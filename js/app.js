// Before adding major features, check docs/architecture.md to keep Forma modular.
// App rendering, navigation, global input helpers, and startup orchestration.

// ── RENDER ────────────────────────────────────────────────────
function render(){
  if(!S.loaded){
    document.getElementById('root').innerHTML='<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;color:var(--muted)">loading...</div>';
    return;
  }
  const inTourPrompt=S.tourPrompt;
  const hasNav=!inTourPrompt&&['home','chat','progress','setup'].includes(S.view);
  const hasBack=!inTourPrompt&&['log','feedback','workout-detail'].includes(S.view);

  // Show onboarding if first time and no profile set up
  const isFirstTime=!inTourPrompt&&!S.tourActive&&!S.onboarded&&!S.profile.name&&!S.profile.goal&&S.workouts.length===0;

  let body='';
  try{
  if(S.tourPrompt)                   body=vFeatureTourPrompt();
  else if(isFirstTime)               body=vOnboarding();
  else if(S.view==='apikey')         body=vApiKey();
  else if(S.view==='home')      body=vHome();
  else if(S.view==='chat')      body=vChat();
  else if(S.view==='log')       body=vLog();
  else if(S.view==='progress')  body=vProgress();
  else if(S.view==='setup')     body=vSetup();
  else if(S.view==='feedback')  body=vFeedback();
  else if(S.view==='workout-detail') body=vWorkoutDetail();
  }catch(err){
    body='<div style="padding:32px 20px;color:#E05050;font-size:13px;line-height:1.6"><strong>Render error ('+S.view+'):</strong><br><pre style="white-space:pre-wrap;margin-top:8px;font-size:11px">'+err.stack+'</pre></div>';
  }

  // Floating rest timer
  let timerHtml='';
  if(S.restTimer){
    const remaining=Math.ceil((S.restTimer.endTime-Date.now())/1000);
    const done=remaining<=0;
    const abs=Math.abs(remaining);
    const m=Math.floor(abs/60),s=abs%60;
    const display=(done?'+':'')+m+':'+(s<10?'0':'')+s;
    const pct=Math.max(0,Math.min(1,remaining/S.restTimer.total));
    timerHtml='<div class="rest-timer'+(done?' done':'')+'" id="rest-timer">'+
      '<span style="font-size:11px;font-weight:700;letter-spacing:.06em;opacity:.7">'+(done?'GO! ':'REST ')+'</span>'+
      '<span class="rt-time">'+display+'</span>'+
      '<button class="rt-btn" onclick="stopRestTimer()" style="color:inherit">&#215;</button>'+
    '</div>';
  }

  const el=document.querySelector('.content');
  const scrollY=el?el.scrollTop:0;

  document.getElementById('root').innerHTML=
    timerHtml+
    '<div class="shell">'+
      (isFirstTime?'':
      '<div class="hdr">'+
        '<div class="logo">Forma<span>.</span></div>'+
        (hasBack?'<button class="back-btn" onclick="'+(S.view==='workout-detail'?'go(\'progress\')':S.workout&&S.workout.templateOnly?'S.workout=null;go(\'home\')':'go(\'home\')')+'">← '+(S.view==='workout-detail'?'CALENDAR':'HOME')+'</button>':
        hasNav?'<button onclick="toggleQuickAI()" style="display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;border:none;background:'+(S.quickAIOpen?'#0D1E2E':'#1A9ED4')+';cursor:pointer;transition:all .15s">'+
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/></svg>'+
          '<span style="font-size:12px;font-weight:700;color:#fff;letter-spacing:.02em">'+(S.quickAIOpen?'Close':'Ask AI')+'</span>'+
        '</button>':'')+
      '</div>')+
      (S.quickAIOpen&&!isFirstTime?(hasNav||S.view==='log'?vQuickAIPanel():''):'')+
      '<div class="content'+(isFirstTime||inTourPrompt?'':hasNav?' has-nav':'')+(S.view==='chat'&&!isFirstTime&&!inTourPrompt?' is-chat':'')+(S.restTimer?' style="padding-top:calc(env(safe-area-inset-top) + 58px)"':'')+'">'+body+'</div>'+
      (!isFirstTime&&hasNav?vNav():'')+
      (S.tourActive?vTourOverlay():'')+
    '</div>';

  const el2=document.querySelector('.content');
  if(el2&&S.view!=='chat')el2.scrollTop=scrollY;
  if(S.view==='progress'&&S.selEx&&S.progressTab==='progress')setTimeout(drawChart,0);
  if(S.view==='chat')setTimeout(()=>{const m=document.querySelector('.chat-msgs');if(m)m.scrollTop=m.scrollHeight;},0);
  if(S.tourActive)setTimeout(positionTourSpotlight,0);

  // Sticky workout mini-bar — injected into .hdr so it overlays content
  if(S.view==='log'&&S.workout){
    setTimeout(function(){
      const hdr=document.querySelector('.hdr');
      const content=document.querySelector('.content');
      if(!hdr||!content)return;
      // Build/update bar
      let bar=document.getElementById('sticky-workout-bar');
      if(!bar){
        bar=document.createElement('div');
        bar.id='sticky-workout-bar';
        bar.style.cssText='position:absolute;top:100%;left:0;right:0;z-index:99;background:#0D1E2E;padding:8px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(26,158,212,.2);box-shadow:0 4px 16px rgba(0,0,0,.25);transform:translateY(-110%);opacity:0;transition:transform .22s cubic-bezier(.4,0,.2,1),opacity .22s ease;pointer-events:none';
        hdr.style.position='relative';
        hdr.appendChild(bar);
        // Scroll listener
        content.addEventListener('scroll',function(){
          const b=document.getElementById('sticky-workout-bar');
          if(!b)return;
          const show=content.scrollTop>90&&!S.quickAIOpen;
          b.style.transform=show?'translateY(0)':'translateY(-110%)';
          b.style.opacity=show?'1':'0';
          b.style.pointerEvents=show?'auto':'none';
        },{passive:true});
      }
      // Update bar content
      const done=S.workout.exercises.filter(function(e){return e.sets.filter(function(s){return !s.warmup;}).length>0;}).length;
      const total=S.workout.exercises.length;
      const hasLogged=S.workout.exercises.some(function(e){return e.sets.length>0;});
      bar.innerHTML=
        '<div style="display:flex;gap:3px;flex:1">'+
          S.workout.exercises.map(function(ex){
            const isDone=ex.sets.filter(function(s){return !s.warmup;}).length>0;
            return '<div style="flex:1;height:3px;border-radius:2px;background:'+(isDone?'#1A9ED4':'rgba(255,255,255,.2)')+'"></div>';
          }).join('')+
        '</div>'+
        '<span style="font-size:10px;color:rgba(255,255,255,.5);flex-shrink:0">'+done+'/'+total+'</span>'+
        '<button onclick="toggleQuickAI()" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:7px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">AI</button>'+
        (hasLogged?'<button onclick="finishWorkout()" style="background:#1A9ED4;border:none;color:#fff;border-radius:7px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">Finish</button>':'');
      // If quickAI is open, hide bar immediately
      if(S.quickAIOpen){
        bar.style.transform='translateY(-110%)';
        bar.style.opacity='0';
        bar.style.pointerEvents='none';
      }
    },0);
  } else {
    // Remove bar when leaving log view
    const b=document.getElementById('sticky-workout-bar');
    if(b)b.remove();
  }
  // Auto-save all state after every render
  if(S.loaded)persistAll();
}

function vNav(){
  const icons={
    // House — simple, clean
    home:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 4l9 8"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>',
    // Sparkle / AI star
    chat:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="4"/></svg>',
    // Bar chart — stats
    progress:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',
    // Sliders — settings
    setup:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="var(--bg)"/><circle cx="16" cy="12" r="2" fill="var(--bg)"/><circle cx="10" cy="18" r="2" fill="var(--bg)"/></svg>'
  };
  return '<div class="nav">'+
    [{k:'home',l:'HOME'},{k:'chat',l:'AI'},{k:'progress',l:'STATS'},{k:'setup',l:'SETUP'}]
    .map(function(it){
      return '<button class="'+(S.view===it.k?'on':'')+'" onclick="navTo(\''+it.k+'\')">'+
        '<span class="nav-icon">'+icons[it.k]+'</span>'+it.l+
      '</button>';
    }).join('')+
  '</div>';
}

function autoRes(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,100)+'px';}

function autoResI(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,80)+'px';}

// ── ACTIONS ───────────────────────────────────────────────────
function go(view){S.view=view;render();if(view==='log'&&S.workout&&!S.workout.templateOnly)startWorkoutTick();else stopWorkoutTick();}
function navTo(view){
  if(view==='progress'){const ns=[...new Set(S.workouts.flatMap(function(w){return w.exercises.map(function(e){return e.name;});}))];S.selEx=ns[0]||'';}
  S.view=view;render();
}

function deleteAllData(){
  if(!confirm('Delete ALL workouts and profile data permanently? Your schedule and exercise lists will not be affected. This cannot be undone.'))return;
  S.workouts=[];
  S.workout=null;
  S.profile={name:'',goal:'',experience:'',session_duration:60,exercises_per_session:5,equipment:'',injuries:'',preferences:'',bodyweight:'',height:''};
  S.onboarded=false;
  S.nudgeDismissedAt=null;
  try{localStorage.removeItem('ll_active_workout');}catch(e){}
  persist('ll_workouts',[]);
  persist('ll_profile',S.profile);
  persist('ll_onboarded',false);
  render();
}

function makeVoice(onFinal, onInterim, onStop){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Voice input not supported. Use Chrome.');return null;}
  let active=true;
  let rec=null;
  function start(){
    if(!active)return;
    try{
      rec=new SR();
      rec.continuous=true;
      rec.interimResults=true;
      rec.lang='en-US';
      rec.maxAlternatives=3;
      rec.onresult=function(e){
        let fin='',interim='';
        for(let i=e.resultIndex;i<e.results.length;i++){
          if(e.results[i].isFinal) fin+=e.results[i][0].transcript+' ';
          else interim+=e.results[i][0].transcript;
        }
        if(fin)onFinal(fin.trim());
        onInterim(interim);
      };
      rec.onend=function(){
        // Auto-restart if still active (handles browser timeout on silence)
        if(active){setTimeout(start,150);}
        else{if(onStop)onStop();}
      };
      rec.onerror=function(err){
        if(err.error==='no-speech'||err.error==='aborted')return; // silence/manual stop — just restart
        if(err.error==='not-allowed'){alert('Microphone access denied.');active=false;if(onStop)onStop();return;}
        // For other errors, try restarting after a short delay
        if(active)setTimeout(start,300);
      };
      rec.start();
    }catch(e){if(active)setTimeout(start,300);}
  }
  start();
  return{stop:function(){active=false;try{if(rec)rec.stop();}catch(e){}}};
}

// ── BOOT ──────────────────────────────────────────────────────
function initApp(){
  if(S._appStarted)return;
  S._appStarted=true;
  render();
  loadData();

// Register inline service worker for background notifications
if('serviceWorker' in navigator){
  const swCode=[
    'self.addEventListener("notificationclick",function(e){',
    '  e.notification.close();',
    '  e.waitUntil(clients.matchAll({type:"window"}).then(function(cs){',
    '    if(cs.length)return cs[0].focus();',
    '    return clients.openWindow(location.href);',
    '  }));',
    '});'
  ].join('\n');
  try{
    const swBlob=new Blob([swCode],{type:'application/javascript'});
    const swUrl=URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swUrl).catch(function(){});
  }catch(e){}
}

// Scroll-hide bottom nav — hide on scroll down, show on scroll up
(function(){
  var lastY=0, ticking=false;
  document.addEventListener('scroll', handleScroll, {passive:true, capture:true});
  function handleScroll(e){
    var el=e.target;
    if(!el||!el.classList||!el.classList.contains('content'))return;
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(function(){
      var y=el.scrollTop;
      var nav=document.querySelector('.nav');
      if(nav){
        if(y>lastY+6&&y>60) nav.classList.add('nav-hidden');
        else if(y<lastY-6) nav.classList.remove('nav-hidden');
      }
      lastY=y;
      ticking=false;
    });
  }
  })();
}

document.addEventListener('DOMContentLoaded',initApp);
if(document.readyState!=='loading')initApp();
