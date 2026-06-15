#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_MD=path.join(ROOT,'dev','reports','coaching_qa.md');
const REPORT_JSON=path.join(ROOT,'dev','reports','coaching_qa.json');
const FORMA_AI_API='https://forma-proxy.bonarelli-m.workers.dev';
const FORMA_AI_MODEL='claude-sonnet-4-6';

const DRY_RUN=process.argv.includes('--dry-run');
const DELAY_MS=Math.max(0,(parseInt(process.env.FORMA_AI_DELAY_MS||'1500',10)||0));

const DEFAULT_SCHEDULE={mon:'push',tue:'pull',wed:'legs',thu:'upper',fri:'lower',sat:'rest',sun:'rest'};

const SCORE_KEYS=[
  'overall',
  'contextUse',
  'intentUnderstanding',
  'dataGrounding',
  'recommendationQuality',
  'uncertaintyCalibration',
  'actionability',
  'noFabrication',
  'conversationNaturalness'
];

const SCORE_LABELS={
  overall:'Overall',
  contextUse:'Context use',
  intentUnderstanding:'Intent understanding',
  dataGrounding:'Data grounding',
  recommendationQuality:'Recommendation quality',
  uncertaintyCalibration:'Uncertainty calibration',
  actionability:'Actionability',
  noFabrication:'No fabrication',
  conversationNaturalness:'Conversation naturalness'
};

function expect(text,includeAny,excludeAny,critical){
  return{text:text,includeAny:includeAny,excludeAny:excludeAny,critical:!!critical};
}

function ex(context,name,sets){
  return{
    name:name,
    sets:(sets||[]).map(function(s){
      return{w:context.toKg(s[0]),r:s[1],warmup:!!s[2]};
    })
  };
}

function workout(date,split,exercises){
  return{date:date+'T12:00:00.000Z',split:split,exercises:exercises||[]};
}

const DATASETS={
  normal_performance:{
    label:'Intermediate, stable recent performance',
    profile:{name:'Alex',goal:'Hypertrophy with strength progress',experience:'Intermediate',session_duration:60,equipment:'Full commercial gym'},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Incline Dumbbell Press','Tricep Pushdown','Lateral Raise'],
      pull:['Deadlift','Seated Cable Row','Lat Pulldown','Face Pull','Bicep Curl'],
      legs:['Back Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
      upper:['Bench Press','Seated Cable Row','Overhead Press','Lat Pulldown'],
      lower:['Back Squat','Romanian Deadlift','Leg Press','Calf Raise'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-08','push',[ex(ctx,'Bench Press',[[225,6],[225,5]]),ex(ctx,'Overhead Press',[[115,8]]),ex(ctx,'Incline Dumbbell Press',[[90,9]])]),
        workout('2026-06-06','pull',[ex(ctx,'Deadlift',[[315,6]]),ex(ctx,'Seated Cable Row',[[150,10]]),ex(ctx,'Lat Pulldown',[[145,10]])]),
        workout('2026-06-04','legs',[ex(ctx,'Back Squat',[[275,5]]),ex(ctx,'Romanian Deadlift',[[205,8]]),ex(ctx,'Leg Press',[[330,12]])]),
        workout('2026-06-01','push',[ex(ctx,'Bench Press',[[225,8],[225,6]]),ex(ctx,'Overhead Press',[[110,8]])]),
        workout('2026-05-29','pull',[ex(ctx,'Deadlift',[[305,6]]),ex(ctx,'Seated Cable Row',[[150,10]])]),
        workout('2026-05-27','legs',[ex(ctx,'Back Squat',[[280,5]]),ex(ctx,'Romanian Deadlift',[[195,8]]),ex(ctx,'Leg Press',[[320,12]])])
      ];
    }
  },
  squat_mixed_signals:{
    label:'Squat slightly down; RDL and leg press up (no sleep in profile)',
    profile:{name:'Alex',goal:'Get stronger',experience:'Intermediate',session_duration:60,equipment:'Full commercial gym',injuries:'',preferences:''},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Lateral Raise'],
      pull:['Deadlift','Barbell Row','Lat Pulldown'],
      legs:['Back Squat','Romanian Deadlift','Leg Press'],
      upper:['Bench Press','Barbell Row'],
      lower:['Back Squat','Romanian Deadlift'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-08','legs',[ex(ctx,'Back Squat',[[275,4]]),ex(ctx,'Romanian Deadlift',[[220,9]]),ex(ctx,'Leg Press',[[350,12]])]),
        workout('2026-06-06','pull',[ex(ctx,'Deadlift',[[340,5]]),ex(ctx,'Barbell Row',[[185,8]])]),
        workout('2026-06-03','push',[ex(ctx,'Bench Press',[[225,8]]),ex(ctx,'Overhead Press',[[120,8]])]),
        workout('2026-05-29','legs',[ex(ctx,'Back Squat',[[280,5]]),ex(ctx,'Romanian Deadlift',[[210,9]]),ex(ctx,'Leg Press',[[340,12]])])
      ];
    }
  },
  minor_fluctuation:{
    label:'Minor fluctuation only — not broad decline',
    profile:{name:'Alex',goal:'Hypertrophy',experience:'Intermediate',session_duration:60,equipment:'Full commercial gym'},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Incline Dumbbell Press'],
      pull:['Deadlift','Seated Cable Row','Lat Pulldown'],
      legs:['Back Squat','Romanian Deadlift','Leg Press'],
      upper:['Bench Press','Overhead Press'],
      lower:['Back Squat','Romanian Deadlift'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-08','legs',[ex(ctx,'Back Squat',[[275,5]]),ex(ctx,'Romanian Deadlift',[[205,8]]),ex(ctx,'Leg Press',[[325,11]])]),
        workout('2026-06-05','push',[ex(ctx,'Bench Press',[[225,7]]),ex(ctx,'Overhead Press',[[115,8]])]),
        workout('2026-06-03','legs',[ex(ctx,'Back Squat',[[280,5]]),ex(ctx,'Romanian Deadlift',[[200,8]]),ex(ctx,'Leg Press',[[330,12]])]),
        workout('2026-05-30','pull',[ex(ctx,'Deadlift',[[315,6]]),ex(ctx,'Seated Cable Row',[[150,10]])]),
        workout('2026-05-28','legs',[ex(ctx,'Back Squat',[[280,6]]),ex(ctx,'Romanian Deadlift',[[200,9]]),ex(ctx,'Leg Press',[[330,12]])])
      ];
    }
  },
  beginner_low_data:{
    label:'Beginner with 2 workouts',
    profile:{name:'Sam',goal:'Build muscle and consistency',experience:'Beginner',session_duration:45,equipment:'Full commercial gym'},
    schedule:{mon:'upper',tue:'rest',wed:'lower',thu:'rest',fri:'upper',sat:'rest',sun:'rest'},
    splitEx:{
      upper:['Bench Press','Lat Pulldown','DB Shoulder Press','Bicep Curl'],
      lower:['Back Squat','Romanian Deadlift','Leg Press','Calf Raise'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-07','upper',[ex(ctx,'Bench Press',[[95,8],[95,7]]),ex(ctx,'Lat Pulldown',[[85,10],[85,9]]),ex(ctx,'DB Shoulder Press',[[30,10]])]),
        workout('2026-06-03','lower',[ex(ctx,'Back Squat',[[115,8],[115,7]]),ex(ctx,'Romanian Deadlift',[[95,10],[95,9]]),ex(ctx,'Leg Press',[[160,10]])])
      ];
    }
  },
  intermediate_mixed:{
    label:'Intermediate mixed pressing signals',
    profile:{name:'Alex',goal:'Strength and hypertrophy',experience:'Intermediate',session_duration:60,equipment:'Full commercial gym'},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Incline Dumbbell Press','Tricep Pushdown','Lateral Raise'],
      pull:['Deadlift','Barbell Row','Lat Pulldown'],
      legs:['Back Squat','Romanian Deadlift','Leg Press'],
      upper:['Bench Press','Overhead Press','Incline Dumbbell Press','Barbell Row'],
      lower:['Back Squat','Romanian Deadlift'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-08','push',[ex(ctx,'Bench Press',[[215,5]]),ex(ctx,'Overhead Press',[[120,8]]),ex(ctx,'Incline Dumbbell Press',[[95,10]])]),
        workout('2026-06-04','legs',[ex(ctx,'Back Squat',[[275,5]]),ex(ctx,'Romanian Deadlift',[[215,8]]),ex(ctx,'Deadlift',[[335,5]])]),
        workout('2026-06-01','push',[ex(ctx,'Bench Press',[[220,6]]),ex(ctx,'Overhead Press',[[115,8]]),ex(ctx,'Incline Dumbbell Press',[[90,10]])]),
        workout('2026-05-25','push',[ex(ctx,'Bench Press',[[230,7]]),ex(ctx,'Overhead Press',[[110,8]]),ex(ctx,'Incline Dumbbell Press',[[85,9]])])
      ];
    }
  },
  five_day_program:{
    label:'Current 5-day PPL + Upper/Lower',
    profile:{name:'Alex',goal:'Hypertrophy',experience:'Intermediate',session_duration:60,equipment:'Full commercial gym'},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Incline Dumbbell Press','Tricep Pushdown','Lateral Raise'],
      pull:['Deadlift','Seated Cable Row','Lat Pulldown','Face Pull','Bicep Curl'],
      legs:['Back Squat','Romanian Deadlift','Leg Press','Leg Curl','Calf Raise'],
      upper:['Bench Press','Seated Cable Row','Overhead Press','Lat Pulldown'],
      lower:['Back Squat','Romanian Deadlift','Leg Press','Calf Raise'],
      rest:[]
    },
    buildWorkouts:function(){return[];}
  },
  engine_bench_progression:{
    label:'Bench early_add_weight engine case',
    profile:{sex:'male',age:28,height:"5'10\"",bodyweight:170,experience:'Just starting out (< 6 months)',goal:'General fitness',equipment:'Full commercial gym'},
    schedule:Object.assign({},DEFAULT_SCHEDULE),
    splitEx:{
      push:['Bench Press','Overhead Press','Incline Dumbbell Press'],
      pull:['Lat Pulldown','Barbell Row'],
      legs:['Back Squat','Leg Press'],
      upper:['Bench Press','Lat Pulldown'],
      lower:['Back Squat','Romanian Deadlift'],
      rest:[]
    },
    buildWorkouts:function(ctx){
      return[
        workout('2026-06-11','push',[ex(ctx,'Bench Press',[[60,10]])]),
        workout('2026-06-08','push',[ex(ctx,'Bench Press',[[60,10]])]),
        workout('2026-06-05','push',[ex(ctx,'Bench Press',[[60,10]])])
      ];
    },
    workout:{split:'push',exercises:[{name:'Bench Press',inputW:'',inputR:'',sets:[]}]}
  }
};

const SCENARIOS=[
  {
    id:'next_workout',
    name:'What should I do next workout?',
    datasetKey:'normal_performance',
    conversation:[],
    prompt:'What should I do next workout?',
    expectations:[
      expect('Uses current program or schedule',/push|pull|legs|upper|lower|schedule|program|split|today|next session/i),
      expect('Gives specific next workout guidance',/next|train|session|focus|day|workout|exercise|squat|bench|deadlift|pull|push|legs/i),
      expect('Does not invent missing data',null,/you mentioned|your note says|you told me|injury|pain|sleep/i,true)
    ]
  },
  {
    id:'squat_down_mixed',
    name:'Why did my squat go down?',
    datasetKey:'squat_mixed_signals',
    conversation:[],
    prompt:'Why did my squat go down?',
    expectations:[
      expect('Separates observation from interpretation',/observation|data|logged|recent|may|might|possible|interpretation|looks like|suggests/i),
      expect('Does not blame sleep unless provided',null,/sleep (is|was).*caus|because of sleep|sleep caused|poor sleep caused/i,true),
      expect('Mentions mixed or non-squat signals',/rdl|romanian|leg press|deadlift|while|however|but|other|mixed|still/i),
      expect('Gives monitoring or action step',/monitor|next session|watch|repeat|check|keep|try|focus|aim/i)
    ]
  },
  {
    id:'should_deload',
    name:'Should I deload?',
    datasetKey:'minor_fluctuation',
    conversation:[],
    prompt:'Should I deload?',
    expectations:[
      expect('Does not recommend deload aggressively',null,/definitely deload|you should deload now|deload this week|take a deload immediately|strong recommendation.*deload/i,true),
      expect('Explains limited or mixed evidence',/limited|not enough|minor|single|one session|mixed|monitor|not yet|don't need|no need|not warranted/i),
      expect('Suggests monitoring or conservative next step',/monitor|watch|repeat|next session|keep|maintain|check|progress/i)
    ]
  },
  {
    id:'weakness_low_data',
    name:'What is my biggest weakness? (low-data beginner)',
    datasetKey:'beginner_low_data',
    conversation:[],
    prompt:'What is my biggest weakness?',
    expectations:[
      expect('Says not enough data or limited history',/limited|not enough|early|only|few sessions|little data|insufficient|two sessions|2 sessions/i),
      expect('Avoids inventing a definite weakness',null,/biggest weakness is|clearly your weakness|definitely|your weakness is definitely/i,true),
      expect('Gives a next step',/monitor|baseline|keep logging|log|next|focus|track|build/i)
    ]
  },
  {
    id:'weakness_intermediate_mixed',
    name:'What is my biggest weakness? (intermediate mixed data)',
    datasetKey:'intermediate_mixed',
    conversation:[],
    prompt:'What is my biggest weakness?',
    expectations:[
      expect('Identifies likely pattern or area',/bench|horizontal|pressing|weak|limit|lag|pattern|likely|may|might|could/i),
      expect('Confidence medium or lower',/confidence:\s*(medium|low)|medium confidence|low confidence|not certain|uncertain|hypoth/i),
      expect('Gives hypotheses not certainty',/may|might|could|possible|hypoth|likely|one plausible|contributor/i),
      expect('Does not claim single definite cause',null,/definitely|clearly your weakness is|without doubt|the problem is definitely/i,true)
    ]
  },
  {
    id:'add_training_day',
    name:'Should I add another training day?',
    datasetKey:'five_day_program',
    conversation:[],
    prompt:'Should I add another training day?',
    expectations:[
      expect('Program-level reasoning first',/program|schedule|split|structure|weekly|day|volume|frequency/i),
      expect('Does not jump straight to workout generation',null,/3 sets|4 sets|exercise 1|workout:\s*\n|bench press.*\d+\s*x\s*\d+.*squat.*\d+\s*x/i,true),
      expect('Gives options if confidence is medium',/option|alternative|could|reasonable|depends|if|consider|confidence:\s*medium|medium confidence/i)
    ]
  },
  {
    id:'reduce_to_four_days',
    name:'I want to reduce to 4 days.',
    datasetKey:'five_day_program',
    conversation:[],
    prompt:'I want to reduce to 4 days.',
    expectations:[
      expect('Recommends sensible structure',/upper|lower|full body|push|pull|legs|schedule|structure|4-day|four day|four-day/i),
      expect('Preserves training frequency or explains tradeoff',/frequency|volume|sessions|maintain|preserve|spread|still hit|each muscle|twice/i),
      expect('Can ask or offer to apply change',/apply|update|want me|confirm|schedule|I can|would you like/i)
    ]
  },
  {
    id:'confirmation_yes',
    name:'User says yes after coach asks to apply change',
    datasetKey:'five_day_program',
    conversation:[
      {role:'user',text:'I want to reduce from 5 days to 4.'},
      {role:'ai',text:'I would move you to an Upper/Lower four-day schedule (Upper/Lower/Rest/Upper/Lower/Rest/Rest). Want me to apply that schedule?'}
    ],
    prompt:'Yes',
    expectations:[
      expect('Resolves yes as confirmation',/apply|update|yes|confirmed|upper\/lower|upper lower|schedule|done|updated/i),
      expect('Does not ask what yes means',null,/what.*yes|what.*refer|can you clarify|what do you mean/i,true),
      expect('Mentions pending 4-day change',/4-day|four|upper|lower|schedule/i)
    ]
  },
  {
    id:'why_engine_weight',
    name:'Why did Forma recommend this weight?',
    datasetKey:'engine_bench_progression',
    conversation:[],
    prompt:'Why did Forma recommend this weight for Bench Press?',
    engineExercise:'Bench Press',
    expectations:[
      expect('References engine or recommendation',/recommend|engine|forma|calibrat|progress|increase|70|60|weight|load/i),
      expect('Uses history context',/session|logged|recent|60|10|rep|history|working set/i),
      expect('Gives confidence or calibration framing',/confidence|calibrat|early|conservative|limited|medium|low/i)
    ]
  },
  {
    id:'conflicting_pressing',
    name:'Bench down, OHP and incline up',
    datasetKey:'intermediate_mixed',
    conversation:[],
    prompt:'My bench is down but OHP and incline are up. What\'s wrong?',
    expectations:[
      expect('Recognizes conflicting signals',/bench.*down|horizontal|vertical|ohp|overhead|incline|mixed|conflict|different|while.*up/i),
      expect('Does not collapse to one cause',null,/definitely|clearly caused|the problem is|your weakness is definitely|sleep caused/i,true),
      expect('Gives hypotheses and next check',/may|might|could|hypoth|possible|monitor|check|next|technique|repeat|watch/i)
    ]
  }
];

function loadFormaAIContext(){
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
    fetch:fetch,
    setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{unit:'lbs',workouts:[],profile:{},schedule:{},splitEx:{},workout:null,messages:[]}
  };
  context.window=context;
  vm.createContext(context);
  [
    'js/utils.js',
    'js/constants.js',
    'js/exerciseSubstitutions.js',
    'js/plateCalculator.js',
    'js/recommendations.js',
    'js/coachingAnalysis.js',
    'js/ai.js'
  ].forEach(function(rel){
    vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});
  });
  return context;
}

function applyScenario(context,scenario){
  const ds=DATASETS[scenario.datasetKey];
  context.S.unit='lbs';
  context.S.profile=Object.assign({},ds.profile||{});
  context.S.schedule=Object.assign({},DEFAULT_SCHEDULE,ds.schedule||{});
  context.S.splitEx=Object.assign({},ds.splitEx||{});
  context.S.workouts=(ds.buildWorkouts?ds.buildWorkouts(context):[]).map(function(w){
    return Object.assign({},w,{exercises:(w.exercises||[]).map(function(e){
      return Object.assign({},e,{sets:Array.isArray(e.sets)?e.sets:[]});
    })});
  });
  context.S.workout=ds.workout?JSON.parse(JSON.stringify(ds.workout)):null;
  context.S.messages=(scenario.conversation||[]).map(function(m){
    return{role:m.role==='ai'?'ai':'user',text:m.text||'',time:context.NOW(),actions:[]};
  });
}

function datasetSummary(scenario){
  const ds=DATASETS[scenario.datasetKey];
  const workoutCount=(ds.buildWorkouts?ds.buildWorkouts({toKg:function(l){return l/2.20462}}):[]).length;
  return{
    key:scenario.datasetKey,
    label:ds.label,
    profile:ds.profile,
    schedule:ds.schedule||DEFAULT_SCHEDULE,
    workoutCount:workoutCount,
    conversation:(scenario.conversation||[]).map(function(m){return m.role+': '+m.text;})
  };
}

function engineSnapshot(context,exercise){
  if(!exercise||typeof context.getOverloadSuggestion!=='function')return null;
  const sug=context.getOverloadSuggestion(exercise,context.S.workout&&context.S.workout.exercises&&context.S.workout.exercises[0]?context.S.workout.exercises[0].inputW:'');
  if(!sug)return null;
  const detail=String(sug.detail||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/\*\*/g,'');
  return{
    action:sug.action,
    weightDisp:sug.weightDisp,
    repTarget:sug.repTarget,
    confidence:sug.confidence,
    why:detail.split('Why:')[1]||'',
    actionLine:detail.split('Why:')[0].replace(/^I'd recommend /,'').trim()
  };
}

function checkExpected(answer,item){
  const text=String(answer||'');
  let passed=true;
  if(item.includeAny instanceof RegExp)passed=passed&&item.includeAny.test(text);
  if(item.excludeAny instanceof RegExp)passed=passed&&!item.excludeAny.test(text);
  return passed;
}

function sleepOverAttributed(text,profileText){
  const t=String(text||'').toLowerCase();
  if(/sleep|fatigue|rest/.test(String(profileText||'')))return false;
  if(/sleep (is|was) (the|a|your|likely )?(main|primary|root|key|chief|biggest )?(cause|reason|factor|driver|culprit)/.test(t))return true;
  if(/because of (your )?(poor )?sleep|due to (poor )?sleep|sleep caused|caused by sleep|sleep is why/.test(t))return true;
  if(/the (drop|decline|regression|dip) (is|was) (likely )?(due to|because of|from) (poor )?sleep/.test(t))return true;
  if(/definitely.*sleep|clearly.*sleep.*(cause|reason)|sleep is (to blame|the answer)/.test(t))return true;
  return false;
}

function contradictedEngine(text,engine){
  if(!engine||engine.weightDisp===undefined||engine.weightDisp===null||engine.weightDisp==='')return false;
  const t=String(text||'').toLowerCase();
  const w=parseFloat(engine.weightDisp);
  if(isNaN(w))return false;

  const engineWeightRecommended=new RegExp(
    '(?:recommend|suggest|engine suggests?|forma(?:\'s)? (?:engine )?recommend|try(?:ing)?|increase to|reduce to|drop to|lower to|stay at|hold at|repeat(?:ing)? at|move to|bump to|jump to)\\s*(?:[^\\n.]{0,45}?\\b)?'+String(w).replace('.','\\.')+'\\s*(?:lb|lbs|kg|×|x)',
    'i'
  ).test(t);

  const explicitWeightChange=/(?:recommend|suggest|should|try|need to|go)\s*(?:[^.\n]{0,45}?)(?:reduce to|drop to|lower to|decrease to|increase to|move to|try)\s*(\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)/gi;
  let match;
  while((match=explicitWeightChange.exec(t))!==null){
    const stated=parseFloat(match[1]);
    if(isNaN(stated))continue;
    if(Math.abs(stated-w)<=1)continue;
    const snippet=t.slice(Math.max(0,match.index-40),match.index+match[0].length+20);
    if(/last \d+ session|previous|prior|logged|you('ve| have) hit|hit \d|history|were at|was at|sessions at|× \d|x \d reps|from \d+ to/.test(snippet))continue;
    if(!engineWeightRecommended)return true;
  }

  const increaseActions={early_add_weight:1,add_weight:1,early_add_reps:1,add_reps:1,baseline:1};
  if(increaseActions[engine.action]){
    const reduceReco=/(?:recommend|suggest|should|try|need to)\s*(?:[^.\n]{0,45}?)(?:reduce to|drop to|lower to|decrease to|deload at)\s*(\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)/i.exec(t);
    if(reduceReco&&Math.abs(parseFloat(reduceReco[1])-w)>0.5)return true;
  }

  const decreaseActions={reduce_or_recover:1,reduce_weight:1,hold:1,early_repeat:1};
  if(decreaseActions[engine.action]){
    const increaseReco=/(?:recommend|suggest|should|try|need to)\s*(?:[^.\n]{0,45}?)(?:increase to|move up to|go up to|try)\s*(\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)/i.exec(t);
    if(increaseReco){
      const stated=parseFloat(increaseReco[1]);
      if(!isNaN(stated)&&Math.abs(stated-w)>1){
        const snippet=t.slice(Math.max(0,increaseReco.index-40),increaseReco.index+increaseReco[0].length+20);
        if(!/last \d+ session|previous|prior|logged|you('ve| have) hit|history|were at|was at/.test(snippet))return true;
      }
    }
  }

  return false;
}

function detectFailurePatterns(scenario,checks,answer,profile,engine){
  const failed=checks.filter(function(c){return !c.passed;}).map(function(c){return c.text.toLowerCase();}).join(' | ');
  const text=String(answer||'').toLowerCase();
  const profileText=JSON.stringify(profile||{}).toLowerCase();
  const labels=[];
  function add(label,cond){if(cond&&labels.indexOf(label)===-1)labels.push(label);}

  add('lost_conversation_context',/confirmation|context|refers|yes/.test(failed)||(scenario.id==='confirmation_yes'&&/what.*yes|clarify/.test(text)));
  add('ignored_current_program',/program|schedule|structure|current/.test(failed));
  add('unnecessary_clarification',/ask|clarify|means again/.test(failed)||/can you clarify|what do you mean|do you mean by/.test(text));
  add('confirmation_not_resolved',/confirmation|yes/.test(failed));
  add('jumped_to_workout_generation',/workout generation|full workout|exercise list/.test(failed)||(/3 sets|4 sets/.test(text)&&scenario.id.indexOf('add')!==-1));
  add('overconfident_causation',/definite|certainty|does not collapse/.test(failed)||/definitely caused|clearly caused|without doubt/.test(text));
  add('over_attributed_to_sleep',sleepOverAttributed(text,profileText)||(/blame sleep|sleep unless/.test(failed)&&/sleep (is|was).*cause|because of sleep/.test(text)));
  add('invented_data',/invent/.test(failed)||(/you mentioned|your note says|you told me about/i.test(text)&&!/injur|sleep|preferences/.test(profileText)));
  add('no_actionable_next_step',/monitor|action|next step|next check/.test(failed));
  add('generic_advice',/generic/.test(failed)||(/in general|generally speaking|always remember to/i.test(text)&&text.length<400));
  add('contradicted_engine',contradictedEngine(text,engine));

  return labels;
}

function scoreFromEvaluation(checks,patterns,apiError){
  if(apiError){
    return Object.fromEntries(SCORE_KEYS.map(function(k){return[k,0];}));
  }
  const total=checks.length||1;
  const passed=checks.filter(function(c){return c.passed;}).length;
  const ratio=passed/total;
  const penalty=patterns.length;
  function clamp(n){return Math.max(1,Math.min(10,Math.round(n)));}
  const base=clamp(4+ratio*6-Math.min(penalty*0.45,3));
  const scores={
    overall:base,
    contextUse:clamp(base-(patterns.includes('ignored_current_program')?3:0)-(patterns.includes('lost_conversation_context')?2:0)),
    intentUnderstanding:clamp(base-(patterns.includes('unnecessary_clarification')?2:0)-(patterns.includes('confirmation_not_resolved')?3:0)),
    dataGrounding:clamp(base-(patterns.includes('invented_data')?4:0)-(patterns.includes('contradicted_engine')?3:0)),
    recommendationQuality:clamp(base-(patterns.includes('jumped_to_workout_generation')?3:0)-(patterns.includes('generic_advice')?2:0)),
    uncertaintyCalibration:clamp(base-(patterns.includes('overconfident_causation')?3:0)-(patterns.includes('over_attributed_to_sleep')?2:0)),
    actionability:clamp(base-(patterns.includes('no_actionable_next_step')?3:0)),
    noFabrication:clamp(10-(patterns.includes('invented_data')?6:0)-(patterns.includes('contradicted_engine')?2:0)),
    conversationNaturalness:clamp(base-(patterns.includes('unnecessary_clarification')?2:0)-(patterns.includes('lost_conversation_context')?2:0))
  };
  scores.overall=clamp(Math.round((scores.contextUse+scores.intentUnderstanding+scores.dataGrounding+scores.recommendationQuality+scores.uncertaintyCalibration+scores.actionability+scores.noFabrication+scores.conversationNaturalness)/8));
  return scores;
}

function evaluateResponse(scenario,answer,profile,engine,apiError){
  const checks=(scenario.expectations||[]).map(function(item){
    return{text:item.text,passed:!apiError&&checkExpected(answer,item),critical:item.critical};
  });
  const patterns=apiError?['api_or_runtime_error']:detectFailurePatterns(scenario,checks,answer,profile,engine);
  const scores=scoreFromEvaluation(checks,patterns,apiError);
  const failedCritical=checks.some(function(c){return c.critical&&!c.passed;});
  const failCount=checks.filter(function(c){return !c.passed;}).length;
  const pass=!apiError&&scores.overall>=7&&!failedCritical&&failCount<=1;
  return{checks:checks,patterns:patterns,scores:scores,pass:pass};
}

async function askAI(context,scenario){
  const prior=(scenario.conversation||[]).map(function(m){
    return{role:m.role==='ai'?'assistant':'user',content:m.text||''};
  });
  const question=scenario.prompt;
  const system=context.buildSysPrompt(question)+
    '\n\nMODE: DEV COACHING QA TEST. Answer normally using Forma context. Keep concise for mobile chat.';
  const resp=await fetch(FORMA_AI_API,{
    method:'POST',
    headers:Object.assign({},context.apiHeaders(),{'Origin':'http://localhost'}),
    body:JSON.stringify({
      model:FORMA_AI_MODEL,
      max_tokens:2500,
      thinking:{type:'enabled',budget_tokens:1024},
      system:system,
      messages:prior.concat([{role:'user',content:question}])
    })
  });
  const raw=await resp.text();
  if(!resp.ok)throw new Error('API HTTP '+resp.status+': '+raw.slice(0,240));
  let data;
  try{data=JSON.parse(raw);}catch(e){throw new Error('API returned non-JSON: '+raw.slice(0,240));}
  if(data.error)throw new Error(data.error.message||'API error');
  const parsed=context.parseAIResponse(context.extractText(data.content));
  return parsed.message||context.extractText(data.content)||'(empty response)';
}

function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}

function escapeMd(v){
  return String(v===undefined||v===null?'':v).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildReport(results,meta){
  const lines=[];
  const coachingResults=results.filter(function(r){return !r.apiError;});
  const apiFailures=results.filter(function(r){return r.apiError;});
  const passed=coachingResults.filter(function(r){return r.evaluation.pass;});
  const failed=coachingResults.filter(function(r){return !r.evaluation.pass;});

  lines.push('# Forma Coaching QA Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: test whether Forma feels like a real coach across common user questions — beyond deterministic exercise recommendations.');
  lines.push('');
  lines.push('Mode: **'+(meta.dryRun?'dry-run (scenarios only, no AI calls)':'live AI via production proxy')+'**');
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('- Scenarios: '+results.length);
  lines.push('- Coaching pass: '+passed.length+'/'+coachingResults.length+(meta.dryRun?' (dry-run — not evaluated)':''));
  lines.push('- Coaching fail: '+failed.length);
  lines.push('- API/runtime failures: '+apiFailures.length+' (separate from coaching quality)');
  lines.push('');

  const patternCounts={};
  coachingResults.forEach(function(r){
    (r.evaluation.patterns||[]).forEach(function(p){
      patternCounts[p]=(patternCounts[p]||0)+1;
    });
  });
  if(Object.keys(patternCounts).length){
    lines.push('### Top failure patterns');
    lines.push('');
    lines.push('| Pattern | Count |');
    lines.push('|---|---:|');
    Object.keys(patternCounts).sort(function(a,b){return patternCounts[b]-patternCounts[a];}).forEach(function(k){
      lines.push('| '+escapeMd(k)+' | '+patternCounts[k]+' |');
    });
    lines.push('');
  }

  if(apiFailures.length){
    lines.push('### API/runtime failures (not coaching failures)');
    lines.push('');
    apiFailures.forEach(function(r){
      lines.push('- **'+r.scenarioName+'**: '+escapeMd(r.apiError));
    });
    lines.push('');
  }

  lines.push('| # | Scenario | Pass | Overall | Failed checks | Patterns | API |');
  lines.push('|---:|---|:---:|:---:|:---:|---|:---:|');
  results.forEach(function(r,i){
    const ev=r.evaluation;
    lines.push('| '+[
      i+1,
      r.scenarioName,
      r.apiError?'API error':(meta.dryRun?'dry-run':(ev.pass?'yes':'no')),
      r.apiError?'—':(meta.dryRun?'—':String(ev.scores.overall)),
      r.apiError?'—':(meta.dryRun?'—':String(ev.checks.filter(function(c){return !c.passed;}).length)),
      r.apiError?'—':(meta.dryRun?'—':((ev.patterns||[]).join(', ')||'—')),
      r.apiError?'yes':'no'
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Detailed scenarios');
  lines.push('');

  results.forEach(function(r,i){
    const ev=r.evaluation;
    const ds=r.datasetSummary;
    lines.push('### '+(i+1)+'. '+r.scenarioName);
    lines.push('');
    lines.push('**Prompt:** '+r.prompt);
    lines.push('');
    lines.push('**Mock context:** '+ds.label);
    lines.push('');
    lines.push('- Profile: '+escapeMd(JSON.stringify(ds.profile)));
    lines.push('- Schedule: '+escapeMd(Object.keys(ds.schedule||{}).map(function(d){return d+':'+ds.schedule[d];}).join(', ')));
    lines.push('- Logged workouts: '+ds.workoutCount);
    if(ds.conversation.length){
      lines.push('- Conversation: '+escapeMd(ds.conversation.join(' | ')));
    }
    if(r.engine){
      lines.push('- Engine snapshot: '+escapeMd(r.engine.action+' @ '+r.engine.weightDisp+' lb, reps '+r.engine.repTarget+', '+r.engine.confidence+' confidence'));
    }
    lines.push('');
    lines.push('#### AI response');
    lines.push('');
    if(r.apiError){
      lines.push('_API/runtime error:_ '+escapeMd(r.apiError));
    }else if(meta.dryRun){
      lines.push('_Skipped in dry-run mode._');
    }else{
      lines.push('```');
      lines.push(r.aiResponse||'(empty)');
      lines.push('```');
    }
    lines.push('');
    lines.push('#### Evaluation');
    lines.push('');
    lines.push('| Field | Value |');
    lines.push('|---|---|');
    lines.push('| Pass/fail | '+escapeMd(r.apiError?'API error':(meta.dryRun?'dry-run':(ev.pass?'pass':'fail')))+' |');
    if(!meta.dryRun&&!r.apiError){
      SCORE_KEYS.forEach(function(k){
        lines.push('| '+SCORE_LABELS[k]+' | '+ev.scores[k]+'/10 |');
      });
    }
    lines.push('');
    if(!meta.dryRun&&!r.apiError){
      lines.push('**Failed checklist items:** '+(ev.checks.filter(function(c){return !c.passed;}).map(function(c){return c.text;}).join('; ')||'none'));
      lines.push('');
      lines.push('**Failure patterns:** '+((ev.patterns||[]).join(', ')||'none'));
      lines.push('');
      lines.push('| Checklist item | Pass |');
      lines.push('|---|---|');
      ev.checks.forEach(function(c){
        lines.push('| '+escapeMd(c.text)+' | '+(c.passed?'yes':'no')+(c.critical?' (critical)':'')+' |');
      });
      lines.push('');
    }
    lines.push('#### Manual review');
    lines.push('');
    lines.push('| clear? | trustworthy? | actionable? | notes |');
    lines.push('|:---:|:---:|:---:|---|');
    lines.push('| | | | |');
    lines.push('');
  });

  lines.push('## Review guide');
  lines.push('');
  lines.push('- **API/runtime failures** mean the proxy or network failed — not a coaching quality score.');
  lines.push('- **Pass** requires overall ≥ 7, no critical checklist failures, and at most one non-critical failure.');
  lines.push('- Use manual review columns for tone, nuance, and false positives in automated checks.');
  lines.push('');

  return lines.join('\n');
}

async function main(){
  const context=loadFormaAIContext();
  if(typeof context.buildSysPrompt!=='function'){
    throw new Error('buildSysPrompt was not loaded from js/ai.js');
  }

  const results=[];
  for(let i=0;i<SCENARIOS.length;i++){
    const scenario=SCENARIOS[i];
    applyScenario(context,scenario);
    const engine=scenario.engineExercise?engineSnapshot(context,scenario.engineExercise):null;
    const row={
      scenarioId:scenario.id,
      scenarioName:scenario.name,
      prompt:scenario.prompt,
      datasetSummary:datasetSummary(scenario),
      engine:engine,
      aiResponse:'',
      apiError:'',
      evaluation:{checks:[],patterns:[],scores:Object.fromEntries(SCORE_KEYS.map(function(k){return[k,0];})),pass:false}
    };

    if(DRY_RUN){
      row.evaluation={checks:[],patterns:['dry_run'],scores:Object.fromEntries(SCORE_KEYS.map(function(k){return[k,0];})),pass:false};
    }else{
      try{
        row.aiResponse=await askAI(context,scenario);
        row.evaluation=evaluateResponse(scenario,row.aiResponse,context.S.profile,engine,'');
      }catch(err){
        row.apiError=err&&err.message?err.message:String(err);
        row.evaluation=evaluateResponse(scenario,'',context.S.profile,engine,row.apiError);
      }
      if(DELAY_MS&&i<SCENARIOS.length-1)await sleep(DELAY_MS);
    }

    results.push(row);
    const tag=row.apiError?'[API error]':(DRY_RUN?'[dry-run]':(row.evaluation.pass?'[pass]':'[fail '+row.evaluation.scores.overall+']'));
    console.log('  '+(i+1)+'. '+scenario.name+': '+tag);
  }

  const meta={dryRun:DRY_RUN,generatedAt:new Date().toISOString()};
  fs.mkdirSync(path.dirname(REPORT_MD),{recursive:true});
  fs.writeFileSync(REPORT_MD,buildReport(results,meta));
  fs.writeFileSync(REPORT_JSON,JSON.stringify({meta:meta,results:results},null,2));

  const coaching=results.filter(function(r){return !r.apiError&&!DRY_RUN;});
  const passCount=coaching.filter(function(r){return r.evaluation.pass;}).length;
  const apiCount=results.filter(function(r){return r.apiError;}).length;
  console.log('Wrote '+path.relative(ROOT,REPORT_MD));
  console.log('Wrote '+path.relative(ROOT,REPORT_JSON));
  if(DRY_RUN){
    console.log('Dry-run: '+results.length+' scenarios listed (no AI calls)');
  }else{
    console.log('Coaching pass: '+passCount+'/'+coaching.length+', API failures: '+apiCount);
  }
}

main().catch(function(err){
  console.error(err);
  process.exit(1);
});
