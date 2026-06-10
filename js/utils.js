// Generic utility helpers for Forma.
var KG2LB=2.20462;
// Shared exercise starting-weight defaults in display lbs. Used by both the app
// and dev-only AI tester before user-specific history exists.
var EX_DEFAULTS={
  // Heavy compounds
  'Squat':135,'Back Squat':135,'Front Squat':95,'Deadlift':135,'Romanian Deadlift':95,
  'Bench Press':95,'Incline Bench':75,'Decline Bench':95,'Barbell Row':75,'Overhead Press':65,
  'Hip Thrust':95,'Good Morning':45,'Hack Squat':90,
  // Machine / moderate
  'Leg Press':180,'Chest Press':90,'Lat Pulldown':70,'Seated Cable Row':70,
  'Cable Row':70,'Smith Machine Squat':95,
  // Light compounds / bodyweight
  'Pull-Up':0,'Pull-ups':0,'Chin-Up':0,'Dips':0,'Push-Up':0,
  // Isolation — lighter
  'Bicep Curl':30,'Hammer Curl':25,'Preacher Curl':30,'Cable Curl':25,
  'Tricep Pushdown':40,'Skull Crusher':40,'Tricep Extension':35,'Overhead Tricep':30,
  'Lateral Raise':15,'Front Raise':15,'Rear Delt Fly':15,'Face Pull':30,
  'Leg Curl':50,'Leg Extension':60,'Calf Raise':90,'Seated Calf Raise':45,
  'Reverse Fly':20,'Cable Fly':30,'Cable Crossover':25,
  'Ab Wheel':0,'Plank':0,'Crunch':0,'Leg Raise':0
};
function NOW(){return new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}
function e1rm(w,r){return Math.round(w*(1+r/30));}
function fmtD(iso){return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});}
function todayKey(){return ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];}
function toDisp(kg){return S.unit==='lbs'?Math.round(kg*KG2LB*10)/10:kg;}
function toKg(v){return S.unit==='lbs'?Math.round(v/KG2LB*100)/100:v;}
function uLbl(){return S.unit;}
function step(){return S.unit==='lbs'?5:2.5;}

function parseSetVoice(text){
  let t=text.toLowerCase();
  const words={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,fifteen:15,twenty:20};
  for(const[w,n]of Object.entries(words))t=t.replace(new RegExp('\\b'+w+'\\b','g'),n);
  const m=t.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|pound|lb)?s?\s*(?:for|x|by|times)?\s*(\d+)/);
  return m?{w:m[1],r:m[2]}:null;
}

function hexA(col,a){return col+Math.round(a*255).toString(16).padStart(2,'0');}

function escH(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');}

function renderMd(raw){
  if(!raw)return '';
  let s=String(raw);
  // Escape HTML first
  s=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Headers
  s=s.replace(/^### (.+)$/gm,'<div style="font-size:12px;font-weight:700;color:var(--white);margin:10px 0 4px;letter-spacing:.03em">$1</div>');
  s=s.replace(/^## (.+)$/gm,'<div style="font-size:13px;font-weight:700;color:var(--white);margin:10px 0 4px">$1</div>');
  // Bold
  s=s.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight:700;color:var(--white)">$1</strong>');
  // Italic
  s=s.replace(/\*(.+?)\*/g,'<em>$1</em>');
  // Numbered lists
  s=s.replace(/^\d+\.\s+(.+)$/gm,function(m,p1){return '<div style="display:flex;gap:8px;margin:4px 0;align-items:flex-start"><span style="color:var(--blue);font-weight:700;flex-shrink:0;min-width:14px">&#8226;</span><span>'+p1+'</span></div>';});
  // Bullet lists
  s=s.replace(/^[-•]\s+(.+)$/gm,'<div style="display:flex;gap:8px;margin:3px 0;align-items:flex-start"><span style="color:var(--blue);flex-shrink:0">&#8226;</span><span>$1</span></div>');
  // Horizontal rule
  s=s.replace(/^---+$/gm,'<hr style="border:none;border-top:1px solid var(--border);margin:8px 0">');
  // Line breaks
  s=s.replace(/\n/g,'<br>');
  // Clean up double breaks after block elements
  s=s.replace(/(<\/div>|<hr[^>]*>)<br>/g,'$1');
  return s;
}
