// Shared constants and lightweight global helpers for Forma.
const DAYS=['mon','tue','wed','thu','fri','sat','sun'];
const DAY_FULL={mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
const SPLITS=['push','pull','legs','upper','lower','rest'];
const SPLIT_LBL={push:'Push',pull:'Pull',legs:'Legs',upper:'Upper',lower:'Lower',rest:'Rest'};
const SPLIT_COL={push:'#E8693A',pull:'#1A9ED4',legs:'#2DAA70',upper:'#7B6FE0',lower:'#D4A020',rest:'#9AB8CC'};
const SPLIT_COL_DARK={push:'#B96A4E',pull:'#4F8FA8',legs:'#3E8F67',upper:'#756FB6',lower:'#9A8448',rest:'#5E6E78'};
const CUSTOM_COLS=['#E84393','#00BFA5','#FF6F00','#5C6BC0','#26A69A','#EF5350','#8D6E63','#42A5F5'];
function spLbl(sp){return SPLIT_LBL[sp]||(sp?sp.charAt(0).toUpperCase()+sp.slice(1):'?');}
function spCol(sp){
  const dark=document.documentElement&&document.documentElement.getAttribute('data-theme')==='dark';
  if(dark&&SPLIT_COL_DARK[sp])return SPLIT_COL_DARK[sp];
  if(SPLIT_COL[sp])return SPLIT_COL[sp];
  let h=0;for(let i=0;i<sp.length;i++)h=(h*31+sp.charCodeAt(i))&0xffffffff;
  return CUSTOM_COLS[Math.abs(h)%CUSTOM_COLS.length];
}
function cleanSplit(s){return String(s||'').trim().toLowerCase();}
function normalizeSplitsData(){
  // Merge old saved split names like "Push"/"Pull" into canonical lowercase keys
  const merged={};
  Object.keys(S.splitEx||{}).forEach(function(k){
    const ck=cleanSplit(k);
    if(!ck)return;
    merged[ck]=[...new Set([...(merged[ck]||[]),...((S.splitEx||{})[k]||[])])];
  });
  S.splitEx=Object.assign({},JSON.parse(JSON.stringify(DEF_EX)),merged);
  Object.keys(S.schedule||{}).forEach(function(d){S.schedule[d]=cleanSplit(S.schedule[d]);});
}
function allSplits(){
  const inSched=Object.values(S.schedule||{}).map(cleanSplit);
  const inEx=Object.keys(S.splitEx||{}).map(cleanSplit);
  return[...new Set([...SPLITS.map(cleanSplit),...inSched,...inEx])].filter(Boolean);
}
const DEF_SCHED={mon:'push',tue:'pull',wed:'legs',thu:'upper',fri:'lower',sat:'rest',sun:'rest'};
const DEF_EX={
  push:['Bench Press','Overhead Press','Incline Bench','Tricep Pushdown','Lateral Raise'],
  pull:['Deadlift','Barbell Row','Pull-ups','Face Pull','Bicep Curl'],
  legs:['Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
  upper:['Bench Press','Barbell Row','Overhead Press','Pull-ups','Lateral Raise'],
  lower:['Squat','Romanian Deadlift','Leg Press','Leg Curl','Hip Thrust'],
  rest:[],
  cardio:['Walking'],
  hiit:['HIIT Session'],
  core:['Plank','Crunches','Leg Raises','Russian Twist','Ab Wheel'],
  arms:['Bicep Curl','Hammer Curl','Tricep Pushdown','Skull Crushers','Preacher Curl'],
};
const ALL_EX=[...new Set(Object.values(DEF_EX).flat())];

// Cardio metrics — what to track for each exercise type
const CARDIO_METRICS={
  'Running':       {m1:'MIN',m2:'KM'},
  'Cycling':       {m1:'MIN',m2:'KM'},
  'Swimming':      {m1:'MIN',m2:'LAPS'},
  'Rowing':        {m1:'MIN',m2:'KM'},
  'Jump Rope':     {m1:'MIN',m2:'SETS'},
  'Stair Climber': {m1:'MIN',m2:'FLR'},
  'Walking':       {m1:'MIN',m2:'KM'},
  'Hiking':        {m1:'MIN',m2:'KM'},
  'Elliptical':    {m1:'MIN',m2:'KM'},
  'HIIT Session':  {m1:'MIN',m2:'RNDS'},
  'Cardio Session':{m1:'MIN',m2:'KM'},
};
const CARDIO_SPLITS=['cardio','hiit','running','cycling','swimming','walking'];
const CARDIO_EX_OPTIONS=['Running','Cycling','Swimming','Rowing','Jump Rope','Stair Climber','Walking','Hiking','Elliptical'];
function isCardioSplit(sp){return CARDIO_SPLITS.includes((sp||'').toLowerCase());}
function isCardioEx(name){return!!(CARDIO_METRICS[name]);}
function cardioMetrics(name){return CARDIO_METRICS[name]||{m1:'MIN',m2:'DIST'};}
