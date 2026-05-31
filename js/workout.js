// Workout logging, active workout state, set logging, timers, and workout-related panels.

// ── REST TIMER ────────────────────────────────────────────────
var _timerInterval=null;
var _workoutTickInterval=null;
function startWorkoutTick(){
  if(_workoutTickInterval)return;
  _workoutTickInterval=setInterval(function(){
    if(S.view==='log'&&S.workout&&!S.workout.templateOnly)render();
  },60000);
}
function stopWorkoutTick(){clearInterval(_workoutTickInterval);_workoutTickInterval=null;}

// ── Exercise rest time classification ─────────────────────────
function getAutoRestSecs(exName){
  const n=(exName||'').toLowerCase();
  const heavy=['squat','deadlift','bench press','barbell row','overhead press','hack squat','leg press','hip thrust','romanian deadlift','pull-up','weighted'];
  const moderate=['incline','lat pulldown','seated row','machine row','cable row','dumbbell press','shoulder press','incline bench'];
  if(heavy.some(function(k){return n.includes(k);})) return 120;   // 2 min — heavy compounds
  if(moderate.some(function(k){return n.includes(k);})) return 90;  // 90s — moderate compounds
  return 60;                                                          // 60s — isolation
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
function requestNotifPermission(){
  if(!('Notification' in window))return;
  if(Notification.permission==='default')Notification.requestPermission();
}

function fireRestDoneNotif(){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  let nextEx='Next set';
  if(S.workout){
    const exs=S.workout.exercises;
    let curIdx=0;
    for(let i=0;i<exs.length;i++){if(exs[i].sets.length>0)curIdx=i;}
    const cur=exs[curIdx];
    if(cur)nextEx='Next: '+cur.name+' set '+(cur.sets.filter(function(s){return !s.warmup;}).length+1);
  }
  try{
    const n=new Notification('Rest done — time to go!',{
      body:nextEx,
      icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230D1E2E"/></svg>',
      tag:'forma-rest-timer',renotify:true,requireInteraction:false,silent:false
    });
    setTimeout(function(){n.close();},8000);
  }catch(e){}
}

// ── REST TIMER (timestamp-based — survives backgrounding) ──────
function startRestTimer(secs,exName){
  requestNotifPermission();
  if(_timerInterval) clearInterval(_timerInterval);
  const endTime=Date.now()+(secs*1000);
  S.restTimer={endTime:endTime,total:secs,_fired:false};
  localStorage.setItem('ll_rest_timer',JSON.stringify({endTime:endTime,total:secs}));
  _timerInterval=setInterval(_restTick,500);
  render();
}

function _restTick(){
  if(!S.restTimer){clearInterval(_timerInterval);return;}
  const remaining=Math.ceil((S.restTimer.endTime-Date.now())/1000);
  const el=document.getElementById('rest-timer');
  if(!el) return;
  const done=remaining<=0;
  const abs=Math.abs(remaining);
  const m=Math.floor(abs/60),s=abs%60;
  el.className='rest-timer'+(done?' done':'');
  el.querySelector('.rt-time').textContent=(done?'+':'')+m+':'+(s<10?'0':'')+s;
  el.querySelector('span').textContent=done?'GO! ':'REST ';
  if(done&&!S.restTimer._fired){
    S.restTimer._fired=true;
    if(navigator.vibrate) navigator.vibrate([300,100,300]);
    fireRestDoneNotif();
  }
  if(remaining<=-60) stopRestTimer();
}

function stopRestTimer(){
  if(_timerInterval) clearInterval(_timerInterval);
  _timerInterval=null;
  S.restTimer=null;
  localStorage.removeItem('ll_rest_timer');
  render();
}

// Restore timer on page load / tab focus
function resumeRestTimerIfActive(){
  const saved=localStorage.getItem('ll_rest_timer');
  if(!saved) return;
  try{
    const t=JSON.parse(saved);
    if(t.endTime>Date.now()-60000){
      S.restTimer={endTime:t.endTime,total:t.total,_fired:t.endTime<=Date.now()};
      if(_timerInterval) clearInterval(_timerInterval);
      _timerInterval=setInterval(_restTick,500);
    } else {
      localStorage.removeItem('ll_rest_timer');
    }
  }catch(e){localStorage.removeItem('ll_rest_timer');}
}

document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='visible'){
    resumeRestTimerIfActive();
    if(S.restTimer) _restTick();
  }
});

function vLog(){
  if(!S.workout)return '';
  const w=S.workout;
  const isTemplate=!!w.templateOnly;

  // AI coach panel (only shown during real workouts)
  const aiReply=S.inlineAIReply?'<div class="inline-ai-reply">'+renderMd(S.inlineAIReply)+'</div>':'';
  const aiLoading=S.inlineAILoading?'<div style="padding:4px 0 10px;display:flex;gap:3px;align-items:center"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>':'';
  const inlineAI=isTemplate?'':
    '<div class="inline-ai">'+
      '<div class="inline-ai-hdr">'+
        '<div style="width:3px;height:14px;background:var(--blue);border-radius:2px"></div>'+
        '<span style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:.07em">AI COACH</span>'+
        '<span style="font-size:10px;color:var(--muted)"> &mdash; ask anything or get a recommendation</span>'+
      '</div>'+
      aiReply+aiLoading+
      '<button onclick="sendRecommend()" '+(S.inlineAILoading?'disabled':'')+' style="width:100%;background:var(--s2);border:1px solid var(--border2);color:var(--blue);border-radius:8px;padding:9px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:10px;opacity:'+(S.inlineAILoading?.5:1)+'">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'+
        'What should I do next?'+
      '</button>'+
      '<div class="inline-ai-row">'+
        '<button id="inline-vbtn" class="sm-vc-btn'+(S.inlineAIListening?' on':'')+'" onclick="toggleInlineVoice()">'+
          (S.inlineAIListening?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>')+
        '</button>'+
        '<textarea id="inline-ta" class="inline-ta" rows="1" placeholder="Message AI coach&hellip;" '+
          'oninput="autoResI(this);S.inlineAIDraft=this.value" '+
          'onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();sendInlineAI()}">'+escH(S.inlineAIDraft)+'</textarea>'+
        '<button class="sm-send-btn" onclick="sendInlineAI()" '+(S.inlineAILoading?'disabled':'')+'>&#8593;</button>'+
      '</div>'+
    '</div>';

  // Exercise cards
  const exCards=w.exercises.map(function(ex,i){
    // Defensive guard — skip any malformed exercise object to prevent crashes
    if(!ex||typeof ex.name!=='string'){return '';}
    if(!Array.isArray(ex.sets)){ex.sets=[];}
    const last=getLastSession(ex.name);
    const isL=S.setVoiceIdx===i;
    const isEditing=S.editingExIdx===i;

    const canUp=i>0;
    const canDown=i<w.exercises.length-1;

    const isCardio=isCardioEx(ex.name)||isCardioSplit(w.split);
    const cm=isCardio?cardioMetrics(ex.name):null;
    const showM2=isCardio?(ex.trackM2===true):false; // default: time only

    // ── Logged sets / sessions ─────────────────
    const setsHtml=ex.sets.length?
      (isCardio?
        // Cardio: clean session rows
        '<div style="margin-bottom:12px">'+
          ex.sets.map(function(s,si){
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--dim)">'+
              '<span style="font-size:11px;color:var(--sub)">Session '+(si+1)+'</span>'+
              '<div style="display:flex;align-items:center;gap:12px">'+
                '<span style="font-size:14px;font-weight:700;color:var(--white)" class="mono">'+s.w+'<span style="font-size:10px;font-weight:400;color:var(--sub);margin-left:2px">min</span></span>'+
                (showM2&&s.r?'<span style="font-size:14px;font-weight:700;color:var(--blue)" class="mono">'+s.r+'<span style="font-size:10px;font-weight:400;color:var(--sub);margin-left:2px">'+cm.m2.toLowerCase()+'</span></span>':'')+ 
              '</div>'+
              '<button style="background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:0 4px;line-height:1" onclick="delSet('+i+','+si+')">&#215;</button>'+
            '</div>';
          }).join('')+
        '</div>':
        // Strength: clean set rows
        '<div style="margin-bottom:12px">'+
          ex.sets.map(function(s,si){
            const e=e1rm(toKg(s.w),s.r);
            const prevBest=si>0?Math.max.apply(null,ex.sets.slice(0,si).map(function(ps){return e1rm(toKg(ps.w),ps.r);})):0;
            const isPR=last&&e>last.e1||(!last&&si>0&&e>prevBest);
            return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--dim)">'+
              '<div style="display:flex;align-items:center;gap:6px">'+
                '<button onclick="toggleSetWarmup('+i+','+si+')" title="Toggle warm-up" style="background:none;border:none;padding:0;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px">'+
                  '<span style="font-size:11px;color:'+(s.warmup?'#E8693A':'var(--sub)')+';font-family:\'Courier New\',monospace">#'+(si+1)+'</span>'+
                  (s.warmup?'<span style="font-size:9px;font-weight:700;color:#E8693A;background:#E8693A18;border:1px solid #E8693A44;padding:1px 5px;border-radius:4px">WU</span>':
                   '<span style="font-size:9px;color:var(--dim);border:1px dashed var(--dim);padding:1px 5px;border-radius:4px;opacity:.5">WU</span>')+
                '</button>'+
              '</div>'+
              (s.w===0?'<span style="font-size:14px;font-weight:700;color:var(--white);font-family:\'Courier New\',monospace">BW <span style="font-size:10px;font-weight:400;color:var(--sub)">&times; '+s.r+'</span></span>':'<span style="font-size:14px;font-weight:700;color:var(--white);font-family:\'Courier New\',monospace">'+toDisp(s.w)+'<span style="font-size:10px;font-weight:400;color:var(--sub)"> '+uLbl()+'</span> &times; '+s.r+'</span>')+
              '<div style="display:flex;align-items:center;gap:6px">'+
                (isPR&&!s.warmup?'<span style="font-size:9px;font-weight:800;color:#2DAA70;background:rgba(45,170,112,.1);border:1px solid rgba(45,170,112,.3);padding:1px 5px;border-radius:4px">PR</span>':'')+
                '<button style="background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:0 4px;line-height:1" onclick="delSet('+i+','+si+')">&#215;</button>'+
              '</div>'+
            '</div>';
          }).join('')+
        '</div>')
      :'';

    // ── Last session display ───────────────────
    const lastHtml=last?
      '<div class="ex-last" onclick="S.exHistoryPanel=\''+ex.name+'\';render()" style="cursor:pointer;text-decoration:none;text-align:right" title="Tap to see full history">'+
        '<span style="color:var(--muted);font-size:9px">'+last.date+'</span><br>'+
        (isCardio?
          '<span class="mono" style="font-size:11px">'+last.w+' min</span>':
          '<span class="mono" style="font-size:11px">'+toDisp(last.w)+' '+uLbl()+'&times;'+last.r+'</span>')+
        '<div style="font-size:8px;color:var(--blue);margin-top:1px;letter-spacing:.04em">HISTORY ›</div>'+
      '</div>':
      '<div onclick="S.exHistoryPanel=\''+ex.name+'\';render()" style="font-size:10px;color:var(--muted);font-style:italic;flex-shrink:0;cursor:pointer;white-space:nowrap">first time</div>';

    // ── Activity type picker (cardio only) ─────
    const cardioTypePicker='';

    // ── Metric toggle (time only vs time+distance) ─
    const metricToggle=isCardio?
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'+
        '<span style="font-size:11px;color:var(--sub)">Track:</span>'+
        '<button onclick="toggleM2('+i+')" style="background:'+(!showM2?'var(--blue)':'var(--s1)')+';color:'+(!showM2?'#fff':'var(--muted)')+';border:1px solid '+(!showM2?'var(--blue)':'var(--border)')+';border-radius:14px;padding:5px 13px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:'+(!showM2?700:400)+'">'+
          'Time only'+
        '</button>'+
        '<button onclick="toggleM2('+i+')" style="background:'+(showM2?'var(--blue)':'var(--s1)')+';color:'+(showM2?'#fff':'var(--muted)')+';border:1px solid '+(showM2?'var(--blue)':'var(--border)')+';border-radius:14px;padding:5px 13px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:'+(showM2?700:400)+'">'+
          'Time + '+(cm?cm.m2:'dist')+
        '</button>'+
      '</div>':'';

    // ── Inputs ─────────────────────────────────
    const inputsHtml=isCardio?
      '<div class="ex-inputs">'+
        '<div style="flex:1;min-width:0">'+
          '<span class="lbl">'+cm.m1+' — Duration</span>'+
          '<div class="num-row">'+
            '<button onclick="nudgeW('+i+',-5)">&minus;</button>'+
            '<input id="w'+i+'" type="number" value="'+ex.inputW+'" oninput="syncW('+i+',this.value)" placeholder="0">'+
            '<button onclick="nudgeW('+i+',5)">+</button>'+
          '</div>'+
        '</div>'+
        (showM2?
          '<div style="flex:1;min-width:0">'+
            '<span class="lbl">'+cm.m2+' — Distance</span>'+
            '<div class="num-row">'+
              '<button onclick="nudgeR('+i+',-1)">&minus;</button>'+
              '<input id="r'+i+'" type="number" value="'+ex.inputR+'" oninput="syncR('+i+',this.value)" placeholder="0">'+
              '<button onclick="nudgeR('+i+',1)">+</button>'+
            '</div>'+
          '</div>':
          '<input id="r'+i+'" type="hidden" value="0">')+
      '</div>':
      '<div class="ex-inputs">'+
        (function(){
          const sug=!isCardio?getOverloadSuggestion(ex.name,ex.inputW):null;
          const sugChip=sug?(function(){
            const currentDisp=parseFloat(ex.inputW)||0;
            let badge='';
            if(sug.action==='add_weight'&&sug.weightDisp>currentDisp){
              badge='<button onclick="applyOverloadSug('+i+','+sug.weightDisp+')" style="display:inline-flex;align-items:center;gap:2px;background:rgba(26,158,212,.12);border:1px solid rgba(26,158,212,.35);border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;color:var(--blue);cursor:pointer;font-family:inherit;line-height:1">'+
                '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'+
                sug.weightDisp+
              '</button>';
            }else if(sug.action==='reduce_weight'&&sug.weightDisp<currentDisp){
              badge='<button onclick="applyOverloadSug('+i+','+sug.weightDisp+')" style="display:inline-flex;align-items:center;gap:2px;background:rgba(26,158,212,.12);border:1px solid rgba(26,158,212,.35);border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;color:var(--blue);cursor:pointer;font-family:inherit;line-height:1">'+
                '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>'+
                sug.weightDisp+
              '</button>';
            }else if(sug.action==='add_reps'&&sug.repTarget){
              badge='<span style="display:inline-flex;align-items:center;gap:2px;background:rgba(26,158,212,.10);border:1px solid rgba(26,158,212,.28);border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;color:var(--blue);font-family:inherit;line-height:1">'+sug.repTarget+' reps</span>';
            }else if(sug.action==='hold_weight'||sug.action==='recovery'){
              badge='<span style="display:inline-flex;align-items:center;gap:2px;background:rgba(26,158,212,.08);border:1px solid rgba(26,158,212,.22);border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;color:var(--blue);font-family:inherit;line-height:1">hold</span>';
            }
            if(!badge&&sug.action!=='add_weight'&&sug.action!=='reduce_weight'&&sug.action!=='add_reps'&&sug.action!=='hold_weight'&&sug.action!=='recovery')return '';
            return badge?
            '<span style="display:inline-flex;align-items:center;gap:3px;margin-left:6px;position:relative">'+
              badge+
              '<button onclick="S.sugTooltip=(S.sugTooltip===\''+i+'\'?null:\''+i+'\');render();setTimeout(function(){var el=document.getElementById(\'sugtip-'+i+'\');if(el){var r=el.getBoundingClientRect();if(r.right>window.innerWidth)el.style.left=\'auto\',el.style.right=\'0\';}},0)" style="width:14px;height:14px;border-radius:50%;background:var(--s2);border:1px solid var(--border);color:var(--muted);font-size:8px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;padding:0;font-family:inherit">?</button>'+
              (S.sugTooltip===String(i)?
                '<div id="sugtip-'+i+'" style="position:absolute;top:20px;left:0;z-index:99;width:200px;background:var(--s1);border:1px solid rgba(26,158,212,.3);border-radius:8px;padding:9px 11px;font-size:11px;line-height:1.55;color:var(--sub);box-shadow:0 4px 16px rgba(0,0,0,.3)">'+sug.detail+'</div>':
                '')+
            '</span>':'';
          })():
          '';
          return '<div style="flex:1;min-width:0">'+
            '<div style="display:flex;align-items:center;height:18px;margin-bottom:5px">'+
              '<span class="lbl" style="margin-bottom:0;line-height:1">'+uLbl().toUpperCase()+'</span>'+
              sugChip+
            '</div>'+
            '<div class="num-row">'+
              '<button onclick="nudgeW('+i+',-'+step()+')">&minus;</button>'+
              '<input id="w'+i+'" type="number" value="'+ex.inputW+'" oninput="syncW('+i+',this.value)" onchange="previewE1('+i+')">'+
              '<button onclick="nudgeW('+i+','+step()+')">+</button>'+
            '</div>'+
            // ── Plate calculator — barbell exercises only ──
            (isBarbell(ex.name)&&parseFloat(ex.inputW)>0?(function(){
              try{
                return plateHtml(parseFloat(ex.inputW));
              }catch(e){return '';}
            })():'')+'</div>';
        })()+
        '<div style="flex:1;min-width:0">'+
          '<div style="height:18px;margin-bottom:5px;display:flex;align-items:center">'+
            '<span class="lbl" style="margin-bottom:0;line-height:1">REPS</span>'+
          '</div>'+
          '<div class="num-row">'+
            '<button onclick="nudgeR('+i+',-1)">&minus;</button>'+
            '<input id="r'+i+'" type="number" value="'+ex.inputR+'" oninput="syncR('+i+',this.value)" onchange="previewE1('+i+')">'+
            '<button onclick="nudgeR('+i+',1)">+</button>'+
          '</div>'+
        '</div>'+
      '</div>';

    // ── Card header ─────────────────────────────
    const isDragging=S.dragIdx===i;
    const isDragOver=S.dragOverIdx===i&&S.dragIdx!==i;
    const hdr=isEditing?
      '<div style="margin-bottom:12px">'+
        '<input id="ex-edit-'+i+'" style="width:100%;background:var(--s2);border:1.5px solid var(--blue);border-radius:8px;padding:9px 12px;font-size:15px;font-weight:700;color:var(--white);outline:none;font-family:inherit" value="'+ex.name+'" '+
          'onkeydown="if(event.key===\'Enter\')saveExEdit('+i+');if(event.key===\'Escape\')cancelExEdit()">'+
        '<div style="display:flex;gap:6px;margin-top:8px">'+
          '<button onclick="cancelExEdit()" style="flex:1;background:var(--bg);border:1px solid var(--border);color:var(--sub);border-radius:7px;padding:8px;font-size:12px;cursor:pointer;font-family:inherit">Cancel</button>'+
          '<button onclick="saveExEdit('+i+')" style="flex:2;background:var(--blue);color:#fff;border:none;border-radius:7px;padding:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Save</button>'+
        '</div>'+
      '</div>':
      // ── Normal header: drag · name+? · [last | ✎ · ×] ───────
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'+
        // Drag grip
        '<button class="drag-handle" id="dh-'+i+'" draggable="true" ondragstart="exDragStart(event,'+i+')" ondragend="exDragEnd(event)" ontouchstart="exTouchStart(event,'+i+')" title="Drag to reorder" style="flex-shrink:0">&#8942;&#8942;</button>'+
        // Name + ? button + pencil rename
        '<div style="flex:1;min-width:0">'+
          '<div style="display:flex;align-items:center;gap:5px">'+
            '<div style="font-weight:700;font-size:15px;color:var(--white);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3">'+ex.name+'</div>'+
            '<button onclick="showExInstruct(\''+ex.name.replace(/'/g,"\\'")+'\')" title="How to perform" style="width:17px;height:17px;border-radius:50%;background:var(--s2);border:1px solid var(--border);color:var(--blue);font-size:9px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;padding:0">?</button>'+
            '<button onclick="startExEdit('+i+')" title="Rename exercise" style="width:20px;height:20px;border-radius:5px;background:none;border:none;color:var(--muted);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;opacity:.6">&#9999;</button>'+            '<button onclick="toggleSubstitutions('+i+')" title="Show substitutions" style="width:20px;height:20px;border-radius:5px;background:none;border:none;color:var(--muted);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;opacity:.65">&#8644;</button>'+
          '</div>'+
        '</div>'+
        // Right cluster: last session info · remove
        '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0">'+
          lastHtml+
          '<button onclick="removeExFromWorkout('+i+')" title="Remove" style="width:26px;height:26px;border-radius:7px;background:#FEE8E8;border:1px solid #FCC;color:#C44;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;padding:0">&#215;</button>'+
        '</div>'+
      '</div>';

    const subPanel=(S.substituteIdx===i&&!isEditing)?(function(){
      const subs=getExerciseSubstitutions(ex.name).filter(function(o){return o&&o.name&&o.name!==ex.name;}).slice(0,3);
      return '<div class="tour-swap-target" style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:10px;margin:-4px 0 12px">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">'+
          '<div>'+
            '<div style="font-size:10px;color:var(--sub);letter-spacing:.08em;font-weight:700;text-transform:uppercase">AI-ranked swaps</div>'+
            '<div style="font-size:10px;color:var(--muted);line-height:1.35;margin-top:2px">Same muscle and movement pattern where possible.</div>'+
          '</div>'+
          '<button onclick="S.substituteIdx=null;render()" style="background:none;border:none;color:var(--muted);font-size:14px;line-height:1;cursor:pointer;padding:0">&#215;</button>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:6px">'+
          subs.map(function(o){
            const safeName=o.name.replace(/\'/g,"\\'");
            if(o.name==='Ask AI Coach'){
              return '<button onclick="S.inlineAIDraft=\'Suggest a replacement for '+ex.name.replace(/\'/g,"\\'")+' that fits today\\\'s '+String(S.workout&&S.workout.split||'workout').replace(/\'/g,"\\'")+' workout and hits the same muscle/angle.\';S.substituteIdx=null;render()" style="text-align:left;background:var(--s1);border:1px solid var(--border);color:var(--white);border-radius:10px;padding:9px 10px;font-size:11px;cursor:pointer;font-family:inherit">'+
                '<div style="font-weight:800;color:var(--blue);margin-bottom:2px">Ask AI Coach</div>'+
                '<div style="font-size:10px;color:var(--muted);line-height:1.35">'+escH(o.reason)+'</div>'+
              '</button>';
            }
            return '<button onclick="replaceExerciseWith('+i+',\''+safeName+'\')" style="text-align:left;background:var(--s1);border:1px solid var(--border);color:var(--white);border-radius:10px;padding:9px 10px;font-size:11px;cursor:pointer;font-family:inherit">'+
              '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px">'+
                '<span style="font-weight:800;color:var(--white)">'+escH(o.name)+'</span>'+
                '<span style="font-size:9px;color:var(--blue);background:rgba(26,158,212,.08);border:1px solid rgba(26,158,212,.18);border-radius:12px;padding:2px 6px;white-space:nowrap">'+escH(o.muscle)+'</span>'+
              '</div>'+
              '<div style="font-size:10px;color:var(--sub);line-height:1.35;margin-bottom:2px">'+escH(o.pattern)+'</div>'+
              '<div style="font-size:10px;color:var(--muted);line-height:1.35">'+escH(o.reason)+'</div>'+
            '</button>';
          }).join('')+
        '</div>'+
      '</div>';
    })():'';

    return '<div class="ex-card'+(isEditing?' editing':'')+(isDragging?' dragging':'')+(isDragOver?' drag-over':'')+'" '+
      'id="ex-card-'+i+'" '+
      'ondragover="exDragOver(event,'+i+')" '+
      'ondrop="exDrop(event,'+i+')" '+
      'ontouchmove="exTouchMove(event)" '+
      'ontouchend="exTouchEnd(event)">'+
      hdr+
      subPanel+
      (isTemplate?'':metricToggle)+
      setsHtml+
      (isTemplate?'':inputsHtml)+
      // ── LOG SET — hidden in template mode ────────────────────
      (isTemplate?'':
        // ── LOG SET row: [🎙 WU] [    LOG SET    ] ───────────────
        '<div style="display:flex;gap:6px;margin-bottom:'+(ex.sets.length>0&&!isCardio?'6':'0')+'px">'+
          '<button id="vbtn'+i+'" class="voice-btn'+(isL?' on':'')+'" onclick="toggleSetVoice('+i+')" title="Voice input" style="flex:0 0 auto;width:42px;padding:0;display:flex;align-items:center;justify-content:center">'+
            (isL?'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>')+
          '</button>'+
          (isCardio?'':
            '<button onclick="toggleWarmup('+i+')" title="Mark as warm-up set" style="flex:0 0 auto;width:42px;background:'+(ex.nextIsWarmup?'#E8693A18':'none')+';color:'+(ex.nextIsWarmup?'#E8693A':'var(--muted)')+';border:1px solid '+(ex.nextIsWarmup?'#E8693A55':'var(--border)')+';border-radius:8px;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center">WU</button>')+
          '<button class="log-btn" onclick="logSet('+i+')" style="flex:1;margin:0">'+(isCardio?'LOG SESSION':'LOG SET')+'</button>'+
        '</div>'+
        // ── Rest timers — only shown after first set ─────────────
        (ex.sets.length>0&&!isCardio?
          '<div style="display:flex;gap:5px">'+
            '<span style="font-size:10px;color:var(--muted);display:flex;align-items:center;padding:0 4px;flex-shrink:0">Rest:</span>'+
            '<button onclick="startRestTimer(60)" style="flex:1;background:none;border:1px solid var(--dim);color:var(--muted);border-radius:8px;padding:7px 4px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit">1m</button>'+
            '<button onclick="startRestTimer(90)" style="flex:1;background:none;border:1px solid var(--dim);color:var(--muted);border-radius:8px;padding:7px 4px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit">90s</button>'+
            '<button onclick="startRestTimer(120)" style="flex:1;background:none;border:1px solid var(--dim);color:var(--muted);border-radius:8px;padding:7px 4px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit">2m</button>'+
            '<button onclick="startRestTimer(180)" style="flex:1;background:none;border:1px solid var(--dim);color:var(--muted);border-radius:8px;padding:7px 4px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit">3m</button>'+
          '</div>':
          ''))+
    '</div>';
  }).join('');

  // For cardio splits, show cardio exercise options in the add panel
  const addPanel=S.addingEx?
    '<div class="card">'+
      '<span class="lbl">ADD EXERCISE</span>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">'+
        (isCardioSplit(w.split)?CARDIO_EX_OPTIONS:ALL_EX).filter(function(e){return!w.exercises.find(function(ae){return ae.name===e;});})
          .map(function(e){return '<button class="tag" onclick="addEx(\''+e.replace(/'/g,"\\'")+'\')" style="font-size:11px">'+e+'</button>';})
          .join('')+
      '</div>'+
      '<div style="display:flex;gap:6px">'+
        '<input id="cex" style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:9px 12px;font-size:12px;color:var(--white);outline:none;font-family:inherit" placeholder="Custom exercise&hellip;" onkeydown="if(event.key===\'Enter\')customEx()">'+
        '<button onclick="customEx()" style="background:var(--blue);color:#fff;border-radius:6px;padding:9px 14px;font-weight:800;font-size:11px;cursor:pointer;font-family:inherit;border:none">ADD</button>'+
        '<button onclick="toggleAddEx()" style="background:none;border:1px solid var(--border);color:var(--sub);border-radius:6px;padding:9px;font-size:11px;cursor:pointer">&#10005;</button>'+
      '</div>'+
    '</div>':
    '<button class="btn-dashed" onclick="toggleAddEx()">+ add exercise</button>';

  const anyLogged=w.exercises.some(function(e){return e.sets.length>0;});

  // ── Exercise history panel ─────────────────────────────────
  const histPanel=S.exHistoryPanel?vExHistoryPanel(S.exHistoryPanel):'';
  const instructPanel=S.exInstructPanel?vExInstructPanel():'';

  return (isTemplate?
    // ── Template edit header ──────────────────────────────────
    '<div style="background:var(--white);border-radius:16px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">'+
      '<div>'+
        '<div style="font-size:9px;color:#5A84A0;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">EDITING TEMPLATE</div>'+
        '<div style="font-size:15px;font-weight:700;color:#fff;line-height:1">'+spLbl(w.split)+' Day</div>'+
      '</div>'+
      '<button onclick="saveTemplate()" style="background:#2DAA70;color:#fff;border:none;border-radius:9px;padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em">Save &amp; Close</button>'+
    '</div>':
    // ── Active workout header ─────────────────────────────────
    (function(){
      const elapsedMs=S.workoutStartTime?Date.now()-S.workoutStartTime:0;
      const elapsedMin=Math.floor(elapsedMs/60000);
      const elapsedStr=elapsedMin>=60?(Math.floor(elapsedMin/60)+'h '+(elapsedMin%60)+'m'):(elapsedMin+'m');
      return '<div style="background:var(--white);border-radius:16px;padding:12px 14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between">'+
        '<div>'+
          '<div style="font-size:9px;color:#5A84A0;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">'+spLbl(w.split).toUpperCase()+' DAY · '+fmtD(w.date).toUpperCase()+'</div>'+
          '<div style="display:flex;align-items:center;gap:8px">'+
            '<div style="font-size:15px;font-weight:700;color:#fff;line-height:1">In progress</div>'+
            (S.workoutStartTime&&elapsedMin>0?'<div style="font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums">'+elapsedStr+'</div>':'')+
          '</div>'+
        '</div>'+
        (anyLogged?
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'+
            '<button onclick="finishWorkout()" style="background:var(--blue);color:#fff;border:none;border-radius:9px;padding:7px 14px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:.02em">Finish →</button>'+
            '<button onclick="cancelWorkout()" style="background:none;border:none;color:#8892b0;font-size:10px;cursor:pointer;font-family:inherit;padding:0;letter-spacing:.02em;opacity:.7">✕ Cancel workout</button>'+
          '</div>':
          '<button onclick="cancelWorkout()" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#8892b0;border-radius:9px;padding:7px 14px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:.02em">✕ Cancel</button>')+
      '</div>';
    })())+

  // ── Progress strip (hidden in template mode) ──────────────────
  (isTemplate?'':
    '<div style="display:flex;gap:4px;margin-bottom:10px">'+
      w.exercises.map(function(ex,idx){
        const hasSets=ex.sets.filter(function(s){return !s.warmup;}).length>0;
        const isActive=idx===w.exercises.findIndex(function(e){return e.sets.filter(function(s){return !s.warmup;}).length===0;});
        return '<div style="flex:1;height:4px;border-radius:2px;background:'+(hasSets?'var(--blue)':isActive?'rgba(26,158,212,.35)':'var(--border)')+'"></div>';
      }).join('')+
    '</div>')+

  inlineAI+
  exCards+
  addPanel+
  '<div style="height:calc(24px + env(safe-area-inset-bottom))"></div>'+
  histPanel+
  instructPanel;
}

function vExHistoryPanel(name){
  // Collect all history for this exercise
  const history=[];
  S.workouts.forEach(function(w){
    w.exercises.forEach(function(ex){
      if(ex.name!==name)return;
      const allSets=ex.sets.filter(function(s){return (s.w>0||s.r>0);});
      const workSets=allSets.filter(function(s){return !s.warmup;});
      // Keep sessions visible even if they contain warm-up sets. PR/top-set calculations still ignore warm-ups.
      const bestSet=workSets.length?workSets.reduce(function(b,s){return e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b;},workSets[0]):null;
      history.push({date:w.date,sets:allSets,workSets:workSets,bestSet:bestSet,e1:bestSet?e1rm(bestSet.w,bestSet.r):0});
    });
  });

  const isCardio=isCardioEx(name);
  const allTimeMax=history.length?Math.max.apply(null,history.map(function(h){return h.e1;})):0;

  return '<div style="position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;justify-content:flex-end" onclick="S.exHistoryPanel=null;render()">'+
    '<div ontouchstart="sheetTouchStart(event)" ontouchmove="sheetTouchMove(event)" ontouchend="sheetTouchEnd(\'exHistory\')" onclick="event.stopPropagation()" style="background:var(--s1);border-radius:20px 20px 0 0;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 -4px 30px rgba(0,0,0,.15)">'+

      // Handle bar
      '<div style="display:flex;justify-content:center;padding:10px 0 0">'+
        '<div style="width:36px;height:4px;background:var(--border);border-radius:2px"></div>'+
      '</div>'+

      // Header
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px 10px">'+
        '<div>'+
          '<div style="font-size:17px;font-weight:700;color:var(--white);letter-spacing:-.3px">'+name+'</div>'+
          '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+history.length+' session'+(history.length!==1?'s':'')+' logged</div>'+
        '</div>'+
        (allTimeMax>0?'<div style="text-align:right">'+
          '<div style="font-size:11px;color:var(--muted);margin-bottom:2px">All-time best</div>'+
          '<div style="font-size:18px;font-weight:700;color:var(--blue);font-family:\'Courier New\',monospace">'+toDisp(allTimeMax)+' <span style="font-size:11px;font-weight:400">'+uLbl()+'</span></div>'+
        '</div>':'')+
      '</div>'+

      // Session list
      '<div data-sheet-scroll="1" style="overflow-y:auto;padding:0 18px 24px;flex:1">'+
        (history.length?
          history.map(function(h,hi){
            const isPR=h.e1===allTimeMax&&allTimeMax>0;
            return '<div style="padding:12px 0;border-bottom:1px solid var(--border)">'+
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">'+
                '<div style="font-size:12px;font-weight:600;color:var(--sub)">'+fmtD(h.date)+'</div>'+
                (isPR&&hi===history.findIndex(function(x){return x.e1===allTimeMax;})?
                  '<div style="background:var(--blue);color:#fff;border-radius:4px;padding:2px 7px;font-size:9px;font-weight:700;letter-spacing:.04em">PR</div>':'')+ 
              '</div>'+
              '<div style="display:flex;flex-direction:column;gap:4px">'+
                h.sets.map(function(s,si){
                  const isTopSet=s===h.bestSet;
                  const isWU=!!s.warmup;
                  const workIdx=h.sets.slice(0,si).filter(function(x){return !x.warmup;}).length;
                  const label=isWU?'Warm-up':'Set '+(workIdx+1);
                  return '<div style="display:flex;align-items:center;justify-content:space-between;opacity:'+(isWU?0.72:1)+'">'+
                    '<span style="font-size:10px;font-weight:700;letter-spacing:.04em;color:'+(isWU?'#E8693A':'var(--muted)')+';background:'+(isWU?'#E8693A18':'transparent')+';border:'+(isWU?'1px solid #E8693A44':'1px solid transparent')+';border-radius:999px;padding:'+(isWU?'2px 7px':'2px 0')+';min-width:'+(isWU?'68px':'50px')+';text-align:'+(isWU?'center':'left')+'">'+label+'</span>'+
                    '<div style="display:flex;align-items:center;gap:10px">'+
                      '<span style="font-size:'+(isWU?'12px':'14px')+';font-weight:'+(isTopSet?700:isWU?400:500)+';color:'+(isTopSet?'var(--white)':'var(--sub)')+';font-family:\'Courier New\',monospace">'+
                        (isCardio?s.w+' min':toDisp(s.w)+' '+uLbl()+' × '+s.r)+
                      '</span>'+
                      (isTopSet&&!isCardio?'<span style="font-size:11px;color:var(--blue);font-family:\'Courier New\',monospace">'+toDisp(e1rm(s.w,s.r))+'</span>':'')+
                    '</div>'+
                  '</div>';
                }).join('')+
              '</div>'+
            '</div>';
          }).join(''):
          '<div style="text-align:center;padding:40px 0;color:var(--muted);font-size:13px">No history yet for '+name+'.</div>'
        )+
      '</div>'+

    '</div>'+
  '</div>';
}

function vExInstructPanel(){
  const name=S.exInstructPanel;
  return '<div style="position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;justify-content:flex-end" onclick="S.exInstructPanel=null;S.exInstructText=null;S.exInstructChat=[];render()">'+
    '<div ontouchstart="sheetTouchStart(event)" ontouchmove="sheetTouchMove(event)" ontouchend="sheetTouchEnd(\'exInstruct\')" onclick="event.stopPropagation()" style="background:var(--s1);border-radius:20px 20px 0 0;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 -4px 30px rgba(0,0,0,.15)">'+
      // Handle
      '<div style="display:flex;justify-content:center;padding:10px 0 0">'+
        '<div style="width:36px;height:4px;background:var(--border);border-radius:2px"></div>'+
      '</div>'+
      // Header
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px 12px">'+
        '<div>'+
          '<div style="font-size:17px;font-weight:700;color:var(--white);letter-spacing:-.3px">'+name+'</div>'+
          '<div style="font-size:11px;color:var(--muted);margin-top:2px">How to perform correctly</div>'+
        '</div>'+
        '<div style="width:32px;height:32px;background:var(--s2);border-radius:50%;display:flex;align-items:center;justify-content:center">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'+
        '</div>'+
      '</div>'+
      // Scrollable content area
      '<div id="ex-instruct-scroll" data-sheet-scroll="1" style="overflow-y:auto;padding:0 18px 12px;flex:1">'+
        (S.exInstructLoading?
          '<div style="display:flex;justify-content:center;padding:40px 0;gap:8px">'+
            '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'+
          '</div>':
          S.exInstructText?
            '<div style="font-size:13px;line-height:1.7;color:var(--white)">'+renderMd(S.exInstructText)+'</div>':
            '<div style="color:var(--muted);text-align:center;padding:40px 0">Could not load instructions.</div>'
        )+
        // Q&A thread
        (S.exInstructChat.length?
          '<div style="margin-top:16px;border-top:1px solid var(--border);padding-top:14px;display:flex;flex-direction:column;gap:10px">'+
            S.exInstructChat.map(function(m){
              const isUser=m.role==='user';
              return '<div style="display:flex;flex-direction:column;align-items:'+(isUser?'flex-end':'flex-start')+'">'+
                '<div style="max-width:88%;background:'+(isUser?'var(--blue)':'var(--s2)')+';border-radius:'+(isUser?'12px 12px 3px 12px':'12px 12px 12px 3px')+';padding:9px 13px">'+
                  '<div style="font-size:13px;line-height:1.55;color:'+(isUser?'#fff':'var(--white)')+'">'+
                    (isUser?escH(m.text):renderMd(m.text))+
                  '</div>'+
                '</div>'+
              '</div>';
            }).join('')+
            (S.exInstructChatLoading?
              '<div style="display:flex;align-items:flex-start"><div style="background:var(--s2);border-radius:12px 12px 12px 3px;padding:10px 14px;display:flex;gap:5px"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div>':
              '')+
          '</div>':'')+ 
      '</div>'+
      // Chat input — pinned to bottom
      '<div style="padding:10px 14px calc(10px + env(safe-area-inset-bottom));border-top:1px solid var(--border);background:var(--s1);display:flex;gap:8px;align-items:center">'+
        '<input id="ex-instruct-input" type="text" placeholder="Ask a question about this exercise…" '+
          'value="'+escH(S.exInstructDraft)+'" '+
          'oninput="S.exInstructDraft=this.value" '+
          'onkeydown="if(event.key===\'Enter\')sendExInstructChat()" '+
          'style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:22px;padding:9px 14px;font-size:13px;color:var(--white);outline:none;font-family:inherit">'+
        '<button onclick="sendExInstructChat()" '+(S.exInstructChatLoading?'disabled':'')+
          ' style="width:38px;height:38px;border-radius:50%;background:'+(S.exInstructChatLoading?'var(--s2)':'var(--blue)')+';border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0">'+
          (S.exInstructChatLoading?
            '<div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border);border-top-color:var(--blue);animation:spin 1s linear infinite"></div>':
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>')+
        '</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}





function vFeedback(){
  const w=S.lastWorkout||S.workout;
  if(!w)return '';
  const sm=S.workoutSummary||{};

  // ── Stats row ─────────────────────────────────────────────
  const statsRow=(function(){
    const items=[];
    if(sm.durationMin) items.push({val:sm.durationMin+'m',lbl:'DURATION'});
    if(sm.totalSets)   items.push({val:sm.totalSets,lbl:'SETS'});
    if(sm.totalVol)    items.push({val:sm.totalVol.toLocaleString(),lbl:'LBS MOVED'});
    if(!items.length)return '';
    return '<div style="display:flex;gap:8px;margin-bottom:14px">'+
      items.map(function(it){
        return '<div style="flex:1;background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:11px;text-align:center">'+
          '<div style="font-size:22px;font-weight:700;color:var(--blue);letter-spacing:-0.5px;line-height:1">'+it.val+'</div>'+
          '<div style="font-size:9px;color:var(--muted);margin-top:3px;letter-spacing:.06em">'+it.lbl+'</div>'+
        '</div>';
      }).join('')+
    '</div>';
  })();

  // ── PRs ───────────────────────────────────────────────────
  const prRow=(sm.prs&&sm.prs.length)?
    '<div style="background:linear-gradient(135deg,rgba(45,170,112,.15),rgba(45,170,112,.05));border:1px solid rgba(45,170,112,.3);border-radius:12px;padding:12px 14px;margin-bottom:14px">'+
      '<div style="font-size:10px;font-weight:700;color:#2DAA70;letter-spacing:.08em;margin-bottom:8px">NEW PERSONAL RECORDS</div>'+
      sm.prs.map(function(pr){
        return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
          '<span style="font-size:13px;font-weight:600;color:var(--white)">'+pr.name+'</span>'+
          '<span style="font-size:12px;font-weight:700;color:#2DAA70;font-family:\'Courier New\',monospace">'+pr.e1rm+' '+uLbl()+' e1RM</span>'+
        '</div>';
      }).join('')+
    '</div>':'';

  return '<span class="lbl" style="margin-bottom:14px">SESSION COMPLETE</span>'+
    statsRow+prRow+
    '<div class="card" style="margin-bottom:18px">'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">'+
        '<div style="width:3px;height:14px;background:var(--blue);border-radius:2px"></div>'+
        '<span style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:.08em">COACH DEBRIEF</span>'+
      '</div>'+
      (S.feedbackLoading?
        '<div style="display:flex;align-items:center;gap:10px;padding:6px 0">'+
          '<div class="spinner" style="width:16px;height:16px;flex-shrink:0"></div>'+
          '<span style="font-size:12px;color:var(--muted)">Analyzing your session...</span>'+
        '</div>':
        '<div style="font-size:13px;line-height:1.75;color:var(--white)">'+renderMd(S.feedback||'')+'</div>')+
    '</div>'+
    '<button class="btn-accent" style="width:100%;margin-bottom:8px" onclick="go(\'home\')">&#8592; Back to Home</button>'+
    '<div style="font-size:11px;color:var(--muted);text-align:center">Saved to your calendar.</div>';
}

function startWorkout(split){
  const sp=split||S.schedule[todayKey()];
  // Only protect existing workout if it has logged sets
  if(S.workout&&S.workout.exercises.some(function(e){return e.sets.length>0;})){
    if(S.workout.split===sp){go('log');return;}
    if(!confirm('You have an unfinished '+spLbl(S.workout.split)+' workout. Discard it and start '+spLbl(sp)+'?'))return;
  }
  // Always build fresh from current splitEx
  S.workout={date:new Date().toISOString(),split:sp,exercises:(S.splitEx[sp]||[]).filter(function(n){return n&&typeof n==='string';}).map(function(name){return{name:name,sets:[],inputW:getLastW(name),inputR:'5'};})};
  S.workoutStartTime=Date.now();
  S.addingEx=false;S.editingExIdx=null;S.setVoiceIdx=null;S.dragIdx=null;S.dragOverIdx=null;
  S.inlineAIDraft='';S.inlineAIReply='';S.inlineAILoading=false;
  go('log');
}
function resumeWorkout(){go('log');}

const ACTION_SPLITS=['push','pull','legs','upper','lower','rest','cardio','hiit','core','arms'];
function splitFromText(text){
  const t=' '+String(text||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ')+' ';
  for(const sp of ACTION_SPLITS){if(t.indexOf(' '+sp+' ')>=0)return sp;}
  return null;
}
function capSplit(sp){return spLbl(sp||'').replace(/\b\w/g,function(c){return c.toUpperCase();});}
function todayIso(){return new Date().toISOString();}
function saveTrainingState(){
  persistAll();
  render();
}
function startWorkoutFromAI(split){
  if(!split||split==='rest')return null;
  startWorkout(split);
  if(S.workout&&S.workout.split===split&&S.view==='log'){
    persistAll();
    return 'Started '+capSplit(split)+' for today.';
  }
  persistAll();
  return 'I could not start '+capSplit(split)+' because the current workout was kept unchanged.';
}
function logEmptyWorkoutFromAI(split,date){
  if(!split||split==='rest')return null;
  const w={
    date:date||todayIso(),
    split:split,
    startTime:date||todayIso(),
    durationMin:null,
    debrief:'Logged from AI chat.',
    exercises:[]
  };
  S.workouts=[w,...S.workouts];
  S.lastWorkout=w;
  S.workoutSummary={totalSets:0,totalVol:0,durationMin:null,prs:[]};
  S.view='home';
  persistAll();
  render();
  return 'Logged completed '+capSplit(split)+' session for today without set details.';
}
function logCardioFromAI(minutes,exercise){
  const mins=Math.max(1,parseInt(minutes,10)||0);
  if(!mins)return null;
  const name=exercise||'Cardio Session';
  const now=todayIso();
  const w={
    date:now,
    split:'cardio',
    startTime:now,
    durationMin:mins,
    debrief:'Logged from AI chat.',
    exercises:[{
      name:name,
      sets:[{w:0,r:mins,cardio:true,minutes:mins}]
    }]
  };
  S.workouts=[w,...S.workouts];
  S.lastWorkout=w;
  S.workoutSummary={totalSets:1,totalVol:0,durationMin:mins,prs:[]};
  S.view='home';
  persistAll();
  render();
  return 'Logged: '+mins+' minutes '+name.toLowerCase()+'.';
}
function executePendingAction(text){
  if(!S.pendingAction)return null;
  const t=String(text||'').trim().toLowerCase();
  if(/^(no|nope|cancel|stop|never mind|nevermind|don'?t)$/i.test(t)){
    S.pendingAction=null;
    persistAll();
    render();
    return 'No problem.';
  }
  const yes=/^(yes|yeah|yep|sure|ok|okay|do it|confirm|please|go ahead|start it|log it)$/i.test(t);
  if(!yes)return null;
  const pending=S.pendingAction;
  S.pendingAction=null;
  if(pending.type==='start_workout')return startWorkoutFromAI(pending.split);
  if(pending.type==='log_empty_workout'){
    if(/\bstart\b|\bstart it\b|\bbegin\b/.test(t))return startWorkoutFromAI(pending.split);
    return logEmptyWorkoutFromAI(pending.split,pending.date);
  }
  persistAll();
  render();
  return null;
}
function cardioIntent(text){
  const t=String(text||'').toLowerCase();
  const m=t.match(/\b(\d{1,3})\s*(minutes?|mins?|min)\b/);
  if(!m)return null;
  const hasCardio=/\b(walked|walking|walk|cardio|cycling|cycle|biking|bike|running|run|jogging|jog|elliptical|rower|rowing)\b/.test(t);
  const hasLog=/\b(log|logged|did|completed|mark)\b/.test(t);
  if(!hasCardio||!hasLog)return null;
  let ex='Cardio Session';
  if(/\bwalked|walking|walk\b/.test(t))ex='Walking';
  else if(/\bcycling|cycle|biking|bike\b/.test(t))ex='Cycling';
  else if(/\brunning|run\b/.test(t))ex='Running';
  else if(/\bjogging|jog\b/.test(t))ex='Jogging';
  else if(/\belliptical\b/.test(t))ex='Elliptical';
  else if(/\brower|rowing\b/.test(t))ex='Rowing';
  return{minutes:parseInt(m[1],10),exercise:ex};
}
function handleUserActionIntent(text){
  const pendingReply=executePendingAction(text);
  if(pendingReply)return pendingReply;
  const cardio=cardioIntent(text);
  if(cardio)return logCardioFromAI(cardio.minutes,cardio.exercise);
  const t=String(text||'').toLowerCase().trim();
  const split=splitFromText(t);
  if(!split||split==='rest')return null;
  const explicitStart=/\b(start|begin|let'?s do|lets do|train)\b/.test(t);
  const softStart=/\b(i want to do|want to do|do .* today|today)\b/.test(t)&&!/\b(log|logged|did|completed|mark)\b/.test(t);
  const logDone=/\b(log|logged|i did|did|completed|complete|mark)\b/.test(t)&&/\b(workout|session|today|done|log|logged|completed|complete|did|mark)\b/.test(t);
  if(explicitStart||softStart){
    const scheduled=S.schedule[todayKey()];
    if(softStart&&scheduled&&scheduled!==split){
      S.pendingAction={type:'start_workout',split:split};
      persistAll();
      render();
      return 'Today is scheduled as '+capSplit(scheduled)+'. Do you want me to start a '+capSplit(split)+' session instead?';
    }
    return startWorkoutFromAI(split);
  }
  if(logDone){
    S.pendingAction={type:'log_empty_workout',split:split,date:todayIso()};
    persistAll();
    render();
    return 'Do you want me to log a completed '+capSplit(split)+' session for today without set details, or start a '+capSplit(split)+' workout now?';
  }
  return null;
}

function cancelWorkout(){
  if(!S.workout)return;
  const hasData=S.workout.exercises.some(function(e){return e.sets.length>0;});
  if(hasData&&!confirm('Cancel this workout? All sets logged so far will be lost.'))return;
  stopRestTimer();
  stopWorkoutTick();
  S.workout=null;
  S.workoutStartTime=null;
  S.inlineAIDraft='';S.inlineAIReply='';S.inlineAILoading=false;
  try{localStorage.removeItem('ll_active_workout');}catch(e){}
  go('home');
}

function previewDayWorkout(day){
  const sp=S.schedule[day];
  if(!sp||sp==='rest')return;
  // Only resume existing workout if it has actual sets logged
  if(S.workout&&S.workout.split===sp&&S.workout.exercises.some(function(e){return e.sets.length>0;})){
    go('log');return;
  }
  // Always create fresh from current splitEx so edits are reflected
  if(S.workout&&S.workout.exercises.some(function(e){return e.sets.length>0;})){
    if(!confirm('You have an unfinished '+spLbl(S.workout.split)+' workout. Discard it and preview '+spLbl(sp)+'?'))return;
  }
  S.workout={
    date:new Date().toISOString(),
    split:sp,
    exercises:(S.splitEx[sp]||[]).map(function(name){
      return{name:name,sets:[],inputW:getLastW(name),inputR:'5'};
    })
  };
  S.addingEx=false;S.editingExIdx=null;S.setVoiceIdx=null;
  S.inlineAIDraft='';S.inlineAIReply='';S.inlineAILoading=false;
  go('log');
}

function editTemplate(split){
  // Open the log view in template-only mode: edit exercises without starting a real session
  const sp=split||S.schedule[todayKey()];
  if(!sp||sp==='rest')return;
  if(S.workout&&S.workout.exercises.some(function(e){return e.sets.length>0;})){
    if(!confirm('You have an unfinished '+spLbl(S.workout.split)+' workout. Discard it and edit the '+spLbl(sp)+' template?'))return;
  }
  S.workout={
    date:new Date().toISOString(),
    split:sp,
    templateOnly:true,
    exercises:(S.splitEx[sp]||[]).map(function(name){
      return{name:name,sets:[],inputW:getLastW(name),inputR:'5'};
    })
  };
  S.addingEx=false;S.editingExIdx=null;S.setVoiceIdx=null;S.dragIdx=null;S.dragOverIdx=null;
  S.inlineAIDraft='';S.inlineAIReply='';S.inlineAILoading=false;
  S.dayPreviewPanel=null;
  go('log');
}

function saveTemplate(){
  if(!S.workout||!S.workout.templateOnly)return;
  // Write exercise list back to the split template
  S.splitEx[S.workout.split]=S.workout.exercises.map(function(e){return e.name;});
  persist('ll_splits',S.splitEx);
  S.workout=null;
  go('home');
}

async function finishWorkout(){
  if(!S.workout)return;
  flushLogInputs();
  const clean={...S.workout,exercises:S.workout.exercises.filter(function(e){return e.sets.length>0;})};
  if(!clean.exercises.length)return;

  // ── Compute summary stats before saving ───────────────────
  const durationMin=S.workoutStartTime?Math.round((Date.now()-S.workoutStartTime)/60000):null;
  const workingSets=clean.exercises.flatMap(function(e){return e.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});});
  const totalSets=workingSets.length;
  const totalVol=Math.round(workingSets.reduce(function(a,s){return a+toDisp(s.w)*s.r;},0));

  // PR detection: compare e1RM vs all previous sessions for same exercise
  const prs=[];
  clean.exercises.forEach(function(ex){
    const workSets=ex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
    if(!workSets.length)return;
    const todayBest=Math.max.apply(null,workSets.map(function(s){return e1rm(s.w,s.r);}));
    const prevBest=S.workouts.reduce(function(best,pw){
      const pex=pw.exercises.find(function(e){return e.name===ex.name;});
      if(!pex)return best;
      const pws=pex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
      if(!pws.length)return best;
      return Math.max(best,Math.max.apply(null,pws.map(function(s){return e1rm(s.w,s.r);})));
    },0);
    if(todayBest>prevBest*1.005) prs.push({name:ex.name,e1rm:Math.round(toDisp(todayBest)*10)/10});
  });

  syncWorkoutToTemplate();
  const updated=[clean,...S.workouts];
  S.workouts=updated;
  persist('ll_workouts',updated);
  S.lastWorkout={...clean};
  S.workoutSummary={totalSets,totalVol,durationMin,prs};
  S.workoutStartTime=null;
  stopWorkoutTick();
  S.workout=null;
  S.feedback=null;S.feedbackLoading=true;go('feedback');
  try{
    if(!hasKey())throw new Error(aiKeyMessage());
    const cleanDisplay={
      split:clean.split,
      date:fmtD(clean.date),
      unit:S.unit,
      exercises:clean.exercises.map(function(e){
        return{
          name:e.name,
          sets:e.sets.map(function(s){
            return{
              weight:toDisp(s.w)+' '+S.unit,
              reps:s.r,
              warmup:s.warmup||false,
              e1rm:s.warmup||s.w===0?null:toDisp(e1rm(s.w,s.r))+' '+S.unit
            };
          })
        };
      })
    };
    const history=updated.slice(1,5).map(function(w){return{date:w.date,split:w.split,exercises:w.exercises.map(function(e){return{name:e.name,best_e1rm:Math.max.apply(null,e.sets.map(function(s){return e1rm(s.w,s.r);})),sets:e.sets};})};});
    const weekCtx=buildWeekContext();
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({model:MODEL,max_tokens:1200,messages:[{role:'user',content:
      'You are an expert strength coach. Analyze this workout and give structured feedback using markdown.\n\n'+
      'COMPLETED SESSION (all weights in '+S.unit+'):\n'+JSON.stringify(cleanDisplay,null,2)+'\n\n'+
      'LAST 15 SESSIONS:\n'+JSON.stringify(S.workouts.slice(1,16).map(function(w){
        return{date:fmtD(w.date),split:w.split,exercises:w.exercises.map(function(e){
          const ws=e.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
          return{name:e.name,best_e1rm:ws.length?toDisp(Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);}))):null};
        })};
      }),null,1)+'\n\n'+
      weekCtx+'\n\n'+
      'Write structured feedback with these sections:\n'+
      '### What went well\n One sentence, cite specific weights/reps/e1RM from THIS session.\n'+
      '### Progress vs history\n Reference ACTUAL previous numbers. Did anything improve, plateau, or regress vs last time this split was trained? Check if this is a post-deload session (weights deliberately lower) before calling anything a regression.\n'+
      '### One priority for next session\n Single specific recommendation with exact numbers (e.g. "add 5 lbs to bench, target 155×8").\n'+
      'Keep total response under 160 words. Be specific, not generic. No fluff.'}]})});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    S.feedback=extractText(data.content);
    // Persist debrief onto the saved workout so calendar can show it
    S.workouts[0].debrief=S.feedback;
    persist('ll_workouts',S.workouts);
    S.debriefDate=new Date().toISOString().slice(0,10);
    S.debriefDismissed=false;
  }catch(e){S.feedback='Could not connect. Workout saved.';}
  S.feedbackLoading=false;render();
}


function syncW(i,val){if(S.workout)S.workout.exercises[i].inputW=val;previewE1(i);}
function syncR(i,val){if(S.workout)S.workout.exercises[i].inputR=val;previewE1(i);}

function nudgeW(i,delta){
  const inp=document.getElementById('w'+i);if(!inp)return;
  const v=Math.max(0,Math.round(((parseFloat(inp.value)||0)+delta)*10)/10);
  inp.value=v;syncW(i,String(v));
}
function nudgeR(i,delta){
  const inp=document.getElementById('r'+i);if(!inp)return;
  const v=Math.max(1,(parseInt(inp.value)||0)+delta);
  inp.value=v;syncR(i,String(v));
}
// Sync workout exercise list back to template so home screen stays current
function syncWorkoutToTemplate(){
  if(!S.workout)return;
  S.splitEx[S.workout.split]=S.workout.exercises.map(function(e){return e.name;});
  persist('ll_splits',S.splitEx);
}
function renameEx(i,name){if(!S.workout)return;flushLogInputs();S.workout.exercises[i].name=name;syncWorkoutToTemplate();render();}
function toggleM2(i){if(!S.workout)return;const ex=S.workout.exercises[i];ex.trackM2=!ex.trackM2;render();}

// ── PLATE CALCULATOR ─────────────────────────────────────────
function calcWorkoutPlates(dispW){
  const bar=S.unit==='lbs'?45:20;
  const plates=S.unit==='lbs'?[45,35,25,10,5,2.5]:[25,20,15,10,5,2.5,1.25];
  if(dispW<=bar)return null;
  let rem=(dispW-bar)/2;
  const result=[];
  for(const p of plates){
    while(rem>=p-0.01){result.push(p);rem=Math.round((rem-p)*100)/100;}
  }
  if(rem>0.15)return null; // can't make exact weight
  return{bar,plates:result};
}
function plateHtml(dispW){
  const p=calcWorkoutPlates(dispW);
  if(!p||!p.plates.length)return '';
  const colors={45:'#1A9ED4',35:'#D4A020',25:'#2DAA70',20:'#2DAA70',15:'#E8693A',10:'#7B6FE0',5:'#9AB8CC',2.5:'#C44',1.25:'#C44'};
  const counts={};
  p.plates.forEach(function(pl){counts[pl]=(counts[pl]||0)+1;});
  const dots=Object.keys(counts).map(function(pl){
    const c=colors[pl]||'#9AB8CC';
    return '<span class="plate-dot" style="--plate-color:'+c+'"></span>';
  }).join('');
  const txt=Object.keys(counts).map(function(pl){return(counts[pl]>1?counts[pl]+'x':'')+pl;}).join(' + ');
  return '<div class="plate-calc">'+
    '<span class="plate-visual" aria-label="Plate calculator">'+
      '<span class="plate-sleeve"></span>'+
      dots+
    '</span>'+
    '<span class="plate-text">'+p.bar+' '+uLbl()+' bar &middot; '+txt+' per side</span>'+
  '</div>';
}

function previewE1(i){
  const el=document.getElementById('prev'+i);if(!el)return;
  const ex=S.workout&&S.workout.exercises[i];
  if(ex&&isCardioEx(ex.name)){el.innerHTML='';return;}
  const dW=parseFloat(document.getElementById('w'+i)&&document.getElementById('w'+i).value||0);
  const r=parseInt(document.getElementById('r'+i)&&document.getElementById('r'+i).value||0);
  if(dW===0&&r>0){
    // Bodyweight exercise
    el.innerHTML='<span style="color:var(--sub)">Bodyweight &times; '+r+' reps</span>';
  } else if(dW>0&&r>0){
    const kgW=toKg(dW);const val=e1rm(kgW,r);
    const last=S.workout?getLastSession(S.workout.exercises[i]&&S.workout.exercises[i].name):null;
    const isPR=last&&val>last.e1;
    el.innerHTML=
      'e1RM <span style="color:'+(isPR?'#2DAA70':'var(--blue)')+'">'+toDisp(val)+' '+uLbl()+'</span>'+(isPR?' <span style="color:#2DAA70">&#9650; PR</span>':'')+
      plateHtml(dW);
  }else el.innerHTML='';
}

function toggleSetWarmup(ei,si){if(!S.workout)return;const s=S.workout.exercises[ei].sets[si];s.warmup=!s.warmup;render();}

// ── DRAG AND DROP REORDER ─────────────────────────────────────
// Works on both desktop (HTML5 DnD) and mobile (touch events)
var _touchDrag={idx:null,startY:0,lastY:0,el:null};

function exDragStart(e,i){
  S.dragIdx=i;S.dragOverIdx=i;
  e.dataTransfer.effectAllowed='move';
  setTimeout(function(){render();},0);
}
function exDragOver(e,i){
  e.preventDefault();
  if(S.dragIdx===null)return;
  if(S.dragOverIdx!==i){S.dragOverIdx=i;render();}
}
function exDrop(e,i){
  e.preventDefault();
  if(S.dragIdx===null||S.dragIdx===i)return;
  flushLogInputs();
  const exs=S.workout.exercises;
  const moved=exs.splice(S.dragIdx,1)[0];
  exs.splice(i,0,moved);
  S.dragIdx=null;S.dragOverIdx=null;
  render();
}
function exDragEnd(e){
  S.dragIdx=null;S.dragOverIdx=null;render();
}

// Touch drag
function exTouchStart(e,i){
  e.stopPropagation();
  _touchDrag.idx=i;
  _touchDrag.startY=e.touches[0].clientY;
  _touchDrag.lastY=e.touches[0].clientY;
  S.dragIdx=i;S.dragOverIdx=i;
  document.getElementById('dh-'+i)&&document.getElementById('dh-'+i).classList.add('held');
  render();
}
function exTouchMove(e){
  if(_touchDrag.idx===null)return;
  e.preventDefault();
  const y=e.touches[0].clientY;
  _touchDrag.lastY=y;
  // Find which card we're over by Y position
  const cards=document.querySelectorAll('.ex-card');
  let newOver=_touchDrag.idx;
  cards.forEach(function(card,j){
    const rect=card.getBoundingClientRect();
    if(y>=rect.top&&y<=rect.bottom)newOver=j;
  });
  if(newOver!==S.dragOverIdx){S.dragOverIdx=newOver;render();}
}
function exTouchEnd(e){
  if(_touchDrag.idx===null)return;
  const src=_touchDrag.idx;
  const dest=S.dragOverIdx;
  _touchDrag.idx=null;
  if(src!==dest&&dest!==null&&S.workout){
    flushLogInputs();
    const exs=S.workout.exercises;
    const moved=exs.splice(src,1)[0];
    exs.splice(dest,0,moved);
  }
  S.dragIdx=null;S.dragOverIdx=null;
  render();
}

function toggleWarmup(i){if(!S.workout)return;const ex=S.workout.exercises[i];ex.nextIsWarmup=!ex.nextIsWarmup;render();}

function logSet(i){
  if(!S.workout)return;
  const dW=parseFloat(document.getElementById('w'+i)&&document.getElementById('w'+i).value||0);
  const r=parseFloat(document.getElementById('r'+i)&&document.getElementById('r'+i).value||0);
  const ex=S.workout.exercises[i];
  const isCardio=isCardioEx(ex.name)||isCardioSplit(S.workout.split);
  if(!dW)return;
  if(!isCardio&&!r)return;
  flushLogInputs();
  const set={w:isCardio?dW:toKg(dW),r:r};
  if(ex.nextIsWarmup){set.warmup=true;ex.nextIsWarmup=false;} // auto-reset after logging
  S.workout.exercises[i].sets.push(set);
  // Auto-start rest timer with smart duration based on exercise type
  if(!set.warmup){
    const autoSecs=getAutoRestSecs(ex.name);
    startRestTimer(autoSecs,ex.name);
  }
  render();
}
function delSet(ei,si){if(!S.workout)return;flushLogInputs();S.workout.exercises[ei].sets.splice(si,1);render();}
function toggleAddEx(){S.addingEx=!S.addingEx;render();}
function addEx(name){if(!S.workout||S.workout.exercises.find(function(e){return e.name===name;}))return;S.workout.exercises.push({name:name,sets:[],inputW:getLastW(name),inputR:'5'});S.addingEx=false;syncWorkoutToTemplate();render();}
function customEx(){const inp=document.getElementById('cex');if(inp&&inp.value.trim())addEx(inp.value.trim());}

// Manual exercise editing
function startExEdit(i){S.editingExIdx=i;render();setTimeout(function(){const inp=document.getElementById('ex-edit-'+i);if(inp){inp.focus();inp.select();}},50);}
function cancelExEdit(){S.editingExIdx=null;render();}
function saveExEdit(i){
  const inp=document.getElementById('ex-edit-'+i);
  const name=inp?inp.value.trim():'';
  if(!name||!S.workout)return;
  S.workout.exercises[i].name=name;S.editingExIdx=null;syncWorkoutToTemplate();render();
}
function removeExFromWorkout(i){if(!S.workout)return;flushLogInputs();S.workout.exercises.splice(i,1);S.editingExIdx=null;syncWorkoutToTemplate();render();}
function moveExUp(i){
  if(!S.workout||i===0)return;flushLogInputs();
  const exs=S.workout.exercises;const tmp=exs[i-1];exs[i-1]=exs[i];exs[i]=tmp;
  S.editingExIdx=i-1;syncWorkoutToTemplate();render();
}
function moveExDown(i){
  if(!S.workout||i>=S.workout.exercises.length-1)return;flushLogInputs();
  const exs=S.workout.exercises;const tmp=exs[i];exs[i]=exs[i+1];exs[i+1]=tmp;
  S.editingExIdx=i+1;syncWorkoutToTemplate();render();
}

// Set voice
function toggleSetVoice(i){
  if(S.setVoiceIdx===i){
    if(S.setVoiceRec){S.setVoiceRec.stop();S.setVoiceRec=null;}
    S.setVoiceIdx=null;
    const b=document.getElementById('vbtn'+i);if(b)b.className='voice-btn';
    return;
  }
  if(S.setVoiceRec){S.setVoiceRec.stop();S.setVoiceRec=null;}
  S.setVoiceIdx=i;
  const b=document.getElementById('vbtn'+i);if(b)b.className='voice-btn on';
  let accum='';
  S.setVoiceRec=makeVoice(
    function(fin){
      accum=(accum+' '+fin).trim();
      const p=parseSetVoice(accum);
      if(p){
        const wi=document.getElementById('w'+i);const ri=document.getElementById('r'+i);
        if(wi){wi.value=p.w;syncW(i,p.w);}if(ri){ri.value=p.r;syncR(i,p.r);}previewE1(i);
      }
    },
    function(interim){
      // Show interim in preview
      const p=parseSetVoice(accum+' '+interim);
      if(p){const el=document.getElementById('prev'+i);if(el)el.innerHTML='<span style="color:var(--blue)">'+p.w+' '+uLbl()+' &times; '+p.r+'</span> <span style="color:var(--muted);font-size:9px">listening...</span>';}
    },
    function(){S.setVoiceIdx=null;S.setVoiceRec=null;accum='';const b=document.getElementById('vbtn'+i);if(b)b.className='voice-btn';}
  );
  if(!S.setVoiceRec){S.setVoiceIdx=null;}
}
