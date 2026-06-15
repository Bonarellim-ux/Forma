// Recommendation, progression, and exercise substitution logic for Forma.

function normExName(name){return String(name||'').trim().toLowerCase().replace(/[-_]/g,' ').replace(/\s+/g,' ');}

function makeSub(name,muscle,pattern,reason){return{name:name,muscle:muscle,pattern:pattern,reason:reason};}

function getExerciseSubstitutions(name){
  if(S&&S.tourActive&&name==='Bulgarian Split Squat')return[
    makeSub('Reverse Lunge','quads/glutes','unilateral squat','Same unilateral squat pattern, same quad/glute target, and easier to load when balance is limiting.'),
    makeSub('Step-Up','quads/glutes','unilateral squat','Same single-leg role with a stable box height and similar knee/hip action.'),
    makeSub('Split Squat','quads/glutes','unilateral squat','Same lower-body pattern with less balance demand than the rear-foot-elevated version.')
  ];
  const exact=EX_SUBS[name];
  if(exact)return exact.filter(function(o){return o&&o.name&&o.name!==name;});
  const n=normExName(name);
  // Fallbacks are still constrained by muscle + movement pattern, never random.
  if(n.includes('incline')&&(n.includes('press')||n.includes('bench')))return[
    makeSub('Incline Dumbbell Press','upper chest','incline press','Same incline angle and upper-chest emphasis.'),
    makeSub('Machine Incline Press','upper chest','incline press','Same upper-chest press with more stability.'),
    makeSub('Low-to-High Cable Fly','upper chest','low-to-high adduction','Same clavicular/upper-pec bias from a similar upward angle.')
  ];
  if(n.includes('bench')||n.includes('chest press'))return[
    makeSub('Dumbbell Bench Press','mid chest','horizontal press','Same horizontal press and mid-chest target.'),
    makeSub('Machine Chest Press','mid chest','horizontal press','Same chest/triceps pattern with more stability.'),
    makeSub('Push-Up','mid chest','horizontal press','Same horizontal push when equipment is limited.')
  ];
  if(n.includes('fly')&&n.includes('low'))return[
    makeSub('Incline Dumbbell Fly','upper chest','incline adduction','Same upper-pec angle with dumbbells.'),
    makeSub('Incline Dumbbell Press','upper chest','incline press','Keeps upper-chest emphasis with more load.'),
    makeSub('Machine Incline Press','upper chest','incline press','Same upper-chest slot with stable pressing.')
  ];
  if(n.includes('fly')||n.includes('crossover'))return[
    makeSub('Cable Crossover','mid chest','horizontal adduction','Same chest adduction pattern.'),
    makeSub('Pec Deck','mid chest','horizontal adduction','Same chest isolation with more stability.'),
    makeSub('Dumbbell Fly','mid chest','horizontal adduction','Same pec isolation using dumbbells.')
  ];
  if(n.includes('squat'))return[
    makeSub('Hack Squat','quads','squat pattern','Closest quad-dominant squat substitute.'),
    makeSub('Leg Press','quads/glutes','knee-dominant press','Same lower-body press focus with less spinal loading.'),
    makeSub('Goblet Squat','quads/glutes','squat pattern','Same squat pattern with easier setup.')
  ];
  if(n.includes('deadlift')||n.includes('rdl')||n.includes('hinge'))return[
    makeSub('Romanian Deadlift','hamstrings/glutes','hip hinge','Same posterior-chain hinge with less total fatigue.'),
    makeSub('Back Extension','glutes/hamstrings','hip extension','Same hip-extension muscles without a barbell.'),
    makeSub('Hip Thrust','glutes','hip extension','Keeps posterior-chain focus with more glute bias.')
  ];
  if(n.includes('row'))return[
    makeSub('Chest-Supported Row','mid back/lats','horizontal pull','Same row pattern while removing lower-back fatigue.'),
    makeSub('Seated Cable Row','mid back/lats','horizontal pull','Same horizontal pull with constant tension.'),
    makeSub('Dumbbell Row','lats/mid back','horizontal pull','Same row pattern with unilateral loading.')
  ];
  if(n.includes('pull')||n.includes('lat'))return[
    makeSub('Lat Pulldown','lats','vertical pull','Closest vertical-pull match for lat focus.'),
    makeSub('Assisted Pull-Up','lats','vertical pull','Same pull-up pattern with assistance.'),
    makeSub('Single-Arm Pulldown','lats','vertical pull','Same lat action with unilateral control.')
  ];
  if(n.includes('curl')&&!n.includes('leg'))return[
    makeSub('Cable Curl','biceps','elbow flexion','Same biceps pattern with constant tension.'),
    makeSub('Preacher Curl','biceps short head','elbow flexion','Same biceps role with stricter form.'),
    makeSub('Incline Dumbbell Curl','biceps long head','elbow flexion','Same biceps role with more long-head stretch.')
  ];
  if(n.includes('tricep')||n.includes('pushdown')||n.includes('skull'))return[
    makeSub('Cable Kickback','triceps lateral head','elbow extension','Same elbow-extension role with lateral-head bias.'),
    makeSub('Skull Crusher','triceps','elbow extension','Same triceps extension with more stretch.'),
    makeSub('Close-Grip Bench Press','triceps','compound elbow extension','Same triceps goal with heavier loading.')
  ];
  if(n.includes('lateral raise'))return[
    makeSub('Cable Lateral Raise','side delts','shoulder abduction','Same side-delt target with constant tension.'),
    makeSub('Machine Lateral Raise','side delts','shoulder abduction','Same side-delt isolation with more stability.'),
    makeSub('Lean-Away Lateral Raise','side delts','shoulder abduction','Same side-delt target with more stretch.')
  ];
  if(n.includes('face pull')||n.includes('rear delt')||n.includes('reverse fly'))return[
    makeSub('Cable Rear Delt Fly','rear delts','horizontal abduction','Same rear-delt movement pattern.'),
    makeSub('Reverse Fly','rear delts','horizontal abduction','Same rear-delt function with simpler setup.'),
    makeSub('Band Pull-Apart','rear delts/upper back','horizontal abduction','Same rear-delt and upper-back role.')
  ];
  if(n.includes('shoulder')||n.includes('overhead'))return[
    makeSub('Dumbbell Shoulder Press','front/side delts','vertical press','Same vertical press pattern.'),
    makeSub('Machine Shoulder Press','front/side delts','vertical press','Same vertical push with added stability.'),
    makeSub('Landmine Press','front delts/upper chest','angled press','Shoulder-friendly angled press alternative.')
  ];
  if(n.includes('leg curl'))return[
    makeSub('Seated Leg Curl','hamstrings','knee flexion','Same hamstring isolation pattern.'),
    makeSub('Lying Leg Curl','hamstrings','knee flexion','Same knee-flexion role with a different body position.'),
    makeSub('Nordic Curl','hamstrings','knee flexion','Same hamstring function with high eccentric demand.')
  ];
  if(n.includes('leg extension'))return[
    makeSub('Hack Squat','quads','knee extension','Keeps quad-dominant knee-extension emphasis.'),
    makeSub('Spanish Squat','quads','knee extension','Very quad-focused substitute.'),
    makeSub('Sissy Squat','quads','knee extension','Closest bodyweight-style quad bias.')
  ];
  return[
    makeSub('Ask AI Coach','same target','custom substitute','No confident rule-based match found. Ask the AI coach for a context-specific swap before replacing this exercise.')
  ];
}

function getSubstitutionByName(oldName,newName){
  return getExerciseSubstitutions(oldName).find(function(o){return o.name===newName;})||null;
}

function getLastSession(name){
  for(const w of S.workouts){
    const ex=w.exercises&&w.exercises.find(e=>e&&e.name===name);
    if(!ex||!Array.isArray(ex.sets)||!ex.sets.length)continue;
    try{
      const best=ex.sets.reduce((b,s)=>e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b);
      return{date:fmtD(w.date),w:best.w,r:best.r,e1:e1rm(best.w,best.r)};
    }catch(e){continue;}
  }
  return null;
}

function getLastWorkingSets(name){
  for(const w of S.workouts){
    const ex=w.exercises&&w.exercises.find(e=>e&&e.name===name);
    if(!ex||!Array.isArray(ex.sets))continue;
    try{
      const ws=ex.sets.filter(s=>s&&!s.warmup&&s.r>0);
      if(ws.length)return ws;
    }catch(e){continue;}
  }
  return null;
}

function getRecentExerciseSessions(exName,limit){
  const target=normExName(exName);
  return (S.workouts||[])
    .filter(function(w){return w&&w.date&&Array.isArray(w.exercises);})
    .slice()
    .sort(function(a,b){return new Date(b.date)-new Date(a.date);})
    .map(function(w){
      const ex=w.exercises.find(function(e){return e&&normExName(e.name)===target;});
      if(!ex||!Array.isArray(ex.sets))return null;
      const sets=ex.sets.filter(function(s){return s&&!s.warmup&&Number(s.r)>0&&Number(s.w)>=0;});
      if(!sets.length)return null;
      const top=sets.reduce(function(best,set){
        return e1rm(set.w,set.r)>e1rm(best.w,best.r)?set:best;
      },sets[0]);
      return{
        date:w.date,
        sets:sets,
        topW:Number(top.w),
        topR:Number(top.r),
        topE1:e1rm(Number(top.w),Number(top.r)),
        volume:sets.reduce(function(acc,s){return acc+(Number(s.w)||0)*(Number(s.r)||0);},0)
      };
    })
    .filter(Boolean)
    .slice(0,limit||5);
}

function exerciseProgressionProfile(exName){
  const n=normExName(exName);
  const category=classifyExerciseCategory(exName);
  const isLower=category==='lower_compound'||category==='lower_isolation'||category==='unilateral_lower'||category==='machine_lower_compound';
  const isUnilateral=category==='unilateral_lower';
  const isCompound=category==='upper_compound'||category==='lower_compound'||category==='machine_compound'||category==='machine_lower_compound'||category==='dumbbell_compound';
  const isLowerIsolation=category==='lower_isolation';
  const isUpperIsolation=category==='upper_isolation'||category==='small_isolation';
  let jump;
  if(S.unit==='kg'){
    jump=category==='lower_compound'||category==='machine_lower_compound'?5:2.5;
  }else{
    if(category==='lower_compound'||category==='machine_lower_compound')jump=10;
    else if(category==='lower_isolation'||category==='upper_compound'||category==='unilateral_lower'||category==='machine_compound'||category==='dumbbell_compound')jump=5;
    else if(category==='upper_isolation'||category==='small_isolation')jump=2.5;
    else jump=5;
  }
  let minTarget=8,maxTarget=12;
  if(category==='lower_compound'){minTarget=5;maxTarget=10;}
  else if(category==='upper_compound'){minTarget=6;maxTarget=10;}
  else if(category==='machine_compound'||category==='machine_lower_compound'||category==='dumbbell_compound'){minTarget=8;maxTarget=12;}
  else if(category==='upper_isolation'){minTarget=10;maxTarget=15;}
  else if(category==='small_isolation'){minTarget=12;maxTarget=20;}
  else if(category==='bodyweight'){minTarget=8;maxTarget=15;}
  return{
    category:category,
    isLower:isLower,
    isCompound:isCompound,
    isUnilateral:isUnilateral,
    isLowerIsolation:isLowerIsolation,
    isUpperIsolation:isUpperIsolation,
    isIsolation:!isCompound,
    jump:jump,
    minTarget:minTarget,
    maxTarget:maxTarget
  };
}

function classifyExerciseCategory(exName){
  const n=normExName(exName);
  if(/\b(pull up|pull-up|pullups|pull ups|push up|push-up|dip|chin up|chin-up)\b/.test(n))return 'bodyweight';
  if(n.includes('lateral raise')||n.includes('rear delt')||n.includes('face pull')||n.includes('y raise')||n.includes('pec deck')||n.includes('reverse pec'))return 'small_isolation';
  if((n.includes('dumbbell')||/\bdb\b/.test(n))&&(n.includes('press')||n.includes('row')))return 'dumbbell_compound';
  if(n.includes('machine')||n.includes('smith')||n.includes('hack squat')||n.includes('leg press')||n.includes('chest press')||n.includes('pulldown')||n.includes('high row')||n.includes('t bar row')){
    if(n.includes('leg press')||n.includes('hack squat'))return 'machine_lower_compound';
    if(n.includes('kickback'))return 'lower_isolation';
    if(n.includes('curl')||n.includes('extension')||n.includes('fly')||n.includes('raise'))return 'upper_isolation';
    return 'machine_compound';
  }
  if(n.includes('lunge')||n.includes('split squat')||n.includes('step up')||n.includes('step-up'))return 'unilateral_lower';
  if(n.includes('leg extension')||n.includes('leg curl')||n.includes('calf')||n.includes('seated calf')||n.includes('glute kickback'))return 'lower_isolation';
  if(n.includes('squat')||n.includes('deadlift')||n.includes('rdl')||n.includes('romanian deadlift')||n.includes('leg press')||n.includes('hack squat')||n.includes('hip thrust'))return 'lower_compound';
  if(n.includes('curl')||n.includes('raise')||n.includes('fly')||n.includes('pushdown')||n.includes('extension'))return 'upper_isolation';
  if(n.includes('bench')||n.includes('press')||n.includes('row')||n.includes('pulldown')||n.includes('lat pulldown')||n.includes('overhead'))return 'upper_compound';
  return 'unknown';
}

function roundToProgressionJump(value,jump){
  if(!jump)return value;
  return Math.round(value/jump)*jump;
}

function sameProgressionWeight(a,b,jump){
  return Math.abs(a-b)<=Math.max(.5,jump*.15);
}

function displayWeightFromKg(kg){
  return Number(toDisp(Number(kg)||0));
}

function kgFromDisplayWeight(wDisp){
  return S.unit==='lbs'?wDisp/KG2LB:wDisp;
}

function fmtRecWeight(kg){
  return roundToProgressionJump(displayWeightFromKg(kg),S.unit==='lbs'?2.5:1)+' '+uLbl();
}

function fmtTopSet(session){
  return fmtRecWeight(session.topW)+' x '+session.topR;
}

function recentTopSetText(sessions){
  return sessions.slice().reverse().map(fmtTopSet).join(' -> ');
}

function sessionDisplayWeight(session,profile){
  return roundToProgressionJump(displayWeightFromKg(session.topW),S.unit==='lbs'?2.5:1);
}

function repsAtWeight(sessions,weightDisp,profile){
  return sessions.filter(function(s){return sameProgressionWeight(sessionDisplayWeight(s,profile),weightDisp,profile.jump);}).map(function(s){return s.topR;});
}

function recentWeightRangeText(sessions,profile){
  const chronological=sessions.slice().reverse();
  const first=sessionDisplayWeight(chronological[0],profile);
  const last=sessionDisplayWeight(chronological[chronological.length-1],profile);
  return first+' to '+last+' '+uLbl();
}

function topE1NonDeclining(sessions){
  if(sessions.length<3)return true;
  const chronological=sessions.slice(0,Math.min(5,sessions.length)).reverse();
  let declines=0;
  for(let i=1;i<chronological.length;i++){
    if(chronological[i].topE1<chronological[i-1].topE1*.98)declines++;
  }
  return declines<2;
}

function clearRegressionAtRecentHigh(sessions,profile){
  if(sessions.length<4)return false;
  const recent=sessions.slice(0,4);
  const last=sessionDisplayWeight(recent[0],profile);
  const highest=Math.max.apply(null,recent.map(function(s){return sessionDisplayWeight(s,profile);}));
  if(!sameProgressionWeight(last,highest,profile.jump))return false;
  const sameHigh=repsAtWeight(recent,highest,profile);
  if(sameHigh.length<2)return false;
  return sameHigh[0]<sameHigh[sameHigh.length-1]-1&&sameHigh[0]<profile.minTarget;
}

function successfulHigherWeight(sessions,currentDisp,profile){
  return sessions.some(function(s){
    const w=sessionDisplayWeight(s,profile);
    return w>currentDisp+.5&&s.topR>=profile.minTarget;
  });
}

function e1TrendText(sessions){
  if(sessions.length<3)return '';
  const chronological=sessions.slice(0,3).reverse();
  const first=chronological[0].topE1;
  const last=chronological[chronological.length-1].topE1;
  if(last>first)return 'Your estimated 1RM is trending up.';
  if(last<first)return 'Your estimated 1RM is trending down.';
  return 'Your estimated 1RM has stayed about the same.';
}

function recommendationDetail(action,whyLines){
  return action+'<br><br>Why:<br>'+whyLines.filter(Boolean).join('<br>');
}

function recommendationHistoryText(sessions,profile,limit){
  const rows=(sessions||[]).slice(0,limit||3).map(function(s){
    return fmtD(s.date)+': '+sessionDisplayWeight(s,profile)+' '+uLbl()+' x '+s.topR;
  });
  return rows.length?'Recent working sets: '+rows.join('; ')+'.':'';
}

function priorWorkingSessionText(sessions){
  const n=(sessions||[]).length;
  return n+' prior working '+(n===1?'session':'sessions');
}

function rawDefaultExerciseLbs(name){
  const n=String(name||'').trim();
  const defaults=(typeof EX_DEFAULTS==='object'&&EX_DEFAULTS)?EX_DEFAULTS:{};
  if(defaults[n]!==undefined)return Number(defaults[n])||0;
  const nl=n.toLowerCase();
  if(nl.includes('leg press'))return 150;
  if(nl.includes('deadlift'))return 135;
  if(nl.includes('squat'))return 95;
  if(nl.includes('bench')||nl.includes('press'))return 75;
  if(nl.includes('row')||nl.includes('pull'))return 55;
  if(nl.includes('curl')||nl.includes('raise')||nl.includes('fly'))return 20;
  if(nl.includes('pushdown')||nl.includes('extension')||nl.includes('tricep'))return 35;
  if(nl.includes('calf'))return 80;
  return 45;
}

function profileBodyweightLbs(){
  const raw=parseFloat(S&&S.profile&&S.profile.bodyweight);
  if(!raw||raw<=0)return null;
  if(S.unit==='kg'&&raw<130)return raw*KG2LB;
  return raw;
}

function profileExperienceMultiplier(){
  const exp=String(S&&S.profile&&S.profile.experience||'').toLowerCase();
  if(exp.includes('5+'))return 1.18;
  if(exp.includes('3')||exp.includes('advanced'))return 1.1;
  if(exp.includes('1')||exp.includes('2')||exp.includes('intermediate'))return 1;
  if(exp.includes('beginner')||exp.includes('starting')||exp.includes('6 months'))return .88;
  return .95;
}

function profileExperienceLevel(){
  const exp=String(S&&S.profile&&S.profile.experience||'').toLowerCase();
  if(exp.includes('5+')||exp.includes('advanced')||exp.includes('3'))return 'advanced';
  if(exp.includes('1')||exp.includes('2')||exp.includes('intermediate'))return 'intermediate';
  if(exp.includes('beginner')||exp.includes('novice')||exp.includes('starting')||exp.includes('6 months'))return 'beginner';
  return 'unknown';
}

function profileHeightInches(){
  const h=String(S&&S.profile&&S.profile.height||'').trim().toLowerCase();
  if(!h)return null;
  const imperial=h.match(/(\d+)\s*'\s*(\d+)?/);
  if(imperial)return (parseFloat(imperial[1])||0)*12+(parseFloat(imperial[2])||0);
  const numeric=parseFloat(h);
  if(!numeric)return null;
  return numeric>90?numeric/2.54:numeric;
}

function heightBuildFactor(category){
  const inches=profileHeightInches();
  if(!inches)return 1;
  const influence=category==='lower_compound'?.06:category==='upper_compound'?.04:category==='machine'?.03:.02;
  return Math.max(.96,Math.min(1.04,1+((inches-69)/10)*influence));
}

function profileAge(){
  const raw=parseFloat(S&&S.profile&&S.profile.age);
  return raw>0?raw:null;
}

function profileReturningFromBreak(){
  const p=S&&S.profile?S.profile:{};
  if(p.returning_from_break===true||p.returning_from_break==='true')return true;
  const gap=String(p.training_break||p.training_gap||'').toLowerCase();
  if(gap&&(gap.indexOf('break')>=0||gap.indexOf('return')>=0||gap.indexOf('away')>=0))return true;
  const exp=String(p.experience||'').toLowerCase();
  return exp.indexOf('returning')>=0||exp.indexOf('after break')>=0;
}

function profileEquipmentFlags(){
  const eq=String(S&&S.profile&&S.profile.equipment||'').toLowerCase();
  const hasFull=eq.indexOf('full commercial')>=0||eq.indexOf('commercial gym')>=0;
  const hasBarbell=hasFull||eq.indexOf('barbell')>=0;
  const hasDumbbell=hasFull||eq.indexOf('dumbbell')>=0;
  const hasMachine=hasFull||eq.indexOf('cable')>=0||eq.indexOf('machine')>=0;
  return{
    hasFull:hasFull,
    hasBarbell:hasBarbell,
    hasDumbbell:hasDumbbell,
    hasMachine:hasMachine,
    dumbbellsOnly:eq.indexOf('dumbbell')>=0&&!hasBarbell&&!hasMachine&&!hasFull,
    machinesOnly:(eq.indexOf('cable')>=0||eq.indexOf('machine')>=0)&&!hasBarbell&&!hasDumbbell&&!hasFull
  };
}

function isVeryLightNovice(){
  const bw=profileBodyweightLbs();
  const level=profileExperienceLevel();
  const novice=level==='beginner'||level==='unknown';
  if(!novice||!bw)return false;
  const sex=String(S&&S.profile&&S.profile.sex||'').toLowerCase();
  if(sex.includes('female'))return bw<135;
  return bw<125;
}

function firstTimeEffectiveLevel(){
  const base=profileExperienceLevel();
  if(profileReturningFromBreak()&&(base==='intermediate'||base==='advanced'))return'returning';
  return base;
}

function firstTimeRangeUsesIntermediate(level){
  return(level==='intermediate'||level==='advanced')&&!profileReturningFromBreak();
}

function firstTimeEquipmentSubstitution(exName){
  const n=normExName(exName);
  const eq=profileEquipmentFlags();
  if(eq.dumbbellsOnly){
    if(n==='bench press')return{variation:'Dumbbell Bench Press or Push-Up',substitute:'Dumbbell Bench Press',explain:'No barbell available in your equipment profile; use dumbbell or push-up calibration instead.',source:'equipment_adjusted_calibration'};
    if(n==='back squat')return{variation:'Goblet Squat',substitute:'Goblet Squat',explain:'No barbell rack available; Goblet Squat is the safer squat calibration.',source:'equipment_adjusted_calibration'};
    if(n.includes('romanian deadlift')||n==='rdl')return{variation:'Dumbbell Romanian Deadlift',substitute:'Dumbbell Romanian Deadlift',explain:'No barbell available; use dumbbell RDL calibration.',source:'equipment_adjusted_calibration'};
  }
  if(eq.machinesOnly){
    if(n==='bench press')return{variation:'Machine Chest Press',substitute:'Machine Chest Press',explain:'Machine-only equipment profile; use machine chest press calibration.',source:'equipment_adjusted_calibration'};
    if(n==='back squat')return{variation:'Leg Press or Hack Squat',substitute:'Leg Press',explain:'Machine-only equipment profile; use leg press calibration instead of barbell squat.',source:'equipment_adjusted_calibration'};
    if(n.includes('barbell row')||n==='row')return{variation:'Machine Row',substitute:'Machine Row',explain:'Machine-only equipment profile; use machine row calibration.',source:'equipment_adjusted_calibration'};
    if(n.includes('pull up')||n.includes('pull-up'))return{variation:'Lat Pulldown or Assisted Pull-Up',substitute:'Lat Pulldown',explain:'Machine-only equipment profile; lat pulldown is the practical vertical-pull calibration.',source:'equipment_adjusted_calibration'};
  }
  return null;
}

function firstTimeLightNoviceSafety(exName){
  if(!isVeryLightNovice())return null;
  const n=normExName(exName);
  if(n==='back squat')return{variation:'Goblet Squat',substitute:'Goblet Squat',explain:'Back squat barbell loading can be high for a very light novice, so Goblet Squat is a safer calibration choice.',source:'safer_calibration'};
  if(n==='bench press')return{variation:'Dumbbell Bench Press or Incline Push-Up',substitute:'Dumbbell Bench Press',explain:'Barbell bench loading can be high for a very light novice; dumbbell or incline push-up is a safer calibration choice.',source:'safer_calibration'};
  if(n.includes('romanian deadlift')||n==='rdl')return{variation:'Dumbbell Romanian Deadlift',substitute:'Dumbbell Romanian Deadlift',explain:'Barbell RDL loading can be high for a very light novice; dumbbell RDL is a safer calibration choice.',source:'safer_calibration'};
  return null;
}

function firstTimeBodyweightGuidance(exName){
  const n=normExName(exName);
  const level=firstTimeEffectiveLevel();
  const baseLevel=level==='returning'?'beginner':level;
  const eq=profileEquipmentFlags();
  if(n.includes('push')){
    if(baseLevel==='advanced'){
      return{variation:'Push-Up or weighted/deficit Push-Up',repTarget:'6-12',loadBasis:'bodyweight',weightDisp:0,weight:0,displayText:'Push-Up or weighted/deficit Push-Up, 6–12 reps',source:'exact_match',confidenceReason:'No logged working sets yet.'};
    }
    if(baseLevel==='intermediate'){
      return{variation:'Push-Up',repTarget:'6-12',loadBasis:'bodyweight',weightDisp:0,weight:0,displayText:'Push-Up, 6–12 reps',source:'exact_match',confidenceReason:'No logged working sets yet.'};
    }
    return{variation:'Incline Push-Up',repTarget:'6-10',loadBasis:'variation',weightDisp:0,weight:0,displayText:'Incline Push-Up, 6–10 reps',source:'exact_match',confidenceReason:'No logged working sets yet.'};
  }
  if(n.includes('pull')||n.includes('chin')){
    if(baseLevel==='intermediate'&&!profileReturningFromBreak()&&!eq.machinesOnly){
      return{variation:'Pull-Up',repTarget:'4-8',loadBasis:'bodyweight',weightDisp:0,weight:0,displayText:'Pull-Up, 4–8 reps',source:'exact_match',confidenceReason:'No logged working sets yet.'};
    }
    if(eq.machinesOnly){
      return{variation:'Lat Pulldown',repTarget:'5-8',loadBasis:'equipment substitute',weightDisp:0,weight:0,displayText:'Lat Pulldown, 5–8 reps (vertical-pull substitute)',source:'equipment_adjusted_calibration',confidenceReason:'Adjusted for machine-only equipment with no logged history.',equipmentAdjusted:true,adjustmentReason:'Machine-only equipment profile; lat pulldown substitutes for pull-up calibration.'};
    }
    return{variation:'Assisted Pull-Up',repTarget:'5-8',loadBasis:'assisted',weightDisp:0,weight:0,displayText:'Assisted Pull-Up, 5–8 reps',source:'exact_match',confidenceReason:'No logged working sets yet.'};
  }
  return null;
}

function firstTimeLoadBasis(exName){
  const n=normExName(exName);
  return n.includes('dumbbell')||/\bdb\b/.test(n)?'per hand':'total load';
}

function firstTimeUsesBarbell(exName){
  const n=normExName(exName);
  if(n.includes('goblet')||n.includes('dumbbell')||/\bdb\b/.test(n))return false;
  return isBarbell(exName);
}

function firstTimeCalibrationRangeLbs(exName,category,level){
  const n=normExName(exName);
  const intermediate=level==='intermediate'||level==='advanced';
  if(n.includes('goblet squat'))return intermediate?{min:25,max:65}:{min:20,max:50};
  if((n.includes('dumbbell')||/\bdb\b/.test(n))&&n.includes('bench'))return intermediate?{min:12.5,max:35}:{min:10,max:25};
  if((n.includes('dumbbell')||/\bdb\b/.test(n))&&(n.includes('romanian')||n.includes('rdl')))return intermediate?{min:15,max:35}:{min:10,max:25};
  if(n.includes('back squat')||n==='squat')return intermediate?{min:65,max:115}:{min:45,max:95};
  if(n.includes('bench'))return intermediate?{min:55,max:95}:{min:45,max:75};
  if(n.includes('lat pulldown')||n.includes('pulldown'))return intermediate?{min:50,max:85}:{min:40,max:70};
  if((n.includes('db')||n.includes('dumbbell'))&&n.includes('shoulder press'))return intermediate?{min:12.5,max:30}:{min:10,max:25};
  if(n.includes('romanian deadlift')||n.includes('rdl'))return intermediate?{min:55,max:115}:{min:45,max:95};
  if(n.includes('leg press'))return intermediate?{min:120,max:220}:{min:90,max:180};
  if(n.includes('bicep curl')||n.includes('curl'))return intermediate?{min:12.5,max:30}:{min:10,max:25};
  if(n.includes('tricep')||n.includes('pushdown'))return intermediate?{min:25,max:45}:{min:20,max:40};
  if(n.includes('lateral raise'))return intermediate?{min:7.5,max:17.5}:{min:5,max:15};
  if(category==='lower_compound')return intermediate?{min:55,max:115}:{min:45,max:95};
  if(category==='upper_compound')return intermediate?{min:45,max:95}:{min:35,max:75};
  if(category==='machine_lower_compound')return intermediate?{min:120,max:220}:{min:90,max:180};
  if(category==='machine_compound')return intermediate?{min:50,max:100}:{min:40,max:70};
  if(category==='dumbbell_compound')return intermediate?{min:15,max:35}:{min:10,max:25};
  if(category==='lower_isolation')return intermediate?{min:30,max:80}:{min:20,max:60};
  if(category==='small_isolation')return intermediate?{min:7.5,max:20}:{min:5,max:15};
  if(category==='upper_isolation')return intermediate?{min:10,max:30}:{min:5,max:20};
  return intermediate?{min:15,max:40}:{min:5,max:25};
}

function firstTimeExactCalibrationMatch(exName){
  const n=normExName(exName);
  return [
    'bench press',
    'back squat',
    'goblet squat',
    'lat pulldown',
    'db shoulder press',
    'dumbbell shoulder press',
    'romanian deadlift',
    'leg press',
    'bicep curl',
    'tricep pushdown',
    'lateral raise'
  ].includes(n);
}

function firstTimeFallbackSource(exName,category){
  if(firstTimeExactCalibrationMatch(exName))return 'exact_match';
  if(category==='unknown')return 'unknown_fallback';
  return 'category_fallback';
}

function firstTimeRepTarget(exName,category){
  const n=normExName(exName);
  if(category==='unknown')return '8-12';
  if(category==='machine_compound'||category==='machine_lower_compound')return '8-12';
  if(category==='dumbbell_compound')return '8-12';
  if(category==='small_isolation')return '12-20';
  if(category==='upper_isolation'||category==='lower_isolation')return '10-15';
  if(category==='lower_compound')return '5-10';
  if(category==='upper_compound')return '5-10';
  if(n.includes('curl')||n.includes('pushdown')||n.includes('extension')||n.includes('fly'))return '10-15';
  return '8-12';
}

function firstTimeCalibrationPosition(level){
  const bwLbs=profileBodyweightLbs();
  const bwScore=bwLbs?Math.max(0,Math.min(1,(bwLbs-110)/130)):.45;
  const sex=String(S&&S.profile&&S.profile.sex||'').toLowerCase();
  const sexAdjust=sex.includes('female')?-.18:sex.includes('male')?.04:0;
  const expAdjust=level==='advanced'?.28:level==='intermediate'?.18:level==='beginner'?-.08:level==='returning'?.02:0;
  let position=Math.max(0,Math.min(1,.35+bwScore*.25+sexAdjust+expAdjust));
  const age=profileAge();
  if(age&&age>=50)position=Math.max(0,position-.14);
  return position;
}

function firstTimeConfidence(level){
  return level==='intermediate'||level==='advanced'?'medium':'low';
}

function firstTimeRecommendationConfidence(level,source){
  if(profileReturningFromBreak())return'low';
  if(profileAge()>=50)return'low';
  if(source==='equipment_adjusted_calibration'||source==='safer_calibration')return'low';
  if(source!=='exact_match')return'low';
  return firstTimeConfidence(level);
}

function firstTimeConfidenceReason(level,source){
  const parts=[];
  if(source==='unknown_fallback')parts.push('No logged working sets and no strong exercise-category match.');
  else if(source==='category_fallback')parts.push('No exact exercise history; using a broad movement/category match.');
  else if(source==='equipment_adjusted_calibration')parts.push('Adjusted for available equipment with no logged history.');
  else if(source==='safer_calibration')parts.push('Safer calibration choice for profile size and experience.');
  else if(profileReturningFromBreak())parts.push('Some prior training, but rebuilding baseline after time away.');
  else if(level==='intermediate'||level==='advanced')parts.push('Some training experience, but no app history or prior lifting numbers.');
  else parts.push('No logged working sets yet.');
  if(profileAge()>=50)parts.push('Use a conservative ramp-up given age and no Forma training history.');
  return parts.join(' ');
}

function categoryCalibrationLabel(category,exName){
  const n=normExName(exName);
  if(category==='dumbbell_compound'){
    if(n.includes('press'))return 'dumbbell press';
    if(n.includes('row'))return 'dumbbell row';
    return 'dumbbell compound lift';
  }
  if(category==='upper_compound'){
    if(n.includes('bench'))return 'barbell bench press';
    if(n.includes('overhead')||n.includes('shoulder'))return 'barbell overhead press';
    return 'upper-body compound lift';
  }
  if(category==='lower_compound'){
    if(n.includes('squat'))return 'barbell squat';
    if(n.includes('deadlift')||n.includes('rdl'))return 'barbell deadlift';
    return 'lower-body compound lift';
  }
  if(category==='machine_compound')return 'machine compound lift';
  if(category==='machine_lower_compound')return 'machine lower-body lift';
  if(category==='upper_isolation')return 'upper-body isolation lift';
  if(category==='lower_isolation')return 'lower-body isolation lift';
  if(category==='small_isolation')return 'small-muscle isolation lift';
  if(category==='unilateral_lower')return 'unilateral lower-body lift';
  if(category==='bodyweight')return 'bodyweight exercise';
  if(category==='unknown')return 'general strength exercise';
  return 'strength exercise';
}

function firstTimeSourceInterpretation(start,p,exName){
  const source=start&&start.source;
  const category=start&&start.category||p.category;
  const label=categoryCalibrationLabel(category,exName);
  if(source==='unknown_fallback')return 'a conservative general starting point because there is no strong exercise-category match';
  if(source==='category_fallback')return 'a conservative category-based starting point for '+label+' because there is no exact exercise match in your history';
  if(source==='equipment_adjusted_calibration'||source==='safer_calibration'){
    return start&&start.adjustmentReason?start.adjustmentReason:('a conservative equipment-adjusted starting point for '+label);
  }
  const profileNotes=(start&&start.profileNotes)||startingWeightProfileNotes();
  return 'a conservative '+label+' starting point informed by '+profileNotes;
}

function firstTimeCalibrationWhyLines(exName,start,p){
  const why=[
    'No prior working sets yet.',
    'I\'m using '+firstTimeSourceInterpretation(start,p,exName)+' and treating this as a calibration load, not a strength prediction.'
  ];
  if(start&&start.loadBasis==='per hand')why.push('Load is per dumbbell/hand, not combined.');
  if(start&&start.equipmentAdjusted&&start.adjustmentReason&&!why.some(function(line){return line.indexOf(start.adjustmentReason)>=0;})){
    why.push(start.adjustmentReason);
  }
  if(profileAge()>=50)why.push('Starting conservatively given age and no Forma training history.');
  if(profileReturningFromBreak())why.push('Rebuild baseline gradually after time away from training.');
  why.push('After your first logged set, Forma will adjust from your actual performance.');
  return why;
}

function sameWeightSessionsDeclining(sessions){
  if(!sessions||sessions.length<3)return false;
  return repTrendDeclined(sessions)||e1TrendDeclined(sessions);
}

function stabilizeLoadWhyLines(atSameWeight,profile,lastWDisp,topSetHistory){
  if(sameWeightSessionsDeclining(atSameWeight)){
    const history=topSetHistory||recentTopSetText(atSameWeight.slice(0,Math.min(3,atSameWeight.length)));
    return[
      history?'Recent performance is trending down ('+history.replace(/\.$/,'')+'), so repeating '+lastWDisp+' '+uLbl()+' is safer than progressing.':'Recent performance is trending down, so repeating the load is safer than progressing.',
      'The goal is to rebuild clean reps before increasing.'
    ];
  }
  const history=topSetHistory||recentTopSetText(atSameWeight.slice(0,Math.min(3,atSameWeight.length)));
  return[
    history?'Your recent reps have been inconsistent at this weight: '+history+'.':'Performance has been inconsistent across recent sessions.',
    'Repeat the current load to collect more data before progressing.'
  ];
}

function bodyweightInfluenceForCategory(category){
  if(category==='lower_compound')return .65;
  if(category==='upper_compound')return .5;
  if(category==='unilateral_lower')return .42;
  if(category==='lower_isolation')return .35;
  if(category==='upper_isolation')return .22;
  if(category==='machine')return .35;
  return .28;
}

function startingWeightProfileNotes(){
  const notes=[];
  const p=S&&S.profile?S.profile:{};
  if(p.bodyweight)notes.push('bodyweight');
  if(p.experience)notes.push('training experience');
  if(p.height)notes.push('height/build context');
  return notes.length?notes.join(', '):'your saved profile';
}

function firstTimeBuildCalibration(exName,level,position){
  const p=exerciseProgressionProfile(exName);
  const rangeLevel=firstTimeRangeUsesIntermediate(level)?level:'beginner';
  const range=firstTimeCalibrationRangeLbs(exName,p.category,rangeLevel);
  let pos=position!==undefined?position:firstTimeCalibrationPosition(level);
  if(isVeryLightNovice()&&firstTimeUsesBarbell(exName))pos=Math.min(pos,.22);
  const calibrationLbs=range.min+(range.max-range.min)*pos;
  const displayRaw=S.unit==='kg'?calibrationLbs/KG2LB:calibrationLbs;
  const jump=S.unit==='kg'?Math.min(p.jump||2.5,2.5):(p.jump||5);
  const rounded=Math.max(jump,Math.round(displayRaw/jump)*jump);
  const minBarbell=S.unit==='kg'?20:45;
  const lower=firstTimeUsesBarbell(exName)?Math.max(rounded,minBarbell):rounded;
  const source=firstTimeFallbackSource(exName,p.category);
  return{
    weightDisp:Math.round(lower*10)/10,
    repTarget:firstTimeRepTarget(exName,p.category),
    category:p.category,
    loadBasis:firstTimeLoadBasis(exName),
    source:source,
    confidence:firstTimeRecommendationConfidence(level,source),
    confidenceReason:firstTimeConfidenceReason(level,source)
  };
}

function firstTimeStartingTarget(exName){
  const p=exerciseProgressionProfile(exName);
  const baseLbs=rawDefaultExerciseLbs(exName);
  if(p.category==='bodyweight')return firstTimeBodyweightGuidance(exName);
  const level=firstTimeEffectiveLevel();
  const start=firstTimeBuildCalibration(exName,level);
  const equipAdj=firstTimeEquipmentSubstitution(exName);
  const safetyAdj=!equipAdj?firstTimeLightNoviceSafety(exName):null;
  const adj=equipAdj||safetyAdj;
  if(adj&&adj.substitute){
    const sub=firstTimeBuildCalibration(adj.substitute,level);
    return Object.assign({},sub,{
      baseLbs:baseLbs,
      source:adj.source||'equipment_adjusted_calibration',
      variation:adj.variation,
      substitute:adj.substitute,
      equipmentAdjusted:!!equipAdj,
      adjustmentReason:adj.explain,
      confidence:firstTimeRecommendationConfidence(level,adj.source||'equipment_adjusted_calibration'),
      confidenceReason:firstTimeConfidenceReason(level,adj.source||'equipment_adjusted_calibration'),
      profileNotes:startingWeightProfileNotes()
    });
  }
  return Object.assign({},start,{
    baseLbs:baseLbs,
    profileNotes:startingWeightProfileNotes()
  });
}

function jumpLabel(jump){
  return jump+' '+(uLbl()==='lbs'?'lb':'kg');
}

function weightIncreaseRepTarget(profile,maxReps){
  if(profile.category==='upper_isolation'){
    return maxReps>profile.maxTarget?{min:10,max:15,label:'10-15'}:{min:10,max:12,label:'10-12'};
  }
  if(profile.category==='lower_isolation'){
    return maxReps>profile.maxTarget?{min:8,max:12,label:'8-12'}:{min:8,max:12,label:'8-12'};
  }
  if(profile.category==='unilateral_lower'){
    return{min:8,max:12,label:'8-12'};
  }
  if(profile.category==='lower_compound'){
    return{min:6,max:10,label:'6-10'};
  }
  return{min:profile.minTarget,max:Math.min(profile.minTarget+2,profile.maxTarget),label:profile.minTarget+'-'+Math.min(profile.minTarget+2,profile.maxTarget)};
}

function e1TrendRatio(sessions){
  if(sessions.length<3)return 0;
  const chronological=sessions.slice(0,Math.min(6,sessions.length)).reverse();
  const first=chronological[0].topE1||0;
  const last=chronological[chronological.length-1].topE1||0;
  return first>0?(last-first)/first:0;
}

function recentSuccessfulHigh(sessions,profile){
  const high=Math.max.apply(null,sessions.map(function(s){return sessionDisplayWeight(s,profile);}));
  const highSessions=sessions.filter(function(s){return sameProgressionWeight(sessionDisplayWeight(s,profile),high,profile.jump);});
  const bestReps=highSessions.length?Math.max.apply(null,highSessions.map(function(s){return s.topR;})):0;
  return{weight:high,sessions:highSessions,bestReps:bestReps,successful:bestReps>=profile.minTarget};
}

function sameWeightRepTrend(sessions,weightDisp,profile){
  const same=sessions.filter(function(s){return sameProgressionWeight(sessionDisplayWeight(s,profile),weightDisp,profile.jump);}).slice(0,4);
  if(same.length<2)return 'unknown';
  const chronological=same.slice().reverse();
  const first=chronological[0].topR;
  const last=chronological[chronological.length-1].topR;
  if(last>=first+1)return 'up';
  if(last<=first-2)return 'down';
  return 'flat';
}

function analyzeExerciseTrend(sessions,profile){
  if(sessions.length<3)return{trend:'mixed',confidence:'low',reason:'Not enough recent history.'};
  const chronological=sessions.slice(0,Math.min(6,sessions.length)).reverse();
  const firstW=sessionDisplayWeight(chronological[0],profile);
  const last=chronological[chronological.length-1];
  const lastW=sessionDisplayWeight(last,profile);
  const high=recentSuccessfulHigh(sessions,profile);
  const e1Ratio=e1TrendRatio(sessions);
  const sameTrend=sameWeightRepTrend(sessions,lastW,profile);
  const weightUp=lastW>firstW+.5;
  const lastIsHigh=sameProgressionWeight(lastW,high.weight,profile.jump);
  const strongProgress=weightUp&&lastIsHigh&&last.topR>=profile.minTarget&&e1Ratio>-0.04;
  if(strongProgress)return{trend:'strong_positive',confidence:'high',reason:'Weight is up and the recent high is still in range.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
  if(lastIsHigh&&last.topR>=profile.minTarget&&e1Ratio>-0.06)return{trend:'moderate_positive',confidence:'medium',reason:'The current high weight is working.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
  if(sameTrend==='up'&&e1Ratio>=-.02)return{trend:'moderate_positive',confidence:'medium',reason:'Reps are improving at a similar weight.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
  if(clearRegressionAtRecentHigh(sessions,profile)||(!topE1NonDeclining(sessions)&&sameTrend==='down'))return{trend:'declining',confidence:sessions.length>=4?'medium':'low',reason:'Performance has declined across multiple recent sessions.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
  if(sameTrend==='flat'||Math.abs(e1Ratio)<.02)return{trend:'stable',confidence:'medium',reason:'Recent performance is stable.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
  return{trend:'mixed',confidence:'low',reason:'Signals are mixed.',high:high,e1Ratio:e1Ratio,sameTrend:sameTrend};
}

function classifyProgressionState(ctx){
  const p=ctx.profile;
  if(!ctx||!ctx.sessions||ctx.sessions.length<3||ctx.trend.confidence==='low')return 'no_recommendation';
  if(ctx.trend.trend==='declining')return 'recovering';
  if(ctx.sameRecent.length>=3&&ctx.sameReps&&ctx.maxReps<p.maxTarget&&Math.abs(ctx.trend.e1Ratio||0)<.02)return 'plateaued';
  if(ctx.allAtTop&&ctx.lastIsRecentHigh)return 'ready_to_increase';
  if(ctx.weightProgressed&&ctx.lastIsRecentHigh&&ctx.last.topR>=p.minTarget&&ctx.last.topR<p.maxTarget)return 'consolidating_new_weight';
  if(ctx.lastIsRecentHigh&&ctx.last.topR>=p.minTarget&&ctx.last.topR<p.maxTarget)return 'building_reps';
  if(ctx.sameRecent.length>=2&&ctx.nonDeclining&&ctx.maxReps<p.maxTarget&&ctx.last.topR===ctx.maxReps)return 'building_reps';
  if(ctx.currentBelowRecentSuccess)return 'consolidating_new_weight';
  return 'no_recommendation';
}

function recommendationResult(opts){
  if(!opts||opts.confidence==='low'&&opts.state!=='baseline')return null;
  return{
    dir:opts.dir||'same',
    type:opts.action,
    action:opts.action,
    confidence:opts.confidence||'medium',
    trend:opts.trend||'stable',
    state:opts.state||'no_recommendation',
    category:opts.category||'unknown',
    weight:opts.weight,
    weightDisp:opts.weightDisp,
    repTarget:opts.repTarget,
    reason:opts.reason,
    source:opts.source,
    loadBasis:opts.loadBasis,
    confidenceReason:opts.confidenceReason,
    variation:opts.variation,
    displayText:opts.displayText,
    equipmentAdjusted:opts.equipmentAdjusted,
    adjustmentReason:opts.adjustmentReason,
    detail:opts.detail
  };
}

function repTrendDeclined(sessions){
  if(sessions.length<3)return false;
  const chronological=sessions.slice(0,3).reverse();
  return chronological[0].topR>chronological[1].topR&&chronological[1].topR>chronological[2].topR;
}

function e1TrendDeclined(sessions){
  if(sessions.length<3)return false;
  const chronological=sessions.slice(0,3).reverse();
  return chronological[0].topE1>chronological[1].topE1&&chronological[1].topE1>chronological[2].topE1;
}

function isCompoundExerciseName(exName){
  return exerciseProgressionProfile(exName).isCompound;
}

function compoundDeclineCount(){
  const names=[...new Set((S.workouts||[]).slice(0,5).flatMap(function(w){
    return (w.exercises||[]).map(function(e){return e&&e.name;}).filter(Boolean);
  }))];
  return names.filter(function(name){
    if(!isCompoundExerciseName(name))return false;
    const sessions=getRecentExerciseSessions(name,3);
    return repTrendDeclined(sessions)||e1TrendDeclined(sessions);
  }).length;
}

function calibrationPhaseIntro(sessions){
  const n=(sessions||[]).length;
  return[
    'Early calibration phase — this is based on only '+n+' logged '+(n===1?'session':'sessions')+'.',
    'The goal is to find your working range, not maximize load yet.'
  ];
}

function calibrationSameWeightSessions(sessions,profile,weightDisp){
  return sessions.filter(function(s){
    return sameProgressionWeight(sessionDisplayWeight(s,profile),weightDisp,profile.jump);
  });
}

function calibrationRepStats(sessions,profile,weightDisp){
  const same=calibrationSameWeightSessions(sessions,profile,weightDisp).slice(0,3);
  if(!same.length)return{minReps:0,maxReps:0,repRange:0,reps:[]};
  const reps=same.map(function(s){return s.topR;});
  const minReps=Math.min.apply(null,reps);
  const maxReps=Math.max.apply(null,reps);
  return{minReps:minReps,maxReps:maxReps,repRange:maxReps-minReps,reps:reps,sameCount:same.length};
}

function calibrationSupportsDoubleJump(profile){
  return profile.isCompound&&!profile.isUpperIsolation&&!profile.isLowerIsolation&&profile.category!=='small_isolation';
}

function calibrationMinDisplayWeight(exName,profile,value){
  const displayJump=S.unit==='lbs'?2.5:1;
  let lower=roundToProgressionJump(value,displayJump);
  if(firstTimeUsesBarbell(exName)){
    const minBarbell=S.unit==='kg'?20:45;
    lower=Math.max(lower,minBarbell);
  }
  return Math.max(lower,displayJump);
}

function fullEngineInconsistentPerformance(sessions,atSameWeight){
  if(sessions.length>6||atSameWeight.length<3)return false;
  const reps=atSameWeight.map(function(s){return s.topR;});
  return Math.max.apply(null,reps)-Math.min.apply(null,reps)>=3;
}

function fullEngineRepProgressionBlocked(last,profile,sessions,lastWDisp,minReps,maxReps){
  if(last.topR>=profile.minTarget)return false;
  if(maxReps>=profile.minTarget&&sameWeightRepTrend(sessions,lastWDisp,profile)==='up')return false;
  if(sessions.length>=3){
    const chronological=sessions.slice(0,3).reverse();
    const oldest=chronological[0].topR;
    const newest=chronological[chronological.length-1].topR;
    if(newest>=profile.minTarget)return false;
    if(newest>=oldest+2&&newest>=profile.minTarget-1)return false;
  }
  return true;
}

function fullEngineBelowMinAlternative(exName,sessions,profile,last,lastWDisp,minReps,maxReps,trend,e1Text){
  const targetRange=profile.minTarget+'-'+profile.maxTarget;
  const shouldReduce=maxReps<=profile.minTarget-2||minReps<=profile.minTarget-2;
  if(shouldReduce){
    const reducedDisp=calibrationMinDisplayWeight(exName,profile,lastWDisp-profile.jump);
    const action='I\'d recommend reducing slightly to '+reducedDisp+' '+uLbl()+' and aiming for '+targetRange+' reps.';
    const detail=recommendationDetail(action,[
      'Recent top sets stayed below the '+targetRange+' target range at '+lastWDisp+' '+uLbl()+'.',
      'Reduce slightly to keep reps in target range.',
      'The goal is to rebuild clean reps before progressing.'
    ]);
    return recommendationResult({dir:'down',action:'reduce_or_recover',confidence:trend&&trend.confidence?trend.confidence:'medium',trend:trend&&trend.trend?trend.trend:'stable',state:'recovering',category:profile.category,weight:kgFromDisplayWeight(reducedDisp),weightDisp:reducedDisp,repTarget:targetRange,reason:'Load above early range',detail:detail});
  }
  const action='I\'d recommend holding '+lastWDisp+' '+uLbl()+' for '+targetRange+' clean reps.';
  const detail=recommendationDetail(action,[
    'Recent top sets stayed below the '+targetRange+' target range at '+lastWDisp+' '+uLbl()+'.',
    'Repeat this load to confirm baseline before increasing weight or reps.',
    e1Text
  ].filter(Boolean));
  return recommendationResult({dir:'same',action:'hold',confidence:trend&&trend.confidence?trend.confidence:'medium',trend:trend&&trend.trend?trend.trend:'stable',state:'recovering',category:profile.category,weight:last.topW,weightDisp:lastWDisp,repTarget:targetRange,reason:'Repeat to confirm baseline',detail:detail});
}

function starterOverloadSuggestion(exName,currentInputW,sessions){
  const p=exerciseProgressionProfile(exName);
  if(p.category==='bodyweight'&&!sessions.length){
    const start=firstTimeBodyweightGuidance(exName);
    if(!start)return null;
    const action='I\'d recommend '+start.displayText+' as a calibration set.';
    const why=[
      'No prior working sets yet.',
      start.adjustmentReason?
        start.adjustmentReason+' Treat this as a conservative calibration set, not a strength prediction.':
        'I\'m using a conservative bodyweight starting point for '+categoryCalibrationLabel('bodyweight',exName)+' and treating this as a calibration set, not a strength prediction.',
      'After your first logged set, Forma will adjust from your actual performance.'
    ];
    if(profileAge()>=50)why.push('Starting conservatively given age and no Forma training history.');
    if(profileReturningFromBreak())why.push('Rebuild baseline gradually after time away from training.');
    const detail=recommendationDetail(action,why);
    return recommendationResult({dir:'same',action:'baseline',confidence:'low',trend:'unknown',state:'baseline',category:'bodyweight',weight:0,weightDisp:0,repTarget:start.repTarget,reason:'Conservative calibration set',source:start.source,loadBasis:start.loadBasis,variation:start.variation,displayText:start.displayText,equipmentAdjusted:start.equipmentAdjusted,adjustmentReason:start.adjustmentReason,confidenceReason:start.confidenceReason,detail:detail});
  }
  if(p.category==='bodyweight')return null;
  const currentDisp=parseFloat(currentInputW)>0?Number(currentInputW):Number(getLastW(exName));
  if(!sessions.length){
    const start=firstTimeStartingTarget(exName);
    const startDisp=start?start.weightDisp:currentDisp;
    const repTarget=start?start.repTarget:p.minTarget+'-'+p.maxTarget;
    const loadBasis=start&&start.loadBasis==='per hand'?' per hand':'';
    // TEMP: based on ACSM Progression Models in Resistance Training for Healthy Adults (Med Sci Sports Exerc, 2009; DOI 10.1249/MSS.0b013e3181915670) - use a conservative calibration load until Forma has exercise-specific history; replace with rule engine when research database is complete.
    const action=start&&start.variation?
      'I\'d recommend '+start.variation+' — '+startDisp+' '+uLbl()+loadBasis+' for '+repTarget+' clean reps.':
      'I\'d recommend using '+startDisp+' '+uLbl()+loadBasis+' as a calibration load for '+repTarget+' clean reps.';
    const why=firstTimeCalibrationWhyLines(exName,start,p);
    const detail=recommendationDetail(action,why);
    const reasonLabel=start&&(start.source==='equipment_adjusted_calibration'||start.source==='safer_calibration')?'Equipment-adjusted calibration load':'Conservative calibration load';
    return recommendationResult({dir:'same',action:'baseline',confidence:start&&start.confidence?start.confidence:'low',trend:'unknown',state:'baseline',category:start&&start.category?start.category:p.category,weight:kgFromDisplayWeight(startDisp),weightDisp:startDisp,repTarget:repTarget,reason:reasonLabel,source:start&&start.source,loadBasis:start&&start.loadBasis,variation:start&&start.variation,displayText:start&&start.displayText,equipmentAdjusted:start&&start.equipmentAdjusted,adjustmentReason:start&&start.adjustmentReason,confidenceReason:start&&start.confidenceReason,detail:detail});
  }
  const last=sessions[0];
  if(!last||last.topW===0)return null;
  const lastWDisp=sessionDisplayWeight(last,p);
  const displayJump=S.unit==='lbs'?2.5:1;
  const calIntro=calibrationPhaseIntro(sessions);
  const repStats=calibrationRepStats(sessions,p,lastWDisp);
  const targetRange=p.minTarget+'-'+p.maxTarget;

  if(repStats.sameCount>=2&&repStats.repRange>=3){
    const action='I\'d recommend repeating '+lastWDisp+' '+uLbl()+' for '+targetRange+' clean reps.';
    const detail=recommendationDetail(action,calIntro.concat([
      recommendationHistoryText(sessions,p,3),
      'Your recent reps at this weight have varied quite a bit ('+repStats.reps.slice().reverse().join(' → ')+').',
      'Repeat this load to confirm baseline before increasing weight or reps.'
    ]));
    return recommendationResult({dir:'same',action:'early_repeat',confidence:'medium',trend:'early_signal',state:'early_guidance',category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:targetRange,reason:'Stabilize early data',detail:detail});
  }

  const belowMin=repStats.maxReps<p.minTarget||last.topR<p.minTarget;
  if(belowMin){
    const shouldReduce=repStats.maxReps<=p.minTarget-2||repStats.minReps<=p.minTarget-2;
    if(shouldReduce){
      const reducedDisp=calibrationMinDisplayWeight(exName,p,lastWDisp-p.jump);
      const action='I\'d recommend reducing slightly to '+reducedDisp+' '+uLbl()+' and aiming for '+targetRange+' reps.';
      const detail=recommendationDetail(action,calIntro.concat([
        recommendationHistoryText(sessions,p,3),
        'Recent top sets stayed below the '+targetRange+' target range at '+lastWDisp+' '+uLbl()+'.',
        'Reduce slightly to keep reps in target range.',
        'The goal is to rebuild clean reps before progressing.'
      ]));
      return recommendationResult({dir:'down',action:'reduce_or_recover',confidence:'medium',trend:'early_signal',state:'early_guidance',category:p.category,weight:kgFromDisplayWeight(reducedDisp),weightDisp:reducedDisp,repTarget:targetRange,reason:'Load above early range',detail:detail});
    }
    const action='I\'d recommend repeating '+lastWDisp+' '+uLbl()+' for '+targetRange+' clean reps.';
    const detail=recommendationDetail(action,calIntro.concat([
      recommendationHistoryText(sessions,p,3),
      'Recent top sets stayed below the '+targetRange+' target range at '+lastWDisp+' '+uLbl()+'.',
      'Repeat this load to confirm baseline before increasing weight or reps.'
    ]));
    return recommendationResult({dir:'same',action:'hold',confidence:'medium',trend:'early_signal',state:'early_guidance',category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:targetRange,reason:'Repeat to confirm baseline',detail:detail});
  }

  const prior=sessions[1]||null;
  const sameAsPrior=prior&&sameProgressionWeight(sessionDisplayWeight(prior,p),lastWDisp,p.jump);
  const repeatedTop=sameAsPrior&&last.topR>=p.maxTarget&&prior.topR>=p.maxTarget;
  const stableAtTop=repStats.repRange<=1;
  const allAtMaxTop=repStats.sameCount>=2&&repStats.maxReps>=p.maxTarget&&stableAtTop;
  if((repeatedTop&&sessions.length>=2)||(allAtMaxTop&&sessions.length>=2)){
    let jumpSteps=1;
    if(calibrationSupportsDoubleJump(p)&&repStats.sameCount>=3&&repStats.repRange===0&&repStats.minReps>=p.maxTarget){
      jumpSteps=2;
    }
    const sugDisp=roundToProgressionJump(lastWDisp+jumpSteps*p.jump,displayJump);
    const target=weightIncreaseRepTarget(p,last.topR);
    const jumpText=jumpSteps>1?(jumpSteps*p.jump)+' '+uLbl():jumpLabel(p.jump);
    const action='I\'d recommend trying '+sugDisp+' '+uLbl()+' for '+target.label+' reps.';
    const detail=recommendationDetail(action,calIntro.concat([
      recommendationHistoryText(sessions,p,3),
      'You reached the top of the '+targetRange+' target range at '+lastWDisp+' '+uLbl()+' with stable performance.',
      'The '+jumpText+' increase is an early calibration step, not a confirmed long-term trend yet.'
    ]));
    return recommendationResult({dir:'up',action:'early_add_weight',confidence:'medium',trend:'early_signal',state:'early_progression',category:p.category,weight:kgFromDisplayWeight(sugDisp),weightDisp:sugDisp,repTarget:target.label,reason:'Early progression test',detail:detail});
  }

  const targetReps=Math.min(p.maxTarget,last.topR+1);
  const shouldAddReps=last.topR<p.maxTarget&&last.topR>=p.minTarget;
  const action=shouldAddReps?
    'I\'d recommend keeping '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps.':
    'I\'d recommend repeating '+lastWDisp+' '+uLbl()+' for '+targetRange+' clean reps.';
  const whyAction=shouldAddReps?
    'Last time you hit '+lastWDisp+' '+uLbl()+' x '+last.topR+'. Since that is below the top of your '+targetRange+' target range, the next step is '+targetReps+' reps at the same weight before increasing.':
    'Last time you hit '+lastWDisp+' '+uLbl()+' x '+last.topR+'. Since that is already at the top of your '+targetRange+' target range, repeat it cleanly once more before increasing.';
  const detail=recommendationDetail(action,calIntro.concat([
    recommendationHistoryText(sessions,p,3),
    whyAction
  ]));
  return recommendationResult({dir:'same',action:shouldAddReps?'early_add_reps':'early_repeat',confidence:'medium',trend:'early_signal',state:'early_guidance',category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:shouldAddReps?String(targetReps):targetRange,reason:shouldAddReps?'Early rep target':'Repeat and confirm',detail:detail});
}

function getOverloadSuggestion(exName,currentInputW){
  const sessions=getRecentExerciseSessions(exName,6);
  if(sessions.length<4)return starterOverloadSuggestion(exName,currentInputW,sessions);
  if(sessions.some(function(s){return s.topW===0;}))return null; // bodyweight loading needs separate logic

  const p=exerciseProgressionProfile(exName);
  if(p.category==='bodyweight')return null;
  const recent3=sessions.slice(0,3);
  const last=recent3[0];
  const lastWDisp=sessionDisplayWeight(last,p);
  const currentDisp=parseFloat(currentInputW)>0?Number(currentInputW):lastWDisp;
  const atSameWeight=sessions.filter(function(s){
    return sameProgressionWeight(sessionDisplayWeight(s,p),lastWDisp,p.jump);
  });
  const sameRecent=atSameWeight.slice(0,3);
  if(fullEngineInconsistentPerformance(sessions,atSameWeight)){
    const action='I\'d recommend repeating '+lastWDisp+' '+uLbl()+' for '+p.minTarget+'-'+p.maxTarget+' clean reps.';
    const detail=recommendationDetail(action,stabilizeLoadWhyLines(atSameWeight,p,lastWDisp));
    return recommendationResult({dir:'same',action:'hold',confidence:'medium',trend:'mixed',state:'plateaued',category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:p.minTarget+'-'+p.maxTarget,reason:'Stabilize reps',detail:detail});
  }
  const recentHigh=Math.max.apply(null,sessions.map(function(s){return sessionDisplayWeight(s,p);}));
  const lastIsRecentHigh=sameProgressionWeight(lastWDisp,recentHigh,p.jump);
  const currentBelowRecentSuccess=successfulHigherWeight(sessions,currentDisp,p);
  const broadHistory=recentTopSetText(sessions.slice(0,Math.min(6,sessions.length)));
  const trend=analyzeExerciseTrend(sessions,p);
  if(trend.confidence==='low')return null;
  const chronological=sessions.slice(0,Math.min(6,sessions.length)).reverse();
  const firstWDisp=sessionDisplayWeight(chronological[0],p);

  const reps=(sameRecent.length>=2?sameRecent:atSameWeight).map(function(s){return s.topR;});
  if(!reps.length)return null;
  const minReps=Math.min.apply(null,reps);
  const maxReps=Math.max.apply(null,reps);
  const repRange=maxReps-minReps;
  const sameReps=minReps===maxReps;
  const allAtTop=reps.every(function(r){return r>=p.maxTarget;});
  const nonDeclining=sessions.slice(0,Math.min(5,sessions.length)).slice().reverse().every(function(s,i,arr){return i===0||s.topE1>=arr[i-1].topE1*.97;});
  const topSetHistory=recentTopSetText(sameRecent.length>=2?sameRecent:recent3);
  const e1Text=e1TrendText(recent3);
  const regressing=trend.trend==='declining';
  const state=classifyProgressionState({
    sessions:sessions,
    profile:p,
    trend:trend,
    last:last,
    lastWDisp:lastWDisp,
    recentHigh:recentHigh,
    lastIsRecentHigh:lastIsRecentHigh,
    currentBelowRecentSuccess:currentBelowRecentSuccess,
    weightProgressed:lastWDisp>firstWDisp+.5,
    sameRecent:sameRecent,
    sameReps:sameReps,
    maxReps:maxReps,
    allAtTop:allAtTop,
    nonDeclining:nonDeclining
  });
  if(state==='no_recommendation')return null;

  if(state==='recovering'&&compoundDeclineCount()>=2){
    const action='I\'d recommend holding progression today.';
    const detail=recommendationDetail(action,[
      'Your recent sessions show a performance drop: '+broadHistory+'.',
      'Multiple compound lifts are showing decline signals, so pushing load now may not be the best move.',
      e1TrendDeclined(recent3)?e1Text:''
    ]);
    return recommendationResult({dir:'same',action:'reduce_or_recover',confidence:trend.confidence,trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,reason:'Recovery signal',detail:detail});
  }

  if(state==='recovering'){
    const action='I\'d recommend holding '+lastWDisp+' '+uLbl()+' for now.';
    const detail=recommendationDetail(action,[
      'Your recent sessions show a real drop in performance: '+broadHistory+'.',
      'The next goal is to stabilize clean reps before increasing.',
      e1TrendDeclined(recent3)?e1Text:''
    ]);
    return recommendationResult({dir:'same',action:'hold',confidence:trend.confidence,trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,reason:'Hold progression',detail:detail});
  }

  if(currentBelowRecentSuccess){
    const action=currentDisp<recentHigh-.5?
      'I\'d recommend returning to '+recentHigh+' '+uLbl()+' and aiming for '+p.minTarget+'-'+p.maxTarget+' reps.':
      'I\'d recommend staying at '+recentHigh+' '+uLbl()+' and aiming for '+p.minTarget+'-'+p.maxTarget+' reps.';
    const detail=recommendationDetail(action,[
      'You have already performed that higher working weight successfully.',
      'Since it is working, I would not move the target lower unless performance clearly declines.'
    ]);
    return recommendationResult({dir:'up',action:'add_weight',confidence:'medium',trend:trend.trend,state:state,category:p.category,weight:kgFromDisplayWeight(recentHigh),weightDisp:recentHigh,repTarget:p.minTarget+'-'+p.maxTarget,reason:'Use recent successful weight',detail:detail});
  }

  if(state==='ready_to_increase'){
    const sugDisp=roundToProgressionJump(lastWDisp+p.jump,S.unit==='lbs'?2.5:1);
    const sugKg=kgFromDisplayWeight(sugDisp);
    if(sugDisp>currentDisp+0.5){
      const target=weightIncreaseRepTarget(p,maxReps);
      const action='I\'d recommend increasing to '+sugDisp+' '+uLbl()+' and aiming for '+target.label+' reps.';
      const stableLine=p.isIsolation?
        'You\'ve hit '+lastWDisp+' '+uLbl()+' for '+maxReps+' reps across multiple sessions, which is '+(maxReps>p.maxTarget?'above':'at')+' your target range.':
        'You\'ve hit '+lastWDisp+' '+uLbl()+' x '+p.maxTarget+' for 3 sessions: '+topSetHistory+'.';
      const resetLine=p.isIsolation?
        'A '+jumpLabel(p.jump)+' jump should still keep you in a productive rep zone.':
        'Performance has stayed stable at the top of the target range.';
      const detail=recommendationDetail(action,[
        stableLine,
        resetLine
      ]);
      return recommendationResult({dir:'up',action:'add_weight',confidence:trend.trend==='stable'?'medium':'high',trend:trend.trend,state:state,category:p.category,weight:sugKg,weightDisp:sugDisp,repTarget:target.label,reason:'Ready to go heavier',detail:detail});
    }
  }

  if(state==='plateaued'){
    if(fullEngineRepProgressionBlocked(last,p,sessions,lastWDisp,minReps,maxReps)){
      return fullEngineBelowMinAlternative(exName,sessions,p,last,lastWDisp,minReps,maxReps,trend,e1Text);
    }
    const targetReps=maxReps+1;
    const action='I\'d recommend keeping '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps.';
    const detail=recommendationDetail(action,[
      'You\'ve repeated '+lastWDisp+' '+uLbl()+' x '+maxReps+' for 3 sessions.',
      'Because the top set has not moved yet, the next useful target is adding a rep before increasing.'
    ]);
    return recommendationResult({dir:'same',action:'add_reps',confidence:'medium',trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:String(targetReps),reason:'Plateaued: add reps first',detail:detail});
  }

  if(state==='building_reps'){
    if(fullEngineRepProgressionBlocked(last,p,sessions,lastWDisp,minReps,maxReps)){
      return fullEngineBelowMinAlternative(exName,sessions,p,last,lastWDisp,minReps,maxReps,trend,e1Text);
    }
    const targetReps=maxReps+1;
    const action='I\'d recommend keeping '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps.';
    const detail=recommendationDetail(action,[
      sameRecent.length>=2?'You\'ve moved from '+minReps+' to '+maxReps+' reps over your recent sessions.':'Your recent top set is still below the top of the target range.',
      'You are still below the top of the target range, so the next progression is another rep.',
      e1Text
    ]);
    return recommendationResult({dir:'same',action:'add_reps',confidence:'medium',trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:String(targetReps),reason:'Rep progression',detail:detail});
  }

  if(state==='consolidating_new_weight'){
    if(fullEngineRepProgressionBlocked(last,p,sessions,lastWDisp,minReps,maxReps)){
      return fullEngineBelowMinAlternative(exName,sessions,p,last,lastWDisp,minReps,maxReps,trend,e1Text);
    }
    const targetReps=Math.min(p.maxTarget,last.topR+1);
    let action,why;
    if(p.category==='lower_compound'&&last.topR<p.minTarget+1){
      action='I\'d recommend staying around '+lastWDisp+' '+uLbl()+' and aiming to bring this back into the '+(p.minTarget+1)+'-'+p.maxTarget+' rep range.';
      why=[
        'You\'ve built up from '+recentWeightRangeText(sessions.slice(0,Math.min(5,sessions.length)),p)+' successfully.',
        'Since this heavier weight is new, the next goal is to improve reps before increasing again.'
      ];
    }else{
      action='I\'d recommend staying at '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps.';
      why=[
        'You\'ve progressed from '+recentWeightRangeText(sessions.slice(0,Math.min(5,sessions.length)),p)+' while staying in a strong rep range.',
        'That higher weight is working, so the next useful target is adding a rep before increasing.'
      ];
    }
    const detail=recommendationDetail(action,why);
    return recommendationResult({dir:'same',action:'add_reps',confidence:trend.confidence,trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:String(targetReps),reason:'Keep successful weight',detail:detail});
  }

  if(sameRecent.length>=3&&repRange>=2){
    const action='I\'d recommend holding '+lastWDisp+' '+uLbl()+' for now.';
    const detail=recommendationDetail(action,stabilizeLoadWhyLines(sameRecent,p,lastWDisp,topSetHistory).concat(e1Text?[e1Text]:[]));
    return recommendationResult({dir:'same',action:'hold',confidence:'medium',trend:trend.trend,state:'plateaued',category:p.category,weight:last.topW,weightDisp:lastWDisp,reason:'Stabilize reps',detail:detail});
  }

  return null;
}

function hasJustifiedWorkoutRecommendation(){
  if(!S.workout||!Array.isArray(S.workout.exercises))return false;
  const exercises=S.workout.exercises;
  const done=exercises.filter(function(ex){
    return ex&&Array.isArray(ex.sets)&&ex.sets.some(function(s){return s&&!s.warmup&&Number(s.r)>0;});
  });
  if(exercises.length&&done.length===exercises.length)return true; // finishing is the clear next action
  if(exercises.some(function(ex){return ex&&!isCardioEx(ex.name)&&getOverloadSuggestion(ex.name,ex.inputW);}))return true;
  if(!done.length)return false;
  return exercises.some(function(ex){
    if(!ex||isCardioEx(ex.name))return false;
    const started=Array.isArray(ex.sets)&&ex.sets.some(function(s){return s&&!s.warmup&&Number(s.r)>0;});
    return !started&&getRecentExerciseSessions(ex.name,3).length>=3;
  });
}

function buildWorkoutRecommendationEvidence(){
  if(!S.workout||!Array.isArray(S.workout.exercises))return 'No active workout.';
  const exercises=S.workout.exercises;
  const lines=[];
  const done=exercises.filter(function(ex){
    return ex&&Array.isArray(ex.sets)&&ex.sets.some(function(s){return s&&!s.warmup&&Number(s.r)>0;});
  });
  exercises.forEach(function(ex){
    if(!ex||isCardioEx(ex.name))return;
    const sug=getOverloadSuggestion(ex.name,ex.inputW);
    if(sug)lines.push(ex.name+': '+sug.detail);
  });
  if(exercises.length&&done.length===exercises.length)lines.push('Every planned exercise has working sets logged; finishing the workout may be the best next action.');
  exercises.forEach(function(ex){
    if(!ex||isCardioEx(ex.name))return;
    const started=Array.isArray(ex.sets)&&ex.sets.some(function(s){return s&&!s.warmup&&Number(s.r)>0;});
    if(!started&&getRecentExerciseSessions(ex.name,3).length>=3)lines.push(ex.name+': has at least 3 prior sessions available for evidence-based next-set guidance.');
  });
  return lines.length?lines.join('\n'):'No strong local recommendation signal.';
}

function getLastW(name){
  const s=getLastSession(name);
  if(s)return String(toDisp(s.w));
  const start=firstTimeStartingTarget(name);
  if(start)return String(start.weightDisp);
  const fallback=S.unit==='kg'?rawDefaultExerciseLbs(name)/KG2LB:rawDefaultExerciseLbs(name);
  return String(roundToProgressionJump(fallback,S.unit==='kg'?2.5:5));
}

function toggleSubstitutions(i){
  S.substituteIdx=(S.substituteIdx===i?null:i);
  render();
}

function replaceExerciseWith(i,newName){
  if(!S.workout||!S.workout.exercises||!S.workout.exercises[i])return;
  const oldName=S.workout.exercises[i].name;
  const sub=getSubstitutionByName(oldName,newName);
  S.workout.exercises[i]=Object.assign({},S.workout.exercises[i],{
    name:newName,
    sets:[],
    inputW:getLastW(newName),
    inputR:isCardioEx(newName)?'0':'8',
    nextIsWarmup:false,
    showM2:isCardioEx(newName)?true:undefined,
    swapFrom:oldName,
    swapReason:sub?sub.reason:''
  });
  S.substituteIdx=null;
  persistAll();
  flushCloudSaveNow('exercise replaced');
  render();
}

function applyOverloadSug(i,wDisp){
  if(!S.workout)return;
  // wDisp is in the user's display unit. We store workout inputs in display units,
  // then logSet() converts to kg through toKg(). Passing kg here made lbs users see bad suggestions.
  S.workout.exercises[i].inputW=String(wDisp);
  const inp=document.getElementById('w'+i);
  if(inp){inp.value=wDisp;syncW(i,String(wDisp));previewE1(i);}
  persistActiveWorkoutNow('recommendation applied');
  render();
}
