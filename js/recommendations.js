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
  const category=classifyExerciseCategory(exName);
  const isLower=category==='lower_compound'||category==='lower_isolation'||category==='unilateral_lower';
  const isUnilateral=category==='unilateral_lower';
  const isCompound=category==='upper_compound'||category==='lower_compound';
  const isLowerIsolation=category==='lower_isolation';
  const isUpperIsolation=category==='upper_isolation';
  let jump;
  if(S.unit==='kg'){
    jump=category==='lower_compound'?5:2.5;
  }else{
    if(category==='lower_compound')jump=10;
    else if(category==='lower_isolation'||category==='upper_compound'||category==='unilateral_lower')jump=5;
    else if(category==='upper_isolation')jump=2.5;
    else jump=5;
  }
  let minTarget=8,maxTarget=12;
  if(category==='lower_compound'){minTarget=5;maxTarget=10;}
  else if(category==='upper_compound'){minTarget=6;maxTarget=10;}
  else if(category==='upper_isolation'){minTarget=10;maxTarget=15;}
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
  if(n.includes('lunge')||n.includes('split squat')||n.includes('step up')||n.includes('step-up'))return 'unilateral_lower';
  if(n.includes('leg extension')||n.includes('leg curl')||n.includes('calf')||n.includes('seated calf'))return 'lower_isolation';
  if(n.includes('squat')||n.includes('deadlift')||n.includes('rdl')||n.includes('romanian deadlift')||n.includes('leg press')||n.includes('hack squat')||n.includes('hip thrust'))return 'lower_compound';
  if(n.includes('curl')||n.includes('lateral raise')||n.includes('raise')||n.includes('fly')||n.includes('pushdown')||n.includes('face pull')||n.includes('rear delt'))return 'upper_isolation';
  if(n.includes('bench')||n.includes('press')||n.includes('row')||n.includes('pulldown')||n.includes('lat pulldown')||n.includes('overhead'))return 'upper_compound';
  if(n.includes('machine')||n.includes('smith')||n.includes('cable'))return 'machine';
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
  if(!opts||opts.confidence==='low')return null;
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

function getOverloadSuggestion(exName,currentInputW){
  const sessions=getRecentExerciseSessions(exName,6);
  if(sessions.length<3)return null;
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
    const targetReps=maxReps+1;
    const action='I\'d recommend keeping '+lastWDisp+' '+uLbl()+' and aiming for '+targetReps+' reps.';
    const detail=recommendationDetail(action,[
      'You\'ve repeated '+lastWDisp+' '+uLbl()+' x '+maxReps+' for 3 sessions.',
      'Because the top set has not moved yet, the next useful target is adding a rep before increasing.'
    ]);
    return recommendationResult({dir:'same',action:'add_reps',confidence:'medium',trend:trend.trend,state:state,category:p.category,weight:last.topW,weightDisp:lastWDisp,repTarget:String(targetReps),reason:'Plateaued: add reps first',detail:detail});
  }

  if(state==='building_reps'){
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
    const detail=recommendationDetail(action,[
      'Your recent reps have been inconsistent at this weight: '+topSetHistory+'.',
      'The next goal is to stabilize clean reps before increasing.',
      e1Text
    ]);
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
