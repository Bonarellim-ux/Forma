// AI coach, proxy API calls, prompts, and AI voice/input flows.

const API='https://forma-proxy.bonarelli-m.workers.dev';
const MODEL='claude-sonnet-4-6';

// ── EXERCISE SCIENCE KNOWLEDGE BASE ──────────────────────────
// Evidence-based exercise data used for AI recommendations.
// Sources: Schoenfeld (2010, 2015, 2020), NSCA guidelines, ACE, 
// Krieger (2010) meta-analysis, Gentil et al. (2015), Calatayud et al. (2015)
const EXERCISE_KB = `
EVIDENCE-BASED EXERCISE SCIENCE KNOWLEDGE BASE v2
Sources: Schoenfeld BJ (JSCR 2010, 2015, 2020), Krieger meta-analysis (JSCR 2010),
Gentil et al. (2015), NSCA Essentials, ACE guidelines, Calatayud et al. (2015),
Vigotsky & Beardsley (2016), Barnett et al. (1995 EMG), Contreras et al. (2015),
Petersen et al. (2011 AJSM), McMahon et al. (2014), Colquhoun et al. (2018).

⚠ VERIFY ANATOMY BEFORE STATING. Common errors: cable fly directions, bench angles, grip widths.

══════════════════════════════════════════════
CABLE & ANGLE ANATOMY
══════════════════════════════════════════════
CABLE FLY DIRECTIONS:
• High-to-Low (cable HIGH, pull DOWN): lower chest / costal pec fibres
• Low-to-High (cable LOW, pull UP): upper chest / clavicular pec
• Mid-height crossover: mid chest / sternal pec
• Face Pull (high pulley, rope): rear delt + external rotators + mid trap

BENCH ANGLES:
• Flat (0°): mid/sternal pec, anterior delt, triceps
• Incline 30–45°: upper/clavicular pec, anterior delt
• Decline –15 to –30°: lower/costal pec, less delt
• >45° incline: shifts to anterior delt, poor chest stimulus

GRIP / STANCE EFFECTS:
• Wide grip bench: more chest stretch, less triceps
• Close grip bench: more triceps, less chest
• Neutral grip (DB/cable): less shoulder stress, more comfortable ROM
• Wide squat stance: more glute/adductor recruitment
• Narrow squat stance: more quad recruitment

══════════════════════════════════════════════
EXERCISE VARIATIONS BY MUSCLE & FUNCTION
══════════════════════════════════════════════

CHEST — HORIZONTAL PUSH:
  Primary: Barbell Bench Press ★★★, Dumbbell Bench Press ★★★, Push-Up ★★★
  Upper emphasis: Incline Barbell ★★☆, Incline Dumbbell ★★☆, Low-to-High Cable Fly ★★☆, Incline Push-Up ★★☆
  Lower emphasis: Dips ★★☆, Decline Bench ★★☆, High-to-Low Cable Fly ★★☆
  Mid/isolation: Cable Crossover ★★☆, Dumbbell Fly ★★☆, Pec Deck ★★☆
  Unique value: Landmine Press (shoulder-friendly, angled push), Chest Press Machine (stable overload)

SHOULDERS — VERTICAL PUSH:
  Primary: Overhead Press (barbell) ★★★, Dumbbell Shoulder Press ★★★, Arnold Press ★★☆
  Lateral delt: Lateral Raise (dumbbell) ★★☆, Cable Lateral Raise ★★☆ (constant tension advantage)
  Front delt: Front Raise ★★☆ (often overtrained — bench covers this)
  Rear delt: Face Pull ★★☆, Reverse Fly ★★☆, Band Pull-Apart ★★☆
  Unique value: Landmine Press (unilateral, shoulder-friendly), Z-Press (core + shoulder), Push Press (power/overload)

BACK — VERTICAL PULL (lats/width):
  Primary: Pull-Up ★★★, Lat Pulldown ★★★, Chin-Up ★★★
  Variations: Wide-grip (more lat width), Close-grip neutral (more lower lat + bicep), Behind-neck (avoid — risky)
  Unique: Straight-Arm Pulldown ★★☆ (isolates lat, no bicep), Single-arm Pulldown ★★☆

BACK — HORIZONTAL PULL (thickness/rhomboids/mid-traps):
  Primary: Barbell Row ★★★, Dumbbell Row ★★★, Cable Row ★★★
  Chest-supported: Chest-Supported Row ★★☆ (removes lower back fatigue, great for quality reps)
  Unique: Meadows Row (high lat/lower lat emphasis), Pendlay Row (explosive, more posterior chain), T-Bar Row ★★☆
  Rear delt focus: Face Pull ★★☆, Reverse Fly ★★☆, Seated Cable Row with wide grip + external rotation

BICEPS:
  Primary: Barbell Curl ★★★, Dumbbell Curl ★★★
  Long head (peak): Incline Dumbbell Curl ★★☆ (max stretch at bottom), Hammer Curl ★★☆ (brachialis)
  Short head (thickness): Preacher Curl ★★☆, Cable Curl ★★☆ (constant tension)
  Unique: Spider Curl (max peak contraction), Cross-Body Hammer Curl (brachialis emphasis)

TRICEPS:
  Lateral head (most visible): Tricep Pushdown ★★★, Cable Kickback ★★☆
  Long head (size): Overhead Tricep Extension ★★☆ (max stretch = more hypertrophy stimulus), Skull Crusher ★★☆
  All heads: Close-Grip Bench Press ★★☆, Dips ★★☆
  Unique: JM Press (powerlifting tricep overload), Tate Press (medial head)

QUADS:
  Primary: Back Squat ★★★, Front Squat ★★★, Leg Press ★★★
  Unilateral: Bulgarian Split Squat ★★☆, Reverse Lunge ★★☆, Step-Up ★★☆
  Isolation: Leg Extension ★★☆ (controversial but effective for isolation)
  Unique: Hack Squat (more quad emphasis, less lower back), Sissy Squat (extreme quad stretch), Spanish Squat

HAMSTRINGS:
  Hip-dominant (length): Romanian Deadlift ★★★, Good Morning ★★☆, Hip Hinge ★★★
  Knee-dominant (curl): Leg Curl (lying) ★★☆, Leg Curl (seated) ★★☆ (Maeo 2021: seated hits long head better)
  Full range: Nordic Curl ★★★ (Petersen 2011: 51% injury reduction), Stiff-Leg Deadlift ★★☆
  Unique: Single-leg RDL (unilateral balance + hamstring), Glute-Ham Raise ★★☆

GLUTES:
  Primary: Hip Thrust ★★★ (Contreras 2015: highest glute EMG), Glute Bridge ★★★
  Secondary: Bulgarian Split Squat ★★☆, Sumo Deadlift ★★☆, Cable Kickback ★★☆
  Unique: Frog Pump (high rep glute isolation), Banded Hip Thrust (accommodating resistance), Step-Up

CALVES:
  Gastrocnemius (standing): Standing Calf Raise ★★☆, Donkey Calf Raise ★★☆
  Soleus (seated): Seated Calf Raise ★★☆ (different muscle — train both)
  Unique: Single-leg calf raise (better stretch + ROM), Calf Raise on leg press (comfortable loading)

CORE (anti-rotation/stability):
  Primary: Plank ★★★, Dead Bug ★★★, Pallof Press ★★☆
  Flexion: Ab Wheel ★★☆, Cable Crunch ★★☆ (loaded — more effective than bodyweight crunches)
  Unique: Copenhagen Plank (adductor + core), RKC Plank (full-body tension), Stir the Pot

══════════════════════════════════════════════
TEMPO & TECHNIQUE MODIFIERS (add variety without new exercises)
══════════════════════════════════════════════
• Slow eccentric (3–5s down): +hypertrophy stimulus, good for plateaus (Schoenfeld 2015)
• Pause at bottom: increases time under tension + eliminates stretch reflex
• 1.5 rep method: go down, halfway up, back down, full up — doubles TUT per set
• Cluster sets: rest 15s mid-set to push past failure — advanced technique
• Mechanical drop set: change leverage (e.g. incline → flat → decline) without dropping weight

══════════════════════════════════════════════
PERIODIZATION PRINCIPLES
══════════════════════════════════════════════
• Linear progression: add weight each session — best for beginners
• Undulating periodization: vary rep ranges week to week (e.g. 5s → 8s → 12s) — intermediate+
• Block periodization: 3–4 week hypertrophy block → 3–4 week strength block → deload
• Deload: every 4–8 weeks, reduce volume 40–50% — prevents overreaching
• Progressive overload: add weight, reps, sets, or reduce rest time — ALWAYS the goal

══════════════════════════════════════════════
EXERCISE PAIRING LOGIC
══════════════════════════════════════════════
• After quads-dominant: add hamstring/glute (RDL, Hip Thrust, Leg Curl, Nordic Curl)
• After horizontal push: add horizontal pull (Row, Face Pull) — maintains push:pull ≥1:1
• After vertical pull: add shoulder isolation (Lateral Raise) or arms
• After heavy hinge (Deadlift): avoid direct lower back; add upper back or arms
• After upper lat (Pull-Up): add lower lat (Cable Row) or rear delt (Face Pull)
• After chest: add tricep isolation (Pushdown, Skull Crusher)
• After back: add bicep isolation (Curl, Hammer Curl)
• Rear delts almost always undertrained — Face Pull or Reverse Fly fits almost every session

EXERCISE ROTATION PRINCIPLE: Protect successful patterns. Before recommending any exercise change, check whether the exercise is still progressing, whether performance is near all-time highs, whether there is evidence of a plateau, and whether there is evidence of pain or recovery issues. Prefer multiple independent signals when identifying risks or weaknesses. Do not draw strong conclusions from one metric alone. Do not recommend rotation solely because an exercise has been performed many times. If an exercise is still progressing and there are no recovery or injury concerns, classify it as WORKING WELL and explain why it should be kept. To justify a swap, at least one of these must be true: progress has plateaued, performance has declined for multiple sessions, pain/discomfort is reported, recovery issues are linked to the movement, a muscle group is underdeveloped and a different movement would target it better, or the user explicitly wants variety. Bench Press, Squat, Deadlift, Overhead Press, Row, Pull-Up, and similar compounds should generally be retained if they are still progressing.

EVIDENCE RATINGS:
★★★ Strong RCT/meta-analysis, widely replicated
★★☆ Good EMG evidence + practical consensus  
★☆☆ Mechanistic reasoning, limited direct studies
Only recommend ★★★ or ★★☆.
`;

function aiProxyConfigured(){return API&&API.indexOf('YOUR_SUBDOMAIN')===-1;}

function apiKey(){return '';}

function hasKey(){return aiProxyConfigured();}

function aiKeyMessage(){
  return aiProxyConfigured()?
    'AI is temporarily unavailable. Please try again soon.':
    'AI proxy is not configured yet. Deploy the Forma Cloudflare Worker and set the proxy URL in js/ai.js.';
}

function apiHeaders(){return{'Content-Type':'application/json'};}

function vQuickAIPanel(){
  return '<div style="position:absolute;top:calc(env(safe-area-inset-top) + 56px);left:12px;right:12px;z-index:200;background:var(--s1);border:1px solid var(--border2);border-radius:16px;padding:14px;box-shadow:0 4px 20px rgba(13,30,46,.12)">'+

    // Header row with close button
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
      '<span style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:.06em">ASK AI</span>'+
      '<button onclick="toggleQuickAI()" style="width:26px;height:26px;border-radius:50%;background:var(--s2);border:1px solid var(--border);color:var(--sub);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1">&#215;</button>'+
    '</div>'+

    // Reply area
    (S.quickAIReply?
      '<div style="background:var(--white);border-radius:10px;padding:10px 13px;margin-bottom:12px">'+
        '<div style="font-size:13px;line-height:1.55;color:#e8f4fb">'+S.quickAIReply.replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\*([^*]+)\*/g,'$1').replace(/#{1,3}\s*/g,'').replace(/`([^`]+)`/g,'$1')+'</div>'+
      '</div>':'')+

    // Input row
    '<div style="display:flex;gap:8px;align-items:center">'+
      '<button onclick="sendQuickAIVoice()" style="width:38px;height:38px;border-radius:50%;border:1px solid '+(S.quickAIListening?'var(--blue)':'var(--border)')+';background:'+(S.quickAIListening?'rgba(26,158,212,.1)':'var(--bg)')+';display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0'+(S.quickAIListening?';animation:pulse .9s ease-in-out infinite':'')+'">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/></svg>'+
      '</button>'+
      '<input id="quick-ai-input" type="text" placeholder="Ask anything or make a quick change…" '+
        'onkeydown="if(event.key===\'Enter\'){sendQuickAI();}" '+
        'oninput="S.quickAIDraft=this.value" '+
        'value="'+escH(S.quickAIDraft)+'" '+
        'style="flex:1;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:9px 12px;font-size:13px;color:var(--white);outline:none;font-family:inherit">'+
      '<button onclick="sendQuickAI()" '+(S.quickAILoading?'disabled':'')+' style="width:38px;height:38px;border-radius:50%;background:'+(S.quickAILoading?'var(--s2)':'var(--blue)')+';border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0">'+
        (S.quickAILoading?
          '<div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border);border-top-color:var(--blue);animation:spin 1s linear infinite"></div>':
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>')+
      '</button>'+
    '</div>'+

    // Quick chips
    (!S.quickAIReply&&!S.quickAIDraft&&!S.quickAILoading?
      '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:10px">'+
        ['Change today\'s split','Add exercise to today','What should I work on?','Swap an exercise'].map(function(q){
          return '<button onclick="S.quickAIDraft=\''+q+'\';render();setTimeout(function(){var el=document.getElementById(\'quick-ai-input\');if(el){el.value=\''+q+'\';el.focus();}},30)" '+
            'style="background:var(--s2);border:1px solid var(--border);color:var(--sub);border-radius:20px;padding:5px 11px;font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap">'+q+'</button>';
        }).join('')+
      '</div>':'')+ 

  '</div>';
}

function toggleQuickAI(){
  S.quickAIOpen=!S.quickAIOpen;
  if(!S.quickAIOpen){S.quickAIDraft='';S.quickAIReply='';S.quickAIListening=false;}
  else if(!hasKey())S.quickAIReply=aiKeyMessage();
  render();
  if(S.quickAIOpen)setTimeout(function(){var el=document.getElementById('quick-ai-input');if(el)el.focus();},80);
}

async function sendQuickAI(){
  const text=S.quickAIDraft.trim();
  if(!text||S.quickAILoading)return;
  const actionReply=handleUserActionIntent(text);
  if(actionReply){
    S.quickAIDraft='';
    S.quickAIReply=actionReply;
    S.messages.push({role:'user',text:text,time:NOW(),actions:[]});
    S.messages.push({role:'ai',text:actionReply,time:NOW(),actions:[]});
    saveMessages();
    render();
    return;
  }
  if(!hasKey()){S.quickAIReply=aiKeyMessage();render();return;}
  // Stop any active voice recording before sending
  if(S.quickAIListening){
    if(S._quickRec){S._quickRec.stop();S._quickRec=null;}
    S.quickAIListening=false;
  }
  S.quickAILoading=true;S.quickAIDraft='';S.quickAIReply='';render();
  // Push user message to chat history so it shows in AI tab
  S.messages.push({role:'user',text:text,time:NOW(),actions:[]});
  try{
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
      model:MODEL,max_tokens:2000,
      system:buildSysPrompt(text)+'\n\nMODE: QUICK COMMAND. The user is making a fast request from the home screen. Be brief — one or two sentences max. Execute the action immediately. No lengthy explanations.',
      messages:[{role:'user',content:text}]
    })});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    const parsed=parseAIResponse(extractText(data.content));
    (parsed.actions||[]).forEach(function(a){applyAction(a);});
    const reply=parsed.message||'Done.';
    S.quickAIReply=reply;
    // Push AI response to chat history
    S.messages.push({role:'ai',text:reply,time:NOW(),actions:parsed.actions||[]});
  }catch(e){
    S.quickAIReply='Error: '+e.message;
    S.messages.push({role:'ai',text:'Error: '+e.message,time:NOW(),actions:[]});
  }
  S.quickAILoading=false;render();
}

async function sendQuickAIVoice(){
  if(S.quickAIListening){
    // Stop recording — do NOT auto-submit, let user review and edit
    if(S._quickRec){S._quickRec.stop();S._quickRec=null;}
    S.quickAIListening=false;
    render();
    // Focus input so user can edit before sending
    setTimeout(function(){var el=document.getElementById('quick-ai-input');if(el)el.focus();},80);
    return;
  }
  // Start recording — accumulate into draft
  S.quickAIDraft='';S.quickAIListening=true;render();
  let accumulated='';
  S._quickRec=makeVoice(
    function(final){
      accumulated+=final+' ';
      S.quickAIDraft=accumulated.trim();
      const el=document.getElementById('quick-ai-input');
      if(el)el.value=S.quickAIDraft;
    },
    function(interim){
      const el=document.getElementById('quick-ai-input');
      if(el)el.value=(accumulated+interim).trim();
    },
    function(){
      S.quickAIListening=false;S._quickRec=null;render();
    }
  );
}

function vApiKey(){
  return '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center">'+
    '<div class="logo" style="font-size:32px;margin-bottom:8px">Forma<span>.</span></div>'+
    '<div style="font-size:13px;color:var(--muted);margin-bottom:36px">Your AI-powered strength coach</div>'+
    '<div style="width:100%;max-width:360px;text-align:left">'+
      '<div class="card" style="margin-bottom:14px">'+
        '<span class="lbl" style="margin-bottom:10px">AI Connection</span>'+
        '<div style="font-size:13px;color:var(--white);line-height:1.55;margin-bottom:8px">'+(aiProxyConfigured()?'AI is connected through the Forma proxy.':'AI proxy setup is needed before coaching can run.')+'</div>'+
        '<div style="font-size:11px;color:var(--muted);line-height:1.5">Forma does not store Anthropic API keys in the browser. The key belongs in the Cloudflare Worker secret.</div>'+
      '</div>'+
      '<button class="btn-accent" onclick="go(\'home\')">CONTINUE &rarr;</button>'+
      '<div id="key-err" style="color:#E05050;font-size:12px;text-align:center;margin-top:10px;min-height:16px"></div>'+
    '</div>'+
  '</div>';
}

function vChat(){
  const keyNotice=(!hasKey()&&!S.tourActive)?'<div style="background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin:4px 0 12px;font-size:12px;color:var(--sub);line-height:1.45">'+aiKeyMessage()+'</div>':'';
  const msgs=S.messages.map(function(m){
    if(m.role==='typing'){
      return '<div class="msg ai"><div class="avatar">L</div><div><div class="bubble" style="display:flex;align-items:center;gap:5px;padding:14px 16px"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div></div></div>';
    }
    const pills=(m.actions||[]).length?'<div class="action-pills">'+m.actions.map(function(a){return '<span class="apill">&#10003; '+actionLbl(a)+'</span>';}).join('')+'</div>':'';
    const fbtns=buildFBtns(m.actions||[]);
    if(m.role==='user'){
      return '<div class="msg user"><div class="avatar">M</div><div><div class="bubble">'+escH(m.text)+'</div><div class="msg-time">'+(m.time||'')+'</div></div></div>';
    }
    return '<div class="msg ai"><div class="avatar">L</div><div><div class="bubble">'+renderMd(m.text)+pills+'</div>'+fbtns+'<div class="msg-time">'+(m.time||'')+'</div></div></div>';
  }).join('');

  const qcmds=getQuickCmds().map(function(c){
    return '<button class="qcmd" onclick="sendQuick('+escH(JSON.stringify(c))+')" >'+escH(c)+'</button>';
  }).join('');

  return '<div class="chat-wrap">'+
    '<div class="chat-msgs" id="chat-msgs">'+keyNotice+msgs+'</div>'+
    '<div class="chat-input-area">'+
      '<div class="qcmds">'+qcmds+'</div>'+
      '<div class="chat-input-row">'+
        '<button class="vc-btn'+(S.chatListening?' on':'')+'" onclick="toggleChatVoice()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg></button>'+
        '<textarea id="chat-input" class="chat-ta" rows="1" placeholder="Ask anything or give a command&hellip;" '+
          'oninput="autoRes(this);S.chatDraft=this.value" '+
          'onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();sendChat()}">'+escH(S.chatDraft)+'</textarea>'+
        '<button class="send-btn" onclick="sendChat()" '+(S.chatLoading?'disabled':'')+'>&#8593;</button>'+
      '</div>'+
    '</div>'+
  '</div>';
}

// ── CHAT HELPERS ──────────────────────────────────────────────
function actionLbl(a){
  if(a.type==='update_schedule')return 'Schedule updated';
  if(a.type==='update_split_exercises')return (SPLIT_LBL[a.split]||a.split)+' updated';
  if(a.type==='add_exercise')return 'Added '+a.exercise;
  if(a.type==='remove_exercise')return 'Removed '+a.exercise;
  if(a.type==='workout_swap_exercise')return 'Swapped '+a.from+' for '+a.to;
  if(a.type==='workout_add_exercise')return 'Added '+a.exercise;
  if(a.type==='workout_remove_exercise')return 'Removed '+a.exercise;
  if(a.type==='log_set')return 'Set logged';
  return a.type;
}

function buildFBtns(actions){
  if(!actions||!actions.length)return '';
  const types=actions.map(function(a){return a.type;});
  const btns=[];
  const workoutRelated=types.some(function(t){return['update_split_exercises','add_exercise','remove_exercise','workout_add_exercise','workout_remove_exercise','workout_swap_exercise'].includes(t);});
  if(workoutRelated){
    const today=todayKey();const sp=S.schedule[today];
    if(sp!=='rest')btns.push('<button class="fol-btn ac" onclick="startWorkout(\''+sp+'\')">Start today\'s '+spLbl(sp)+' &rarr;</button>');
  }
  if(types.includes('update_schedule'))btns.push('<button class="fol-btn" onclick="navTo(\'setup\')">View schedule</button>');
  if(types.includes('log_set')&&S.workout)btns.push('<button class="fol-btn ac" onclick="go(\'log\')">Back to workout &rarr;</button>');
  return btns.length?'<div class="follow-btns">'+btns.join('')+'</div>':'';
}

function getQuickCmds(){
  const today=todayKey();
  const sp=S.schedule[today];
  const isRest=!sp||sp==='rest';

  // ── Active workout ────────────────────────────────────────
  if(S.workout&&!S.workout.templateOnly){
    const w=S.workout;
    const exs=w.exercises;
    const logged=exs.filter(function(e){return e.sets.filter(function(s){return !s.warmup;}).length>0;});
    const notLogged=exs.filter(function(e){return e.sets.filter(function(s){return !s.warmup;}).length===0;});
    const lastLogged=logged.length?logged[logged.length-1]:null;
    const nextUp=notLogged.length?notLogged[0]:null;
    const cmds=[];
    if(nextUp) cmds.push('What weight should I use for '+nextUp.name+'?');
    if(lastLogged) cmds.push('How did my '+lastLogged.name+' look?');
    if(logged.length===exs.length) cmds.push('Am I ready to finish?');
    else cmds.push('How many sets left should I do?');
    if(nextUp) cmds.push('Swap '+nextUp.name+' for something else');
    return cmds.slice(0,4);
  }

  // ── Rest day ──────────────────────────────────────────────
  if(isRest){
    const tomorrow=DAYS[(DAYS.indexOf(today)+1)%7];
    const tomorrowSp=S.schedule[tomorrow];
    const cmds=['What should I prioritize next session?','How is my recovery looking this week?'];
    if(tomorrowSp&&tomorrowSp!=='rest') cmds.push('What weight should I target for '+spLbl(tomorrowSp)+'?');
    cmds.push('Show me my weakest lift');
    return cmds.slice(0,4);
  }

  // ── Training day, no active workout ──────────────────────
  const todayExs=S.splitEx[sp]||[];
  const cmds=[];
  // Reference last session for this split
  const lastSplit=S.workouts.find(function(w){return w.split===sp;});
  if(lastSplit){
    const daysSince=Math.round((Date.now()-new Date(lastSplit.date).getTime())/86400000);
    cmds.push('How did my last '+spLbl(sp)+' go? ('+daysSince+'d ago)');
  }
  if(todayExs.length) cmds.push('What weight should I use for '+todayExs[0]+'?');
  if(todayExs.length>1) cmds.push('Any changes to today\'s '+spLbl(sp)+' session?');
  // Add a progress chip for main lifts
  const mainLifts=['Bench Press','Squat','Deadlift','Overhead Press','Pull-Ups'];
  const tracked=mainLifts.find(function(l){return S.workouts.some(function(w){return w.exercises.find(function(e){return e.name===l;});});});
  if(tracked) cmds.push('How is my '+tracked+' progressing?');
  return cmds.slice(0,4);
}

async function requestChartAnalysis(){
  if(!S.selEx||S.chartAnalysisLoading)return;
  if(!hasKey()){S.chartAnalysis=aiKeyMessage();S.chartAnalysisEx=S.selEx;S.chartAnalysisLoading=false;render();setTimeout(drawChart,0);return;}
  S.chartAnalysisLoading=true;S.chartAnalysisEx=S.selEx;S.chartAnalysis=null;render();setTimeout(drawChart,0);
  try{
    const ex=S.selEx;
    const rows=S.workouts.filter(function(w){return w.exercises.find(function(e){return e.name===ex;});}).map(function(w){
      const e=w.exercises.find(function(e){return e.name===ex;});
      const ws=e.sets.filter(function(s){return !s.warmup;});
      if(!ws.length)return null;
      const best=ws.reduce(function(b,s){return e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b;},ws[0]);
      return{date:fmtD(w.date),top:toDisp(best.w)+uLbl()+'×'+best.r,e1rm:Math.round(Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);}))*10)/10};
    }).filter(Boolean).reverse();
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({model:MODEL,max_tokens:600,messages:[{role:'user',content:
      'You are an expert strength coach. Analyze this athlete\'s '+ex+' progression and give a short, specific insight.\n\n'+
      'DATA ('+rows.length+' sessions, '+S.unit+'):\n'+rows.map(function(r){return r.date+': '+r.top+' \u2192 e1RM '+r.e1rm;}).join('\n')+'\n\n'+
      'Profile: '+JSON.stringify(S.profile)+'\n\n'+
      'Write 3 short sections using markdown:\n'+
      '### Trend\nOne sentence on the trajectory \u2014 cite actual numbers.\n'+
      '### Strengths\nWhat is going well? Reference specific data points.\n'+
      '### Next step\nOne concrete recommendation with exact target weight/reps for the next session.\n'+
      'Keep it under 120 words total. Be specific, not generic.'}]})});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    S.chartAnalysis=parseAIResponse(extractText(data.content)).message||extractText(data.content);
  }catch(e){S.chartAnalysis='Could not load analysis. Check your connection.';}
  S.chartAnalysisLoading=false;render();setTimeout(drawChart,0);
}

// Chat voice
function toggleChatVoice(){
  if(S.chatListening){
    if(S.chatVoiceRec){S.chatVoiceRec.stop();S.chatVoiceRec=null;}
    S.chatListening=false;
    const vb=document.querySelector('.vc-btn');if(vb)vb.classList.remove('on');
    return;
  }
  S.chatListening=true;
  const vb=document.querySelector('.vc-btn');if(vb)vb.classList.add('on');
  let draft=S.chatDraft;
  S.chatVoiceRec=makeVoice(
    function(fin){
      draft=(draft+' '+fin).trim();S.chatDraft=draft;
      const inp=document.getElementById('chat-input');
      if(inp){inp.value=draft;autoRes(inp);}
    },
    function(interim){
      const inp=document.getElementById('chat-input');
      if(inp){inp.value=(draft+(interim?' '+interim:'')).trim();autoRes(inp);}
    },
    function(){
      S.chatListening=false;S.chatVoiceRec=null;
      const inp=document.getElementById('chat-input');if(inp){inp.value=S.chatDraft;autoRes(inp);}
      const vb=document.querySelector('.vc-btn');if(vb)vb.classList.remove('on');
    }
  );
  if(!S.chatVoiceRec){S.chatListening=false;const vb=document.querySelector('.vc-btn');if(vb)vb.classList.remove('on');}
}

// Inline AI voice
function toggleInlineVoice(){
  if(S.inlineAIListening){
    if(S.inlineAIVoiceRec){S.inlineAIVoiceRec.stop();S.inlineAIVoiceRec=null;}
    S.inlineAIListening=false;
    const vb=document.getElementById('inline-vbtn');if(vb)vb.className='sm-vc-btn';return;
  }
  S.inlineAIListening=true;
  const vb=document.getElementById('inline-vbtn');if(vb)vb.className='sm-vc-btn on';
  let draft=S.inlineAIDraft;
  S.inlineAIVoiceRec=makeVoice(
    function(fin){
      draft=(draft+' '+fin).trim();S.inlineAIDraft=draft;
      const inp=document.getElementById('inline-ta');
      if(inp){inp.value=draft;autoResI(inp);}
    },
    function(interim){
      const inp=document.getElementById('inline-ta');
      if(inp){inp.value=(draft+(interim?' '+interim:'')).trim();autoResI(inp);}
    },
    function(){
      S.inlineAIListening=false;S.inlineAIVoiceRec=null;
      const inp=document.getElementById('inline-ta');if(inp){inp.value=S.inlineAIDraft;autoResI(inp);}
      const vb=document.getElementById('inline-vbtn');if(vb)vb.className='sm-vc-btn';
    }
  );
  if(!S.inlineAIVoiceRec){S.inlineAIListening=false;const vb=document.getElementById('inline-vbtn');if(vb)vb.className='sm-vc-btn';}
}

function applyAction(action){
  try{
    if(action.type==='update_profile'&&action.updates){
      Object.assign(S.profile,action.updates);
      persist('ll_profile',S.profile);
      return true;
    }
    if(action.type==='update_schedule'&&action.days){
      // Log the current schedule before overwriting
      S.scheduleHistory.push({
        ts: new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}),
        schedule: {...S.schedule}
      });
      if(S.scheduleHistory.length>20) S.scheduleHistory.shift(); // cap at 20 entries
      Object.assign(S.schedule,action.days);
      Object.values(action.days).forEach(function(sp){
        if(sp!=='rest'&&!S.splitEx[sp]){S.splitEx[sp]=DEF_EX[sp]||[];persist('ll_splits',S.splitEx);}
      });
      persist('ll_schedule',S.schedule);return true;
    }
    if(action.type==='update_split_exercises'&&action.split){S.splitEx[action.split]=action.exercises||[];persist('ll_splits',S.splitEx);return true;}
    if(action.type==='add_exercise'&&action.split&&action.exercise){
      if(!S.splitEx[action.split])S.splitEx[action.split]=[];
      if(!S.splitEx[action.split].includes(action.exercise))S.splitEx[action.split].push(action.exercise);
      persist('ll_splits',S.splitEx);
      if(S.workout&&S.workout.split===action.split&&!S.workout.exercises.find(function(e){return e.name===action.exercise;}))
        S.workout.exercises.push({name:action.exercise,sets:[],inputW:getLastW(action.exercise),inputR:'5'});
      return true;
    }
    if(action.type==='remove_exercise'&&action.split&&action.exercise){
      S.splitEx[action.split]=(S.splitEx[action.split]||[]).filter(function(e){return e!==action.exercise;});
      persist('ll_splits',S.splitEx);
      if(S.workout&&S.workout.split===action.split)S.workout.exercises=S.workout.exercises.filter(function(e){return e.name!==action.exercise;});
      return true;
    }
    if(action.type==='workout_reorder_exercises'&&action.exercises&&S.workout){
      // Reorder current workout exercises to match the given name array
      const names=action.exercises;
      const exMap={};
      S.workout.exercises.forEach(function(ex){exMap[ex.name]=ex;});
      const reordered=[];
      names.forEach(function(name){
        // fuzzy match — case insensitive
        const key=Object.keys(exMap).find(function(k){return k.toLowerCase()===name.toLowerCase();});
        if(key&&exMap[key]){reordered.push(exMap[key]);delete exMap[key];}
      });
      // Any not mentioned go at the end
      Object.values(exMap).forEach(function(ex){reordered.push(ex);});
      S.workout.exercises=reordered;
      syncWorkoutToTemplate();
      return true;
    }
    if(action.type==='workout_add_exercise'&&action.exercise){
      if(S.workout){
        if(!S.workout.exercises.find(function(e){return e.name===action.exercise;}))S.workout.exercises.push({name:action.exercise,sets:[],inputW:getLastW(action.exercise),inputR:'5'});syncWorkoutToTemplate();
      } else {
        // No active workout — add to the scheduled split template for today
        const todaySplit=S.schedule[todayKey()];
        if(todaySplit&&todaySplit!=='rest'){
          if(!S.splitEx[todaySplit])S.splitEx[todaySplit]=[];
          if(!S.splitEx[todaySplit].includes(action.exercise))S.splitEx[todaySplit].push(action.exercise);
          persist('ll_splits',S.splitEx);
        }
      }
      return true;
    }
    if(action.type==='workout_remove_exercise'&&action.exercise&&S.workout){
      S.workout.exercises=S.workout.exercises.filter(function(e){return e.name!==action.exercise;});syncWorkoutToTemplate();return true;
    }
    if(action.type==='workout_swap_exercise'&&action.from&&action.to&&S.workout){
      const idx=S.workout.exercises.findIndex(function(e){return e.name===action.from;});
      if(idx!==-1)S.workout.exercises[idx]={name:action.to,sets:[],inputW:getLastW(action.to),inputR:'5'};
      else S.workout.exercises.push({name:action.to,sets:[],inputW:getLastW(action.to),inputR:'5'});syncWorkoutToTemplate();
      return true;
    }
    if(action.type==='log_set'&&S.workout){
      const ex=S.workout.exercises[action.exercise_index];
      if(ex){const kgW=action.unit===S.unit?toKg(action.weight):action.weight;ex.sets.push({w:kgW,r:action.reps});}
      return true;
    }
    if(action.type==='set_cardio_mode'&&S.workout){
      // mode: 'time_only' or 'both'
      const idx=action.exercise_index!=null?action.exercise_index:0;
      const ex=S.workout.exercises[idx];
      if(ex)ex.trackM2=(action.mode==='both');
      return true;
    }
    if(action.type==='navigate')return true;
  }catch(e){console.error('applyAction:',e,action);}
  return false;
}

function parseAIResponse(text){
  try{
    const clean=text.replace(/```json|```/g,'').trim();
    const s=clean.indexOf('{');const e=clean.lastIndexOf('}');
    return JSON.parse(s!==-1?clean.slice(s,e+1):clean);
  }catch(e){
    // AI returned plain text instead of JSON — treat it as a message with no actions
    return {message:text,actions:[]};
  }
}
// Extract the text content from a response that may include thinking blocks
function extractText(content){
  if(!content||!content.length)return '';
  // Find the last text block (thinking blocks come first)
  for(let i=content.length-1;i>=0;i--){
    if(content[i].type==='text')return content[i].text||'';
  }
  return content[0].text||'';
}

// ── MAIN CHAT ─────────────────────────────────────────────────
function buildExerciseHistory(){
  if(!S.workouts.length) return '';

  // Count how many times each exercise has been done in last 6 weeks
  const sixWeeksAgo = Date.now() - 42*24*60*60*1000;
  const counts = {};
  const lastDone = {};
  const e1rmByEx = {};

  S.workouts.forEach(function(w){
    const wDate = new Date(w.date).getTime();
    if(wDate < sixWeeksAgo) return;
    w.exercises.forEach(function(ex){
      const n = ex.name;
      counts[n] = (counts[n]||0) + 1;
      if(!lastDone[n] || wDate > new Date(lastDone[n]).getTime()) lastDone[n] = w.date;
      const ws = ex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
      if(!ws.length) return;
      const best = Math.max.apply(null, ws.map(function(s){return e1rm(s.w,s.r);}));
      if(!e1rmByEx[n] || best > e1rmByEx[n]) e1rmByEx[n] = best;
    });
  });

  // Classify exercise frequency without treating repetition alone as a swap trigger.
  const frequent = [], moderate = [], fresh = [];
  Object.keys(counts).forEach(function(name){
    const c = counts[name];
    if(c >= 8) frequent.push({name:name, count:c, e1rm:e1rmByEx[name]});
    else if(c >= 3) moderate.push({name:name, count:c, e1rm:e1rmByEx[name]});
    else fresh.push({name:name, count:c, e1rm:e1rmByEx[name]});
  });

  // Exercises NOT done recently at all (in schedule but not logged)
  const allScheduled = [];
  Object.values(S.splitEx).forEach(function(exs){
    (exs||[]).forEach(function(e){if(!counts[e])allScheduled.push(e);});
  });

  let out = '\n═══ EXERCISE HISTORY (last 6 weeks) ═══\n';

  if(frequent.length){
    out += '\nFREQUENTLY TRAINED — do not rotate for frequency alone:\n';
    frequent.forEach(function(e){
      out += '  '+e.name+' ('+e.count+'x'+(e.e1rm?' | e1RM '+toDisp(e.e1rm)+S.unit:'')+')\n';
    });
  }

  if(moderate.length){
    out += '\nACTIVE — regularly trained:\n';
    moderate.forEach(function(e){
      out += '  '+e.name+' ('+e.count+'x'+(e.e1rm?' | e1RM '+toDisp(e.e1rm)+S.unit:'')+')  \n';
    });
  }

  if(fresh.length){
    out += '\nNEW/INFREQUENT — recently introduced:\n';
    fresh.forEach(function(e){
      out += '  '+e.name+' ('+e.count+'x)\n';
    });
  }

  if(allScheduled.length){
    out += '\nSCHEDULED BUT NOT YET LOGGED:\n';
    out += '  '+allScheduled.slice(0,8).join(', ')+'\n';
  }

  out += '\nROTATION GUIDANCE: Protect successful patterns. Before recommending any exercise change, check whether the exercise is still progressing, whether performance is near all-time highs, whether there is evidence of a plateau, and whether there is evidence of pain or recovery issues. Prefer multiple independent signals when identifying risks or weaknesses; one metric alone should usually be an OBSERVATION, not a strong RECOMMENDATION. Exercise frequency is context, not a reason by itself to swap. If an exercise is progressing and there are no recovery or injury concerns, classify it as WORKING WELL and explain why it should be kept. A recommendation must clear a higher bar than high frequency, many sessions performed, or desire for variety. Only recommend a swap when progress has plateaued, performance declined for multiple sessions, pain/discomfort is reported, recovery issues are linked to the movement, a muscle group is underdeveloped and another movement would target it better, or the user explicitly wants variety. Retain Bench Press, Squat, Deadlift, Overhead Press, Row, Pull-Up, and similar compounds when they are still progressing.\n';

  return out;
}

function buildWeekContext(){
  if(!S.workouts.length)return 'NO HISTORY YET.';
  const now=new Date();

  // ── Session frequency by week (last 13 weeks) ──────────────
  const weekBuckets=[];
  for(let w=0;w<13;w++){
    const wEnd=new Date(now); wEnd.setDate(now.getDate()-w*7);
    const wStart=new Date(wEnd); wStart.setDate(wEnd.getDate()-7);
    const sessions=S.workouts.filter(function(x){const d=new Date(x.date);return d>=wStart&&d<wEnd;});
    weekBuckets.push({week:w,sessions:sessions,count:sessions.length,splits:sessions.map(function(s){return s.split;})});
  }
  const thisWeek=weekBuckets[0];
  const lastWeek=weekBuckets[1];

  // ── Detect gap weeks (illness/travel) ─────────────────────
  const gapWeeks=weekBuckets.filter(function(b){return b.week>0&&b.count<=1;}).map(function(b){return b.week+' weeks ago ('+b.count+' session)';});

  // ── Detect deload weeks: all weights ~40% lower than surrounding weeks ─
  const deloadWeeks=[];
  weekBuckets.slice(1,12).forEach(function(b){
    if(b.count<2)return;
    const avgW=b.sessions.reduce(function(acc,s){
      const ws=s.exercises.reduce(function(a,e){return a+e.sets.filter(function(x){return !x.warmup&&x.w>0;}).reduce(function(aa,x){return aa+x.w;},0);},0);
      return acc+ws;
    },0)/b.count;
    const prevB=weekBuckets[b.week+1];
    if(!prevB||prevB.count<2)return;
    const prevAvg=prevB.sessions.reduce(function(acc,s){
      const ws=s.exercises.reduce(function(a,e){return a+e.sets.filter(function(x){return !x.warmup&&x.w>0;}).reduce(function(aa,x){return aa+x.w;},0);},0);
      return acc+ws;
    },0)/prevB.count;
    if(prevAvg>0&&avgW/prevAvg<0.72)deloadWeeks.push(b.week+' weeks ago');
  });

  // ── Per-exercise e1RM history (last 8 occurrences each) ──
  const exHistory={};
  S.workouts.forEach(function(w){
    w.exercises.forEach(function(ex){
      if(isCardioEx(ex.name))return;
      const ws=ex.sets.filter(function(s){return !s.warmup&&s.w>0&&s.r>0;});
      if(!ws.length)return;
      const best=Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);}));
      if(!exHistory[ex.name])exHistory[ex.name]=[];
      if(exHistory[ex.name].length<8)exHistory[ex.name].push({date:w.date,e1rm:toDisp(best),split:w.split});
    });
  });

  // ── Detect sustained regressions (3+ sessions declining) ──
  const sustained=[];
  Object.keys(exHistory).forEach(function(name){
    const vals=exHistory[name];
    if(vals.length<3)return;
    // vals[0] = most recent
    let streak=0;
    for(let i=0;i<vals.length-1;i++){
      if(vals[i].e1rm<vals[i+1].e1rm)streak++;
      else break;
    }
    if(streak>=2)sustained.push(name+': declining '+streak+' sessions in a row ('+vals[streak].e1rm+'→'+vals[0].e1rm+' '+S.unit+')');
  });

  // ── Detect muscle group suppression ─────────────────────
  // Group exercises by push/pull/legs and check if one group dropped while others didn't
  const groupTrends={push:[],pull:[],legs:[]};
  const pushEx=['Bench Press','Overhead Press','Incline Bench','Tricep Pushdown','Lateral Raise','Dips'];
  const pullEx=['Deadlift','Barbell Row','Pull-ups','Face Pull','Bicep Curl','Lat Pulldown'];
  const legsEx=['Squat','Romanian Deadlift','Leg Press','Leg Curl','Hip Thrust','Calf Raise'];

  Object.keys(exHistory).forEach(function(name){
    const vals=exHistory[name];
    if(vals.length<2)return;
    const diff=vals[0].e1rm-vals[1].e1rm;
    if(pushEx.some(function(e){return name.toLowerCase().includes(e.toLowerCase());}))groupTrends.push.push(diff);
    else if(pullEx.some(function(e){return name.toLowerCase().includes(e.toLowerCase());}))groupTrends.pull.push(diff);
    else if(legsEx.some(function(e){return name.toLowerCase().includes(e.toLowerCase());}))groupTrends.legs.push(diff);
  });

  const groupSummary=[];
  Object.keys(groupTrends).forEach(function(g){
    const diffs=groupTrends[g];
    if(!diffs.length)return;
    const avg=diffs.reduce(function(a,b){return a+b;},0)/diffs.length;
    if(avg<-3)groupSummary.push(g+' SUPPRESSED (avg '+Math.round(avg)+' '+S.unit+' across exercises)');
    else if(avg>3)groupSummary.push(g+' PROGRESSING (avg +'+Math.round(avg)+' '+S.unit+')');
    else groupSummary.push(g+' STABLE');
  });

  // ── Detect PR peaks followed by regression ────────────────
  const prRegressions=[];
  Object.keys(exHistory).forEach(function(name){
    const vals=exHistory[name];
    if(vals.length<3)return;
    // Find if there was a peak then drop
    const peak=Math.max.apply(null,vals.map(function(v){return v.e1rm;}));
    const current=vals[0].e1rm;
    if(peak>current&&peak-current>5){
      const peakIdx=vals.findIndex(function(v){return v.e1rm===peak;});
      if(peakIdx>0)prRegressions.push(name+': peaked at '+peak+' '+S.unit+', now '+current+' (down '+(peak-current)+')');
    }
  });

  // ── E1RM trend table (recent vs previous) ────────────────
  const trends=[];
  Object.keys(exHistory).forEach(function(name){
    const vals=exHistory[name];
    if(vals.length<2)return;
    const diff=Math.round((vals[0].e1rm-vals[1].e1rm)*10)/10;
    const arrow=diff>0?'↑':diff<0?'↓':'→';
    trends.push(name+': '+arrow+' '+vals[1].e1rm+'→'+vals[0].e1rm+' '+S.unit+(diff!==0?' ('+( diff>0?'+':'')+diff+')':''));
  });

  // ── Bodyweight exercise tracking ─────────────────────────
  const bwTrends=[];
  S.workouts.slice(0,10).forEach(function(w){
    w.exercises.forEach(function(ex){
      const bwSets=ex.sets.filter(function(s){return s.w===0&&s.r>0;});
      if(!bwSets.length)return;
      const maxReps=Math.max.apply(null,bwSets.map(function(s){return s.r;}));
      if(!exHistory[ex.name+'_bw'])exHistory[ex.name+'_bw']=[{date:w.date,reps:maxReps}];
    });
  });

  return 'TRAINING CONTEXT ('+S.workouts.length+' total sessions logged):\n\n'+
    'THIS WEEK: '+thisWeek.count+' sessions ('+thisWeek.splits.join(', ')+')\n'+
    'LAST WEEK: '+lastWeek.count+' sessions ('+lastWeek.splits.join(', ')+')\n\n'+
    (gapWeeks.length?'⚠ GAP WEEKS DETECTED: '+gapWeeks.join('; ')+'\n  → Likely illness, travel, or injury during these periods\n\n':'')+
    (deloadWeeks.length?'✓ DELOAD WEEKS DETECTED: '+deloadWeeks.join(', ')+'\n  → These are intentional recovery weeks, NOT regressions\n\n':'')+
    'MUSCLE GROUP STATUS:\n'+groupSummary.map(function(s){return '  '+s;}).join('\n')+'\n\n'+
    (sustained.length?'⚠ SUSTAINED REGRESSIONS (3+ sessions declining):\n'+sustained.map(function(s){return '  '+s;}).join('\n')+'\n\n':'')+
    (prRegressions.length?'📉 POST-PR REGRESSIONS (peaked then dropped):\n'+prRegressions.map(function(s){return '  '+s;}).join('\n')+'\n  → Normal after PR attempts, may need deload or technique work\n\n':'')+
    'E1RM HISTORY PER EXERCISE (most recent first):\n'+
    Object.keys(exHistory).filter(function(k){return !k.endsWith('_bw');}).map(function(name){
      const vals=exHistory[name];
      return '  '+name+': '+vals.map(function(v){return v.e1rm;}).join('→')+' '+S.unit;
    }).join('\n');
}

function buildLegacySysPrompt(){
  const today=todayKey();
  const workoutCtx=S.workout?{split:S.workout.split,exercises:S.workout.exercises.map(function(ex,idx){
    const lastSess=getLastSession(ex.name);
    return{index:idx,name:ex.name,
      sets_logged:ex.sets.map(function(s){return{w:toDisp(s.w),r:s.r,warmup:s.warmup||false,unit:S.unit};}),
      last_session:lastSess?{date:lastSess.date,w:toDisp(lastSess.w),r:lastSess.r,e1rm:toDisp(lastSess.e1)}:null
    };
  })}:null;

  // Expanded history — 15 sessions instead of 5
  const recentWorkouts=S.workouts.slice(0,15).map(function(w){
    return{
      date:fmtD(w.date),
      split:w.split,
      total_sets:w.exercises.reduce(function(a,e){return a+e.sets.filter(function(s){return !s.warmup;}).length;},0),
      exercises:w.exercises.map(function(e){
        const ws=e.sets.filter(function(s){return !s.warmup&&(s.w>0||s.r>0);});
        if(!ws.length)return{name:e.name,note:'no working sets'};
        const best_e1rm=e.sets.some(function(s){return s.w===0;})?
          'BW×'+Math.max.apply(null,e.sets.map(function(s){return s.r;}))+'reps':
          toDisp(Math.max.apply(null,ws.map(function(s){return e1rm(s.w,s.r);})))+' '+S.unit;
        const topSet=ws.reduce(function(b,s){return e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b;},ws[0]);
        return{name:e.name,best_e1rm:best_e1rm,top_set:toDisp(topSet.w)+' '+S.unit+'×'+topSet.r};
      })
    };
  });

  const profileCtx=Object.keys(S.profile).some(function(k){return S.profile[k]&&S.profile[k]!==''&&S.profile[k]!==60&&S.profile[k]!==5;})?
    '\n═══ ATHLETE PROFILE ═══\n'+
    (S.profile.name?'Name: '+S.profile.name+'\n':'')+
    (S.profile.goal?'Goal: '+S.profile.goal+'\n':'')+
    (S.profile.experience?'Experience: '+S.profile.experience+'\n':'')+
    (S.profile.equipment?'Equipment: '+S.profile.equipment+'\n':'')+
    'Preferred session duration: '+S.profile.session_duration+' min\n'+
    'Preferred exercises per session: '+S.profile.exercises_per_session+'\n'+
    (S.profile.injuries?'Injuries/limitations: '+S.profile.injuries+'\n':'')+
    (S.profile.bodyweight?'Bodyweight: '+S.profile.bodyweight+'\n':'')+
    (S.profile.height?'Height: '+S.profile.height+'\n':'')+
    (S.profile.preferences?'Preferences: '+S.profile.preferences+'\n':''):'';

  return 'You are an expert AI strength coach inside Forma. You have deep knowledge of exercise science, progressive overload, injury prevention, and periodization.\n\n'+
    profileCtx+
    '═══ ATHLETE CONTEXT ═══\n'+
    'TODAY: '+DAY_FULL[today]+' | SCHEDULED: '+(SPLIT_LBL[S.schedule[today]]||S.schedule[today])+'\n'+
    'UNIT: '+S.unit+'\n'+
    'CURRENT SCHEDULE: '+DAYS.map(function(d){return DAY_FULL[d].slice(0,3)+':'+( SPLIT_LBL[S.schedule[d]]||S.schedule[d]);}).join(' | ')+'\n'+
    (S.scheduleHistory.length?
      'SCHEDULE CHANGE LOG (most recent first):\n'+
      S.scheduleHistory.slice().reverse().slice(0,5).map(function(h,i){
        return '  ['+(i===0?'previous':'older')+' — '+h.ts+']: '+DAYS.map(function(d){return DAY_FULL[d].slice(0,3)+':'+(SPLIT_LBL[h.schedule[d]]||h.schedule[d]);}).join(' | ');
      }).join('\n')+'\n'
    :'')+
    '\n'+
    '═══ CURRENT WORKOUT ═══\n'+
    (workoutCtx?JSON.stringify(workoutCtx,null,1):'None active')+'\n\n'+
    '═══ RECENT SESSIONS (last 15) ═══\n'+
    JSON.stringify(recentWorkouts,null,1)+'\n\n'+
    // ── Progressive overload targets ──────────────────────────
    (function(){
      const todaySplit=S.schedule[today];
      if(!todaySplit||todaySplit==='rest')return '';
      const exsToday=S.splitEx[todaySplit]||[];
      if(!exsToday.length)return '';
      const lines=exsToday.map(function(name){
        const last=getLastSession(name);
        if(!last||!last.w||!last.r)return name+': first time — pick a moderate starting weight';
        const suggested=S.unit==='kg'?Math.round((last.w+2.5)*2)/2:Math.round((last.w+5)/2.5)*2.5;
        return name+': last '+toDisp(last.w)+uLbl()+'×'+last.r+' → suggest trying '+toDisp(suggested)+uLbl()+'×'+last.r+' or '+toDisp(last.w)+uLbl()+'×'+(last.r+1)+' today';
      });
      return '═══ TODAY\'S PROGRESSIVE OVERLOAD TARGETS ('+spLbl(todaySplit)+') ═══\n'+lines.join('\n')+'\n\n';
    })()+
    // ── Last debrief ──────────────────────────────────────────
    (S.workouts.length&&S.workouts[0].debrief?
      '═══ LAST SESSION COACH DEBRIEF ═══\n'+S.workouts[0].debrief+'\n\n':'')+
    buildWeekContext()+'\n'+
    buildExerciseHistory()+'\n\n'+
    '═══ COACHING RULES ═══\n'+
    '1. ALWAYS cite specific numbers from the data (weights, reps, e1RM, dates)\n'+
    '2. Distinguish deload weeks from real regressions — deload weeks are INTENTIONAL\n'+
    '3. Gap weeks (≤1 session) = likely illness/travel — acknowledge this context\n'+
    '4. If one muscle group is suppressed while others progress = probable injury pattern\n'+
    '5. Post-PR regression is NORMAL — don\'t flag it as a problem without context\n'+
    '6. Pull-ups/bodyweight exercises: track REPS not e1RM — suggest adding weight when reps exceed 10\n'+
    '7. Never give generic advice when specific data is available\n'+
    '8. Before any anatomical claim, verify it. Cable directions (High-to-Low=lower chest, Low-to-High=upper chest)\n'+
    '9. When user asks about exercise science or anatomy, give evidence-based answers with sources\n'+
    '10. If you see a sustained 3+ week regression, investigate cause before recommending solution\n'+
    '11. When building or filling exercises for a split, ALWAYS use update_split_exercises (full replace), never add_exercise one by one. This ensures the list matches exactly what you proposed.\n'+
    '12. When proposing exercises and user confirms, send update_split_exercises for EACH split with the EXACT exercises you listed — no more, no less.\n'+
    '13. CRITICAL: When the user asks to change their schedule (e.g. "change to push pull legs"), ALWAYS do TWO things in the same response: (1) update_schedule AND (2) update_split_exercises for EVERY new split with a full science-backed exercise list. Never just update the schedule and ask what exercises to add — always fill them automatically. The user should get a complete, ready-to-train program in one shot.\n'+
    '14. CRITICAL: update_schedule MUST be sent as a JSON action — not just described in text. If you say a schedule changed, a new schedule was set, or you confirm a change the user requested ("change it", "do it", "apply", "yes", "perfect"), you MUST include {"type":"update_schedule","days":{...}} in the actions array with ALL 7 days. A message saying "Done! Schedule updated" with an empty actions array is a bug — the app cannot read your text, only the actions array.\n'+
    '17. When the user says "change it back", "undo", "revert", or "go back to the original schedule", look at SCHEDULE CHANGE LOG in ATHLETE CONTEXT and use the [previous] entry\'s exact day values to build the update_schedule action. Never guess or reconstruct from chat text — only use the logged data. If the log is empty, say you don\'t have a prior state to revert to.\n'+
    '18. SHORT CONFIRMATIONS ("yes", "ok", "sure", "do it", "go ahead", "yeah", "please", "change it", "swap it"): ALWAYS look at your immediately preceding message to understand what was proposed, then execute it. Never ask for clarification on a short confirmation — the user is saying yes to whatever you just offered. If you asked "Want me to make the switch?" and the user says "yes", make the switch.\n'+
    '19. PROGRESSIVE OVERLOAD: When the user starts or is about to start a workout, proactively mention the TODAY\'S PROGRESSIVE OVERLOAD TARGETS. When they log a set that matches or beats the suggested target, acknowledge it. When they ask "what weight should I use" for any exercise, always reference the last session data and suggest a specific number.\n'+
    '20. BEFORE GIVING TRAINING ADVICE, inspect all available user data first: recent workouts, exercise history, PR/e1RM trends, schedule, current split, warmup vs working sets, progression suggestions, exercise frequency, and current workout context. Use the logs before asking for outside information.\n'+
    '21. QUESTIONS: Do not ask follow-up questions unless the missing information would materially change the recommendation. If logs are enough for the next training decision, give the recommendation now. You may briefly note missing nutrition/sleep/stress data only when relevant.\n'+
    '22. COACHING MODES: Use RECOMMENDATION when the data supports a clear action, OBSERVATION when there is a pattern but not enough evidence to change the plan, and QUESTION only when more information is required before useful advice is possible.\n'+
    '23. Be decisive when evidence is strong. Give exact next actions (for example, "Increase Leg Extension to 110 lb next session") instead of vague "maybe/if you feel good" phrasing.\n'+
    '24. Be honest when evidence is weak. Say "I would not prescribe a deload yet" or "This is worth monitoring" when the logs do not justify a change.\n'+
    '25. Avoid fake precision. Never use confidence percentages or exact certainty scores. Use natural language like "This is a strong recommendation," "This is worth monitoring," or "I do not have enough data to make that call."\n'+
    '26. Never dress guesses as science. If no formula or threshold was used, do not imply one. If making an inference, label it as an inference.\n'+
    '27. When the user asks for coaching advice, prioritize one clear action and include: the single best recommendation, evidence from their data, expected benefit, downside/tradeoff, and what to monitor next.\n'+
    '28. DELOADS: Be conservative. Recommend a deload only if multiple primary compound lifts decline meaningfully across recent sessions, OR performance drops plus user-reported fatigue/soreness/poor sleep exists, OR volume/intensity has been high for several weeks and recent performance is broadly declining. Otherwise classify it as OBSERVATION, not RECOMMENDATION.\n'+
    '29. PHYSIQUE: Acknowledge missing nutrition data briefly, but still give the best training recommendation from the logs. Do not let the answer become mostly about missing nutrition unless the user specifically asks about nutrition.\n'+
    '30. EXERCISE SUBSTITUTIONS: Protect successful patterns. Before recommending any exercise change, check: (1) is the exercise still progressing, (2) is performance near all-time highs, (3) is there evidence of a plateau, and (4) is there evidence of pain or recovery issues. If an exercise is still progressing and there are no recovery or injury concerns, DO NOT recommend changing it; classify it as WORKING WELL and explain why it should be kept. Be biased toward preserving successful training patterns rather than changing them. A recommendation must clear a higher bar than high frequency, many sessions performed, or desire for variety. Never recommend rotation solely because an exercise has been performed many times. Only justify a swap if progress has plateaued, performance has declined for multiple sessions, pain/discomfort is reported, recovery issues are linked to the movement, a muscle group is underdeveloped and a different movement would target it better, or the user explicitly wants variety. The substitute must still match primary muscle, movement pattern, angle or joint function, and role in the current workout. Explain why the substitute fits. Bench Press, Squat, Deadlift, Overhead Press, Row, Pull-Up, and similar compounds should generally be retained if they are still progressing. Never make swaps that feel random.\n'+
    '31. RISK/WEAKNESS ASSESSMENT: Prefer multiple independent signals before identifying a risk, weakness, or strong corrective action. Weak evidence is a single metric dropping. Stronger evidence is several signals pointing to the same conclusion, such as an exercise declining, related volume increasing, user-reported irritation, and other lifts reaching all-time highs. Avoid drawing conclusions from a single metric. If only one signal exists, classify it as OBSERVATION and say it is worth monitoring, not a strong recommendation.\n'+
    '32. When possible, format coaching answers as: RECOMMENDATION or OBSERVATION or QUESTION, then EVIDENCE bullets, WHY THIS HELPS, TRADEOFF, NEXT CHECK. Keep it concise. Do not write long essays unless asked.\n'+
    '33. Do not sound apologetic by default. Be humble when uncertain and confident when the data is strong.\n'+
    '34. Do not use markdown tables in chat. They do not fit the mobile layout. Use short bullets or compact lines instead.\n'+
    '35. CAUSATION AND CONFIDENCE: Separate what the logs clearly show from your interpretation. For root-cause, weakness, limiter, pain, or "why is this happening" questions, use this compact structure when appropriate: Observation, Likely contributor, Other possibilities, Next.\n'+
    '36. Use confidence language: "high confidence" only when multiple independent signals support the same conclusion; "medium confidence" when evidence is plausible but incomplete; "low confidence" when data is weak. Do not use confidence percentages.\n'+
    '37. Do not treat correlation as causation. Do not say an issue is causing a weakness unless evidence is very strong. Prefer "likely contributor" or "may be limiting" when the cause is plausible but not proven.\n'+
    '38. Do not anchor every answer on one explanation. If shoulder irritation or another issue was already discussed, acknowledge it briefly only when relevant, then also consider recovery, sleep, nutrition, volume, exercise selection, recent PRs, and normal performance variation.\n'+
    '39. For "biggest limiter", "biggest weakness", or "one thing to improve" answers, do not give only one cause unless evidence is very strong. Include 1-3 other plausible explanations when relevant, then one practical next action.\n'+
    '40. MEDICAL/PAIN LANGUAGE: Do not diagnose injuries. Do not say "fix the shoulder" or imply the app can treat pain. Say "manage the shoulder irritation", "avoid aggravating movements", and "consider getting it assessed if it persists".\n'+
    '16. Only send update_profile ONCE per response, and ONLY when you have new information to save that differs from what is already in the profile. Do not send it on every message — only when something actually changed.\n\n'+
    '═══ RESPONSE FORMAT ═══\n'+
    'Respond ONLY with JSON: {"message":"your reply","actions":[]}\n'+
    'Use markdown in message: **bold** for key data points, numbered lists, ### headers for sections\n'+
    'Be direct and specific. If data clearly shows X, say X. If cause is incomplete, state the uncertainty briefly and give the best practical next step.\n\n'+
    '═══ ACTIONS ═══\n'+
    '- update_profile: {"type":"update_profile","updates":{"goal":"build muscle and lose fat","session_duration":"60-70 min","exercises_per_session":"5"}} — update athlete profile. Use free text for all fields. ALWAYS send this action when user mentions their goals, preferences, session length, injuries, or experience. Do not just acknowledge — actually update the profile.\n'+
    '- update_schedule: {"type":"update_schedule","days":{"mon":"push","tue":"pull","wed":"legs","thu":"upper","fri":"lower","sat":"rest","sun":"rest"}} — REPLACES the weekly schedule. MUST include ALL 7 days (mon/tue/wed/thu/fri/sat/sun). Use split names: push/pull/legs/upper/lower/rest, or any custom name. ALWAYS send this when the user confirms a schedule change, says "change it", "do it", "apply it", "yes" after you proposed a new schedule, or asks to shift days forward/backward. NEVER say "Done" or "Updated" without sending this action.\n'+
    '- IMPORTANT: workout_add_exercise only works when a workout is ACTIVELY IN PROGRESS (S.workout exists). If no workout is active and user asks to add an exercise to a day/split, use add_exercise instead to update the split template.\n'+
    '- update_split_exercises: {"type":"update_split_exercises","split":"upper","exercises":["Bench Press","Barbell Row"]} — REPLACES the entire exercise list for that split. Use this when building or rebuilding a program. Always use this (not add_exercise) when the user asks to fill/create/build exercises for a day.\n'+
    '- add_exercise / remove_exercise: {"type":"add_exercise","split":"push","exercise":"Name"} — adds/removes ONE exercise. Only use for single additions, not program building.\n'+
    '- workout_reorder_exercises: {"type":"workout_reorder_exercises","exercises":["A","B","C"]} — first = top of screen\n'+
    '- workout_swap_exercise: {"type":"workout_swap_exercise","from":"X","to":"Y"}\n'+
    '- workout_add_exercise / workout_remove_exercise: {"type":"workout_add_exercise","exercise":"Name"}\n'+
    '- log_set: {"type":"log_set","exercise_index":0,"weight":80,"reps":5,"unit":"'+S.unit+'"}\n'+
    '- navigate: {"type":"navigate","view":"log|home|progress|setup"}\n\n'+
    'Split names can be anything. Capitalize exercise names. Always offer to implement changes if recommending program adjustments.';
}

function classifyAIIntent(question){
  const q=String(question||'').toLowerCase();
  if(/\b(today|tonight|next exercise|prioritize today|do today|this workout|current workout|start|session)\b/.test(q))return 'today_plan';
  if(/\b(progress|progressing|improving|fastest|increase weight|ready to increase|overload|pr|stronger|lift is improving)\b/.test(q))return 'progression';
  if(/\b(weakness|weakest|limiting|limiter|lagging|biggest thing|one thing|improve only one)\b/.test(q))return 'weakness';
  if(/\b(goal|trying to do|think my goal|objective|aim)\b/.test(q))return 'goal_inference';
  if(/\b(replace|replacing|swap|substitute|switch|change exercise|alternative)\b/.test(q)){
    return /\b(replace|replacing)\b/.test(q)?'replacement':'exercise_swap';
  }
  if(/\b(recovery|recover|fatigue|tired|sore|pain|irritation|deload|rest|sleep)\b/.test(q))return 'recovery';
  if(/\b(overall|am i progressing|training going|month|week)\b/.test(q))return 'overall_progress';
  return 'general';
}

function aiAllExerciseNames(){
  const names=[];
  Object.values(S.splitEx||{}).forEach(function(exs){(exs||[]).forEach(function(n){if(n)names.push(n);});});
  (S.workouts||[]).forEach(function(w){(w.exercises||[]).forEach(function(e){if(e&&e.name)names.push(e.name);});});
  if(S.workout)(S.workout.exercises||[]).forEach(function(e){if(e&&e.name)names.push(e.name);});
  return [...new Set(names)];
}

function aiRelevantExercises(question,intent){
  const q=String(question||'').toLowerCase();
  const mentioned=aiAllExerciseNames().filter(function(name){return q.indexOf(String(name).toLowerCase())!==-1;});
  if(mentioned.length)return mentioned.slice(0,6);
  if(intent==='today_plan'){
    const today=todayKey();
    const sp=S.workout?S.workout.split:S.schedule[today];
    return (S.workout?S.workout.exercises.map(function(e){return e.name;}):(S.splitEx[sp]||[])).slice(0,8);
  }
  return [];
}

function aiWorkingSets(ex){
  return ((ex&&ex.sets)||[]).filter(function(s){return s&&!s.warmup&&Number(s.r)>0&&(Number(s.w)>0||Number(s.w)===0);});
}

function aiTopSet(sets){
  if(!sets||!sets.length)return null;
  return sets.reduce(function(best,set){return e1rm(set.w,set.r)>e1rm(best.w,best.r)?set:best;},sets[0]);
}

function aiExerciseSessions(name,limit){
  const target=String(name||'').toLowerCase();
  return (S.workouts||[]).filter(function(w){return w&&w.date&&Array.isArray(w.exercises);}).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);}).map(function(w){
    const ex=w.exercises.find(function(e){return e&&String(e.name||'').toLowerCase()===target;});
    if(!ex)return null;
    const sets=aiWorkingSets(ex);
    if(!sets.length)return null;
    const top=aiTopSet(sets);
    return {
      date:fmtD(w.date),
      split:w.split,
      sets:sets.slice(0,3).map(function(s){return toDisp(s.w)+uLbl()+' x '+s.r;}),
      top:toDisp(top.w)+uLbl()+' x '+top.r,
      e1:Math.round(e1rm(top.w,top.r)*10)/10
    };
  }).filter(Boolean).slice(0,limit||4);
}

function aiRecentSessions(limit){
  return (S.workouts||[]).slice(0,limit||8).map(function(w){
    const exs=(w.exercises||[]).map(function(ex){
      const sets=aiWorkingSets(ex);
      if(!sets.length)return null;
      const top=aiTopSet(sets);
      return ex.name+' '+toDisp(top.w)+uLbl()+' x '+top.r;
    }).filter(Boolean).slice(0,8);
    return fmtD(w.date)+' '+spLbl(w.split)+': '+exs.join('; ');
  });
}

function aiExerciseTrendSummaries(limit){
  const summaries=aiAllExerciseNames().map(function(name){
    const sessions=aiExerciseSessions(name,4);
    if(sessions.length<2)return null;
    const recent=sessions[0];
    const prev=sessions[sessions.length-1];
    const diff=Math.round((recent.e1-prev.e1)*10)/10;
    return {
      name:name,
      sessions:sessions.length,
      recent:recent.top,
      previous:prev.top,
      e1_change:diff,
      line:name+': recent '+recent.top+', previous '+prev.top+', e1RM change '+(diff>0?'+':'')+diff+' '+uLbl()
    };
  }).filter(Boolean).sort(function(a,b){return Math.abs(b.e1_change)-Math.abs(a.e1_change);});
  return summaries.slice(0,limit||12);
}

function aiMuscleGroupStatus(){
  const groups={push:['bench','press','pushdown','raise','fly','dip'],pull:['row','pull','pulldown','curl','deadlift','face pull'],legs:['squat','leg','lunge','rdl','romanian','hip thrust','calf']};
  const out=[];
  Object.keys(groups).forEach(function(group){
    const trends=aiExerciseTrendSummaries(20).filter(function(t){
      const n=t.name.toLowerCase();
      return groups[group].some(function(k){return n.indexOf(k)!==-1;});
    });
    if(!trends.length)return;
    const avg=trends.reduce(function(a,t){return a+t.e1_change;},0)/trends.length;
    out.push(group+': '+(avg>2?'improving':avg<-2?'declining':'stable')+' across '+trends.length+' tracked exercises');
  });
  return out;
}

function aiProfileContext(){
  return [
    S.profile.goal?'Goal: '+S.profile.goal:'',
    S.profile.experience?'Experience: '+S.profile.experience:'',
    S.profile.equipment?'Equipment: '+S.profile.equipment:'',
    S.profile.injuries?'Limitations: '+S.profile.injuries:'',
    S.profile.preferences?'Preferences: '+S.profile.preferences:'',
    'Session preference: '+(S.profile.session_duration||60)+' min, '+(S.profile.exercises_per_session||5)+' exercises',
    'Unit: '+S.unit
  ].filter(Boolean).join('\n');
}

function aiScheduleContext(){
  return DAYS.map(function(d){return DAY_FULL[d].slice(0,3)+': '+spLbl(S.schedule[d]);}).join(' | ');
}

function aiCurrentWorkoutContext(){
  if(!S.workout)return 'None active';
  return spLbl(S.workout.split)+': '+(S.workout.exercises||[]).map(function(ex,idx){
    const sets=aiWorkingSets(ex);
    return (idx+1)+'. '+ex.name+(sets.length?' logged '+sets.slice(0,3).map(function(s){return toDisp(s.w)+uLbl()+' x '+s.r;}).join(', '):' no working sets yet');
  }).join(' | ');
}

function aiConfidenceLabel(conf){
  conf=String(conf||'medium').toLowerCase();
  if(conf==='high')return 'High confidence';
  if(conf==='low')return 'Low confidence';
  return 'Medium confidence';
}

function aiCleanRecommendationText(text){
  return String(text||'')
    .replace(/<br\s*\/?>/g,' ')
    .replace(/\s+/g,' ')
    .replace(/^I'd recommend /,'')
    .trim();
}

function aiRecommendationActionText(rec){
  if(!rec||!rec.detail)return '';
  return aiCleanRecommendationText(String(rec.detail).split('Why:')[0]).replace(/\.$/,'');
}

function aiRecommendationWhyText(rec){
  if(!rec||!rec.detail)return '';
  const parts=String(rec.detail).split('Why:');
  return parts.length>1?aiCleanRecommendationText(parts[1]):'';
}

function aiCurrentInputForExercise(name){
  if(!S.workout||!Array.isArray(S.workout.exercises))return null;
  const ex=S.workout.exercises.find(function(e){return e&&e.name===name;});
  return ex?ex.inputW:null;
}

function aiRecommendationEngineLines(names,limit){
  if(typeof getOverloadSuggestion!=='function')return [];
  const seen={};
  return (names||[]).filter(Boolean).map(function(name){
    if(seen[name])return null;
    seen[name]=true;
    const rec=getOverloadSuggestion(name,aiCurrentInputForExercise(name));
    if(!rec)return null;
    const action=aiRecommendationActionText(rec);
    const why=aiRecommendationWhyText(rec);
    return name+': '+action+'. '+aiConfidenceLabel(rec.confidence)+'. Engine state: '+(rec.state||rec.trend||rec.action||'recommendation')+'. Evidence: '+(why||rec.reason||'recent working-set history supports this.');
  }).filter(Boolean).slice(0,limit||8);
}

function aiRecommendationCandidates(question,intent){
  const names=aiRelevantExercises(question,intent);
  if(names.length)return names;
  if(intent==='today_plan'){
    const today=todayKey();
    const sp=S.workout?S.workout.split:S.schedule[today];
    return (S.workout?S.workout.exercises.map(function(e){return e.name;}):(S.splitEx[sp]||[])).slice(0,10);
  }
  if(intent==='progression'||intent==='overall_progress'||intent==='weakness'){
    return aiExerciseTrendSummaries(12).map(function(t){return t.name;});
  }
  return aiAllExerciseNames().slice(0,12);
}

function aiRecommendationEngineContext(question,intent){
  const lines=aiRecommendationEngineLines(aiRecommendationCandidates(question,intent),8);
  return lines.length?'Forma recommendation engine signals:\n'+lines.join('\n'):'Forma recommendation engine signals: none strong enough to show.';
}

function aiTodayPlanContext(question){
  const today=todayKey();
  const sp=S.workout?S.workout.split:S.schedule[today];
  const exs=S.workout?S.workout.exercises.map(function(e){return e.name;}):(S.splitEx[sp]||[]);
  return 'INTENT: today_plan\nToday: '+DAY_FULL[today]+' / '+spLbl(sp)+'\nExercises: '+exs.join(', ')+'\nCurrent workout: '+aiCurrentWorkoutContext()+'\nRecent history for today exercises:\n'+exs.slice(0,8).map(function(name){
    const rows=aiExerciseSessions(name,4);
    return name+': '+(rows.length?rows.map(function(r){return r.date+' '+r.top;}).join(' -> '):'no working-set history');
  }).join('\n')+'\n'+aiRecommendationEngineContext(question,'today_plan');
}

function aiProgressionContext(intent){
  const trends=aiExerciseTrendSummaries(12);
  return 'INTENT: '+intent+'\nExercise trend summaries (working sets only):\n'+
    (trends.length?trends.map(function(t){return '- '+t.line;}).join('\n'):'No exercise trends yet')+
    '\nRecent sessions:\n'+aiRecentSessions(8).join('\n')+
    '\n'+aiRecommendationEngineContext('',intent);
}

function aiWeaknessContext(){
  const trends=aiExerciseTrendSummaries(12);
  const lagging=trends.filter(function(t){return t.e1_change<0;}).slice(0,5);
  const improving=trends.filter(function(t){return t.e1_change>0;}).slice(0,5);
  return 'INTENT: weakness\nMuscle group status:\n'+(aiMuscleGroupStatus().join('\n')||'Not enough grouped data')+
    '\nLagging/declining exercises:\n'+(lagging.length?lagging.map(function(t){return '- '+t.line;}).join('\n'):'No clear declines')+
    '\nTop improving exercises for comparison:\n'+(improving.length?improving.map(function(t){return '- '+t.line;}).join('\n'):'No clear improvements')+
    '\nRecent sessions:\n'+aiRecentSessions(6).join('\n')+
    '\n'+aiRecommendationEngineContext('', 'weakness');
}

function aiGoalContext(){
  const allEx=aiAllExerciseNames().slice(0,30);
  const repSamples=aiExerciseTrendSummaries(12).map(function(t){return t.name+': '+t.recent;});
  return 'INTENT: goal_inference\nProfile:\n'+aiProfileContext()+
    '\nSchedule: '+aiScheduleContext()+
    '\nTotal sessions: '+(S.workouts||[]).length+
    '\nExercise selection: '+allEx.join(', ')+
    '\nRecent top-set pattern: '+repSamples.join(' | ');
}

function aiSwapContext(question,intent){
  const relevant=aiRelevantExercises(question,intent);
  return 'INTENT: '+intent+'\nTarget exercise(s): '+(relevant.join(', ')||'not specified')+
    '\nSubstitution rules: match primary muscle, movement pattern, angle/joint function, equipment, and workout role. Protect exercises that are progressing.'+
    '\nProfile limitations: '+(S.profile.injuries||'none saved')+
    '\nRecent target history:\n'+(relevant.length?relevant.map(function(name){
      const subs=typeof getExerciseSubstitutions==='function'?getExerciseSubstitutions(name).slice(0,4).map(function(s){return s.name;}).join(', '):'';
      const rows=aiExerciseSessions(name,4).map(function(r){return r.date+' '+r.top;}).join(' -> ');
      return name+': '+(rows||'no recent working-set history')+(subs?'\nGood local substitutions: '+subs:'');
    }).join('\n'):'No target named. Ask for the exercise if needed before prescribing a swap.')+
    '\n'+aiRecommendationEngineContext(question,intent);
}

function aiRecoveryContext(){
  const sessions=aiRecentSessions(8);
  const trends=aiExerciseTrendSummaries(12);
  const declines=trends.filter(function(t){return t.e1_change<0;}).slice(0,6);
  return 'INTENT: recovery\nProfile limitations/pain notes: '+(S.profile.injuries||'none saved')+
    '\nRecent frequency: '+sessions.length+' sessions in recent context\nRecent sessions:\n'+sessions.join('\n')+
    '\nDecline signals:\n'+(declines.length?declines.map(function(t){return '- '+t.line;}).join('\n'):'No clear multi-exercise decline in compact context')+
    '\n'+aiRecommendationEngineContext('', 'recovery');
}

function buildCompactAIContext(question,intent){
  if(intent==='today_plan')return aiTodayPlanContext(question);
  if(intent==='progression'||intent==='overall_progress')return aiProgressionContext(intent);
  if(intent==='weakness')return aiWeaknessContext();
  if(intent==='goal_inference')return aiGoalContext();
  if(intent==='exercise_swap'||intent==='replacement')return aiSwapContext(question,intent);
  if(intent==='recovery')return aiRecoveryContext();
  return 'INTENT: general\nProfile:\n'+aiProfileContext()+'\nSchedule: '+aiScheduleContext()+'\nCurrent workout: '+aiCurrentWorkoutContext()+'\nCompact recent sessions:\n'+aiRecentSessions(6).join('\n')+'\nTop exercise trends:\n'+aiExerciseTrendSummaries(8).map(function(t){return '- '+t.line;}).join('\n')+'\n'+aiRecommendationEngineContext(question,intent);
}

function buildSysPrompt(question){
  const intent=classifyAIIntent(question);
  const today=todayKey();
  const profileCtx=aiProfileContext();
  const compactCtx=buildCompactAIContext(question,intent);
  const coachingCtx=typeof formatCoachingAnalysisForPrompt==='function'?formatCoachingAnalysisForPrompt(buildCoachingAnalysis()):'COACHING ANALYSIS: unavailable.';
  const scheduleLog=S.scheduleHistory&&S.scheduleHistory.length?
    '\nRecent schedule history: '+S.scheduleHistory.slice().reverse().slice(0,2).map(function(h){return h.ts+' '+DAYS.map(function(d){return d+':'+h.schedule[d];}).join(', ');}).join(' | '):'';

  return 'You are Forma, an expert AI strength coach. Coach in first person with concise, practical, evidence-based answers.\n\n'+
    'ATHLETE BASICS\n'+profileCtx+'\nToday: '+DAY_FULL[today]+' / '+spLbl(S.schedule[today])+'\nSchedule: '+aiScheduleContext()+scheduleLog+'\n\n'+
    'COACHING ANALYSIS\n'+coachingCtx+'\n\n'+
    'RECOMMENDATION ENGINE AND COMPACT DATA\n'+compactCtx+'\n\n'+
    'CORE COACHING RULES\n'+
    '- Reason in this order: Coaching Analysis, Forma recommendation engine, then raw workout history. Do not let one isolated negative exercise outrank a stronger pattern-level issue.\n'+
    '- Before answering coaching questions, evaluate all five analysis levels: 1) individual exercises, 2) specific muscle groups, 3) movement patterns, 4) program-level relationships, 5) root-cause hypotheses. Do not stop at the first exercise-level trend.\n'+
    '- Priority order is program-level patterns > muscle-group patterns > movement-pattern trends > individual exercises. Report the highest-value supported insight first, not the most negative isolated exercise.\n'+
    '- If direct arm work, isolation work, or one accessory is flat while compounds progress, frame that as a possible program-level pattern before discussing the single exercise.\n'+
    '- If COACHING ANALYSIS identifies conflicting signals, discuss the conflict directly instead of collapsing it into one negative exercise.\n'+
    '- Observation first, conclusion second. Separate what the data directly shows from what might explain it. Use labels like "Observation:" and "Interpretation:" for weakness, limiter, recovery, pain, or root-cause answers.\n'+
    '- Never present an interpretation as a fact. Say "may", "might", "possible", "likely", or "worth monitoring" unless the evidence is strong enough for firmer wording.\n'+
    '- Require multiple signals before naming a weakness, limitation, trend, or root cause. Strong claims need 2-3 supporting signals, such as multiple sessions, related exercises moving together, notes, readiness, or recommendation-engine agreement.\n'+
    '- Do not call 1-2 data points a trend. One signal is "worth monitoring"; two consistent signals are a "possible trend"; 3+ consecutive sessions or multiple related exercises can be a "clear trend".\n'+
    '- Avoid "biggest weakness" traps. When asked for the biggest weakness, first decide whether a meaningful weakness exists. If most lifts are progressing, say training appears to be working and identify only smaller areas to monitor.\n'+
    '- Do not search for problems when the broader pattern is positive. Protect athlete confidence: acknowledge progress before discussing minor regressions.\n'+
    '- Use the workout data before asking questions. Cite actual weights, reps, sessions, trends, or missing-data limits.\n'+
    '- If RECOMMENDATION ENGINE AND COMPACT DATA includes "Forma recommendation engine signals" with a real recommendation, explicitly reference it before adding your own coaching context. Example: "Forma\'s recommendation engine currently suggests increasing OHP to 115 lbs because..."\n'+
    '- Every recommendation must include a visible confidence label: "Confidence: High", "Confidence: Medium", or "Confidence: Low". Use the recommendation engine confidence when available. If you are making your own recommendation, base confidence on data quality, history length, agreement across signals, and whether warm-ups were excluded.\n'+
    '- Confidence must match evidence quality. High requires multiple exercises, multiple sessions, and a consistent pattern. Medium means limited data or a partial pattern. Low means a single signal or speculative explanation.\n'+
    '- Avoid assigning High confidence to hypotheses, likely contributors, or causal explanations unless multiple independent signals support that explanation.\n'+
    '- Ignore warm-up sets for progress, PR, weakness, and recommendation judgments unless the user asks about warm-ups.\n'+
    '- Be decisive only when multiple signals support the same conclusion. If evidence is weak, say so clearly and prefer monitoring over prescription.\n'+
    '- Follow double progression: build reps first, add weight only after repeated top-range success, then reset reps realistically.\n'+
    '- Protect successful training patterns. Do not recommend swaps just because an exercise is frequent.\n'+
    '- Exercise swaps must match muscle, movement pattern, angle/joint function, equipment, and workout role.\n'+
    '- Bodyweight movements should use reps/volume first unless added weight is clearly tracked.\n'+
    '- Do not use markdown tables; they do not fit the mobile chat. Use compact bullets or short sections.\n'+
    '- For root-cause, limiter, weakness, pain, or "why" questions, separate Observation, Interpretation, Other possibilities, and Next when appropriate.\n'+
    '- Distinguish correlation from cause. Say "sleep disruption and squat regression occurred during the same period" before saying sleep may be contributing. Do not say sleep caused it unless the data proves that.\n'+
    '- Do not diagnose injuries. Say "manage irritation" or "avoid aggravating movements"; suggest assessment if pain persists.\n'+
    '- Do not anchor every answer on one prior issue. Consider recovery, sleep, nutrition, volume, exercise selection, recent PRs, and normal variation when relevant.\n\n'+
    'ACTION RULES\n'+
    '- Respond ONLY with JSON: {"message":"your reply","actions":[]}\n'+
    '- Use actions only when the user asks to change data or clearly confirms a previous change.\n'+
    '- update_profile when the user gives new goals, preferences, session length, injuries, or experience.\n'+
    '- update_schedule must include all 7 days. update_split_exercises replaces a split list. add_exercise/remove_exercise are single changes.\n'+
    '- workout_* actions only affect an active workout. log_set must use the current display unit.\n'+
    '- Keep normal coaching answers concise: one clear recommendation, the evidence, and the next check.';
}

async function sendChat(){
  const inp=document.getElementById('chat-input');
  const text=(inp?inp.value.trim():S.chatDraft.trim());
  if(!text||S.chatLoading)return;
  if(S.chatListening&&S.chatVoiceRec){try{S.chatVoiceRec.stop();}catch(e){} S.chatVoiceRec=null;S.chatListening=false;}
  S.chatDraft='';if(inp){inp.value='';inp.style.height='auto';}
  S.messages.forEach(function(m){if(m&&m.rawContent)delete m.rawContent;});
  S.messages.push({role:'user',text:text,time:NOW(),actions:[]});
  const actionReply=handleUserActionIntent(text);
  if(actionReply){
    S.messages.push({role:'ai',text:actionReply,time:NOW(),actions:[]});
    saveMessages();
    render();
    return;
  }
  if(!hasKey()){
    S.messages.push({role:'ai',text:aiKeyMessage(),time:NOW(),actions:[]});
    saveMessages();
    render();
    return;
  }
  S.messages.push({role:'typing'});
  S.chatLoading=true;render();
  try{
    const cleanMsgs=S.messages.filter(function(m){return m.role!=='typing';});
    const prior=cleanMsgs.slice(-3,-1).map(function(m){
      return{role:m.role==='ai'?'assistant':'user',content:m.text||''};
    });
    const apiMsgs=prior.concat([{role:'user',content:text}]);
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({model:MODEL,max_tokens:5000,thinking:{type:"enabled",budget_tokens:1800},system:buildSysPrompt(text),messages:apiMsgs})});
    const data=await resp.json();
    if(data.error)throw new Error('API error: '+data.error.message);
    const parsed=parseAIResponse(extractText(data.content));
    S.messages=S.messages.filter(function(m){return m.role!=='typing';});
    const applied=[];
    (parsed.actions||[]).forEach(function(a){if(applyAction(a))applied.push(a);});
    S.messages.push({role:'ai',text:parsed.message||'Done.',time:NOW(),actions:applied});
    saveMessages();
    const navAct=(parsed.actions||[]).find(function(a){return a.type==='navigate';});
    if(navAct){S.view=navAct.view;if(navAct.view==='progress'){const ns=[...new Set(S.workouts.flatMap(function(w){return w.exercises.map(function(e){return e.name;});}))];S.selEx=ns[0]||'';}}
  }catch(e){
    S.messages=S.messages.filter(function(m){return m.role!=='typing';});
    S.messages.push({role:'ai',text:'Error: '+e.message,time:NOW(),actions:[]});
  }
  S.chatLoading=false;render();
}
function sendQuick(text){
  S.chatDraft=text;
  const inp=document.getElementById('chat-input');
  if(inp){inp.value=text;autoRes(inp);}
  sendChat();
}


async function sendInlineAI(){
  const inp=document.getElementById('inline-ta');
  const text=(inp?inp.value.trim():S.inlineAIDraft.trim());
  if(!text||S.inlineAILoading)return;
  if(!hasKey()){S.inlineAIReply=aiKeyMessage();render();return;}
  if(S.inlineAIListening&&S.inlineAIVoiceRec){try{S.inlineAIVoiceRec.stop();}catch(e){} S.inlineAIVoiceRec=null;S.inlineAIListening=false;}
  S.inlineAIDraft='';S.inlineAIReply='';S.inlineAILoading=true;
  if(inp){inp.value='';inp.style.height='auto';}
  render();
  try{
    const w=S.workout;
    const ctx=w?{split:w.split,exercises:w.exercises.map(function(ex,idx){return{index:idx,name:ex.name,sets:ex.sets.map(function(s){return{w:toDisp(s.w),r:s.r,warmup:s.warmup||false,unit:S.unit};})};})}:null;
    const sys='You are an AI strength coach mid-workout. Be brief (1-2 sentences).\n\n'+
      'WORKOUT: '+JSON.stringify(ctx)+'\nUNIT: '+S.unit+'\n\n'+
      'Use available workout data first, including warmup vs working sets. Do not ask a question unless the missing information would materially change the next action.\n'+
      'Use RECOMMENDATION when the data supports a clear action, OBSERVATION when it is only a pattern to monitor, and QUESTION only when more information is required before useful advice is possible.\n'+
      'Be decisive when evidence is strong, honest when evidence is weak, and avoid fake precision or confidence percentages.\n'+
      'For exercise substitutions, only recommend swaps that match primary muscle, movement pattern, angle or joint function, and role in the current workout; briefly explain why the substitute fits.\n\n'+
      'Respond ONLY with JSON:\n{"message":"short reply","actions":[]}\n\n'+
      'ACTIONS:\n'+
      '- workout_reorder_exercises: {"type":"workout_reorder_exercises","exercises":["Squat","Leg Press","Leg Curl"]} — reorders exercises in THIS workout to the given order, first in list = first on screen\n'+
      '- workout_swap_exercise: {"type":"workout_swap_exercise","from":"X","to":"Y"}\n'+
      '- workout_add_exercise: {"type":"workout_add_exercise","exercise":"Name"}\n'+
      '- workout_remove_exercise: {"type":"workout_remove_exercise","exercise":"Name"}\n'+
      '- set_cardio_mode: {"type":"set_cardio_mode","exercise_index":0,"mode":"time_only"} (mode: "time_only" or "both")\n'+
      '- log_set: {"type":"log_set","exercise_index":0,"weight":80,"reps":5,"unit":"'+S.unit+'"}\n'+
      'Use workout_reorder_exercises when user says "reorder", "put X first", "start with X", or lists exercises in a new order. The first name in the array appears at the top of the screen.\n'+
      'Use set_cardio_mode with mode="time_only" when user says "only time", "no distance", "just minutes", "remove distance".\n'+
      'Use workout_swap_exercise when user says "swap X for Y" or "do Y instead of X". Capitalize exercise names.';
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({model:MODEL,max_tokens:6000,thinking:{type:"enabled",budget_tokens:4000},system:sys,messages:[{role:'user',content:text}]})});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    const parsed=parseAIResponse(extractText(data.content));
    (parsed.actions||[]).forEach(applyAction);
    S.inlineAIReply=parsed.message||'Done!';
    S.messages.push({role:'user',text:'[In-workout] '+text,time:NOW(),actions:[]});
    S.messages.push({role:'ai',text:S.inlineAIReply,time:NOW(),actions:parsed.actions||[]});
    saveMessages();
  }catch(e){S.inlineAIReply='Error: '+e.message;}
  S.inlineAILoading=false;render();
}

// ── EXERCISE RECOMMENDATION ───────────────────────────────────
async function sendRecommend(){
  if(!S.workout||S.inlineAILoading)return;
  if(typeof hasJustifiedWorkoutRecommendation==='function'&&!hasJustifiedWorkoutRecommendation()){
    S.inlineAIReply='I do not see a strong recommendation yet. Log a few working sets first, and I will use your history when there is a clear next move.';
    render();
    return;
  }
  if(!hasKey()){S.inlineAIReply=aiKeyMessage();render();return;}
  S.inlineAIReply='';S.inlineAILoading=true;render();
  try{
    const w=S.workout;
    // Build what's been done today
    const done=w.exercises.map(function(ex,idx){
      const sets=ex.sets.filter(function(s){return !s.warmup;});
      return{
        index:idx,name:ex.name,
        working_sets:sets.length,
        volume:sets.reduce(function(acc,s){return acc+s.w*s.r;},0)
      };
    }).filter(function(e){return e.working_sets>0;});

    const sys=
      'You are an evidence-based strength coach. Recommend the single best next exercise based on what the athlete has done today AND their training history.\n\n'+
      'LOCAL RECOMMENDATION SIGNALS:\n'+
      (typeof buildWorkoutRecommendationEvidence==='function'?buildWorkoutRecommendationEvidence():'No local evidence summary available.')+'\n\n'+
      'EXERCISE SCIENCE KNOWLEDGE BASE:\n'+
      EXERCISE_KB+'\n\n'+
      'ATHLETE HISTORY CONTEXT:\n'+buildWeekContext()+'\n'+buildExerciseHistory()+'\n\n'+
      'CURRENT WORKOUT ('+spLbl(w.split)+'):\n'+
      'Exercises completed so far:\n'+
      (done.length?done.map(function(e){return '  - '+e.name+' ('+e.working_sets+' working sets)';}).join('\n'):'  None yet — this would be the first exercise.')+'\n\n'+
      'ALL exercises in this workout (including ones not yet started):\n'+
      w.exercises.map(function(ex){return '  - '+ex.name;}).join('\n')+'\n\n'+
      'Respond ONLY with JSON (no markdown):\n'+
      '{"message":"your recommendation","actions":[]}\n\n'+
      'Your message MUST:\n'+
      '1. Name ONE specific exercise to do next\n'+
      '2. State which muscle(s) it targets and why it pairs with what was done today\n'+
      '3. If relevant, reference their history (e.g. "your rear delts have been undertrained based on your history")\n'+
      '4. Suggested sets×reps\n'+
      '5. Include a brief tradeoff and what to monitor next\n'+
      'Use RECOMMENDATION when the data supports a clear next exercise, OBSERVATION if the workout already looks complete or evidence is weak, and QUESTION only if more information is required before useful advice is possible.\n'+
      'Do not use confidence percentages, evidence tiers, or citations unless a specific source is truly needed. If making an inference, label it as an inference.\n'+
      'For any substitution-style recommendation, match primary muscle, movement pattern, angle or joint function, and role in the workout.\n'+
      'Be concise — 4–5 sentences. Verify anatomy before stating it.\n'+
      'If the workout looks complete, say so and suggest finishing.';

    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
      model:MODEL,max_tokens:14000,thinking:{type:'enabled',budget_tokens:10000},
      system:sys,
      messages:[{role:'user',content:'Based on what I have done in my '+spLbl(w.split)+' workout today, what single exercise should I do next?'}]
    })});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    const parsed=parseAIResponse(extractText(data.content));
    S.inlineAIReply=parsed.message||'No recommendation.';
  }catch(e){S.inlineAIReply='Error: '+e.message;}
  S.inlineAILoading=false;render();
}

async function sendExInstructChat(){
  const text=S.exInstructDraft.trim();
  if(!text||S.exInstructChatLoading)return;
  S.exInstructChat.push({role:'user',text:text});
  S.exInstructDraft='';
  if(!hasKey()){S.exInstructChat.push({role:'ai',text:aiKeyMessage()});render();return;}
  S.exInstructChatLoading=true;
  render();
  // Scroll chat to bottom
  setTimeout(function(){const el=document.getElementById('ex-instruct-scroll');if(el)el.scrollTop=el.scrollHeight;},50);
  try{
    const messages=[
      {role:'user',content:'Here are the instructions for "'+S.exInstructPanel+'":\n\n'+S.exInstructText}
    ];
    // Add prior Q&A turns
    S.exInstructChat.slice(0,-1).forEach(function(m){
      messages.push({role:m.role==='user'?'user':'assistant',content:m.text});
    });
    messages.push({role:'user',content:text});
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
      model:MODEL,max_tokens:2500,
      thinking:{type:'enabled',budget_tokens:1024},
      system:'You are an expert strength coach. Answer concisely about the exercise "'+S.exInstructPanel+'". Be practical, specific, and under 120 words unless the question genuinely needs more detail.',
      messages:messages
    })});
    const data=await resp.json();
    if(data.error)throw new Error(data.error.message);
    S.exInstructChat.push({role:'ai',text:extractText(data.content)});
  }catch(e){
    S.exInstructChat.push({role:'ai',text:'Sorry, could not get an answer: '+e.message});
  }
  S.exInstructChatLoading=false;
  render();
  setTimeout(function(){const el=document.getElementById('ex-instruct-scroll');if(el)el.scrollTop=el.scrollHeight;},50);
}

async function showExInstruct(name){
  S.exInstructPanel=name;
  S.exInstructText=null;
  S.exInstructLoading=hasKey();
  S.exInstructChat=[];
  S.exInstructDraft='';
  S.exInstructChatLoading=false;
  render();
  if(!hasKey()){
    S.exInstructText=aiKeyMessage();
    S.exInstructLoading=false;
    render();
    return;
  }
  // Try with thinking first, then without, then fall back to static content
  const prompt=
    'Give concise, expert instructions for how to perform "'+name+'" with perfect form. Structure your response with these sections:\n\n'+
    '**Setup** — starting position, grip, stance\n'+
    '**Execution** — step by step movement cues (3-5 bullet points)\n'+
    '**Key cues** — 2-3 short coaching cues to remember\n'+
    '**Common mistakes** — 2-3 things to avoid\n\n'+
    'Keep it practical and actionable. No fluff. Under 200 words total.';
  const sys='You are an expert strength and conditioning coach. Give clear, practical exercise instructions.';
  let text=null;
  // Attempt 1: with thinking (budget ≥1024 required)
  try{
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
      model:MODEL,max_tokens:3000,thinking:{type:'enabled',budget_tokens:1024},
      stream:false,system:sys,messages:[{role:'user',content:prompt}]
    })});
    const raw=await resp.text();
    console.log('[ExInstruct attempt1 raw]',raw.slice(0,400));
    const data=JSON.parse(raw);
    if(!data.error) text=extractText(data.content);
    else console.warn('[ExInstruct attempt1 api error]',JSON.stringify(data.error));
  }catch(e){console.warn('[ExInstruct attempt1 catch]',e.message);}
  // Attempt 2: without thinking
  if(!text){
    try{
      const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
        model:MODEL,max_tokens:1000,stream:false,
        system:sys,messages:[{role:'user',content:prompt}]
      })});
      const raw=await resp.text();
      console.log('[ExInstruct attempt2 raw]',raw.slice(0,400));
      const data=JSON.parse(raw);
      if(!data.error) text=extractText(data.content);
      else console.warn('[ExInstruct attempt2 api error]',JSON.stringify(data.error));
    }catch(e){console.warn('[ExInstruct attempt2 catch]',e.message);}
  }
  S.exInstructText=text||('**'+name+'**\n\nInstructions are unavailable right now. Check your internet connection or AI proxy status and try again by closing and reopening this panel.');
  S.exInstructLoading=false;
  render();
}

// Legacy browser-key cleanup helpers. Current AI calls use the Forma proxy.
function saveKey(inputId){
  const err=document.getElementById('key-err');
  if(err)err.textContent='API keys are managed by the Forma proxy, not saved in the browser.';
  render();
}

function clearApiKey(){localStorage.removeItem('ll_apikey');render();}

function resetKey(){clearApiKey();}
