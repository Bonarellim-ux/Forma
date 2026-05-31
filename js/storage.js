// Storage, API key, import, and export helpers for Forma.
function apiKey(){return localStorage.getItem('ll_apikey')||'';}

function hasKey(){return!!apiKey();}

function aiKeyMessage(){return 'Add your AI API key in Setup to enable coaching.';}

function apiHeaders(){return{'Content-Type':'application/json','x-api-key':apiKey(),'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'};}

function loadData(){
  try{
    const load=function(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}};
    const w=load('ll_workouts');
    if(w){
      // Sanitize all historical workouts — ensure every exercise has a valid sets array
      S.workouts=w.map(function(workout){
        if(!workout||!Array.isArray(workout.exercises))return workout;
        workout.exercises=workout.exercises.filter(Boolean).map(function(ex){
          return Object.assign({},ex,{sets:Array.isArray(ex.sets)?ex.sets:[]});
        });
        return workout;
      }).filter(Boolean);
    }
    const sh=load('ll_sched_hist');if(sh)  S.scheduleHistory=sh;
    const sp=load('ll_splits');    if(sp)  S.splitEx=sp;
    const u=load('ll_unit');       if(u)   S.unit=u;
    const pr=load('ll_profile');   if(pr)  S.profile=Object.assign({},S.profile,pr);
    const ob=load('ll_onboarded'); if(ob)  S.onboarded=ob;
    // Restore active workout but stay on home — user navigates back manually
    const aw=load('ll_active_workout');
    if(aw){
      // Sanitize exercises — guard against missing sets[] from older saves or data corruption
      if(Array.isArray(aw.exercises)){
        aw.exercises=aw.exercises.filter(Boolean).map(function(ex){
          return Object.assign({inputW:'',inputR:'5'},ex,{sets:Array.isArray(ex.sets)?ex.sets:[]});
        });
      } else {
        aw.exercises=[];
      }
      S.workout=aw;
    }
    // Don't restore messages — fresh chat each session
  }catch(e){}
  normalizeSplitsData();
  persist('ll_schedule',S.schedule);
  persist('ll_splits',S.splitEx);
  if(!S.messages.length) S.messages=[{role:'ai',text:"Hey! I'm your Forma coach. I can analyze your training, recommend exercises, swap movements, and adjust your program.\n\nTry asking anything — or tap the mic.",time:NOW(),actions:[]}];
  S.loaded=true;
  resumeRestTimerIfActive();
  try{ render(); }catch(e){
    document.getElementById('root').innerHTML='<div style="padding:32px 20px;color:#E05050;font-size:13px"><strong>Init error:</strong><br><pre style="white-space:pre-wrap;margin-top:8px;font-size:11px">'+e.stack+'</pre></div>';
  }
}

function persist(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}}

function persistAll(){
  persist('ll_schedule',S.schedule);
  persist('ll_sched_hist',S.scheduleHistory.slice(-20));
  persist('ll_splits',S.splitEx);
  persist('ll_workouts',S.workouts);
  persist('ll_unit',S.unit);
  persist('ll_profile',S.profile);
  persist('ll_onboarded',S.onboarded);
  if(S.workout)persist('ll_active_workout',S.workout);
  else try{localStorage.removeItem('ll_active_workout');}catch(e){}
}

function saveMessages(){
  // Strip thinking blocks before persisting — they're only needed for live API calls
  const clean=S.messages.slice(-40).map(function(m){
    if(!m.rawContent)return m;
    const stripped=m.rawContent.filter(function(b){return b.type!=='thinking';});
    return Object.assign({},m,{rawContent:stripped});
  });
  persist('ll_messages',clean);
}

function saveKey(inputId){
  const inp=document.getElementById(inputId||'api-key-input');
  const key=inp?inp.value.trim():'';
  if(!key){const err=document.getElementById('key-err');if(err)err.textContent='Enter an API key first.';return;}
  localStorage.setItem('ll_apikey',key);
  if(S.view==='apikey')S.view='home';
  render();
}

function clearApiKey(){localStorage.removeItem('ll_apikey');render();}

function resetKey(){clearApiKey();}

function exportData(){
  const data={
    version:2,
    exported:new Date().toISOString(),
    workouts:S.workouts,
    schedule:S.schedule,
    splits:S.splitEx,
    unit:S.unit,
    profile:S.profile,
    onboarded:S.onboarded,
    active_workout:S.workout||null
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='forma-backup-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(input){
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result);
      if(!data.workouts)throw new Error('Invalid backup file');
      if(!confirm('This will replace ALL your current data with the backup from '+new Date(data.exported).toLocaleDateString()+'. Continue?'))return;
      if(data.workouts)  {S.workouts=data.workouts;   persist('ll_workouts',data.workouts);}
      if(data.schedule)  {S.schedule=data.schedule;   persist('ll_schedule',data.schedule);}
      if(data.splits)    {S.splitEx=data.splits;       persist('ll_splits',data.splits);}
      if(data.unit)      {S.unit=data.unit;             persist('ll_unit',data.unit);}
      if(data.profile)   {S.profile=Object.assign({},S.profile,data.profile); persist('ll_profile',S.profile);}
      if(data.onboarded!==undefined){S.onboarded=data.onboarded; persist('ll_onboarded',data.onboarded);}
      if(data.active_workout){S.workout=data.active_workout;persist('ll_active_workout',data.active_workout);}
      const el=document.getElementById('import-status');
      if(el)el.textContent='✓ Imported '+data.workouts.length+' sessions + profile successfully';
      render();
    }catch(err){
      const el=document.getElementById('import-status');
      if(el){el.textContent='Error: '+err.message;el.style.color='#C44';}
    }
    input.value='';
  };
  reader.readAsText(file);
}
