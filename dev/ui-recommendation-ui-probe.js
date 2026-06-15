#!/usr/bin/env node
/**
 * Dev-only: extract recommendation strings exactly as Forma UI renders them.
 */
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');

function loadUiContext(){
  const context={
    console:console,Math:Math,Date:Date,Number:Number,String:String,Array:Array,Object:Object,RegExp:RegExp,
    parseFloat:parseFloat,parseInt:parseInt,isNaN:isNaN,setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{unit:'lbs',workouts:[],profile:{},schedule:{},splitEx:{},workout:null}
  };
  context.window=context;
  vm.createContext(context);
  [
    'js/utils.js','js/constants.js','js/exerciseSubstitutions.js','js/importNormalization.js',
    'js/plateCalculator.js','js/recommendations.js'
  ].forEach(function(rel){
    vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});
  });
  vm.runInContext([
    'function recommendationActionText(sug){',
    '  if(!sug||!sug.detail)return \'\';',
    '  const text=String(sug.detail).split(\'<br><br>Why:<br>\')[0].replace(/^I\\\'d recommend /,\'\').replace(/\\.$/,\'\');',
    '  return text.charAt(0).toUpperCase()+text.slice(1);',
    '}',
    'function recommendationWhyText(sug){',
    '  if(!sug||!sug.detail)return \'\';',
    '  const parts=String(sug.detail).split(\'<br><br>Why:<br>\');',
    '  return parts.length>1?parts[1].replace(/<br>/g,\'\\n\'):\'\';',
    '}',
    'function homeRecommendationLine(sug){',
    '  if(!sug)return \'\';',
    '  const unit=uLbl();',
    '  const wt=sug.weightDisp!==undefined&&sug.weightDisp!==null?String(sug.weightDisp)+\' \'+unit:null;',
    '  if(sug.action===\'add_weight\'||sug.action===\'early_add_weight\')return wt?\'Increase to \'+wt:\'Add weight\';',
    '  if(sug.action===\'add_reps\'||sug.action===\'early_add_reps\')return wt?\'Stay at \'+wt:\'Add reps\';',
    '  if(sug.action===\'early_repeat\')return wt?\'Repeat \'+wt:\'Repeat last working set\';',
    '  if(sug.action===\'baseline\')return wt?\'Start around \'+wt:\'Set a baseline\';',
    '  if(sug.action===\'hold\'&&wt)return \'Hold \'+wt;',
    '  if(sug.action===\'reduce_weight\'&&wt)return \'Reduce to \'+wt;',
    '  if(sug.action===\'reduce_or_recover\'){',
    '    if(sug.dir===\'down\'&&wt)return \'Reduce to \'+wt;',
    '    return \'Hold progression today\';',
    '  }',
    '  const text=recommendationActionText(sug);',
    '  return text.replace(/\\s+and aiming for .*/i,\'\');',
    '}',
    'function homePlanItems(exs){',
    '  return (exs||[]).map(function(name){',
    '    const sug=getOverloadSuggestion(name,\'\');',
    '    if(!sug)return null;',
    '    const action=homeRecommendationLine(sug)',
    '      .replace(/^Stay at /,\'stay at \')',
    '      .replace(/^Increase to /,\'increase to \')',
    '      .replace(/^Repeat /,\'repeat \')',
    '      .replace(/^Start around /,\'start around \')',
    '      .replace(/^Hold /,\'hold \')',
    '      .replace(/^Reduce to /,\'reduce to \');',
    '    const short=(sug.action===\'add_reps\'||sug.action===\'early_add_reps\')&&sug.repTarget?\'aim for \'+sug.repTarget+\' reps\':action;',
    '    return{name:name,text:name+\': \'+short,score:sug.confidence===\'high\'?3:sug.confidence===\'medium\'?2:1};',
    '  }).filter(Boolean).sort(function(a,b){return b.score-a.score;}).slice(0,3);',
    '}'
  ].join('\n'),context,{filename:'ui-snippet.js'});
  return context;
}

function isoDaysAgo(days){
  const d=new Date();d.setDate(d.getDate()-days);return d.toISOString();
}

function benchWorkouts(sessions){
  const ch=sessions.slice().reverse();
  return ch.map(function(s,i){
    return{
      date:isoDaysAgo((ch.length-i)*3),
      split:'full-body',
      exercises:[{name:'Bench Press',sets:[{w:s.w/2.20462,r:s.r,warmup:false}]}]
    };
  });
}

function applyProfile(ctx){
  ctx.S.unit='lbs';
  ctx.S.onboarded=true;
  ctx.S.profile={
    sex:'male',age:28,height:"5'10\"",bodyweight:170,
    experience:'Just starting out (< 6 months)',goal:'General fitness',equipment:'Full commercial gym'
  };
  ctx.S.schedule={mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'full-body'};
  ctx.S.splitEx={'full-body':['Bench Press'],'rest':[]};
}

function uiSnapshot(ctx,exercise){
  const sug=ctx.getOverloadSuggestion(exercise,'');
  const plan=ctx.homePlanItems([exercise]);
  return{
    tester:sug?{dir:sug.dir,action:sug.action,weightDisp:sug.weightDisp,repTarget:sug.repTarget}:null,
    homeLine:sug?ctx.homeRecommendationLine(sug):'',
    homePlan:plan.length?plan[0].text:'',
    workoutAction:sug?ctx.recommendationActionText(sug):'',
    workoutWhy:sug?ctx.recommendationWhyText(sug):''
  };
}

function runCase(label,sessions){
  const ctx=loadUiContext();
  applyProfile(ctx);
  ctx.S.workouts=benchWorkouts(sessions);
  return{label:label,sessions:sessions.map(function(s){return s.w+'×'+s.r;}).join(' → '),snapshot:uiSnapshot(ctx,'Bench Press')};
}

function runBeginnerImport(){
  const ctx=loadUiContext();
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data/test-imports/beginner_1week_full_body.json'),'utf8'));
  ctx.S.unit=data.unit||'lbs';
  ctx.S.workouts=ctx.normalizeImportedWorkouts(data.workouts,ctx.S.unit);
  ctx.S.schedule=Object.assign({},data.schedule,{sun:'full-body'});
  ctx.S.splitEx=data.splits;
  ctx.S.profile=Object.assign({},data.profile);
  ctx.S.onboarded=true;
  const exs=ctx.S.splitEx['full-body']||[];
  return{
    label:'Test 1 Beginner import',
    schedule:ctx.S.schedule,
    items:exs.map(function(name){
      const sug=ctx.getOverloadSuggestion(name,'');
      if(!sug)return{name:name,missing:true};
      const plan=ctx.homePlanItems([name]);
      return{
        exercise:name,
        tester:{action:sug.action,weightDisp:sug.weightDisp,repTarget:sug.repTarget},
        homeLine:ctx.homeRecommendationLine(sug),
        homePlan:plan.length?plan[0].text:'',
        workoutAction:ctx.recommendationActionText(sug),
        workoutWhy:ctx.recommendationWhyText(sug)
      };
    })
  };
}

const out={
  generated:new Date().toISOString(),
  test1:runBeginnerImport(),
  test2:runCase('Test 2 Too hard',[ {w:60,r:5},{w:60,r:4},{w:60,r:4},{w:60,r:4} ]),
  test3:runCase('Test 3 Overestimated',[ {w:50,r:4},{w:50,r:3},{w:50,r:3},{w:50,r:3} ]),
  test4:runCase('Test 4 Inconsistent',[ {w:60,r:10},{w:60,r:5},{w:60,r:8},{w:60,r:7} ]),
  test5:runCase('Test 5 Appropriate',[ {w:60,r:8},{w:60,r:8},{w:60,r:7},{w:60,r:8} ]),
  test6:runCase('Test 6 Too easy',[ {w:60,r:10},{w:60,r:10},{w:60,r:10} ])
};
console.log(JSON.stringify(out,null,2));
