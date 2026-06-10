// Storage, import, and export helpers for Forma.
function normalizeImportedWeight(value,unit){
  if(value===undefined||value===null||value==='')return 0;
  const text=String(value).trim().toLowerCase();
  const num=typeof value==='number'?value:parseFloat(text.replace(/,/g,''));
  if(!Number.isFinite(num))return 0;
  if(text.includes('lb')||unit==='lbs')return num/KG2LB;
  if(text.includes('kg')||unit==='kg')return num;
  return unit==='lbs'?num/KG2LB:num;
}

function normalizeImportedSet(set,unit){
  if(!set)return{w:0,r:0};
  const hasInternalW=set.w!==undefined;
  const hasInternalR=set.r!==undefined;
  const out=Object.assign({},set);
  if(!hasInternalW){
    const rawWeight=set.weight!==undefined?set.weight:(set.lbs!==undefined?set.lbs:set.kg);
    const rawUnit=set.lbs!==undefined?'lbs':(set.kg!==undefined?'kg':(set.unit||unit||S.unit));
    out.w=normalizeImportedWeight(rawWeight,rawUnit);
  }else{
    out.w=Number(set.w)||0;
  }
  if(!hasInternalR){
    out.r=Number(set.reps!==undefined?set.reps:(set.rep!==undefined?set.rep:0))||0;
  }else{
    out.r=Number(set.r)||0;
  }
  out.warmup=!!(set.warmup||set.isWarmup);
  return out;
}

function normalizeImportedWorkouts(workouts,unit){
  if(!Array.isArray(workouts))return [];
  return workouts.map(function(workout){
    if(!workout||!Array.isArray(workout.exercises))return null;
    const normalized=Object.assign({},workout);
    normalized.exercises=workout.exercises.filter(Boolean).map(function(ex){
      const cleanEx=Object.assign({},ex);
      cleanEx.sets=Array.isArray(ex.sets)?ex.sets.map(function(set){return normalizeImportedSet(set,unit);}).filter(Boolean):[];
      return cleanEx;
    });
    return normalized;
  }).filter(Boolean);
}

async function loadData(){
  try{
    if(S.auth&&S.auth.configured&&S.auth.user&&typeof formaLoadCloudState==='function'){
      await formaLoadCloudState();
    }else if(!(S.auth&&S.auth.configured)){
      const load=function(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}};
      const u=load('ll_unit');       if(u)   S.unit=u;
      const w=load('ll_workouts');
      if(w){
        // Sanitize all historical workouts — ensure every exercise has a valid sets array
        S.workouts=normalizeImportedWorkouts(w,S.unit);
      }
      const sh=load('ll_sched_hist');if(sh)  S.scheduleHistory=sh;
      const sp=load('ll_splits');    if(sp)  S.splitEx=sp;
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
    }
    // Don't restore messages — fresh chat each session
  }catch(e){
    if(S.auth)S.auth.error='Could not load account data: '+e.message;
  }
  S.workouts=normalizeImportedWorkouts(S.workouts,S.unit);
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

function persist(key,val){
  try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}
  if(typeof formaScheduleCloudSave==='function')formaScheduleCloudSave();
}

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

function flushCloudSaveNow(reason){
  if(typeof formaFlushCloudSave==='function'){
    formaFlushCloudSave(reason||'manual').catch(function(){});
  }
}

function persistActiveWorkoutNow(reason){
  if(S.workout)persist('ll_active_workout',S.workout);
  else try{localStorage.removeItem('ll_active_workout');}catch(e){}
  flushCloudSaveNow(reason||'active workout');
}

async function persistAllAndFlushCloud(reason){
  persistAll();
  if(typeof formaFlushCloudSave==='function'){
    await formaFlushCloudSave(reason||'state change');
  }
}

function saveMessages(){
  // Strip thinking blocks before persisting — they're only needed for live API calls
  const clean=S.messages.slice(-40).map(function(m){
    if(!m.rawContent)return m;
    const stripped=m.rawContent.filter(function(b){return b.type!=='thinking';});
    return Object.assign({},m,{rawContent:stripped});
  });
  persist('ll_messages',clean);
  if(typeof formaScheduleCloudSave==='function')formaScheduleCloudSave();
}







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
  reader.onload=async function(e){
    try{
      const data=JSON.parse(e.target.result);
      if(!data.workouts)throw new Error('Invalid backup file');
      if(!confirm('This will replace ALL your current data with the backup from '+new Date(data.exported).toLocaleDateString()+'. Continue?'))return;
      S.importStatus={text:'Importing backup...',color:'var(--blue)'};
      render();
      const importUnit=data.unit||S.unit;
      if(data.workouts)  {S.workouts=normalizeImportedWorkouts(data.workouts,importUnit); persist('ll_workouts',S.workouts);}
      if(data.schedule)  {S.schedule=data.schedule;   persist('ll_schedule',data.schedule);}
      if(data.splits)    {S.splitEx=data.splits;       persist('ll_splits',data.splits);}
      if(data.unit)      {S.unit=data.unit;             persist('ll_unit',data.unit);}
      if(data.profile)   {S.profile=Object.assign({},S.profile,data.profile); persist('ll_profile',S.profile);}
      if(data.onboarded!==undefined){S.onboarded=data.onboarded; persist('ll_onboarded',data.onboarded);}
      if(data.active_workout){S.workout=data.active_workout;persist('ll_active_workout',data.active_workout);}
      persistAll();
      if(S.auth&&S.auth.user&&typeof formaSaveCloudStateNow==='function'){
        await formaSaveCloudStateNow();
        S.importStatus={text:'✓ Imported '+data.workouts.length+' sessions and saved to your account',color:'#2DAA70'};
      }else{
        S.importStatus={text:'✓ Imported '+data.workouts.length+' sessions locally',color:'#2DAA70'};
      }
      render();
    }catch(err){
      S.importStatus={text:'Error: '+err.message,color:'#C44'};
      render();
    }
    input.value='';
  };
  reader.readAsText(file);
}
