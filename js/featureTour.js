// Feature tour prompt, demo state, and live overlay logic.
let TOUR_REAL_STATE=null;

function tourDone(){
  try{localStorage.setItem('forma_feature_tour_done','true');}catch(e){}
}
function shouldShowFeatureTour(){
  try{return localStorage.getItem('forma_feature_tour_done')!=='true';}catch(e){return true;}
}
function cloneTourState(obj){
  try{return structuredClone(obj);}catch(e){return JSON.parse(JSON.stringify(obj));}
}
function startFeatureTour(){
  if(!TOUR_REAL_STATE)TOUR_REAL_STATE=cloneTourState(S);
  const demo=makeTourDemoState();
  Object.assign(S,demo);
  S.tourPrompt=false;
  S.tourActive=true;
  S.tourStep=0;
  applyTourStep();
  render();
}
function skipFeatureTour(){
  tourDone();
  restoreFeatureTourState();
  render();
}
function finishFeatureTour(){
  tourDone();
  restoreFeatureTourState();
  render();
}
function replayFeatureTour(){
  startFeatureTour();
}
function restoreFeatureTourState(){
  if(TOUR_REAL_STATE){
    Object.keys(S).forEach(function(k){delete S[k];});
    Object.assign(S,TOUR_REAL_STATE);
    TOUR_REAL_STATE=null;
  }
  S.tourPrompt=false;
  S.tourActive=false;
  S.tourStep=0;
  S.view='home';
}
function tourSteps(){
  return [
    {view:'home',selector:'.home-week-strip',title:'Your week, at a glance',text:'See what’s planned, what you completed, and what’s coming next.'},
    {view:'log',selector:'.ex-card',title:'Log smarter workouts',text:'Track warm-ups, working sets, and top sets. Every set you log becomes data I can use.'},
    {view:'log',selector:'#sugtip-2',title:'Recommendations when they matter',text:'I won\'t interrupt every set. When your history shows a clear pattern, I\'ll explain what I\'d recommend next.',example:'You\'ve repeated 185x7 three times. I\'d recommend aiming for 8 reps before increasing.\n\nWhy:\nYou\'re close to the top of your rep target, but not ready to add weight yet.'},
    {view:'log',selector:'.tour-swap-target',title:'Smart exercise swaps',text:'Ask for a replacement and I’ll explain why it fits the same workout goal.',example:'You: What exercise can I do instead of Bulgarian Split Squat?\n\nMe: I’d recommend Reverse Lunges. They train the same unilateral squat pattern, target quads and glutes, and are easier to load if balance is limiting you.\n\nEvidence note: Swap recommendations use movement pattern, target muscles, joint angle, and role in the workout.'},
    {view:'chat',selector:'.msg.ai .bubble',title:'AI that uses your history',text:'Ask specific questions and I’ll use your logs, PRs, schedule, warm-ups, and trends before giving advice.'},
    {view:'progress',selector:'.tour-chart-target',title:'Progress you can actually read',text:'Charts make it easier to see what’s improving, what’s flat, and what needs attention.',example:'Bench is trending up, while rows are flat. I’d recommend keeping bench steady and prioritizing back volume this week.'}
  ];
}
function applyTourStep(){
  const step=tourSteps()[S.tourStep];
  if(!step)return;
  S.view=step.view;
  S.quickAIOpen=false;
  S.inlineAIReply='';
  S.sugTooltip=null;
  S.substituteIdx=null;
  if(step.view==='progress'){S.progressTab='progress';S.selEx='Bench Press';}
  if(step.view==='home')S.workout=null;
  if(step.view==='log'&&!S.workout)S.workout=makeTourActiveWorkout();
  if(S.tourStep===2)S.sugTooltip='2';
  if(S.tourStep===3)S.substituteIdx=3;
}
function tourNext(){
  if(S.tourStep>=tourSteps().length-1){S.tourStep=tourSteps().length;render();return;}
  S.tourStep++;
  applyTourStep();
  render();
}
function tourBack(){
  if(S.tourStep<=0)return;
  S.tourStep--;
  applyTourStep();
  render();
}
function makeTourDemoState(){
  const base=new Date();
  const iso=function(daysAgo){
    const d=new Date(base);
    d.setDate(d.getDate()-daysAgo);
    d.setHours(18,15,0,0);
    return d.toISOString();
  };
  const splits=['push','pull','legs','upper','lower'];
  const dayKeys=['sun','mon','tue','wed','thu','fri','sat'];
  const todayIdx=new Date().getDay();
  const tourSchedule={};
  ['push','pull','legs','upper','lower','rest','rest'].forEach(function(sp,offset){
    tourSchedule[dayKeys[(todayIdx+offset)%7]]=sp;
  });
  const names={
    push:['Bench Press','Incline Bench','Tricep Pushdown','Bulgarian Split Squat'],
    pull:['Barbell Row','Lat Pulldown','Face Pull'],
    legs:['Squat','Leg Extension','Leg Curl'],
    upper:['Overhead Press','Pull-Up','Chest Press'],
    lower:['Deadlift','Leg Press','Calf Raise']
  };
  const workouts=[];
  for(let i=0;i<14;i++){
    const sp=splits[i%splits.length];
    const bump=Math.floor(i/5);
    workouts.push({
      date:iso(28-i*2),
      split:sp,
      debrief:i===10?'Bench is moving well. Squat held steady for two leg sessions.':'Tour demo workout.',
      exercises:names[sp].map(function(n,ei){
        const baseW={push:70,pull:55,legs:95,upper:45,lower:115}[sp]+ei*8+bump*2;
        const top=n==='Tricep Pushdown'?75/KG2LB:(n==='Bench Press'&&i>8?84:n==='Squat'&&i>9?102:baseW);
        return {name:n,sets:[
          {w:Math.max(0,top*.45),r:8,warmup:true},
          {w:top,r:n==='Tricep Pushdown'?9:(ei===0?6+bump:10)},
          {w:top,r:n==='Tricep Pushdown'?9:(ei===0?5+bump:9)}
        ]};
      })
    });
  }
  workouts.reverse();
  const workout=makeTourActiveWorkout();
  return {
    loaded:true,
    view:'home',
    onboarded:true,
    unit:'lbs',
    workouts:workouts,
    workout:workout,
    workoutStartTime:Date.now(),
    schedule:tourSchedule,
    splitEx:names,
    selStripDay:dayKeys[todayIdx],
    progressTab:'progress',
    selEx:'Bench Press',
    dayPreviewPanel:null,
    exHistoryPanel:null,
    exInstructPanel:null,
    scoreDetail:null,
    restTimer:null,
    quickAIOpen:false,
    pendingAction:null,
    messages:[
      {role:'user',text:'What’s my biggest weakness right now, and what should I do about it?',time:'Demo',actions:[]},
      {role:'ai',text:'Your pulling volume is lagging behind your pressing, and rows have stalled for 3 sessions. I’d recommend adding 2–3 hard sets of chest-supported rows this week while keeping bench volume unchanged.',time:'Demo',actions:[]}
    ],
    profile:{name:'Demo Athlete',goal:'Build muscle and strength',experience:'Intermediate',session_duration:60,exercises_per_session:5,equipment:'Full gym',injuries:'',preferences:''},
    recent:workouts.slice(-3).reverse(),
    prs:[
      {name:'Bench Press',from:'170×8',to:'185×7'},
      {name:'Squat',from:'205×6',to:'225×5'},
      {name:'Deadlift',from:'255×5',to:'275×4'}
    ],
    plateau:{name:'Bench Press is trending up, but Squat has repeated the same top set twice.',note:'I’d recommend staying at 225 for now and aiming for 6–7 clean reps before increasing the weight.'},
    ai:'Bench has been steady at 185×7 for three sessions. Keep the weight and aim for 185×8 next time.'
  };
}
function makeTourActiveWorkout(){
  return {
    date:new Date().toISOString(),
    split:'push',
    exercises:[
      {name:'Bench Press',inputW:'185',inputR:'8',sets:[
        {w:43.1,r:8,warmup:true},
        {w:83.9,r:7}
      ]},
      {name:'Incline Bench',inputW:'135',inputR:'8',sets:[]},
      {name:'Tricep Pushdown',inputW:'75',inputR:'10',sets:[]},
      {name:'Bulgarian Split Squat',inputW:'45',inputR:'8',sets:[]}
    ]
  };
}
function vFeatureTourPrompt(){
  return '<div class="tour-wrap" style="justify-content:center;padding-bottom:calc(34px + env(safe-area-inset-bottom))">'+
    '<div class="tour-card">'+
      '<div class="tour-kicker">OPTIONAL TOUR</div>'+
      '<div class="tour-title">Want a quick tour?</div>'+
      '<div class="tour-copy">I’ll show you how Forma gets more useful after you log workouts.</div>'+
      '<div style="display:flex;gap:8px;margin-top:18px">'+
        '<button class="tour-primary press" onclick="startFeatureTour()" style="flex:1;border-radius:12px;padding:14px;font-size:14px;font-weight:800">Show me</button>'+
        '<button class="tour-secondary press" onclick="skipFeatureTour()" style="flex:1;border-radius:12px;padding:14px;font-size:14px;font-weight:800">Skip</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function vTourOverlay(){
  const steps=tourSteps();
  if(S.tourStep>=steps.length){
    return '<div class="tour-live-overlay">'+
      '<div class="tour-live-scrim"></div>'+
      '<div class="tour-coach-card">'+
        '<div class="tour-kicker">DONE</div>'+
        '<div class="tour-coach-title">You’re ready</div>'+
        '<div class="tour-coach-copy">Start logging. I get more useful every session.</div>'+
        '<div class="tour-coach-actions">'+
          '<button class="tour-primary press" onclick="finishFeatureTour()">Start using Forma</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }
  const step=steps[S.tourStep];
  return '<div class="tour-live-overlay">'+
    '<div class="tour-live-scrim"></div>'+
    '<div id="tour-spotlight" class="tour-spotlight"></div>'+
    '<div class="tour-coach-card">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px">'+
        '<div class="tour-kicker" style="margin-bottom:0">'+(S.tourStep+1)+' of '+steps.length+'</div>'+
        '<button onclick="skipFeatureTour()" style="background:none;border:none;color:var(--muted);font-size:12px;font-weight:800;padding:4px">Skip</button>'+
      '</div>'+
      '<div class="tour-coach-title">'+step.title+'</div>'+
      '<div class="tour-coach-copy">'+step.text+'</div>'+
      (step.example?'<div class="tour-coach-example">'+escH(step.example).replace(/\n/g,'<br>')+'</div>':'')+
      '<div class="tour-coach-actions">'+
        '<button class="tour-secondary press" onclick="tourBack()" '+(S.tourStep===0?'disabled style="opacity:.45"':'')+'>Back</button>'+
        '<button class="tour-primary press" onclick="tourNext()">'+(S.tourStep===steps.length-1?'Finish':'Next')+'</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function positionTourSpotlight(){
  const spot=document.getElementById('tour-spotlight');
  if(!spot||!S.tourActive)return;
  const step=tourSteps()[S.tourStep];
  if(!step)return;
  const target=document.querySelector(step.selector);
  if(!target){spot.style.display='none';return;}
  let r=target.getBoundingClientRect();
  const coach=document.querySelector('.tour-coach-card');
  const coachTop=coach?coach.getBoundingClientRect().top:window.innerHeight;
  if(r.top<72||r.bottom>coachTop-18){
    try{target.scrollIntoView({block:'center',inline:'nearest'});}catch(e){target.scrollIntoView();}
    r=target.getBoundingClientRect();
  }
  const pad=8;
  spot.style.display='block';
  spot.style.left=Math.max(8,r.left-pad)+'px';
  spot.style.top=Math.max(8,r.top-pad)+'px';
  spot.style.width=Math.min(window.innerWidth-16,r.width+pad*2)+'px';
  spot.style.height=Math.min(window.innerHeight-16,r.height+pad*2)+'px';
}
