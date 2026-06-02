// Stats, records, charts, calendar, heatmap, and strength score views for Forma.
function vProgress(){
  const tabs='<div class="stabs" style="margin-bottom:18px">'+
    '<button class="stab'+(S.progressTab==='calendar'?' on':'')+'" onclick="S.progressTab=\'calendar\';render()">CALENDAR</button>'+
    '<button class="stab'+(S.progressTab==='heatmap'?' on':'')+'" onclick="S.progressTab=\'heatmap\';render()">HEATMAP</button>'+
    '<button class="stab'+(S.progressTab==='records'?' on':'')+'" onclick="S.progressTab=\'records\';render()">PRs</button>'+
    '<button class="stab'+(S.progressTab==='progress'?' on':'')+'" onclick="S.progressTab=\'progress\';S.selEx=S.selEx||\'\';;render()">CHART</button>'+
    '<button class="stab'+(S.progressTab==='score'?' on':'')+'" onclick="S.progressTab=\'score\';render()">SCORE</button>'+
  '</div>';

  if(S.progressTab==='progress')   return tabs+vProgressChart();
  if(S.progressTab==='heatmap')    return tabs+vHeatmap();
  if(S.progressTab==='records')    return tabs+vPRWall();
  if(S.progressTab==='score')      return tabs+vStrengthScore();
  return tabs+vCalendar();
}

// ── STRENGTH SCORE ────────────────────────────────────────────
function vStrengthScore(){
  if(!S.workouts.length) return '<div style="color:var(--muted);text-align:center;margin-top:60px;font-size:13px">Log some workouts to see your strength score.</div>';

  const LEVELS=['Untrained','Beginner','Novice','Intermediate','Advanced','Elite'];
  const LEVEL_COLORS=['#3A4A5A','#5A9EBF','#2DAA70','#1A9ED4','#9B6EE8','#E8A020'];

  // Get bodyweight in lbs for normalization
  const bwRaw=parseFloat(S.profile.bodyweight||0);
  const bwLbs=bwRaw>0?(S.unit==='kg'?bwRaw*KG2LB:bwRaw):0;
  const hasBW=bwLbs>50&&bwLbs<500;

  // Standards as bodyweight multipliers (source: ExRx.net / Symmetric Strength)
  // [Beginner, Novice, Intermediate, Advanced, Elite]
  // Absolute fallbacks used when no bodyweight is set
  const PARENT_GROUPS=[
    {
      name:'Chest', color:'#E8693A',
      subs:[
        {
          name:'Chest',
          note:'bench press & variations',
          exercises:['Bench Press','Incline Bench Press','Incline Dumbbell Press','Chest Fly','Cable Crossover'],
          bwMult:[0.50,0.75,1.00,1.25,1.50],
          absStd:[95,135,185,245,315]
        }
      ]
    },
    {
      name:'Back', color:'#2DAA70',
      subs:[
        {
          name:'Lat Width',
          note:'vertical pull — pulldowns & pull-ups',
          exercises:['Pull-Ups','Lat Pulldown','Straight-Arm Pulldown'],
          bwMult:[0.35,0.55,0.75,1.00,1.30],
          absStd:[55,85,120,165,215]
        },
        {
          name:'Lat Thickness',
          note:'horizontal pull — rows',
          exercises:['Barbell Row','Seated Row Machine','Cable Row','Dumbbell Row','Pendlay Row'],
          bwMult:[0.45,0.65,0.90,1.15,1.50],
          absStd:[75,115,155,205,265]
        },
        {
          name:'Upper Back & Traps',
          note:'rear delt, traps — training frequency',
          exercises:['Face Pull','Rear Delt Fly','Shrug','Reverse Fly'],
          type:'volume'
        },
        {
          name:'Lower Back',
          note:'spinal erectors — deadlift',
          exercises:['Deadlift','Romanian Deadlift','Good Morning'],
          bwMult:[1.00,1.25,1.50,2.00,2.50],
          absStd:[135,195,275,365,455]
        }
      ]
    },
    {
      name:'Shoulders', color:'#9B6EE8',
      subs:[
        {
          name:'Front Delts',
          note:'overhead pressing',
          exercises:['Overhead Press','Dumbbell Shoulder Press','Arnold Press'],
          bwMult:[0.35,0.50,0.65,0.85,1.10],
          absStd:[55,80,115,155,200]
        },
        {
          name:'Side Delts',
          note:'lateral raises — training frequency',
          exercises:['Cable Lateral Raise','Dumbbell Lateral Raise','Machine Lateral Raise'],
          type:'volume'
        },
        {
          name:'Rear Delts',
          note:'face pull & fly — training frequency',
          exercises:['Face Pull','Rear Delt Fly','Reverse Fly'],
          type:'volume'
        }
      ]
    },
    {
      name:'Arms', color:'#4EA8E8',
      subs:[
        {
          name:'Biceps',
          note:'all curl variations',
          exercises:['Dumbbell Curl','Hammer Curl','Barbell Curl','Incline Curl','Incline Hammer Curls','Cable Curl'],
          bwMult:[0.13,0.20,0.28,0.38,0.50],
          absStd:[20,32,46,62,82]
        },
        {
          name:'Triceps',
          note:'pushdowns, extensions & press',
          exercises:['Tricep Pushdown','Tricep Press Machine','Skull Crusher','Overhead Tricep Extension','Cable Overhead Extension'],
          bwMult:[0.18,0.30,0.45,0.62,0.82],
          absStd:[30,50,75,105,140]
        }
      ]
    },
    {
      name:'Legs', color:'#1A9ED4',
      subs:[
        {
          name:'Quads',
          note:'squat & leg press',
          exercises:['Squat','Hack Squat','Leg Press','Leg Extension','Front Squat'],
          bwMult:[0.75,1.00,1.25,1.75,2.25],
          absStd:[115,165,225,300,390]
        },
        {
          name:'Hamstrings',
          note:'leg curl & RDL',
          exercises:['Leg Curl','Romanian Deadlift'],
          bwMult:[0.25,0.40,0.58,0.78,1.02],
          absStd:[40,65,95,130,170]
        },
        {
          name:'Glutes',
          note:'hip thrust & split squat',
          exercises:['Hip Thrust','Bulgarian Split Squat','Glute Bridge'],
          bwMult:[0.55,0.85,1.20,1.65,2.15],
          absStd:[95,145,205,280,365]
        },
        {
          name:'Calves',
          note:'calf raises',
          exercises:['Calf Raises','Seated Calf Raise','Standing Calf Raise'],
          bwMult:[0.40,0.65,0.92,1.25,1.62],
          absStd:[70,110,155,210,275]
        }
      ]
    }
  ];

  function getBestE1(exList){
    let best=0;
    exList.forEach(function(exName){
      S.workouts.forEach(function(w){
        const ex=w.exercises.find(function(e){return e.name===exName;});
        if(!ex)return;
        ex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;}).forEach(function(s){
          const v=toDisp(e1rm(s.w,s.r));
          if(v>best)best=v;
        });
      });
    });
    return Math.round(best);
  }

  function getVolumeSessions(exList){
    return S.workouts.filter(function(w){
      return w.exercises.some(function(ex){
        return exList.includes(ex.name)&&ex.sets.filter(function(s){return !s.warmup;}).length>0;
      });
    }).length;
  }

  function getStd(sub){
    if(hasBW&&sub.bwMult) return sub.bwMult.map(function(m){return Math.round(bwLbs*m);});
    return sub.absStd||[10,20,35,55,80];
  }

  function getLevel(val,std){
    if(!val||val===0)return 0;
    for(let i=std.length-1;i>=0;i--){if(val>=std[i])return i+1;}
    return 1;
  }
  function getScore(val,std){
    if(!val||val===0)return 0;
    if(val>=std[4])return Math.min(100,Math.round(90+10*(val-std[4])/std[4]));
    for(let i=0;i<std.length-1;i++){
      if(val<std[i+1]){
        const base=(i+1)*18;
        const pct=(val-std[i])/(std[i+1]-std[i]);
        return Math.round(base+pct*18);
      }
    }
    return 8;
  }

  const allScores=[];
  const parentHtml=PARENT_GROUPS.map(function(pg){
    const subResults=pg.subs.map(function(sub){
      const isVol=sub.type==='volume';
      let val,score,level;
      if(isVol){
        val=getVolumeSessions(sub.exercises);
        score=Math.min(100,Math.round(val*8));
        level=val===0?0:val<3?1:val<7?2:val<14?3:val<25?4:5;
      } else {
        const std=getStd(sub);
        val=getBestE1(sub.exercises);
        score=getScore(val,std);
        level=getLevel(val,std);
        sub._std=std; // store for display
      }
      allScores.push(score);
      const levelName=LEVELS[Math.min(level,5)];
      const levelColor=LEVEL_COLORS[Math.min(level,5)];
      const nextStd=!isVol&&sub._std&&sub._std[level]?sub._std[level]:null;
      const needed=nextStd&&val>0&&level<5?Math.ceil(nextStd-val):null;
      const result={sub,val,score,level,levelName,levelColor,nextStd,needed,isVol,pgColor:pg.color};
      S._scoreResults[sub.name]=result; // store for detail panel
      return result;
    });

    const avgScore=Math.round(subResults.reduce(function(a,r){return a+r.score;},0)/subResults.length);
    const avgLevel=Math.round(subResults.reduce(function(a,r){return a+r.level;},0)/subResults.length);

    return '<div style="background:var(--s1);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'+
        '<div style="display:flex;align-items:center;gap:8px">'+
          '<div style="width:3px;height:16px;background:'+pg.color+';border-radius:2px"></div>'+
          '<span style="font-size:13px;font-weight:800;color:var(--white)">'+pg.name+'</span>'+
        '</div>'+
        '<span style="font-size:11px;font-weight:700;color:'+LEVEL_COLORS[Math.min(avgLevel,5)]+'">'+LEVELS[Math.min(avgLevel,5)]+'</span>'+
      '</div>'+
      subResults.map(function(r){
        const isSelected=S.scoreDetail===r.sub.name;
        return '<div onclick="S.scoreDetail=(S.scoreDetail===\''+r.sub.name+'\'?null:\''+r.sub.name+'\');render()" '+
          'style="margin-bottom:11px;padding:10px 11px;border-radius:10px;border:1px solid '+(isSelected?r.levelColor:'var(--border)')+';background:'+(isSelected?hexA(r.levelColor,.06):'transparent')+';cursor:pointer;transition:background .15s">'+
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
            '<div>'+
              '<span style="font-size:12px;font-weight:700;color:var(--white)">'+r.sub.name+'</span>'+
              '<span style="font-size:10px;color:var(--muted);margin-left:5px">'+r.sub.note+'</span>'+
            '</div>'+
            '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:8px">'+
              '<span style="font-size:10px;font-weight:700;color:'+r.levelColor+'">'+r.levelName+'</span>'+
              (r.val>0&&!r.isVol?'<span style="font-size:9px;color:var(--muted)">'+r.val+' '+uLbl()+'</span>':
               r.isVol&&r.val>0?'<span style="font-size:9px;color:var(--muted)">'+r.val+'×</span>':
               '<span style="font-size:9px;color:var(--dim)">no data</span>')+
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:.5"><path d="M9 18l6-6-6-6"/></svg>'+
            '</div>'+
          '</div>'+
          '<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden">'+
            '<div style="height:100%;width:'+r.score+'%;background:'+pg.color+';border-radius:2px;opacity:'+(r.val>0?1:0.2)+';transition:width .5s ease"></div>'+
          '</div>'+
          (r.needed&&r.level<5?'<div style="font-size:9px;color:var(--dim);margin-top:3px">'+r.needed+' '+uLbl()+' to '+LEVELS[Math.min(r.level+1,5)]+'</div>':'')+
        '</div>';
      }).join('')+
    '</div>';
  }).join('');

  const overallScore=allScores.length?Math.round(allScores.reduce(function(a,v){return a+v;},0)/allScores.length):0;
  const tracked=allScores.filter(function(s){return s>0;}).length;
  const overallLevelIdx=Math.min(Math.round(overallScore/18),5);
  const circ=2*Math.PI*36;
  const dash=circ*(overallScore/100);

  const ring='<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:20px;padding:20px 16px;background:var(--s1);border:1px solid var(--border);border-radius:20px">'+
    '<svg width="96" height="96" viewBox="0 0 100 100">'+
      '<circle cx="50" cy="50" r="36" fill="none" stroke="var(--border)" stroke-width="7"/>'+
      '<circle cx="50" cy="50" r="36" fill="none" stroke="'+LEVEL_COLORS[overallLevelIdx]+'" stroke-width="7" '+
        'stroke-dasharray="'+dash+' '+(circ-dash)+'" stroke-dashoffset="'+circ/4+'" stroke-linecap="round"/>'+
      '<text x="50" y="46" text-anchor="middle" font-size="22" font-weight="800" fill="var(--white)" font-family="ui-monospace,Menlo,monospace">'+overallScore+'</text>'+
      '<text x="50" y="59" text-anchor="middle" font-size="8" fill="var(--muted)" font-family="inherit" letter-spacing="1.5">SCORE</text>'+
    '</svg>'+
    '<div style="font-size:16px;font-weight:700;color:'+LEVEL_COLORS[overallLevelIdx]+';margin-top:2px">'+LEVELS[overallLevelIdx]+'</div>'+
    '<div style="font-size:11px;color:var(--muted);margin-top:3px">'+tracked+' of '+allScores.length+' groups tracked</div>'+
  '</div>'+
  (!hasBW?
    '<div onclick="navTo(\'setup\');S.setupTab=\'profile\';" style="cursor:pointer;background:rgba(26,158,212,.08);border:1px solid rgba(26,158,212,.25);border-radius:10px;padding:10px 12px;margin-bottom:16px;display:flex;align-items:center;gap:8px">'+
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'+
      '<div style="font-size:11px;color:var(--blue);line-height:1.4">Add your bodyweight in Profile to get personalized strength standards. <strong>Tap to update →</strong></div>'+
    '</div>':'');

  return ring+
    '<div style="font-size:10px;color:var(--muted);margin-bottom:16px;line-height:1.6;padding:10px 12px;background:var(--s1);border-radius:10px;border:1px solid var(--border)">'+
      (hasBW?
        'Standards normalized to your bodyweight ('+Math.round(bwLbs)+' lbs). Scores use estimated 1RM from your logged sets.':
        'Using general absolute standards. Add your bodyweight in Profile for personalized accuracy.')+
    '</div>'+
    parentHtml+
    (S.scoreDetail&&S._scoreResults[S.scoreDetail]?vScoreDetailPanel(S._scoreResults[S.scoreDetail]):'');
}

function vScoreDetailPanel(r){
  const LEVELS=['Untrained','Beginner','Novice','Intermediate','Advanced','Elite'];
  const LEVEL_COLORS=['#3A4A5A','#5A9EBF','#2DAA70','#1A9ED4','#9B6EE8','#E8A020'];
  const sub=r.sub;
  const col=r.pgColor||r.levelColor;

  // Build standards rows
  const std=sub._std||sub.absStd||[];
  const levelNames=LEVELS.slice(1); // Beginner → Elite (5 entries)
  const stdRows=std.length?levelNames.map(function(lName,i){
    const target=std[i];
    const isCurrent=(r.level-1===i);
    const isNext=(r.level===i);
    const achieved=r.val>=target;
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:8px;margin-bottom:3px;'+
      'background:'+(isCurrent?hexA(r.levelColor,.12):(isNext?hexA(r.levelColor,.05):'transparent'))+';'+
      'border:1px solid '+(isCurrent?r.levelColor:(isNext?hexA(r.levelColor,.3):'transparent'))+'">'+
      '<div style="display:flex;align-items:center;gap:7px">'+
        (achieved?
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2DAA70" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':
          '<div style="width:12px;height:12px;border-radius:50%;border:1.5px solid var(--border)"></div>')+
        '<span style="font-size:12px;font-weight:'+(isCurrent||isNext?700:400)+';color:'+(isCurrent?r.levelColor:isNext?'var(--white)':'var(--sub)')+'">'+lName+'</span>'+
        (isCurrent?'<span style="font-size:9px;color:'+r.levelColor+';font-weight:700"> ← YOU</span>':'')+
        (isNext&&r.level<5?'<span style="font-size:9px;color:var(--muted)"> next</span>':'')+
      '</div>'+
      '<span style="font-size:12px;font-weight:'+(isCurrent?700:400)+';color:'+(isCurrent?r.levelColor:'var(--sub)')+';font-family:var(--mono)">'+target+' '+uLbl()+'</span>'+
    '</div>';
  }).join(''):null;

  // Find which exercises they've actually logged from this group
  const loggedExs=[];
  (sub.exercises||[]).forEach(function(exName){
    var best=0;
    S.workouts.forEach(function(w){
      var ex=w.exercises&&w.exercises.find(function(e){return e.name===exName;});
      if(!ex||!Array.isArray(ex.sets))return;
      ex.sets.forEach(function(s){if(!s.warmup&&s.w>0&&s.r>0){var v=toDisp(e1rm(s.w,s.r));if(v>best)best=v;}});
    });
    if(best>0)loggedExs.push({name:exName,e1rm:best});
  });
  loggedExs.sort(function(a,b){return b.e1rm-a.e1rm;});

  // Improvement tips by sub name
  const TIPS={
    'Chest':['Add sets of Incline Dumbbell Press to hit the upper chest','Use a full range of motion — touch chest on bench press for maximum stretch','Focus on progressive overload: add 5 lbs every 1-2 sessions when you hit 3×8'],
    'Lat Width':['Prioritize Pull-Ups over Lat Pulldown — bodyweight to bar is the best lat builder','Use a full hang at the bottom to maximize the lat stretch','Add Straight-Arm Pulldowns as an isolation finisher to feel the lats better'],
    'Lat Thickness':['Use a medium overhand grip on rows to hit mid-lats equally','Add chest-supported rows to remove lower back fatigue and get more lat volume','Focus on the squeeze at the top of every rep, hold 1 second'],
    'Upper Back & Traps':['Add 2-3 sets of Face Pulls every pull session — rear delts are almost always undertrained','High-rep shrugs (15-20) with a hold at the top build traps efficiently','Rear delt work is easy to program as a superset with bicep curls'],
    'Lower Back':['Romanian Deadlifts 2-3× per week are the safest and most effective lower back builder','Focus on hip hinge mechanics — the bar should drag down your legs','Avoid rounding at the bottom; keep a neutral spine and hinge, don\'t squat'],
    'Front Delts':['Overhead Press is the #1 priority — it drives shoulder size and strength','Use dumbbell shoulder press on alternate sessions to fix imbalances','Your front delts are also hit hard on bench press, so don\'t overtrain them'],
    'Side Delts':['Lateral raises need high frequency (2-3× per week) to grow','Cable laterals have a better strength curve than dumbbells — prioritize them','15-20 reps per set, slow eccentric on the way down'],
    'Rear Delts':['Face Pulls 2-3× per week is the most efficient rear delt builder','Reverse flys at lighter weight with controlled form beats heavy with momentum','Pair with every pull session as a finishing exercise'],
    'Biceps':['Add a stretch-focused curl (incline dumbbell curl) for long-head development','Cable curls provide constant tension the whole rep — better than dumbbells alone','Frequency beats volume: 2 lighter sets every session beats 1 heavy session per week'],
    'Triceps':['Overhead tricep work (skull crushers, overhead extension) hits the long head best — it\'s 2/3 of the arm','Close-grip bench press is the heaviest overload you can put on triceps','Add a finisher set of pushdowns at the end of every push session'],
    'Quads':['Squats are irreplaceable — they produce the most quad mass','Add Hack Squat or Leg Press as a second quad movement to get extra volume safely','Slow the eccentric down (3-4 seconds) on leg press for more hypertrophy stimulus'],
    'Hamstrings':['Romanian Deadlifts are the best hamstring builder — prioritize heavy RDLs','Seated leg curl hits the long head better than lying — worth the switch if available','Nordic curls have the best injury prevention evidence (51% reduction)'],
    'Glutes':['Hip Thrusts have the highest glute EMG of any exercise — make them a staple','Bulgarian Split Squats are the second-best glute exercise and fix imbalances','Heavy weight on hip thrusts matters: 3-5 sets of 8-12 with progressive overload'],
    'Calves':['Train calves with high frequency (3-4× per week) — they have high slow-twitch fiber density','Use the full range of motion: full stretch at the bottom, full contraction at the top','Add standing calf raises (gastrocnemius) AND seated (soleus) — they\'re different muscles'],
  };
  const tips=TIPS[sub.name]||['Train this muscle group 2× per week for best hypertrophy results','Focus on progressive overload: add weight or reps each session','Use a mix of compound and isolation exercises for complete development'];

  return '<div style="position:fixed;inset:0;z-index:400;display:flex;flex-direction:column;justify-content:flex-end" onclick="S.scoreDetail=null;render()">'+
    '<div ontouchstart="sheetTouchStart(event)" ontouchmove="sheetTouchMove(event)" ontouchend="sheetTouchEnd(\'scoreDetail\')" onclick="event.stopPropagation()" style="background:var(--s1);border-radius:20px 20px 0 0;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.25)">'+

      // Handle
      '<div style="display:flex;justify-content:center;padding:10px 0 0">'+
        '<div style="width:36px;height:4px;background:var(--border);border-radius:2px"></div>'+
      '</div>'+

      // Header
      '<div style="padding:14px 18px 0;display:flex;align-items:flex-start;justify-content:space-between">'+
        '<div>'+
          '<div style="font-size:19px;font-weight:800;color:var(--white);letter-spacing:-.4px">'+sub.name+'</div>'+
          '<div style="font-size:12px;color:var(--muted);margin-top:2px">'+sub.note+'</div>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">'+
          '<span style="font-size:13px;font-weight:800;color:'+r.levelColor+';background:'+hexA(r.levelColor,.12)+';border:1px solid '+hexA(r.levelColor,.3)+';padding:4px 12px;border-radius:20px">'+r.levelName+'</span>'+
          (r.val>0&&!r.isVol?'<span style="font-size:11px;color:var(--muted);font-family:var(--mono)">'+r.val+' '+uLbl()+' e1RM</span>':'')+ 
        '</div>'+
      '</div>'+

      '<div data-sheet-scroll="1" style="overflow-y:auto;padding:16px 18px 32px;flex:1">'+

        // Score bar
        '<div style="margin-bottom:18px">'+
          '<div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;margin-bottom:6px">'+
            '<div style="height:100%;width:'+r.score+'%;background:'+col+';border-radius:4px;transition:width .5s ease"></div>'+
          '</div>'+
          '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted)">'+
            '<span>Untrained</span><span style="font-weight:700;color:'+r.levelColor+'">Score: '+r.score+'/100</span><span>Elite</span>'+
          '</div>'+
        '</div>'+

        // Why this score
        '<div style="margin-bottom:16px">'+
          '<div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;margin-bottom:8px">WHY THIS SCORE</div>'+
          (r.val===0&&!r.isVol?
            '<div style="background:var(--bg);border-radius:10px;padding:12px;font-size:12px;color:var(--sub);line-height:1.6">'+
              'No data yet for these exercises. Log a session with '+sub.exercises.slice(0,2).join(' or ')+' and your score will appear.'+
            '</div>':
            r.isVol?
            '<div style="background:var(--bg);border-radius:10px;padding:12px;font-size:12px;color:var(--sub);line-height:1.6">'+
              'Scored by training frequency — you\'ve done '+r.val+' session'+(r.val!==1?'s':'')+' of '+sub.exercises.slice(0,2).join(', ')+' and related exercises. More consistent training = higher score.'+
            '</div>':
            '<div style="background:var(--bg);border-radius:10px;padding:12px;font-size:12px;color:var(--sub);line-height:1.6">'+
              'Your best estimated 1RM across '+sub.exercises.slice(0,3).join(', ')+(sub.exercises.length>3?' and others':'')+' is <strong style="color:var(--white)">'+r.val+' '+uLbl()+'</strong>. '+
              (r.level<5&&r.nextStd?'You need <strong style="color:var(--white)">'+r.nextStd+' '+uLbl()+'</strong> to reach '+LEVELS[Math.min(r.level+1,5)]+' — that\'s '+Math.ceil(r.nextStd-r.val)+' '+uLbl()+' away.':
               r.level===5?'You\'ve reached Elite level. Outstanding.':'')+
            '</div>')+
        '</div>'+

        // Your logged exercises
        (loggedExs.length?
          '<div style="margin-bottom:16px">'+
            '<div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;margin-bottom:8px">YOUR BEST LIFTS</div>'+
            '<div style="display:flex;flex-direction:column;gap:5px">'+
              loggedExs.slice(0,4).map(function(ex){
                return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px">'+
                  '<span style="font-size:12px;font-weight:600;color:var(--white)">'+ex.name+'</span>'+
                  '<span style="font-size:12px;font-weight:700;color:'+col+';font-family:var(--mono)">'+Math.round(ex.e1rm)+' '+uLbl()+'</span>'+
                '</div>';
              }).join('')+
            '</div>'+
          '</div>':'') +

        // Standards table (only for e1RM-based subs)
        (!r.isVol&&std.length?
          '<div style="margin-bottom:16px">'+
            '<div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;margin-bottom:8px">STRENGTH STANDARDS</div>'+
            stdRows+
          '</div>':'') +

        // How to improve
        '<div>'+
          '<div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;margin-bottom:8px">HOW TO IMPROVE</div>'+
          '<div style="display:flex;flex-direction:column;gap:7px">'+
            tips.map(function(tip,i){
              return '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;background:var(--bg);border-radius:9px">'+
                '<div style="width:18px;height:18px;border-radius:50%;background:'+hexA(col,.15)+';display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">'+
                  '<span style="font-size:9px;font-weight:700;color:'+col+'">'+(i+1)+'</span>'+
                '</div>'+
                '<span style="font-size:12px;color:var(--sub);line-height:1.55">'+tip+'</span>'+
              '</div>';
            }).join('')+
          '</div>'+
        '</div>'+

      '</div>'+
    '</div>'+
  '</div>';
}

function vHeatmap(){
  if(!S.workouts.length)return '<div style="color:var(--muted);text-align:center;margin-top:60px;font-size:13px">No workouts yet.</div>';

  const WEEKS=18;
  const today=new Date();
  // Start from Monday of (WEEKS) weeks ago
  const start=new Date(today);
  start.setDate(today.getDate()-(WEEKS*7));
  const dow=start.getDay();
  start.setDate(start.getDate()+(dow===0?1:dow===1?0:8-dow));

  // Build lookup: 'YYYY-MM-DD' -> {split, idx}
  const lookup={};
  S.workouts.forEach(function(w,idx){
    const d=new Date(w.date);
    if(isNaN(d.getTime()))return;
    const key=d.toISOString().slice(0,10);
    if(!lookup[key])lookup[key]={split:w.split,idx:idx};
  });
  const todayKey2=today.toISOString().slice(0,10);

  // Stats
  const totalDays=S.workouts.length;
  const last30=S.workouts.filter(function(w){return new Date(w.date)>new Date(today-30*864e5);}).length;
  const splitCount={};
  S.workouts.forEach(function(w){splitCount[w.split]=(splitCount[w.split]||0)+1;});
  const topSplit=Object.entries(splitCount).sort(function(a,b){return b[1]-a[1];})[0];

  // Generate grid: rows=Mon-Sun, cols=weeks
  const DAY_LABELS=['M','T','W','T','F','S','S'];
  let gridHtml='<div style="display:flex;gap:4px">'+
    // Day labels column
    '<div style="display:flex;flex-direction:column;gap:3px;padding-top:0;flex-shrink:0">'+
      DAY_LABELS.map(function(d){
        return '<div style="width:12px;height:14px;display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--muted);font-weight:600">'+d+'</div>';
      }).join('')+
    '</div>'+
    // Weeks columns
    '<div style="flex:1;overflow-x:auto;scrollbar-width:none">'+
    '<div style="display:flex;gap:3px;min-width:max-content">';

  for(let w=0;w<WEEKS;w++){
    gridHtml+='<div style="display:flex;flex-direction:column;gap:3px">';
    for(let d=0;d<7;d++){
      const date=new Date(start);
      date.setDate(start.getDate()+w*7+d);
      if(date>today){gridHtml+='<div style="width:14px;height:14px"></div>';continue;}
      const key=date.toISOString().slice(0,10);
      const entry=lookup[key];
      const isToday=key===todayKey2;
      const col=entry?spCol(entry.split):'none';
      const bg=entry?hexA(col,.85):(isToday?'var(--border)':'var(--s2)');
      const border=isToday?'1.5px solid var(--blue)':'1.5px solid transparent';
      gridHtml+='<div onclick="'+(entry?'selCalWorkout('+entry.idx+')':'')+'" '+
        'style="width:14px;height:14px;border-radius:3px;background:'+bg+';border:'+border+';cursor:'+(entry?'pointer':'default')+';" '+
        'title="'+(entry?spLbl(entry.split)+' — '+key:key)+'"></div>';
    }
    // Week label every 4 weeks
    gridHtml+='</div>';
  }
  gridHtml+='</div></div></div>';

  // Month labels
  const monthLabels=[];
  let lastMonth=-1;
  for(let w=0;w<WEEKS;w++){
    const d=new Date(start);d.setDate(start.getDate()+w*7);
    if(d.getMonth()!==lastMonth){
      monthLabels.push({w,label:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]});
      lastMonth=d.getMonth();
    }
  }
  // Build month row
  let monthRow='<div style="display:flex;gap:3px;margin-left:16px;margin-bottom:4px;overflow:hidden">';
  for(let w=0;w<WEEKS;w++){
    const lbl=monthLabels.find(function(m){return m.w===w;});
    monthRow+='<div style="width:14px;flex-shrink:0;font-size:8px;color:var(--sub);font-weight:600;white-space:nowrap;overflow:visible">'+(lbl?lbl.label:'')+'</div>';
  }
  monthRow+='</div>';

  // Split legend
  const legend='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">'+
    allSplits().filter(function(s){return s!=='rest'&&splitCount[s];}).map(function(s){
      const c=spCol(s);
      return '<div style="display:flex;align-items:center;gap:4px">'+
        '<div style="width:10px;height:10px;border-radius:2px;background:'+hexA(c,.85)+'"></div>'+
        '<span style="font-size:10px;color:var(--sub)">'+spLbl(s)+' ('+splitCount[s]+')</span>'+
      '</div>';
    }).join('')+
  '</div>';

  // Summary stats
  const stats='<div style="display:flex;gap:10px;margin-bottom:18px">'+
    '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">'+
      '<div class="mono" style="font-size:22px;font-weight:800;color:var(--blue)">'+totalDays+'</div>'+
      '<div style="font-size:10px;color:var(--muted);margin-top:2px;letter-spacing:.05em">TOTAL</div>'+
    '</div>'+
    '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">'+
      '<div class="mono" style="font-size:22px;font-weight:800;color:var(--blue)">'+last30+'</div>'+
      '<div style="font-size:10px;color:var(--muted);margin-top:2px;letter-spacing:.05em">LAST 30 DAYS</div>'+
    '</div>'+
    (topSplit?'<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">'+
      '<div style="font-size:14px;font-weight:800;color:'+spCol(topSplit[0])+'">'+spLbl(topSplit[0]).toUpperCase()+'</div>'+
      '<div style="font-size:10px;color:var(--muted);margin-top:2px;letter-spacing:.05em">MOST TRAINED</div>'+
    '</div>':'')+
  '</div>';

  return stats+
    '<span class="lbl" style="margin-bottom:8px">CONSISTENCY — '+WEEKS+' WEEKS</span>'+
    monthRow+gridHtml+legend;
}

// ── PR WALL ───────────────────────────────────────────────────
function vPRWall(){
  if(!S.workouts.length)return '<div style="color:var(--muted);text-align:center;margin-top:60px;font-size:13px">No workouts yet.</div>';

  const now=new Date();
  const twoWeeksAgo=new Date(now-14*864e5);

  // Find all-time best e1RM per exercise, track date achieved
  const prs={};
  S.workouts.forEach(function(w){
    (w.exercises||[]).forEach(function(ex){
      if(!ex||!Array.isArray(ex.sets)||isCardioEx(ex.name))return;
      const workSets=ex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
      if(!workSets.length)return;
      workSets.forEach(function(s){
        const e=e1rm(s.w,s.r);
        if(!prs[ex.name]||e>prs[ex.name].e1){
          prs[ex.name]={e1:e,w:s.w,r:s.r,date:w.date,split:w.split};
        }
      });
    });
  });

  if(!Object.keys(prs).length)return '<div style="color:var(--muted);text-align:center;margin-top:60px;font-size:13px">Log some workouts to see your PRs.</div>';

  // Sort by e1RM descending
  const sorted=Object.entries(prs).sort(function(a,b){return b[1].e1-a[1].e1;});

  // Group by split
  const bySplit={};
  sorted.forEach(function(entry){
    const sp=entry[1].split;
    if(!bySplit[sp])bySplit[sp]=[];
    bySplit[sp].push(entry);
  });

  let html='';

  // Top 3 PRs — featured
  const top3=sorted.slice(0,3);
  html+='<span class="lbl" style="margin-bottom:10px">TOP LIFTS</span>'+
    '<div class="tour-records-target" style="display:flex;gap:8px;margin-bottom:20px">'+
    top3.map(function(entry,ri){
      const name=entry[0];const pr=entry[1];
      const isRecent=new Date(pr.date)>twoWeeksAgo;
      const col=spCol(pr.split);
      const medals=['🥇','🥈','🥉'];
      return '<div style="flex:1;background:var(--s1);border:1px solid '+hexA(col,.3)+';border-radius:12px;padding:12px;text-align:center">'+
        '<div style="font-size:18px;margin-bottom:4px">'+medals[ri]+'</div>'+
        '<div style="font-size:11px;font-weight:700;color:var(--white);margin-bottom:4px;line-height:1.2">'+name+'</div>'+
        '<div class="mono" style="font-size:18px;font-weight:800;color:'+col+'">'+toDisp(pr.e1)+'</div>'+
        '<div style="font-size:9px;color:var(--muted)">'+uLbl()+' e1RM</div>'+
        '<div style="font-size:9px;color:var(--muted);margin-top:3px">'+toDisp(pr.w)+' × '+pr.r+'</div>'+
        (isRecent?'<div style="font-size:8px;font-weight:700;color:#2DAA70;margin-top:4px;background:rgba(45,170,112,.1);border-radius:4px;padding:2px 4px">NEW &#9650;</div>':'')+
      '</div>';
    }).join('')+
  '</div>';

  // Full list grouped by split
  html+='<span class="lbl" style="margin-bottom:10px">ALL RECORDS</span>';
  Object.entries(bySplit).forEach(function(splitEntry){
    const sp=splitEntry[0];const entries=splitEntry[1];
    const col=spCol(sp);
    html+='<div style="margin-bottom:14px">'+
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">'+
        '<div style="width:8px;height:8px;border-radius:50%;background:'+col+'"></div>'+
        '<span style="font-size:10px;font-weight:700;color:'+col+';letter-spacing:.08em">'+spLbl(sp).toUpperCase()+'</span>'+
      '</div>'+
      entries.map(function(entry){
        const name=entry[0];const pr=entry[1];
        const isRecent=new Date(pr.date)>twoWeeksAgo;
        const dateStr=fmtD(pr.date);
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:var(--s1);border:1px solid var(--border);border-radius:8px;margin-bottom:5px">'+
          '<div>'+
            '<div style="font-size:13px;font-weight:700;color:var(--white)">'+name+
              (isRecent?' <span style="font-size:8px;font-weight:700;color:#2DAA70;background:rgba(45,170,112,.1);border-radius:3px;padding:1px 4px">NEW</span>':'')+
            '</div>'+
            '<div style="font-size:10px;color:var(--muted);margin-top:1px">'+dateStr+'</div>'+
          '</div>'+
          '<div style="text-align:right">'+
            '<div class="mono" style="font-size:14px;font-weight:700;color:var(--blue)">'+toDisp(pr.e1)+' <span style="font-size:9px;color:var(--muted)">'+uLbl()+'</span></div>'+
            '<div style="font-size:10px;color:var(--sub)">'+toDisp(pr.w)+' '+uLbl()+' × '+pr.r+'</div>'+
          '</div>'+
        '</div>';
      }).join('')+
    '</div>';
  });

  return html;
}

function vCalendar(){
  const year=S.calYear, month=S.calMonth;
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Build a lookup: 'YYYY-M-D' → workout index
  const workoutByDate={};
  S.workouts.forEach(function(w,idx){
    const d=new Date(w.date);
    const key=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
    if(!workoutByDate[key])workoutByDate[key]=idx; // keep most recent if multiple
  });

  // First day of month and total days
  const firstDay=new Date(year,month,1).getDay(); // 0=Sun
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date();
  const isCurrentMonth=(today.getFullYear()===year&&today.getMonth()===month);

  // Calendar header
  const nav=
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">'+
      '<button onclick="calNav(-1)" style="background:var(--s1);border:1px solid var(--border);color:var(--sub);border-radius:7px;padding:7px 12px;font-size:16px;cursor:pointer;line-height:1">&#8249;</button>'+
      '<div style="font-weight:700;font-size:15px;color:var(--white)">'+monthNames[month]+' '+year+'</div>'+
      '<button onclick="calNav(1)" style="background:var(--s1);border:1px solid var(--border);color:var(--sub);border-radius:7px;padding:7px 12px;font-size:16px;cursor:pointer;line-height:1">&#8250;</button>'+
    '</div>';

  // Day headers
  const dayHdrs='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px">'+
    dayNames.map(function(d){return '<div style="text-align:center;font-size:9px;font-weight:700;color:var(--muted);letter-spacing:.08em;padding:4px 0">'+d+'</div>';}).join('')+
  '</div>';

  // Grid cells
  let cells='<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">';
  // Empty cells before first day
  for(var i=0;i<firstDay;i++) cells+='<div></div>';
  // Day cells
  for(var d=1;d<=daysInMonth;d++){
    const key=year+'-'+month+'-'+d;
    const wIdx=workoutByDate[key];
    const hasWorkout=wIdx!==undefined;
    const w=hasWorkout?S.workouts[wIdx]:null;
    const col=hasWorkout?spCol(w.split):'none';
    const isToday=isCurrentMonth&&d===today.getDate();
    const isSelected=S.selWorkout===wIdx&&hasWorkout;
    const isEmpty=!hasWorkout&&!isToday;
    cells+=
      '<div onclick="'+(hasWorkout?'selCalWorkout('+wIdx+')':isEmpty?'promptPastWorkout(\''+year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')+'\')':'')+'" '+
        'style="'+
          'aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;'+
          'background:'+(isSelected?col:hasWorkout?hexA(col,.1):(isToday?'var(--s2)':'none'))+';'+
          'border:1.5px solid '+(isSelected?col:isToday?'var(--blue)':isEmpty?'transparent':'transparent')+';'+
          'cursor:'+(hasWorkout||isEmpty?'pointer':'default')+';'+
          'position:relative'+
        '">'+
        '<span style="font-size:12px;font-weight:'+(isToday||hasWorkout?700:400)+';color:'+(isSelected?'#fff':isToday?'var(--blue)':'var(--white)')+'">'+d+'</span>'+
        (hasWorkout?'<div style="width:5px;height:5px;border-radius:50%;background:'+(isSelected?'rgba(255,255,255,.8)':col)+'"></div>':
         isEmpty?'<div style="width:5px;height:5px;border-radius:50%;background:transparent;border:1px dashed var(--dim)"></div>':'')+
      '</div>';
  }
  cells+='</div>';

  // Selected workout detail
  let detail='';
  if(S.selWorkout!==null&&S.workouts[S.selWorkout]){
    const w=S.workouts[S.selWorkout];
    const col=spCol(w.split);
    const exRows=w.exercises.filter(function(e){return e.sets.length>0;}).map(function(ex){
      const workSets=ex.sets.filter(function(s){return !s.warmup;});
      const wuSets=ex.sets.filter(function(s){return s.warmup;});
      const best=workSets.length?Math.max.apply(null,workSets.map(function(s){return e1rm(s.w,s.r);})):0;
      const isCardio=isCardioEx(ex.name);
      return '<div style="padding:10px 0;border-bottom:1px solid var(--dim)">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">'+
          '<span style="font-size:13px;font-weight:700;color:var(--white)">'+ex.name+'</span>'+
          (isCardio?'<span style="font-size:11px;color:var(--blue)" class="mono">'+ex.sets[0].w+' min</span>':
            (best?'<span style="font-size:11px;color:var(--blue)" class="mono">e1RM '+toDisp(best)+'</span>':''))+
        '</div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:5px">'+
          ex.sets.map(function(s){
            return '<span style="font-size:10px;font-family:var(--mono);color:'+(s.warmup?'#E8693A':'var(--sub)')+';background:var(--bg);border:1px solid '+(s.warmup?'#E8693A44':'var(--dim)')+';padding:2px 7px;border-radius:4px">'+
              (isCardio?s.w+'min':(toDisp(s.w)+uLbl()+'×'+s.r))+
              (s.warmup?' WU':'')+
            '</span>';
          }).join('')+
        '</div>'+
      '</div>';
    }).join('');

    detail='<div style="margin-top:16px;background:var(--s1);border:1px solid var(--border);border-radius:12px;overflow:hidden">'+
      '<div style="background:'+hexA(col,.1)+';border-bottom:1px solid '+hexA(col,.2)+';padding:12px 14px;display:flex;align-items:center;justify-content:space-between">'+
        '<div>'+
          '<div style="font-size:12px;font-weight:800;color:'+col+';letter-spacing:.06em">'+spLbl(w.split).toUpperCase()+' DAY</div>'+
          '<div style="font-size:11px;color:var(--sub);margin-top:2px">'+new Date(w.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+'</div>'+
        '</div>'+
        '<button onclick="S.selWorkout=null;render()" style="background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer;padding:0;line-height:1">&#215;</button>'+
      '</div>'+
      '<div style="padding:0 14px 8px">'+
        (exRows||'<div style="padding:12px 0;color:var(--muted);font-size:12px">No exercises logged.</div>')+
      '</div>'+
    '</div>';
  }

  // Recent summary strip (last 30 days)
  const recent=S.workouts.slice(0,8).map(function(w,idx){
    const c=spCol(w.split);
    return '<div onclick="selCalWorkout('+idx+')" style="flex-shrink:0;background:'+hexA(c,.1)+';border:1px solid '+hexA(c,.3)+';border-radius:8px;padding:8px 10px;cursor:pointer;min-width:80px">'+
      '<div style="font-size:9px;font-weight:700;color:'+c+';letter-spacing:.06em">'+spLbl(w.split).toUpperCase()+'</div>'+
      '<div style="font-size:10px;color:var(--muted);margin-top:2px">'+fmtD(w.date)+'</div>'+
      '<div style="font-size:10px;color:var(--sub);margin-top:1px">'+w.exercises.filter(function(e){return e.sets.length>0;}).length+' exercises</div>'+
    '</div>';
  }).join('');

  // Past workout creation panel
  const newPanel=S.newPastDate?
    '<div style="margin-top:14px;background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:14px">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
        '<div style="font-size:13px;font-weight:700;color:var(--white)">Log workout for '+new Date(S.newPastDate+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+'</div>'+
        '<button onclick="S.newPastDate=null;S.newPastSplit=null;render()" style="background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer">&#215;</button>'+
      '</div>'+
      '<span class="lbl" style="margin-bottom:8px">SELECT SPLIT</span>'+
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">'+
        allSplits().filter(function(s){return s!=='rest';}).map(function(s){
          const c=spCol(s);const on=S.newPastSplit===s;
          return '<button onclick="S.newPastSplit=\''+s+'\';render()" style="background:'+(on?hexA(c,.15):'none')+';border:1px solid '+(on?c:'var(--border)')+';color:'+(on?c:'var(--sub)')+';border-radius:20px;padding:5px 13px;font-size:11px;font-weight:'+(on?700:400)+';cursor:pointer;font-family:inherit">'+spLbl(s)+'</button>';
        }).join('')+
      '</div>'+
      (S.newPastSplit?
        '<button onclick="createPastWorkout()" style="width:100%;background:var(--blue);color:#fff;border:none;border-radius:8px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Create Workout &rarr;</button>':
        '<div style="font-size:11px;color:var(--muted);text-align:center">Pick a split to continue</div>')+
    '</div>':'';

  return nav+dayHdrs+cells+newPanel+
    (S.workouts.length?'<div style="margin-top:18px;margin-bottom:8px"><span class="lbl" style="margin-bottom:10px">RECENT SESSIONS</span>'+
      '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none">'+recent+'</div>'+
    '</div>':'<div style="margin-top:30px;text-align:center;color:var(--muted);font-size:13px">No workouts yet.<br>Log your first session to see it here.</div>');
}

function vProgressChart(){
  if(!S.workouts.length)return '<div style="color:var(--muted);text-align:center;margin-top:40px;font-size:13px">No workout data yet.</div>';

  // ── Build exercise list grouped by split ──────────────────
  const splitOrder=['push','pull','legs','upper','lower'];
  const exBySplit={};
  // Collect all exercises ever logged, grouped by which split they belong to
  S.workouts.forEach(function(w){
    const sp=w.split;
    w.exercises.forEach(function(ex){
      if(!exBySplit[sp])exBySplit[sp]=new Set();
      exBySplit[sp].add(ex.name);
    });
  });
  // Also include splitEx template exercises
  Object.keys(S.splitEx).forEach(function(sp){
    (S.splitEx[sp]||[]).forEach(function(n){
      if(!exBySplit[sp])exBySplit[sp]=new Set();
      exBySplit[sp].add(n);
    });
  });
  // Collect exercises not in any known split
  const allKnown=new Set(Object.values(exBySplit).flatMap(function(s){return [...s];}));
  const allLogged=[...new Set(S.workouts.flatMap(function(w){return w.exercises.map(function(e){return e.name;})}))];
  const other=allLogged.filter(function(n){return !allKnown.has(n);});

  const groups=[];
  splitOrder.forEach(function(sp){
    if(exBySplit[sp]&&exBySplit[sp].size){
      groups.push({label:spLbl(sp),col:spCol(sp),names:[...exBySplit[sp]]});
    }
  });
  if(other.length) groups.push({label:'Other',col:'var(--muted)',names:other});

  const picker=groups.map(function(g){
    return '<div style="margin-bottom:12px">'+
      '<div style="font-size:10px;font-weight:700;color:'+g.col+';letter-spacing:.08em;margin-bottom:6px">'+g.label.toUpperCase()+'</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+
        g.names.map(function(n){
          const on=S.selEx===n;
          return '<button onclick="selEx(\''+n.replace(/'/g,"\\'")+'\')" style="background:'+(on?'var(--blue)':'var(--s1)')+';color:'+(on?'#fff':'var(--sub)')+';border:1px solid '+(on?'var(--blue)':'var(--border)')+';padding:5px 10px;border-radius:6px;font-size:10px;font-weight:'+(on?700:400)+';cursor:pointer;font-family:inherit">'+n+'</button>';
        }).join('')+
      '</div>'+
    '</div>';
  }).join('');

  if(!S.selEx) return picker;

  // ── Data for selected exercise ────────────────────────────
  const rows=S.workouts.filter(function(w){return w.exercises.find(function(e){return e.name===S.selEx;});}).map(function(w){
    const ex=w.exercises.find(function(e){return e.name===S.selEx;});
    const ws=ex.sets.filter(function(s){return !s.warmup;});
    if(!ws.length)return null;
    const best=ws.reduce(function(b,s){return e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b;},ws[0]);
    return{date:fmtD(w.date),val:Math.round(Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);}))*10)/10,tw:best.w,tr:best.r};
  }).filter(Boolean).reverse();

  if(!rows.length) return picker+'<div style="color:var(--muted);font-size:13px;text-align:center;margin-top:30px">No working sets logged for this exercise yet.</div>';

  const peak=Math.max.apply(null,rows.map(function(d){return d.val;}));
  const first=rows[0].val, latest=rows[rows.length-1].val;
  const totalGain=Math.round((latest-first)*10)/10;
  const sessions=rows.length;

  // Simple trend: last 3 vs previous 3
  const trend=(function(){
    if(rows.length<4)return null;
    const recent=rows.slice(-3).reduce(function(a,r){return a+r.val;},0)/3;
    const prev=rows.slice(-6,-3).reduce(function(a,r){return a+r.val;},0)/Math.max(rows.slice(-6,-3).length,1);
    const diff=Math.round((recent-prev)*10)/10;
    return{diff:diff,dir:diff>1?'up':diff<-1?'down':'flat'};
  })();

  // AI analysis section
  const analysisHtml=(function(){
    if(S.chartAnalysisEx===S.selEx&&S.chartAnalysis){
      return '<div style="background:var(--s1);border:1px solid rgba(26,158,212,.25);border-radius:12px;padding:14px;margin-bottom:18px">'+
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'+
          '<div style="width:3px;height:14px;background:var(--blue);border-radius:2px"></div>'+
          '<span style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:.08em">COACH ANALYSIS</span>'+
        '</div>'+
        '<div style="font-size:13px;line-height:1.75;color:var(--white)">'+renderMd(S.chartAnalysis)+'</div>'+
      '</div>';
    }
    if(S.chartAnalysisLoading){
      return '<div style="background:var(--s1);border:1px solid rgba(26,158,212,.15);border-radius:12px;padding:14px;margin-bottom:18px;display:flex;align-items:center;gap:10px">'+
        '<div class="spinner" style="width:16px;height:16px;flex-shrink:0"></div>'+
        '<span style="font-size:12px;color:var(--muted)">Analyzing '+S.selEx+' progression...</span>'+
      '</div>';
    }
    return '<button onclick="requestChartAnalysis()" style="width:100%;background:var(--s1);border:1px solid var(--border2);border-radius:10px;padding:11px;font-size:12px;font-weight:700;color:var(--blue);cursor:pointer;font-family:inherit;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:6px">'+
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>'+
      'Analyze my '+S.selEx+' progress'+
    '</button>';
  })();

  const hist=rows.map(function(d){
    return '<div class="hist-row">'+
      '<span class="mono" style="font-size:11px;color:var(--muted)">'+d.date+'</span>'+
      '<span class="mono" style="font-size:11px">'+toDisp(d.tw)+' '+uLbl()+'&times;'+d.tr+'</span>'+
      '<span class="mono" style="font-size:11px;color:var(--blue)">e1RM '+toDisp(d.val)+'</span>'+
    '</div>';
  }).join('');

  return picker+
    // ── Stats row ──────────────────────────────────────
    '<div style="display:flex;gap:8px;margin-bottom:18px">'+
      '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:11px;text-align:center">'+
        '<div class="mono" style="font-size:20px;font-weight:700;color:var(--blue)">'+toDisp(peak)+'</div>'+
        '<div style="font-size:9px;color:var(--muted);margin-top:2px;letter-spacing:.06em">PEAK e1RM</div>'+
      '</div>'+
      '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:11px;text-align:center">'+
        '<div class="mono" style="font-size:20px;font-weight:700;color:'+(totalGain>=0?'#2DAA70':'#E05050')+'">'+(totalGain>=0?'+':'')+toDisp(totalGain)+'</div>'+
        '<div style="font-size:9px;color:var(--muted);margin-top:2px;letter-spacing:.06em">TOTAL GAIN</div>'+
      '</div>'+
      '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:11px;text-align:center">'+
        (trend?
          '<div class="mono" style="font-size:20px;font-weight:700;color:'+(trend.dir==='up'?'#2DAA70':trend.dir==='down'?'#E05050':'var(--muted)')+'">'+
            (trend.dir==='up'?'↑':trend.dir==='down'?'↓':'→')+
          '</div>':
          '<div class="mono" style="font-size:20px;font-weight:700;color:var(--muted)">—</div>')+
        '<div style="font-size:9px;color:var(--muted);margin-top:2px;letter-spacing:.06em">RECENT TREND</div>'+
      '</div>'+
      '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:11px;text-align:center">'+
        '<div class="mono" style="font-size:20px;font-weight:700;color:var(--white)">'+sessions+'</div>'+
        '<div style="font-size:9px;color:var(--muted);margin-top:2px;letter-spacing:.06em">SESSIONS</div>'+
      '</div>'+
    '</div>'+
    // ── Chart ──────────────────────────────────────────
    '<div class="tour-chart-target" style="height:160px;margin-bottom:18px"><canvas id="prog-chart"></canvas></div>'+
    // ── AI analysis ────────────────────────────────────
    analysisHtml+
    // ── History table ──────────────────────────────────
    '<span class="lbl" style="margin-bottom:8px">HISTORY</span>'+hist;
}

function drawChart(){
  if(S.progressTab!=='progress')return;
  const canvas=document.getElementById('prog-chart');if(!canvas)return;
  if(S.chart){S.chart.destroy();S.chart=null;}
  const rows=S.workouts.filter(function(w){return w.exercises.find(function(e){return e.name===S.selEx;});}).map(function(w){
    const ex=w.exercises.find(function(e){return e.name===S.selEx;});
    const ws=ex.sets.filter(function(s){return !s.warmup;});
    return ws.length?{date:fmtD(w.date),val:Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);}))}:null;
  }).filter(Boolean).reverse();
  if(!rows.length)return;
  S.chart=new Chart(canvas,{type:'line',
    data:{labels:rows.map(function(r){return r.date;}),datasets:[{data:rows.map(function(r){return r.val;}),borderColor:'#1A9ED4',backgroundColor:'rgba(26,158,212,0.08)',pointBackgroundColor:'#1A9ED4',pointRadius:4,tension:0.3,borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#fff',borderColor:'#C8DCF0',borderWidth:1,titleColor:'#5A84A0',bodyColor:'#0D1E2E',callbacks:{label:function(ctx){return 'e1RM: '+ctx.raw+uLbl();}}}},scales:{x:{grid:{color:'#EBF3FA'},ticks:{color:'#9AB8CC',font:{size:9}}},y:{grid:{color:'#EBF3FA'},ticks:{color:'#9AB8CC',font:{size:9}}}}}
  });
}

function calNav(dir){
  S.calMonth+=dir;
  if(S.calMonth>11){S.calMonth=0;S.calYear++;}
  if(S.calMonth<0){S.calMonth=11;S.calYear--;}
  S.selWorkout=null;S.newPastDate=null;S.newPastSplit=null;render();
}
function promptPastWorkout(dateStr){
  S.newPastDate=dateStr;
  S.newPastSplit=null;
  render();
}
function createPastWorkout(){
  if(!S.newPastDate||!S.newPastSplit)return;
  const exs=(S.splitEx[S.newPastSplit]||[]).map(function(name){return{name:name,sets:[],inputW:'135',inputR:'8'};});
  const w={date:new Date(S.newPastDate+'T12:00:00').toISOString(),split:S.newPastSplit,exercises:exs};
  // Insert in chronological order
  const ts=new Date(w.date).getTime();
  let idx=S.workouts.findIndex(function(x){return new Date(x.date).getTime()<ts;});
  if(idx===-1)idx=S.workouts.length;
  S.workouts.splice(idx,0,w);
  persist('ll_workouts',S.workouts);
  S.newPastDate=null;S.newPastSplit=null;
  S.selWorkout=idx;S.editPastMode=true;
  go('workout-detail');
}
function selCalWorkout(idx){
  S.selWorkout=idx;
  S.editPastMode=false;
  S.editPastExIdx=null;
  S.editPastSetIdx=null;
  go('workout-detail');
}
