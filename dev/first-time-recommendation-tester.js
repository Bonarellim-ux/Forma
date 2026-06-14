#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_PATH=path.join(ROOT,'dev','reports','first_time_recommendations.md');
const EXERCISES=[
  'Bench Press',
  'Back Squat',
  'Goblet Squat',
  'Lat Pulldown',
  'DB Shoulder Press',
  'Romanian Deadlift',
  'Leg Press',
  'Bicep Curl',
  'Tricep Pushdown',
  'Lateral Raise',
  'Machine High Row',
  'Cable Y Raise',
  'Hack Squat',
  'Smith Machine Incline Press',
  'Reverse Pec Deck',
  'Single-Arm Cable Curl',
  'Glute Kickback Machine',
  'Chest Supported T-Bar Row',
  'Custom Strength Drill'
];

const TEST_USERS=[
  {
    id:'novice-male-hypertrophy',
    label:"Novice male, 5'10\", 170 lb, hypertrophy, commercial gym",
    sex:'male',
    height:"5'10\"",
    bodyweight:170,
    experience:'Beginner / less than 6 months',
    goal:'Hypertrophy',
    equipment:'Commercial Gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3'
  },
  {
    id:'novice-female-hypertrophy',
    label:"Novice female, 5'5\", 135 lb, hypertrophy, commercial gym",
    sex:'female',
    height:"5'5\"",
    bodyweight:135,
    experience:'Beginner / less than 6 months',
    goal:'Hypertrophy',
    equipment:'Commercial Gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3'
  },
  {
    id:'beginner-male-strength-general',
    label:"Beginner male, 6'1\", 210 lb, strength/general fitness",
    sex:'male',
    height:"6'1\"",
    bodyweight:210,
    experience:'Beginner',
    goal:'Strength / General fitness',
    equipment:'Commercial Gym',
    schedule:{mon:'upper',tue:'lower',wed:'rest',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
    split:'Upper/Lower x2'
  },
  {
    id:'small-beginner-female',
    label:"Small beginner female, 5'2\", 110 lb",
    sex:'female',
    height:"5'2\"",
    bodyweight:110,
    experience:'Beginner',
    goal:'General fitness',
    equipment:'Commercial Gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3'
  },
  {
    id:'intermediate-male-hypertrophy',
    label:"Intermediate male, 5'9\", 180 lb, hypertrophy",
    sex:'male',
    height:"5'9\"",
    bodyweight:180,
    experience:'1-2 years / intermediate',
    goal:'Hypertrophy',
    equipment:'Commercial Gym',
    schedule:{mon:'push',tue:'pull',wed:'legs',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
    split:'5-Day Upper/Lower Hybrid'
  },
  {
    id:'intermediate-female',
    label:"Intermediate female, 5'6\", 150 lb",
    sex:'female',
    height:"5'6\"",
    bodyweight:150,
    experience:'1-2 years / intermediate',
    goal:'Hypertrophy',
    equipment:'Commercial Gym',
    schedule:{mon:'upper',tue:'lower',wed:'rest',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
    split:'Upper/Lower x2'
  },
  {
    id:'overweight-beginner-male',
    label:"Overweight beginner male, 5'10\", 240 lb",
    sex:'male',
    height:"5'10\"",
    bodyweight:240,
    experience:'Beginner',
    goal:'General fitness / fat loss',
    equipment:'Commercial Gym',
    schedule:{mon:'full-body',tue:'cardio',wed:'full-body',thu:'rest',fri:'full-body',sat:'walking',sun:'rest'},
    split:'Full Body x3 + recovery cardio'
  },
  {
    id:'very-light-beginner-male',
    label:"Very light beginner male, 5'8\", 125 lb",
    sex:'male',
    height:"5'8\"",
    bodyweight:125,
    experience:'Beginner',
    goal:'Hypertrophy',
    equipment:'Commercial Gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3'
  }
];

function loadFormaRecommendationContext(){
  const context={
    console:console,
    Math:Math,
    Date:Date,
    Number:Number,
    String:String,
    Array:Array,
    Object:Object,
    RegExp:RegExp,
    parseFloat:parseFloat,
    parseInt:parseInt,
    isNaN:isNaN,
    setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{unit:'lbs',workouts:[],profile:{},schedule:{},splitEx:{}}
  };
  context.window=context;
  vm.createContext(context);
  [
    'js/utils.js',
    'js/constants.js',
    'js/exerciseSubstitutions.js',
    'js/plateCalculator.js',
    'js/recommendations.js'
  ].forEach(function(rel){
    vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});
  });
  return context;
}

function cleanDetail(detail){
  return String(detail||'')
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function reasonText(sug){
  if(!sug)return 'No deterministic recommendation was returned.';
  const detail=cleanDetail(sug.detail);
  const why=detail.split('Why:\n')[1]||detail;
  return why.replace(/\n/g,' ');
}

function recommendationSource(context,exercise,sug){
  const sessions=context.getRecentExerciseSessions(exercise,6);
  if(sessions.length)return 'history';
  if(sug&&sug.source)return sug.source;
  if(sug&&sug.state==='baseline')return 'category_fallback';
  return 'unknown_fallback';
}

function profileLine(user){
  return [
    'sex: '+user.sex,
    'height: '+user.height,
    'weight: '+user.bodyweight+' lb',
    'experience: '+user.experience,
    'goal: '+user.goal,
    'equipment: '+user.equipment,
    'split: '+user.split
  ].join(' | ');
}

function runCase(context,user){
  context.S.unit='lbs';
  context.S.workouts=[];
  context.S.profile={
    sex:user.sex,
    height:user.height,
    bodyweight:user.bodyweight,
    experience:user.experience,
    goal:user.goal,
    equipment:user.equipment,
    session_duration:60,
    exercises_per_session:5
  };
  context.S.schedule=user.schedule;
  context.S.splitEx={
    'full-body':['Goblet Squat','Bench Press','Lat Pulldown','DB Shoulder Press','Leg Curl'],
    upper:['Bench Press','Lat Pulldown','DB Shoulder Press','Bicep Curl','Tricep Pushdown'],
    lower:['Back Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
    push:['Bench Press','DB Shoulder Press','Tricep Pushdown','Lateral Raise'],
    pull:['Lat Pulldown','Bicep Curl'],
    legs:['Back Squat','Romanian Deadlift','Leg Press'],
    cardio:['Walking'],
    walking:['Walking'],
    rest:[]
  };

  return EXERCISES.map(function(exercise){
    const sug=context.getOverloadSuggestion(exercise,'');
    return{
      exercise:exercise,
      weight:sug&&sug.weightDisp!==undefined?sug.weightDisp:'',
      reps:sug&&sug.repTarget?sug.repTarget:'',
      confidence:sug&&sug.confidence?sug.confidence:'',
      confidenceReason:sug&&sug.confidenceReason?sug.confidenceReason:'',
      reason:sug&&sug.reason?sug.reason:'',
      category:sug&&sug.category?sug.category:'',
      loadBasis:sug&&sug.loadBasis?sug.loadBasis:'',
      source:recommendationSource(context,exercise,sug),
      explanation:reasonText(sug)
    };
  });
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildReport(results){
  const lines=[];
  lines.push('# First-Time Recommendation Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: inspect deterministic Forma recommendations for users with no workout history. This runner calls the same local recommendation logic used by the app (`getOverloadSuggestion`) and does not call the AI API.');
  lines.push('');
  lines.push('Manual rating columns are intentionally blank so they can be filled during review.');
  lines.push('');
  results.forEach(function(item,index){
    lines.push('## '+(index+1)+'. '+item.user.label);
    lines.push('');
    lines.push('Profile: '+profileLine(item.user));
    lines.push('');
    lines.push('Schedule: '+Object.keys(item.user.schedule).map(function(day){return day+': '+item.user.schedule[day];}).join(', '));
    lines.push('');
    lines.push('| Exercise | Inferred category | Recommended starting weight | Load basis | Target reps | Confidence | Confidence reason | Source | Reason | Explanation | realistic? yes/no/unsure | too_light / reasonable / too_heavy | Notes |');
    lines.push('|---|---|---:|---|---:|---|---|---|---|---|---|---|---|');
    item.rows.forEach(function(row){
      lines.push('| '+[
        row.exercise,
        row.category,
        row.weight?row.weight+' lbs':'',
        row.loadBasis,
        row.reps,
        row.confidence,
        row.confidenceReason,
        row.source,
        row.reason,
        row.explanation,
        '',
        '',
        ''
      ].map(escapeMd).join(' | ')+' |');
    });
    lines.push('');
  });
  return lines.join('\n');
}

function main(){
  const context=loadFormaRecommendationContext();
  if(typeof context.getOverloadSuggestion!=='function'){
    throw new Error('getOverloadSuggestion was not loaded from js/recommendations.js');
  }
  const results=TEST_USERS.map(function(user){
    return{user:user,rows:runCase(context,user)};
  });
  const report=buildReport(results);
  fs.mkdirSync(path.dirname(REPORT_PATH),{recursive:true});
  fs.writeFileSync(REPORT_PATH,report);
  console.log('Wrote '+path.relative(ROOT,REPORT_PATH));
}

main();
