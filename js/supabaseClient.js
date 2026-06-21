// Supabase auth and account-owned cloud state for Forma.
// Keeps the app static/GitHub Pages compatible: no build step, no framework.
let formaSupabase=null;
let formaCloudSaveTimer=null;
let formaCloudApplying=false;
let formaCloudSaveInFlight=null;
let formaCloudSaveQueued=false;

function formaSupabaseConfigured(){
  return !!(window.supabase&&FORMA_SUPABASE_URL&&FORMA_SUPABASE_ANON_KEY);
}

function formaInitSupabaseClient(){
  if(!formaSupabaseConfigured())return null;
  if(!formaSupabase){
    formaSupabase=window.supabase.createClient(FORMA_SUPABASE_URL,FORMA_SUPABASE_ANON_KEY);
  }
  return formaSupabase;
}

function defaultAuthState(){
  return{
    ready:false,
    configured:false,
    user:null,
    email:'',
    password:'',
    mode:'signin',
    loading:false,
    error:'',
    notice:''
  };
}

function formaResetUserState(){
  S.workouts=[];
  S.schedule=Object.assign({},DEF_SCHED);
  S.scheduleHistory=[];
  S.splitEx=JSON.parse(JSON.stringify(DEF_EX));
  S.workout=null;
  S.lastWorkout=null;
  S.unit='lbs';
  S.onboarded=false;
  S.profile={name:'',goal:'',experience:'',session_duration:60,exercises_per_session:5,equipment:'',injuries:'',preferences:''};
  S.messages=[];
  S.scheduleRationale=null;
  S.programWhyOpen=false;
  S.nudgeDismissedAt=null;
  S.selWorkout=null;
  S.selEx='';
  S.view='home';
  normalizeSplitsData();
}

function collectCloudState(){
  return{
    version:1,
    workouts:S.workouts,
    schedule:S.schedule,
    scheduleHistory:S.scheduleHistory,
    splits:S.splitEx,
    unit:S.unit,
    profile:S.profile,
    onboarded:S.onboarded,
    active_workout:S.workout||null,
    scheduleRationale:S.scheduleRationale,
    nudgeDismissedAt:S.nudgeDismissedAt,
    messages:S.messages
  };
}

function applyCloudState(data){
  if(!data||typeof data!=='object')return;
  formaCloudApplying=true;
  if(Array.isArray(data.workouts)){
    // Route cloud workouts through the same normalization as local load (set weights/units/warmup),
    // not just a sets-array guard, so legacy/foreign-unit payloads can't bypass it.
    S.workouts=normalizeImportedWorkouts(data.workouts,data.unit||S.unit);
  }
  if(data.schedule)S.schedule=Object.assign({},DEF_SCHED,data.schedule);
  if(Array.isArray(data.scheduleHistory))S.scheduleHistory=data.scheduleHistory.slice(-20);
  if(data.splits)S.splitEx=data.splits;
  if(data.unit)S.unit=data.unit;
  if(data.profile)S.profile=Object.assign({},S.profile,data.profile);
  if(data.onboarded!==undefined)S.onboarded=data.onboarded;
  if(data.active_workout){
    const aw=data.active_workout;
    if(Array.isArray(aw.exercises)){
      aw.exercises=aw.exercises.filter(Boolean).map(function(ex){
        return Object.assign({inputW:'',inputR:'5'},ex,{sets:Array.isArray(ex.sets)?ex.sets:[]});
      });
    }else aw.exercises=[];
    S.workout=aw;
  }else S.workout=null;
  if(data.scheduleRationale)S.scheduleRationale=data.scheduleRationale;
  if(data.nudgeDismissedAt)S.nudgeDismissedAt=data.nudgeDismissedAt;
  if(Array.isArray(data.messages))S.messages=data.messages.slice(-40);
  normalizeSplitsData();
  formaCloudApplying=false;
}

async function formaLoadCloudState(){
  const client=formaInitSupabaseClient();
  if(!client||!S.auth.user)return false;
  const result=await client
    .from('forma_user_state')
    .select('data')
    .eq('user_id',S.auth.user.id)
    .maybeSingle();
  if(result.error)throw result.error;
  if(result.data&&result.data.data){
    applyCloudState(result.data.data);
    return true;
  }
  await formaSaveCloudStateNow();
  return false;
}

async function formaSaveCloudStateNow(){
  const client=formaInitSupabaseClient();
  if(!client||!S.auth||!S.auth.user||formaCloudApplying)return;
  const payload={
    user_id:S.auth.user.id,
    data:collectCloudState(),
    updated_at:new Date().toISOString()
  };
  const result=await client.from('forma_user_state').upsert(payload,{onConflict:'user_id'});
  if(result.error)throw result.error;
}

function formaScheduleCloudSave(){
  if(!S.loaded||!S.auth||!S.auth.user||formaCloudApplying)return;
  clearTimeout(formaCloudSaveTimer);
  formaCloudSaveTimer=setTimeout(function(){
    formaFlushCloudSave('debounced').catch(function(){});
  },600);
}

function formaFlushCloudSave(reason){
  if(!S.loaded||!S.auth||!S.auth.user||formaCloudApplying)return Promise.resolve(false);
  clearTimeout(formaCloudSaveTimer);
  if(formaCloudSaveInFlight){
    formaCloudSaveQueued=true;
    return formaCloudSaveInFlight;
  }
  formaCloudSaveInFlight=(async function(){
    try{
      do{
        formaCloudSaveQueued=false;
        await formaSaveCloudStateNow();
      }while(formaCloudSaveQueued);
      return true;
    }catch(err){
      console.error('Forma cloud save failed'+(reason?' ('+reason+')':'' )+':',err);
      if(S.auth)S.auth.error='Cloud save failed: '+err.message;
      throw err;
    }finally{
      formaCloudSaveInFlight=null;
    }
  })();
  return formaCloudSaveInFlight;
}

async function initAuthAndData(){
  S.auth=Object.assign(defaultAuthState(),S.auth||{});
  const client=formaInitSupabaseClient();
  S.auth.configured=!!client;
  if(!client){
    S.auth.ready=true;
    S.loaded=true;
    render();
    return;
  }
  try{
    const sessionResult=await client.auth.getSession();
    if(sessionResult.error)throw sessionResult.error;
    S.auth.user=sessionResult.data&&sessionResult.data.session?sessionResult.data.session.user:null;
    client.auth.onAuthStateChange(function(event,session){
      const nextUser=session&&session.user?session.user:null;
      const hadUser=!!S.auth.user;
      S.auth.user=nextUser;
      if(nextUser&&!hadUser){
        formaResetUserState();
        S.loaded=false;
        render();
        loadData();
      }else if(!nextUser){
        formaResetUserState();
        S.loaded=true;
        render();
      }
    });
    S.auth.ready=true;
    if(S.auth.user)loadData();
    else{S.loaded=true;render();}
  }catch(err){
    S.auth.error=err.message;
    S.auth.ready=true;
    S.loaded=true;
    render();
  }
}

function vAuth(){
  const a=S.auth||defaultAuthState();
  const isSignup=a.mode==='signup';
  const disabled=a.loading?'disabled':'';
  const setupMsg=!a.configured?
    '<div style="background:rgba(232,163,58,.12);border:1px solid rgba(232,163,58,.35);color:#E8A33A;border-radius:10px;padding:11px 12px;font-size:12px;line-height:1.45;margin-bottom:14px">Supabase is not configured yet. Add your project URL and public anon key in <strong>js/supabase-config.js</strong>, then run the SQL in <strong>docs/supabase-setup.sql</strong>.</div>':'';
  return '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg)">'+
    '<div style="width:100%;max-width:380px">'+
      '<div class="logo" style="font-size:38px;margin-bottom:8px">Forma<span>.</span></div>'+
      '<div style="font-size:15px;color:var(--sub);line-height:1.5;margin-bottom:22px">Sign in to keep your workouts, program, profile, and settings connected to your account.</div>'+
      setupMsg+
      '<div class="card">'+
        '<div style="font-size:20px;font-weight:900;color:var(--white);margin-bottom:4px">'+(isSignup?'Create account':'Welcome back')+'</div>'+
        '<div style="font-size:12px;color:var(--muted);margin-bottom:16px">'+(isSignup?'Start with a cloud-synced Forma account.':'Use your Forma account to load your training data.')+'</div>'+
        '<label class="lbl">EMAIL</label>'+
        '<input value="'+escH(a.email||'')+'" oninput="S.auth.email=this.value" autocomplete="email" inputmode="email" placeholder="you@example.com" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:12px;font-size:14px;color:var(--white);outline:none;font-family:inherit;margin-bottom:10px">'+
        '<label class="lbl">PASSWORD</label>'+
        '<input value="'+escH(a.password||'')+'" oninput="S.auth.password=this.value" type="password" autocomplete="'+(isSignup?'new-password':'current-password')+'" placeholder="••••••••" style="width:100%;background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:12px;font-size:14px;color:var(--white);outline:none;font-family:inherit;margin-bottom:12px">'+
        (a.error?'<div style="color:#E05050;font-size:12px;line-height:1.45;margin-bottom:10px">'+escH(a.error)+'</div>':'')+
        (a.notice?'<div style="color:#2DAA70;font-size:12px;line-height:1.45;margin-bottom:10px">'+escH(a.notice)+'</div>':'')+
        '<button class="press" onclick="formaSubmitAuth()" '+disabled+' style="width:100%;background:var(--blue);border:none;color:#fff;border-radius:11px;padding:13px;font-size:14px;font-weight:900;cursor:pointer;font-family:inherit;margin-bottom:10px">'+(a.loading?'Please wait...':isSignup?'Create account':'Sign in')+'</button>'+
        '<button onclick="formaToggleAuthMode()" style="width:100%;background:none;border:none;color:var(--blue);font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">'+(isSignup?'Already have an account? Sign in':'New to Forma? Create account')+'</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function formaToggleAuthMode(){
  S.auth.mode=S.auth.mode==='signup'?'signin':'signup';
  S.auth.error='';
  S.auth.notice='';
  render();
}

async function formaSubmitAuth(){
  const client=formaInitSupabaseClient();
  if(!client){S.auth.error='Supabase is not configured yet.';render();return;}
  const email=(S.auth.email||'').trim();
  const password=S.auth.password||'';
  if(!email||!password){S.auth.error='Enter your email and password.';render();return;}
  S.auth.loading=true;S.auth.error='';S.auth.notice='';render();
  try{
    const result=S.auth.mode==='signup'
      ? await client.auth.signUp({email:email,password:password})
      : await client.auth.signInWithPassword({email:email,password:password});
    if(result.error)throw result.error;
    if(S.auth.mode==='signup'&&result.data&&!result.data.session){
      S.auth.notice='Check your email to confirm your account, then sign in.';
    }
  }catch(err){
    S.auth.error=err.message;
  }
  S.auth.loading=false;
  render();
}

async function formaSignOut(){
  const client=formaInitSupabaseClient();
  if(!client)return;
  await client.auth.signOut();
  formaResetUserState();
  S.auth=Object.assign(defaultAuthState(),{ready:true,configured:true});
  S.loaded=true;
  render();
}
