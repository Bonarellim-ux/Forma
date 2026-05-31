// Recommendation, progression, and exercise substitution logic for Forma.
const EX_SUBS={
  'Bench Press':[
    {name:'Dumbbell Bench Press',muscle:'mid chest',pattern:'horizontal press',reason:'Same flat press pattern and mid-chest focus, with more freedom for shoulder position.'},
    {name:'Machine Chest Press',muscle:'mid chest',pattern:'horizontal press',reason:'Same chest/triceps movement pattern with more stability if benches are taken.'},
    {name:'Push-Up',muscle:'mid chest',pattern:'horizontal press',reason:'Same horizontal pushing pattern using bodyweight, good when equipment is unavailable.'}
  ],
  'Incline Bench':[
    {name:'Incline Dumbbell Press',muscle:'upper chest',pattern:'incline press',reason:'Closest match: same incline angle and upper-chest emphasis.'},
    {name:'Machine Incline Press',muscle:'upper chest',pattern:'incline press',reason:'Same upper-chest press with a more stable machine path.'},
    {name:'Low-to-High Cable Fly',muscle:'upper chest',pattern:'low-to-high adduction',reason:'Still targets clavicular upper pec fibres from a similar upward angle.'}
  ],
  'Overhead Press':[
    {name:'Dumbbell Shoulder Press',muscle:'front/side delts',pattern:'vertical press',reason:'Same vertical press pattern and shoulder focus, easier to adjust shoulder path.'},
    {name:'Machine Shoulder Press',muscle:'front/side delts',pattern:'vertical press',reason:'Same vertical push with added stability for consistent loading.'},
    {name:'Landmine Press',muscle:'front delts/upper chest',pattern:'angled press',reason:'Closest shoulder-friendly alternative when true overhead pressing bothers the shoulder.'}
  ],
  'Squat':[
    {name:'Hack Squat',muscle:'quads',pattern:'squat pattern',reason:'Best match for a quad-dominant squat pattern with less balance demand.'},
    {name:'Leg Press',muscle:'quads/glutes',pattern:'knee-dominant press',reason:'Keeps the same lower-body press focus while reducing spinal loading.'},
    {name:'Goblet Squat',muscle:'quads/glutes',pattern:'squat pattern',reason:'Same squat pattern with lighter loading and easier setup.'}
  ],
  'Deadlift':[
    {name:'Trap Bar Deadlift',muscle:'posterior chain',pattern:'heavy hinge',reason:'Closest heavy hinge substitute with a more neutral grip and often less back stress.'},
    {name:'Romanian Deadlift',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Keeps the hinge pattern and posterior-chain focus with less total fatigue.'},
    {name:'Back Extension',muscle:'glutes/hamstrings',pattern:'hip extension',reason:'Targets the same hip-extension muscles without needing a barbell.'}
  ],
  'Romanian Deadlift':[
    {name:'Single-Leg RDL',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Same hinge and hamstring lengthened position, with unilateral balance work.'},
    {name:'Good Morning',muscle:'hamstrings/glutes',pattern:'hip hinge',reason:'Very similar hinge pattern and posterior-chain loading.'},
    {name:'Seated Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Still trains hamstrings in a lengthened position when hinging is not available.'}
  ],
  'Barbell Row':[
    {name:'Chest-Supported Row',muscle:'mid back/lats',pattern:'horizontal pull',reason:'Same horizontal pull while removing lower-back fatigue.'},
    {name:'Seated Cable Row',muscle:'mid back/lats',pattern:'horizontal pull',reason:'Same rowing pattern with constant cable tension.'},
    {name:'Dumbbell Row',muscle:'lats/mid back',pattern:'horizontal pull',reason:'Same row pattern, with unilateral lat and upper-back work.'}
  ],
  'Pull-ups':[
    {name:'Lat Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Closest match: same vertical pull and lat focus, easier to load precisely.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same exact movement pattern with reduced bodyweight load.'},
    {name:'Chin-Up',muscle:'lats/biceps',pattern:'vertical pull',reason:'Same vertical pull with more biceps involvement.'}
  ],
  'Pull-Up':[
    {name:'Lat Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Closest match: same vertical pull and lat focus, easier to load precisely.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same exact movement pattern with reduced bodyweight load.'},
    {name:'Chin-Up',muscle:'lats/biceps',pattern:'vertical pull',reason:'Same vertical pull with more biceps involvement.'}
  ],
  'Lat Pulldown':[
    {name:'Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same vertical pulling pattern and lat focus, just bodyweight-based.'},
    {name:'Assisted Pull-Up',muscle:'lats',pattern:'vertical pull',reason:'Same movement direction with adjustable assistance.'},
    {name:'Single-Arm Pulldown',muscle:'lats',pattern:'vertical pull',reason:'Same lat function, with unilateral control and range of motion.'}
  ],
  'Leg Press':[
    {name:'Hack Squat',muscle:'quads/glutes',pattern:'knee-dominant press',reason:'Very similar lower-body press with a stronger squat-like path.'},
    {name:'Squat',muscle:'quads/glutes',pattern:'squat pattern',reason:'Same knee-dominant lower-body pattern, but with more stability and core demand.'},
    {name:'Bulgarian Split Squat',muscle:'quads/glutes',pattern:'single-leg squat',reason:'Same quad/glute emphasis, unilateral and effective with less equipment.'}
  ],
  'Leg Curl':[
    {name:'Seated Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same hamstring isolation pattern, often better lengthened-position stimulus.'},
    {name:'Lying Leg Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same knee-flexion hamstring role with a slightly different body position.'},
    {name:'Nordic Curl',muscle:'hamstrings',pattern:'knee flexion',reason:'Same hamstring function with high eccentric demand.'}
  ],
  'Leg Extension':[
    {name:'Hack Squat',muscle:'quads',pattern:'knee extension',reason:'Keeps a quad-dominant knee-extension emphasis with heavier loading.'},
    {name:'Spanish Squat',muscle:'quads',pattern:'knee extension',reason:'Very quad-focused substitute with less hip involvement.'},
    {name:'Sissy Squat',muscle:'quads',pattern:'knee extension',reason:'Closest bodyweight-style match for pure quad/knee-extension bias.'}
  ],
  'Hip Thrust':[
    {name:'Glute Bridge',muscle:'glutes',pattern:'hip extension',reason:'Closest match: same hip-extension pattern and glute bias.'},
    {name:'Cable Kickback',muscle:'glutes',pattern:'hip extension',reason:'Same glute hip-extension role with lighter isolation work.'},
    {name:'Banded Hip Thrust',muscle:'glutes',pattern:'hip extension',reason:'Same thrust pattern with accommodating band resistance.'}
  ],
  'Lateral Raise':[
    {name:'Cable Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Closest match with constant tension on the side delts.'},
    {name:'Machine Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Same side-delt isolation with more stability.'},
    {name:'Lean-Away Lateral Raise',muscle:'side delts',pattern:'shoulder abduction',reason:'Same side-delt target with a stronger stretched-position challenge.'}
  ],
  'Face Pull':[
    {name:'Cable Rear Delt Fly',muscle:'rear delts',pattern:'horizontal abduction',reason:'Keeps the rear-delt emphasis with similar shoulder movement.'},
    {name:'Reverse Fly',muscle:'rear delts',pattern:'horizontal abduction',reason:'Same rear-delt function, simpler setup.'},
    {name:'Band Pull-Apart',muscle:'rear delts/upper back',pattern:'horizontal abduction',reason:'Same rear-delt and upper-back role with minimal equipment.'}
  ],
  'Bicep Curl':[
    {name:'Cable Curl',muscle:'biceps',pattern:'elbow flexion',reason:'Same elbow-flexion pattern with more constant tension.'},
    {name:'Preacher Curl',muscle:'biceps short head',pattern:'elbow flexion',reason:'Same biceps target with more strict form and short-head bias.'},
    {name:'Incline Dumbbell Curl',muscle:'biceps long head',pattern:'elbow flexion',reason:'Same biceps role, with more long-head stretch.'}
  ],
  'Tricep Pushdown':[
    {name:'Cable Kickback',muscle:'triceps lateral head',pattern:'elbow extension',reason:'Same elbow-extension role and similar lateral-head bias.'},
    {name:'Close-Grip Bench Press',muscle:'triceps',pattern:'compound elbow extension',reason:'Keeps triceps as the main target but allows heavier loading.'},
    {name:'Skull Crusher',muscle:'triceps',pattern:'elbow extension',reason:'Same triceps extension pattern with a stronger stretched position.'}
  ],
  'Calf Raise':[
    {name:'Standing Calf Raise',muscle:'gastrocnemius',pattern:'plantar flexion',reason:'Same calf action, best match if the original was standing.'},
    {name:'Leg Press Calf Raise',muscle:'calves',pattern:'plantar flexion',reason:'Same ankle-extension movement using the leg press setup.'},
    {name:'Single-Leg Calf Raise',muscle:'calves',pattern:'plantar flexion',reason:'Same calf target with unilateral control and full range.'}
  ],
  'Plank':[
    {name:'Dead Bug',muscle:'core',pattern:'anti-extension',reason:'Same anti-extension core goal with lower back-friendly control.'},
    {name:'Pallof Press',muscle:'core',pattern:'anti-rotation',reason:'Still trains trunk stability, with more anti-rotation emphasis.'},
    {name:'Ab Wheel',muscle:'core',pattern:'anti-extension',reason:'Same anti-extension demand, more advanced and loaded.'}
  ],
  'Walking':[
    {name:'Elliptical',muscle:'cardio',pattern:'low-impact steady state',reason:'Same low-impact cardio role with slightly higher intensity.'},
    {name:'Cycling',muscle:'cardio/quads',pattern:'low-impact steady state',reason:'Same conditioning goal while reducing impact.'},
    {name:'Stair Climber',muscle:'cardio/glutes',pattern:'low-impact conditioning',reason:'Same cardio slot with more glute and quad involvement.'}
  ],
  'HIIT Session':[
    {name:'Rowing',muscle:'full-body cardio',pattern:'interval conditioning',reason:'Same HIIT slot with full-body conditioning.'},
    {name:'Cycling',muscle:'cardio/quads',pattern:'interval conditioning',reason:'Same interval goal with low impact.'},
    {name:'Jump Rope',muscle:'cardio/calves',pattern:'interval conditioning',reason:'Same high-intensity conditioning role with minimal equipment.'}
  ]
};

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
  const lower=['squat','deadlift','romanian deadlift','rdl','leg press','hack squat','hip thrust','lunge','split squat','leg curl','leg extension','calf'];
  const compound=['squat','deadlift','bench press','barbell row','overhead press','pull-up','pull ups','pullups','pulldown','row','press','leg press','hack squat','hip thrust'];
  const isolation=['curl','raise','fly','pushdown','extension','face pull','leg curl','leg extension','calf'];
  const isLower=lower.some(function(k){return n.includes(k);});
  const isCompound=compound.some(function(k){return n.includes(k);})&&!isolation.some(function(k){return n.includes(k);});
  let jump;
  if(S.unit==='kg')jump=isLower&&isCompound?5:2.5;
  else jump=isLower&&isCompound?10:(isCompound?5:2.5);
  return{
    isLower:isLower,
    isCompound:isCompound,
    jump:jump,
    minTarget:isCompound?6:8,
    maxTarget:isCompound?10:12
  };
}

function roundToProgressionJump(value,jump){
  if(!jump)return value;
  return Math.round(value/jump)*jump;
}

function sameProgressionWeight(a,b,jump){
  return Math.abs(a-b)<=Math.max(.5,jump/2);
}

function displayWeightFromKg(kg){
  return Number(toDisp(Number(kg)||0));
}

function kgFromDisplayWeight(wDisp){
  return S.unit==='lbs'?wDisp/KG2LB:wDisp;
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

function getOverloadSuggestion(exName,currentInputW){
  const sessions=getRecentExerciseSessions(exName,5);
  if(sessions.length<3)return null;
  if(sessions.some(function(s){return s.topW===0;}))return null; // bodyweight loading needs separate logic

  const p=exerciseProgressionProfile(exName);
  const recent3=sessions.slice(0,3);
  const last=recent3[0];
  const lastWDisp=roundToProgressionJump(displayWeightFromKg(last.topW),p.jump);
  const atSameWeight=recent3.filter(function(s){
    return sameProgressionWeight(roundToProgressionJump(displayWeightFromKg(s.topW),p.jump),lastWDisp,p.jump);
  });
  if(atSameWeight.length<3)return null;

  const reps=atSameWeight.map(function(s){return s.topR;});
  const minReps=Math.min.apply(null,reps);
  const maxReps=Math.max.apply(null,reps);
  const sameReps=minReps===maxReps;
  const allAtTop=reps.every(function(r){return r>=p.maxTarget;});
  const nonDeclining=atSameWeight.slice().reverse().every(function(s,i,arr){return i===0||s.topR>=arr[i-1].topR;});
  const currentDisp=parseFloat(currentInputW)>0?Number(currentInputW):lastWDisp;

  if((repTrendDeclined(recent3)||e1TrendDeclined(recent3))&&(compoundDeclineCount()>=2||isCompoundExerciseName(exName))){
    const detail='Your recent top sets have dipped for more than one session. I\'d recommend holding '+lastWDisp+' '+uLbl()+' and focusing on clean reps before pushing load.';
    return{dir:'up',weight:last.topW,weightDisp:lastWDisp,reason:'Hold progression',detail:detail};
  }

  if(allAtTop){
    const sugDisp=roundToProgressionJump(lastWDisp+p.jump,p.jump);
    const sugKg=kgFromDisplayWeight(sugDisp);
    if(Math.abs(sugDisp-currentDisp)>0.5){
      const detail='You have hit '+lastWDisp+' '+uLbl()+' x '+p.maxTarget+' across 3 sessions. I\'d recommend adding '+p.jump+' '+uLbl()+' and aiming for '+p.minTarget+'-'+Math.min(p.minTarget+2,p.maxTarget)+' reps.';
      return{dir:'up',weight:sugKg,weightDisp:sugDisp,reason:'Ready to go heavier',detail:detail};
    }
  }

  if(sameReps&&maxReps<p.maxTarget){
    const targetReps=maxReps+1;
    const detail='You have repeated '+lastWDisp+' '+uLbl()+' x '+maxReps+' for 3 sessions. I\'d recommend staying at '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps before increasing weight.';
    return{dir:'up',weight:last.topW,weightDisp:lastWDisp,reason:'Build reps first',detail:detail};
  }

  if(nonDeclining&&maxReps<p.maxTarget&&last.topR===maxReps){
    const targetReps=maxReps+1;
    const detail='Your reps are moving up at '+lastWDisp+' '+uLbl()+'. I\'d recommend keeping the weight there and aiming for '+targetReps+' reps next.';
    return{dir:'up',weight:last.topW,weightDisp:lastWDisp,reason:'Rep progression',detail:detail};
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
  // Smart default: look up by name, then by keyword
  const n=name.trim();
  if(EX_DEFAULTS[n]!==undefined)return String(EX_DEFAULTS[n]);
  const nl=n.toLowerCase();
  if(nl.includes('deadlift'))return '135';
  if(nl.includes('squat'))return '95';
  if(nl.includes('bench')||nl.includes('press'))return '75';
  if(nl.includes('row')||nl.includes('pull'))return '55';
  if(nl.includes('curl')||nl.includes('raise')||nl.includes('fly'))return '20';
  if(nl.includes('pushdown')||nl.includes('extension')||nl.includes('tricep'))return '35';
  if(nl.includes('calf'))return '80';
  if(nl.includes('leg press'))return '150';
  return '45'; // safe fallback (lighter than 135)
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
  render();
}

function applyOverloadSug(i,wDisp){
  if(!S.workout)return;
  // wDisp is in the user's display unit. We store workout inputs in display units,
  // then logSet() converts to kg through toKg(). Passing kg here made lbs users see bad suggestions.
  S.workout.exercises[i].inputW=String(wDisp);
  const inp=document.getElementById('w'+i);
  if(inp){inp.value=wDisp;syncW(i,String(wDisp));previewE1(i);}
  render();
}
