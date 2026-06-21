#!/usr/bin/env node
// Regression guards for two subtle review fixes:
//   1. Recommendation engine determinism — getLastSession must pick by DATE
//      (newest first, stable tiebreaker on equal dates), not by raw array order.
//   2. Date-key consistency — localYMD must key by LOCAL calendar day so the
//      heatmap and calendar agree (the bug was heatmap using UTC toISOString).
//
// Run: node dev/regression-tests.js   (exit code 1 on any failure)

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');

let failures=0;
function check(name,cond){
  console.log((cond?'  [pass] ':'  [FAIL] ')+name);
  if(!cond)failures++;
}

function loadContext(){
  const context={
    console:console,Math:Math,Date:Date,Number:Number,String:String,
    Array:Array,Object:Object,RegExp:RegExp,parseFloat:parseFloat,parseInt:parseInt,
    isNaN:isNaN,isFinite:isFinite,setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{unit:'kg',workouts:[],profile:{},schedule:{},splitEx:{}}
  };
  context.window=context;
  vm.createContext(context);
  ['js/utils.js','js/constants.js','js/exerciseSubstitutions.js','js/plateCalculator.js','js/recommendations.js']
    .forEach(function(rel){vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});});
  return context;
}

const ctx=loadContext();

// ── 1. Determinism: getLastSession picks by date, not array order ──────────
console.log('Determinism — getLastSession:');

// Older workout placed FIRST in the array, newer one SECOND. The old bug
// returned array[0] (the older session); the fix must return the newer date.
ctx.S.workouts=[
  {date:'2026-06-10T10:00:00',exercises:[{name:'Squat',sets:[{w:100,r:5}]}]},
  {date:'2026-06-20T10:00:00',exercises:[{name:'Squat',sets:[{w:140,r:5}]}]}
];
const byDate=ctx.getLastSession('Squat');
check('returns the most recent session by date, not array[0]', byDate && byDate.w===140);

// Two sessions on the SAME date — result must be stable and deterministic
// across repeated calls (stable index tiebreaker, lower index wins).
ctx.S.workouts=[
  {date:'2026-06-20T10:00:00',exercises:[{name:'Bench Press',sets:[{w:80,r:5}]}]},
  {date:'2026-06-20T10:00:00',exercises:[{name:'Bench Press',sets:[{w:70,r:5}]}]}
];
const runs=[];
for(let k=0;k<5;k++)runs.push(ctx.getLastSession('Bench Press').w);
check('same-date sessions resolve deterministically across runs', runs.every(function(v){return v===runs[0];}));
check('same-date tiebreaker keeps original array order (index 0 wins)', runs[0]===80);

// ── 2. Date keys: localYMD uses LOCAL calendar components ──────────────────
console.log('Date keys — localYMD:');

// A late-evening local time. localYMD must reflect the LOCAL day; the old
// heatmap used toISOString (UTC), which rolls to the next day in the Americas.
const late=new Date(2026,0,15,23,59,0); // local Jan 15 2026, 23:59
const expectLocal=late.getFullYear()+'-'+String(late.getMonth()+1).padStart(2,'0')+'-'+String(late.getDate()).padStart(2,'0');
check('localYMD encodes the local calendar day', ctx.localYMD(late)===expectLocal);
check('localYMD is zero-padded YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(ctx.localYMD(late)));

// Heatmap (localYMD) and calendar (local Y-M-D parts) must map a workout to
// the SAME calendar day — the core of the timezone-divergence fix.
const d=new Date(2026,5,21,21,0,0); // local Jun 21 2026, 9pm
const calParts=[d.getFullYear(),d.getMonth()+1,d.getDate()].join('-');
const heatParts=ctx.localYMD(d).split('-').map(Number);
check('heatmap key and calendar key reference the same local day',
  [heatParts[0],heatParts[1],heatParts[2]].join('-')===calParts);

console.log('');
console.log(failures===0?'All regression checks passed.':(failures+' regression check(s) FAILED.'));
process.exit(failures===0?0:1);
