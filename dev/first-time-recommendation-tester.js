#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_PATH=path.join(ROOT,'dev','reports','first_time_recommendations.md');

const EXERCISE_GROUPS={
  'Barbell compound':['Bench Press','Back Squat','Romanian Deadlift'],
  'Dumbbell compound':['Goblet Squat','DB Shoulder Press'],
  'Machine compound':['Lat Pulldown','Leg Press','Hack Squat','Smith Machine Incline Press'],
  'Isolation':['Bicep Curl','Tricep Pushdown'],
  'Small isolation':['Lateral Raise','Cable Y Raise'],
  'Bodyweight':['Push-up','Pull-up'],
  'Unknown/custom':['Custom Strength Drill']
};

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
  'Push-up',
  'Pull-up',
  'Hack Squat',
  'Smith Machine Incline Press',
  'Cable Y Raise',
  'Custom Strength Drill'
];

const EXERCISE_GROUP_LOOKUP={};
Object.keys(EXERCISE_GROUPS).forEach(function(group){
  EXERCISE_GROUPS[group].forEach(function(exercise){
    EXERCISE_GROUP_LOOKUP[exercise]=group;
  });
});

const TEST_USERS=[
  {
    id:'true-novice-male',
    label:"True novice male, 5'10\", 170 lb, no gym experience",
    sex:'male',
    age:22,
    height:"5'10\"",
    bodyweight:170,
    experience:'Just starting out (< 6 months)',
    goal:'General fitness',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Never trained in a gym; wants a simple starter plan.'
  },
  {
    id:'true-novice-female',
    label:"True novice female, 5'4\", 125 lb, no gym experience",
    sex:'female',
    age:24,
    height:"5'4\"",
    bodyweight:125,
    experience:'Just starting out (< 6 months)',
    goal:'General fitness',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Brand new to resistance training.'
  },
  {
    id:'beginner-sports-background',
    label:'Beginner with prior sports background',
    sex:'male',
    age:20,
    height:"5'11\"",
    bodyweight:175,
    experience:'Just starting out (< 6 months)',
    goal:'Athletic performance',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Played soccer through college; new to structured lifting.'
  },
  {
    id:'intermediate-no-history',
    label:'Intermediate user, 2 years lifting, no app history',
    sex:'male',
    age:28,
    height:"5'9\"",
    bodyweight:180,
    experience:'1–2 years',
    goal:'Hypertrophy',
    equipment:'Full commercial gym',
    schedule:{mon:'push',tue:'pull',wed:'legs',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
    split:'PPL + Upper/Lower',
    notes:'Has gym experience but is new to Forma with zero logged sets.'
  },
  {
    id:'returning-lifter',
    label:'Returning lifter after long break',
    sex:'female',
    age:38,
    height:"5'6\"",
    bodyweight:155,
    experience:'1–2 years',
    goal:'Strength / General fitness',
    equipment:'Full commercial gym',
    schedule:{mon:'upper',tue:'lower',wed:'rest',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
    split:'Upper/Lower x2',
    returning_from_break:true,
    training_gap:'18+ month break',
    notes:'Trained consistently 2 years ago; 18+ month break before restarting.'
  },
  {
    id:'older-beginner',
    label:'Older beginner, 50+ years old',
    sex:'male',
    age:54,
    height:"5'9\"",
    bodyweight:185,
    experience:'Just starting out (< 6 months)',
    goal:'General fitness',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'walking',sun:'rest'},
    split:'Full Body x3',
    notes:'Starting strength training for health; prefers conservative loading.'
  },
  {
    id:'very-short-light-beginner',
    label:'Very short/light beginner',
    sex:'female',
    age:19,
    height:"4'11\"",
    bodyweight:95,
    experience:'Just starting out (< 6 months)',
    goal:'General fitness',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Small frame; barbell minimums may dominate recommendations.'
  },
  {
    id:'very-tall-heavy-beginner',
    label:'Very tall/heavy beginner',
    sex:'male',
    age:26,
    height:"6'5\"",
    bodyweight:260,
    experience:'Just starting out (< 6 months)',
    goal:'Hypertrophy',
    equipment:'Full commercial gym',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Large frame beginner; machine loads may scale up quickly.'
  },
  {
    id:'home-gym-dumbbells',
    label:'Home gym user with dumbbells only',
    sex:'female',
    age:31,
    height:"5'5\"",
    bodyweight:140,
    experience:'Just starting out (< 6 months)',
    goal:'General fitness',
    equipment:'Dumbbells',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Limited equipment at home; recommendations still run for all exercises.'
  },
  {
    id:'machine-only-beginner',
    label:'Machine-only beginner',
    sex:'female',
    age:42,
    height:"5'7\"",
    bodyweight:165,
    experience:'Just starting out (< 6 months)',
    goal:'Fat loss / General fitness',
    equipment:'Cables & machines',
    schedule:{mon:'full-body',tue:'rest',wed:'full-body',thu:'rest',fri:'full-body',sat:'rest',sun:'rest'},
    split:'Full Body x3',
    notes:'Avoids free weights; mostly selectorized machines and cables.'
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

function isNoviceExperience(experience){
  const exp=String(experience||'').toLowerCase();
  return exp.includes('starting')||exp.includes('6 months')||exp.includes('beginner')||exp.includes('just');
}

function numericWeight(row){
  const w=parseFloat(row.weight);
  return isNaN(w)?null:w;
}

function potentiallyTooHeavy(user,row){
  if(row.equipmentAdjusted||row.source==='safer_calibration'||row.variation)return false;
  const w=numericWeight(row);
  if(w===null)return false;
  const bw=user.bodyweight;
  const ex=row.exercise.toLowerCase();
  const cat=row.category||'';
  const novice=isNoviceExperience(user.experience);

  if(novice&&bw<140&&(ex.includes('bench press')||ex.includes('back squat')||ex.includes('romanian'))&&w>=45){
    return 'Barbell floor (45 lb) may be high for a light novice';
  }
  if(novice&&(ex.includes('leg press')||ex.includes('hack squat'))&&w>bw*1.2){
    return 'Machine lower load exceeds 1.2× bodyweight for novice';
  }
  if(novice&&cat==='lower_compound'&&w>bw*0.55){
    return 'Lower compound exceeds 0.55× bodyweight for novice';
  }
  if(novice&&bw<120&&cat==='upper_compound'&&w>50){
    return 'Upper compound load may be high for very light novice';
  }
  if(novice&&user.age>=50&&cat==='lower_compound'&&w>bw*0.45){
    return 'Lower compound may be aggressive for older beginner';
  }
  return false;
}

function profileLine(user){
  const parts=[
    'sex: '+user.sex,
    user.age?'age: '+user.age:'',
    'height: '+user.height,
    'weight: '+user.bodyweight+' lb',
    'experience: '+user.experience,
    'goal: '+user.goal,
    'equipment: '+user.equipment,
    'split: '+user.split
  ].filter(Boolean);
  return parts.join(' | ');
}

function runCase(context,user){
  context.S.unit='lbs';
  context.S.workouts=[];
  context.S.profile={
    sex:user.sex,
    age:user.age||'',
    height:user.height,
    bodyweight:user.bodyweight,
    experience:user.experience,
    goal:user.goal,
    equipment:user.equipment,
    returning_from_break:user.returning_from_break||false,
    training_gap:user.training_gap||'',
    session_duration:60,
    exercises_per_session:5
  };
  context.S.schedule=user.schedule;
  context.S.splitEx={
    'full-body':['Goblet Squat','Bench Press','Lat Pulldown','DB Shoulder Press','Leg Curl'],
    upper:['Bench Press','Lat Pulldown','DB Shoulder Press','Bicep Curl','Tricep Pushdown'],
    lower:['Back Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
    push:['Bench Press','DB Shoulder Press','Tricep Pushdown','Lateral Raise'],
    pull:['Lat Pulldown','Bicep Curl','Pull-up'],
    legs:['Back Squat','Romanian Deadlift','Leg Press'],
    walking:['Walking'],
    rest:[]
  };

  return EXERCISES.map(function(exercise){
    const sug=context.getOverloadSuggestion(exercise,'');
    const row={
      exercise:exercise,
      exerciseGroup:EXERCISE_GROUP_LOOKUP[exercise]||'',
      variation:sug&&sug.variation?sug.variation:'',
      displayText:sug&&sug.displayText?sug.displayText:'',
      weight:sug&&sug.weightDisp!==undefined&&sug.weightDisp!==null?sug.weightDisp:'',
      reps:sug&&sug.repTarget?sug.repTarget:'',
      confidence:sug&&sug.confidence?sug.confidence:'',
      confidenceReason:sug&&sug.confidenceReason?sug.confidenceReason:'',
      reason:sug&&sug.reason?sug.reason:'',
      category:sug&&sug.category?sug.category:'',
      loadBasis:sug&&sug.loadBasis?sug.loadBasis:'',
      source:recommendationSource(context,exercise,sug),
      equipmentAdjusted:!!(sug&&sug.equipmentAdjusted),
      adjustmentReason:sug&&sug.adjustmentReason?sug.adjustmentReason:'',
      explanation:reasonText(sug)
    };
    if(!sug){
      row.explanation='No deterministic recommendation was returned.';
      row.source='n/a';
      row.confidence='n/a';
    }
    row.potentiallyTooHeavy=potentiallyTooHeavy(user,row);
    return row;
  });
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildSummary(results){
  const lines=[];
  const allRows=[];
  results.forEach(function(item){
    item.rows.forEach(function(row){
      allRows.push({user:item.user,row:row});
    });
  });

  lines.push('## Summary');
  lines.push('');
  lines.push('### Average recommended weight by profile');
  lines.push('');
  lines.push('| Profile | Avg weight (lbs) | Weighted exercises | Avg per-hand DB (lbs) |');
  lines.push('|---|---:|---:|---:|');
  results.forEach(function(item){
    const weights=item.rows.map(numericWeight).filter(function(w){return w!==null&&w>0;});
    const perHand=item.rows
      .filter(function(r){return r.loadBasis==='per hand';})
      .map(numericWeight)
      .filter(function(w){return w!==null;});
    const avg=weights.length?Math.round(weights.reduce(function(a,b){return a+b;},0)/weights.length*10)/10:'—';
    const avgDb=perHand.length?Math.round(perHand.reduce(function(a,b){return a+b;},0)/perHand.length*10)/10:'—';
    lines.push('| '+escapeMd(item.user.label)+' | '+avg+' | '+weights.length+' | '+avgDb+' |');
  });
  lines.push('');

  lines.push('### Exercises flagged as potentially too heavy');
  lines.push('');
  const heavyFlags=allRows.filter(function(entry){return entry.row.potentiallyTooHeavy;});
  if(!heavyFlags.length){
    lines.push('_No automated flags with current heuristics._');
  }else{
    lines.push('| Profile | Exercise | Weight | Flag reason |');
    lines.push('|---|---|---:|---|');
    heavyFlags.forEach(function(entry){
      lines.push('| '+[
        entry.user.label,
        entry.row.exercise,
        entry.row.weight?entry.row.weight+' lbs':'',
        entry.row.potentiallyTooHeavy
      ].map(escapeMd).join(' | ')+' |');
    });
  }
  lines.push('');

  lines.push('### Equipment-adjusted or safer-calibration recommendations');
  lines.push('');
  const adjustedRows=allRows.filter(function(entry){
    return entry.row.equipmentAdjusted||entry.row.source==='equipment_adjusted_calibration'||entry.row.source==='safer_calibration';
  });
  if(!adjustedRows.length){
    lines.push('_None._');
  }else{
    lines.push('| Profile | Exercise | Variation / guidance | Weight | Source | Adjustment reason |');
    lines.push('|---|---|---|---:|---|---|');
    adjustedRows.forEach(function(entry){
      const guidance=entry.row.displayText||entry.row.variation||'';
      lines.push('| '+[
        entry.user.label,
        entry.row.exercise,
        guidance,
        entry.row.weight!==''?entry.row.weight+' lbs':'—',
        entry.row.source,
        entry.row.adjustmentReason
      ].map(escapeMd).join(' | ')+' |');
    });
  }
  lines.push('');

  lines.push('### Exercises using unknown_fallback');
  lines.push('');
  const unknownRows=allRows.filter(function(entry){return entry.row.source==='unknown_fallback';});
  if(!unknownRows.length){
    lines.push('_None._');
  }else{
    lines.push('| Profile | Exercise | Weight | Category |');
    lines.push('|---|---|---:|---|');
    unknownRows.forEach(function(entry){
      lines.push('| '+[
        entry.user.label,
        entry.row.exercise,
        entry.row.weight?entry.row.weight+' lbs':'',
        entry.row.category
      ].map(escapeMd).join(' | ')+' |');
    });
  }
  lines.push('');

  lines.push('### Confidence distribution');
  lines.push('');
  const confidenceCounts={low:0,medium:0,high:0,'n/a':0,'':0};
  allRows.forEach(function(entry){
    const key=entry.row.confidence||'';
    if(!confidenceCounts[key])confidenceCounts[key]=0;
    confidenceCounts[key]+=1;
  });
  lines.push('| Confidence | Count |');
  lines.push('|---|---:|');
  ['low','medium','high','n/a'].forEach(function(level){
    if(confidenceCounts[level])lines.push('| '+level+' | '+confidenceCounts[level]+' |');
  });
  lines.push('');
  lines.push('### Source distribution');
  lines.push('');
  const sourceCounts={};
  allRows.forEach(function(entry){
    const key=entry.row.source||'';
    if(!sourceCounts[key])sourceCounts[key]=0;
    sourceCounts[key]+=1;
  });
  lines.push('| Source | Count |');
  lines.push('|---|---:|');
  Object.keys(sourceCounts).sort().forEach(function(source){
    lines.push('| '+source+' | '+sourceCounts[source]+' |');
  });
  lines.push('');
  lines.push('### Exercise groups covered');
  lines.push('');
  Object.keys(EXERCISE_GROUPS).forEach(function(group){
    lines.push('- **'+group+'**: '+EXERCISE_GROUPS[group].join(', '));
  });
  lines.push('');

  return lines.join('\n');
}

function buildReport(results){
  const lines=[];
  lines.push('# First-Time Recommendation Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: stress-test deterministic Forma recommendations for users with no workout history. Calls the same local logic as the app (`getOverloadSuggestion`) without the AI API.');
  lines.push('');
  lines.push('Profiles: '+results.length+' onboarding scenarios. Exercises: '+EXERCISES.length+' across '+Object.keys(EXERCISE_GROUPS).length+' movement groups.');
  lines.push('');
  lines.push(buildSummary(results));
  lines.push('---');
  lines.push('');
  lines.push('## Detailed results');
  lines.push('');
  lines.push('Manual rating columns are blank for review: `too_light` / `reasonable` / `too_heavy` / `unsafe`.');
  lines.push('');
  results.forEach(function(item,index){
    lines.push('### '+(index+1)+'. '+item.user.label);
    lines.push('');
    lines.push('**Profile:** '+profileLine(item.user));
    if(item.user.notes)lines.push('');
    if(item.user.notes)lines.push('**Scenario notes:** '+item.user.notes);
    lines.push('');
    lines.push('**Schedule:** '+Object.keys(item.user.schedule).map(function(day){return day+': '+item.user.schedule[day];}).join(', '));
    lines.push('');
    lines.push('| Exercise | Group | Variation | Bodyweight guidance | Inferred category | Weight | Load basis | Rep range | Confidence | Source | Reason | Adjustment | Explanation | too_light / reasonable / too_heavy / unsafe | Notes |');
    lines.push('|---|---|---|---|---|---:|---|---:|---|---|---|---|---|---|---|');
    item.rows.forEach(function(row){
      const weightCell=row.weight!==''?row.weight+' lbs':'—';
      const bodyweightGuidance=row.loadBasis==='bodyweight'||row.loadBasis==='assisted'||row.loadBasis==='variation'||row.loadBasis==='equipment substitute'?row.displayText||row.variation:'';
      lines.push('| '+[
        row.exercise,
        row.exerciseGroup,
        row.variation,
        bodyweightGuidance,
        row.category,
        weightCell,
        row.loadBasis,
        row.reps,
        row.confidence,
        row.source,
        row.reason,
        row.adjustmentReason,
        row.explanation,
        '',
        row.potentiallyTooHeavy?'auto-flag: '+row.potentiallyTooHeavy:''
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
  console.log('Profiles: '+results.length+', exercises per profile: '+EXERCISES.length);
  const allRows=results.reduce(function(acc,item){return acc.concat(item.rows);},[]);
  const unknownCount=allRows.filter(function(r){return r.source==='unknown_fallback';}).length;
  const heavyCount=allRows.filter(function(r){return r.potentiallyTooHeavy;}).length;
  const adjustedCount=allRows.filter(function(r){return r.equipmentAdjusted||r.source==='equipment_adjusted_calibration'||r.source==='safer_calibration';}).length;
  const bodyweightGuidance=allRows.filter(function(r){return r.loadBasis==='bodyweight'||r.loadBasis==='assisted'||r.loadBasis==='variation';}).length;
  console.log('unknown_fallback: '+unknownCount+', equipment/safer adjusted: '+adjustedCount+', too heavy flags: '+heavyCount+', bodyweight guidance: '+bodyweightGuidance);
}

main();
