// Onboarding quiz and feature tour logic.

// ── NEW STEP-BY-STEP ONBOARDING ──────────────────────────────
const OB_STEPS=[
  // 0 — welcome splash
  {type:'splash'},
  // 1 — name
  {type:'text', key:'name', title:"What's your name?", subtitle:'We\'ll personalise your experience.', placeholder:'e.g. Matias', keyboard:'text'},
  // 2 — age
  {type:'text', key:'age', title:'How old are you?', subtitle:'Helps calibrate training volume and recovery.', placeholder:'e.g. 22', keyboard:'numeric'},
  // 3 — preferred unit system
  {type:'choice', multi:false, key:'unit_system', title:'Which units do you prefer?', subtitle:'We\'ll use this for weight, height, and workout logging.',
    options:[
      {val:'Imperial — lbs and inches', svg:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>'},
      {val:'Metric — kg and cm',        svg:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h10"/>'},
    ]},
  // 4 — bodyweight
  {type:'text', key:'bodyweight', title:'What\'s your bodyweight?', subtitle:'Used to set strength standards and track progress.', placeholder:'auto', keyboard:'decimal', unitSuffix:true},
  // 5 — height
  {type:'text', key:'height', title:'How tall are you?', subtitle:'Helps fine-tune exercise standards for your build.', placeholder:'auto', keyboard:'decimal', unitSuffix:true},
  // 6 — goal (multi-select)
  {type:'choice', multi:true, key:'goal', title:'What\'s your main goal?', subtitle:'Select all that apply.',
    options:[
      {val:'Build muscle and get bigger',  svg:'<path d="M6 4v6a6 6 0 0012 0V4"/><line x1="6" y1="4" x2="18" y2="4"/>'},
      {val:'Get stronger — improve lifts', svg:'<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>'},
      {val:'Lose fat and get leaner',      svg:'<path d="M12 2a10 10 0 000 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/>'},
      {val:'General fitness and health',  svg:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>'},
      {val:'Athletic performance',        svg:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'},
    ]},
  // 7 — experience (single)
  {type:'choice', multi:false, key:'experience', title:'How long have you been training?', subtitle:'Be honest — this shapes exercise selection.',
    options:[
      {val:'Just starting out (< 6 months)', svg:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'},
      {val:'1–2 years',                      svg:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'},
      {val:'3–5 years',                      svg:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>'},
      {val:'5+ years, advanced lifter',      svg:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'},
    ]},
  // 8 — days per week (single)
  {type:'choice', multi:false, key:'days_per_week', title:'How many days can you train?', subtitle:'Be realistic with your schedule.',
    options:[
      {val:'2 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'3 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'4 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'5 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'6 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
    ]},
  // 9 — session length (single)
  {type:'choice', multi:false, key:'session_duration', title:'How long are your sessions?', subtitle:'Determines how many exercises to programme.',
    options:[
      {val:'30–45 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'45–60 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'60–75 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'75–90+ minutes', svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
    ]},
  // 10 — equipment (multi-select)
  {type:'choice', multi:true, key:'equipment', title:'What equipment do you have?', subtitle:'Select everything available to you.',
    options:[
      {val:'Full commercial gym',          svg:'<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'},
      {val:'Barbell & rack',               svg:'<line x1="4" y1="12" x2="20" y2="12"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/>'},
      {val:'Dumbbells',                    svg:'<line x1="6" y1="12" x2="18" y2="12"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>'},
      {val:'Cables & machines',            svg:'<rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/>'},
      {val:'Bodyweight only',              svg:'<circle cx="12" cy="5" r="3"/><path d="M6.5 8h11l-1 7h-3l-1 5h-2l-1-5H7l-1-7z"/>'},
    ]},
  // 11 — exercise preferences (text, optional)
  {type:'text', key:'exercise_preferences', title:'Any exercises you like?', subtitle:'Optional. I\'ll try to keep these when they fit your goal.', placeholder:'e.g. dumbbells, machines, pull-ups, no barbell bench…', keyboard:'text', optional:true},
  // 12 — exercise dislikes (text, optional)
  {type:'text', key:'exercise_dislikes', title:'Any exercises you dislike?', subtitle:'Optional. I\'ll avoid these when good alternatives exist.', placeholder:'e.g. burpees, back squat, overhead press…', keyboard:'text', optional:true},
  // 13 — injuries (text, optional)
  {type:'text', key:'injuries', title:'Any injuries or limitations?', subtitle:'The AI will work around these. Leave blank if none.', placeholder:'e.g. bad lower back, left shoulder pain…', keyboard:'text', optional:true},
  // 14 — split preference (single)
  {type:'choice', multi:false, key:'split_pref', title:'Training split preference?', subtitle:'If you\'re unsure, let Forma choose the split that best fits your goal, schedule, equipment, and recovery.',
    options:[
      {val:'Let Forma decide', featured:true, svg:'<path d="M12 2l1.8 5.5L19 9.3l-5.2 1.8L12 16.5l-1.8-5.4L5 9.3l5.2-1.8L12 2z"/><path d="M19 15l.9 2.6L22 18.5l-2.1.8L19 22l-.9-2.7-2.1-.8 2.1-.9L19 15z"/>'},
      {val:'Push / Pull / Legs',   svg:'<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>'},
      {val:'Upper / Lower',        svg:'<line x1="12" y1="2" x2="12" y2="22"/><path d="M2 12h20"/>'},
      {val:'Full Body',            svg:'<circle cx="12" cy="12" r="10"/>'},
      {val:'Bro split',            svg:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 000-7.78z"/>'},
    ]},
  // 15 — generating
  {type:'generating'},
];

function obPrefersMetric(){
  const u=String(S.obData.unit_system||'').toLowerCase();
  return u.indexOf('metric')>=0||u.indexOf('kg')>=0;
}
function obUnitFor(key){
  if(key==='bodyweight')return obPrefersMetric()?'kg':'lbs';
  if(key==='height')return obPrefersMetric()?'cm':'';
  return '';
}
function obPlaceholderFor(def){
  if(def.placeholder!=='auto')return def.placeholder||'';
  if(def.key==='bodyweight')return obPrefersMetric()?'80':'175';
  if(def.key==='height')return obPrefersMetric()?'180':'';
  return '';
}
function obSetImperialHeight(){
  const ft=(document.getElementById('ob-height-ft')||document.getElementById('ob-input')||{}).value||'';
  const inch=(document.getElementById('ob-height-in')||{}).value||'';
  S.obData.height_feet=ft;
  S.obData.height_inches=inch;
  S.obData.height=(ft.trim()&&inch.trim())?(ft.trim()+"'"+inch.trim()+'\"'):'';
  obSyncContinue('height',false);
}

function obImperialHeightOk(){
  return String(S.obData.height_feet||'').trim().length>0&&String(S.obData.height_inches||'').trim().length>0;
}

function vOnboarding(){
  const step=S.obStep;
  const def=OB_STEPS[step];

  // ── Splash ───────────────────────────────────────────────────
  if(def.type==='splash'){
    const iconHref=document.querySelector('link[rel=\'apple-touch-icon\']')&&document.querySelector('link[rel=\'apple-touch-icon\']').href||'';
    return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;padding:32px 24px;text-align:center">'+
      '<div style="width:88px;height:88px;border-radius:20px;overflow:hidden;margin-bottom:20px;box-shadow:0 4px 20px rgba(0,0,0,.12)">'+
        '<img src="'+iconHref+'" style="width:100%;height:100%;display:block">'+
      '</div>'+
      '<div style="font-size:30px;font-weight:800;color:var(--white);letter-spacing:-.8px;margin-bottom:10px">Welcome to Forma<span style="color:var(--blue)">.</span></div>'+
      '<div style="font-size:15px;color:var(--sub);line-height:1.7;margin-bottom:40px;max-width:280px">Answer a few quick questions and we\'ll build your personalised training program.</div>'+
      '<div style="display:flex;flex-direction:column;gap:9px;width:100%;max-width:320px;margin-bottom:32px">'+
        ['Takes about 60 seconds','Fully personalised to you','AI builds your schedule','Change anything anytime'].map(function(t){
          return '<div style="display:flex;align-items:center;gap:10px;text-align:left">'+
            '<div style="width:20px;height:20px;border-radius:50%;background:rgba(26,158,212,.15);border:1px solid rgba(26,158,212,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'+
            '</div>'+
            '<span style="font-size:13px;color:var(--sub)">'+t+'</span>'+
          '</div>';
        }).join('')+
      '</div>'+
      '<button class="press" onclick="S.obStep=1;render()" style="width:100%;max-width:320px;background:var(--blue);color:#fff;border:none;border-radius:14px;padding:17px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:-.2px">Get started →</button>'+
      '<button onclick="skipOnboarding()" style="background:none;border:none;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;padding:12px;margin-top:4px">Skip for now</button>'+
    '</div>';
  }

  // ── Generating ───────────────────────────────────────────────
  if(def.type==='generating'){
    return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;padding:32px 24px;text-align:center">'+
      '<div style="margin-bottom:28px">'+
        '<div class="spinner" style="width:44px;height:44px;border-width:3px;margin:0 auto"></div>'+
      '</div>'+
      '<div style="font-size:22px;font-weight:800;color:var(--white);letter-spacing:-.5px;margin-bottom:10px">Building your program…</div>'+
      '<div style="font-size:14px;color:var(--sub);line-height:1.7;max-width:260px">The AI is creating your personalised schedule and exercise selection.</div>'+
    '</div>';
  }

  // ── Progress bar (steps 1–11) ─────────────────────────────────
  const totalSteps=OB_STEPS.length-2; // exclude splash(0) and generating(last)
  const currentStep=step-1; // 0-indexed
  const pct=Math.round((currentStep/totalSteps)*100);

  // ── Text input step ───────────────────────────────────────────
  if(def.type==='text'){
    const cur=S.obData[def.key]||'';
    const canNext=def.optional||String(cur).trim().length>0;
    const isImperialHeight=def.key==='height'&&!obPrefersMetric();
    if(isImperialHeight){
      const ft=S.obData.height_feet||'';
      const inch=S.obData.height_inches||'';
      const heightOk=ft.trim().length>0&&inch.trim().length>0;
      return '<div style="display:flex;flex-direction:column;min-height:90vh;padding:0">'+
        obProgressBar(pct,step)+
        '<div style="flex:1;padding:32px 24px 24px;display:flex;flex-direction:column">'+
          '<div style="font-size:24px;font-weight:800;color:var(--white);letter-spacing:-.5px;margin-bottom:8px;line-height:1.2">'+def.title+'</div>'+
          '<div style="font-size:14px;color:var(--sub);margin-bottom:32px;line-height:1.6">Helps personalize strength standards and exercise recommendations.</div>'+
          '<div style="display:flex;gap:10px;width:100%;margin-bottom:12px">'+
            '<div id="ob-input-wrap" style="flex:1;display:flex;align-items:center;background:var(--s1);border:2px solid '+(ft.trim()?'var(--blue)':'var(--border)')+';border-radius:12px;overflow:hidden">'+
              '<input id="ob-input" type="text" inputmode="numeric" value="'+escH(ft)+'" placeholder="5" oninput="obSetImperialHeight()" onblur="render()" style="flex:1;width:100%;background:transparent;border:none;padding:14px 16px;font-size:16px;color:var(--white);outline:none;font-family:inherit">'+
              '<div style="padding:0 16px 0 8px;font-size:15px;font-weight:700;color:var(--sub);white-space:nowrap">ft</div>'+
            '</div>'+
            '<div id="ob-input-wrap-2" style="flex:1;display:flex;align-items:center;background:var(--s1);border:2px solid '+(inch.trim()?'var(--blue)':'var(--border)')+';border-radius:12px;overflow:hidden">'+
              '<input id="ob-height-in" type="text" inputmode="numeric" value="'+escH(inch)+'" placeholder="11" oninput="obSetImperialHeight()" onblur="render()" style="flex:1;width:100%;background:transparent;border:none;padding:14px 16px;font-size:16px;color:var(--white);outline:none;font-family:inherit">'+
              '<div style="padding:0 16px 0 8px;font-size:15px;font-weight:700;color:var(--sub);white-space:nowrap">in</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        obFooter(step, heightOk)+
      '</div>';
    }
    return '<div style="display:flex;flex-direction:column;min-height:90vh;padding:0">'+
      // Progress
      obProgressBar(pct,step)+
      // Content
      '<div style="flex:1;padding:32px 24px 24px;display:flex;flex-direction:column">'+
        '<div style="font-size:24px;font-weight:800;color:var(--white);letter-spacing:-.5px;margin-bottom:8px;line-height:1.2">'+def.title+'</div>'+
        '<div style="font-size:14px;color:var(--sub);margin-bottom:32px;line-height:1.6">'+(def.key==='height'?'Helps personalize strength standards and exercise recommendations.':def.subtitle)+'</div>'+
        '<div style="display:flex;align-items:center;width:100%;background:var(--s1);border:2px solid '+(String(cur).trim()?'var(--blue)':'var(--border)')+';border-radius:12px;margin-bottom:12px;overflow:hidden" id="ob-input-wrap">'+
          '<input id="ob-input" type="'+(def.keyboard==='numeric'||def.keyboard==='decimal'?'text':def.keyboard)+'" inputmode="'+(def.keyboard)+'" '+
            'value="'+escH(cur)+'" '+
            'placeholder="'+obPlaceholderFor(def)+'" '+
            'oninput="S.obData[\''+def.key+'\']=this.value;obSyncContinue(\''+def.key+'\','+(def.optional?'true':'false')+')" '+
            'onblur="render()" '+
            'style="flex:1;width:100%;background:transparent;border:none;padding:14px 16px;font-size:16px;color:var(--white);outline:none;font-family:inherit">'+
          (def.unitSuffix&&obUnitFor(def.key)?'<div style="padding:0 16px 0 8px;font-size:15px;font-weight:700;color:var(--sub);white-space:nowrap">'+obUnitFor(def.key)+'</div>':'')+
        '</div>'+
      '</div>'+
      // Footer
      obFooter(step, canNext)+
    '</div>';
  }

  // ── Choice step ───────────────────────────────────────────────
  if(def.type==='choice'){
    const multi=!!def.multi;
    const arr=Array.isArray(S.obData[def.key])?S.obData[def.key]:(S.obData[def.key]?[S.obData[def.key]]:[]);
    const showOther=def.other!==false;
    const otherSel=arr.includes('__other__');
    const otherText=S.obData[def.key+'_other']||'';
    const canNext=arr.length>0&&(!showOther||!otherSel||otherText.trim().length>0);
    return '<div style="display:flex;flex-direction:column;min-height:90vh;padding:0">'+
      obProgressBar(pct,step)+
      '<div style="flex:1;padding:28px 24px 16px;display:flex;flex-direction:column;overflow-y:auto">'+
        '<div style="font-size:24px;font-weight:800;color:var(--white);letter-spacing:-.5px;margin-bottom:8px;line-height:1.2">'+def.title+'</div>'+
        '<div style="font-size:14px;color:var(--sub);margin-bottom:20px;line-height:1.6">'+def.subtitle+(multi?' Select all that apply.':'')+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:8px">'+
          def.options.map(function(opt){
            const sel=arr.includes(opt.val);
            const featured=!!opt.featured;
            return '<button class="ob-choice-btn" data-key="'+def.key+'" data-val="'+escH(opt.val)+'" data-multi="'+multi+'" '+
              'onclick="obToggleChoice(\''+def.key+'\',\''+opt.val.replace(/'/g,"\\'")+'\',' +multi+')" '+
              'style="display:flex;align-items:center;gap:12px;padding:'+(featured?'15px 14px':'13px 14px')+';border-radius:'+(featured?'14px':'11px')+';'+
              'border:2px solid '+(sel||featured?'var(--blue)':'var(--border)')+';'+
              'background:'+(sel?'rgba(26,158,212,.12)':featured?'linear-gradient(135deg,rgba(26,158,212,.14),rgba(26,158,212,.05))':'var(--s1)')+';'+
              'box-shadow:'+(featured?'0 8px 24px rgba(26,158,212,.12)':'none')+';'+
              'cursor:pointer;font-family:inherit;text-align:left;width:100%;transition:border-color .1s">'+
              '<div style="width:'+(featured?'34px':'28px')+';height:'+(featured?'34px':'28px')+';border-radius:'+(featured?'10px':'7px')+';background:'+(sel||featured?'rgba(26,158,212,.18)':'var(--s2)')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+(sel||featured?'var(--blue)':'var(--sub)')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+opt.svg+'</svg>'+
              '</div>'+
              '<span class="ob-choice-label" style="display:flex;flex-direction:column;gap:2px;font-size:14px;font-weight:'+(sel||featured?800:500)+';color:'+(sel||featured?'var(--blue)':'var(--white)')+'">'+
                '<span>'+opt.val+'</span>'+
                (opt.note?'<span style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.02em">'+opt.note+'</span>':'')+
              '</span>'+
              '<div class="ob-choice-check" style="margin-left:auto;flex-shrink:0;display:'+(sel?'flex':'none')+';width:18px;height:18px;border-radius:50%;background:var(--blue);align-items:center;justify-content:center">'+
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'+
              '</div>'+
            '</button>';
          }).join('')+
          // Other option
          (showOther?'<button class="ob-choice-btn" data-key="'+def.key+'" data-val="__other__" data-multi="'+multi+'" '+
            'onclick="obToggleChoice(\''+def.key+'\',\'__other__\','+multi+')" '+
            'style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:11px;'+
            'border:2px solid '+(otherSel?'var(--blue)':'var(--border)')+';'+
            'background:'+(otherSel?'rgba(26,158,212,.08)':'var(--s1)')+';'+
            'cursor:pointer;font-family:inherit;text-align:left;width:100%;transition:border-color .1s">'+
            '<div style="width:28px;height:28px;border-radius:7px;background:'+(otherSel?'rgba(26,158,212,.15)':'var(--s2)')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+(otherSel?'var(--blue)':'var(--sub)')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>'+
            '</div>'+
            '<span class="ob-choice-label" style="font-size:14px;font-weight:'+(otherSel?700:500)+';color:'+(otherSel?'var(--blue)':'var(--white)')+'">Other</span>'+
            '<div class="ob-choice-check" style="margin-left:auto;flex-shrink:0;display:'+(otherSel?'flex':'none')+';width:18px;height:18px;border-radius:50%;background:var(--blue);align-items:center;justify-content:center">'+
              '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'+
            '</div>'+
          '</button>':'')+
          // Other text input — only shown when Other is selected
          (showOther&&otherSel?
            '<input id="ob-other-input" type="text" placeholder="'+(def.key==='split_pref'?'Describe your preferred split…':'Describe your goal…')+'" '+
              'value="'+escH(otherText)+'" '+
              'oninput="S.obData[\''+def.key+'_other\']=this.value;obSyncChoiceContinue(\''+def.key+'\')" '+
              'style="width:100%;background:var(--s1);border:2px solid '+(otherText.trim()?'var(--blue)':'var(--border)')+';border-radius:11px;padding:13px 14px;font-size:14px;color:var(--white);outline:none;font-family:inherit;margin-top:4px">':
            '')+
        '</div>'+
      '</div>'+
      obFooter(step, canNext)+
    '</div>';
  }

  return '';
}

function obProgressBar(pct,step){
  return '<div style="padding:calc(env(safe-area-inset-top) + 16px) 24px 0">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
      '<button onclick="obBack()" style="background:none;border:none;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;padding:0;display:flex;align-items:center;gap:4px">'+
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Back'+
      '</button>'+
      '<span style="font-size:11px;color:var(--muted);font-weight:600">'+step+' of '+(OB_STEPS.length-2)+'</span>'+
    '</div>'+
    '<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:4px">'+
      '<div style="height:100%;width:'+pct+'%;background:var(--blue);border-radius:2px;transition:width .3s ease"></div>'+
    '</div>'+
  '</div>';
}

function obFooter(step, canNext){
  return '<div style="padding:16px 24px calc(24px + env(safe-area-inset-bottom))">'+
    '<button id="ob-continue-btn" class="press" onclick="obNext()" '+(canNext?'':'disabled')+
      ' style="width:100%;background:'+(canNext?'var(--blue)':'var(--border)')+';color:'+(canNext?'#fff':'var(--muted)')+';border:none;border-radius:14px;padding:17px;font-size:16px;font-weight:700;cursor:'+(canNext?'pointer':'default')+';font-family:inherit;transition:background .15s">'+
      'Continue →'+
    '</button>'+
  '</div>';
}

// Toggle a choice option without full re-render (prevents double-click)
function obToggleChoice(key, val, multi){
  if(!Array.isArray(S.obData[key]))S.obData[key]=S.obData[key]?[S.obData[key]]:[];
  const arr=S.obData[key];
  const idx=arr.indexOf(val);
  if(multi){
    if(idx>=0)arr.splice(idx,1); else arr.push(val);
  } else {
    S.obData[key]=[val]; // single-select: replace
  }
  // If Other was deselected, clear text
  if(val==='__other__'&&idx>=0)S.obData[key+'_other']='';
  // Re-render only when Other is toggled (need to show/hide input)
  if(val==='__other__'){render();return;}
  // Surgical DOM update — no full render
  document.querySelectorAll('.ob-choice-btn[data-key="'+key+'"]').forEach(function(btn){
    const bval=btn.getAttribute('data-val');
    const sel=S.obData[key].includes(bval);
    btn.style.border='2px solid '+(sel?'var(--blue)':'var(--border)');
    btn.style.background=sel?'rgba(26,158,212,.08)':'var(--s1)';
    const lbl=btn.querySelector('.ob-choice-label');
    if(lbl){lbl.style.fontWeight=sel?'700':'500';lbl.style.color=sel?'var(--blue)':'var(--white)';}
    const chk=btn.querySelector('.ob-choice-check');
    if(chk)chk.style.display=sel?'flex':'none';
    const ico=btn.querySelector('div');
    if(ico){ico.style.background=sel?'rgba(26,158,212,.15)':'var(--s2)';}
    const svg=btn.querySelector('svg');
    if(svg)svg.setAttribute('stroke',sel?'var(--blue)':'var(--sub)');
  });
  obSyncChoiceContinue(key);
}

function obSyncChoiceContinue(key){
  const arr=S.obData[key]||[];
  const otherSel=Array.isArray(arr)&&arr.includes('__other__');
  const otherText=(S.obData[key+'_other']||'').trim();
  const ok=arr.length>0&&(!otherSel||otherText.length>0);
  const btn=document.getElementById('ob-continue-btn');
  if(!btn)return;
  btn.disabled=!ok;
  btn.style.background=ok?'var(--blue)':'var(--border)';
  btn.style.color=ok?'#fff':'var(--muted)';
  btn.style.cursor=ok?'pointer':'default';
}

function obBack(){
  if(S.obStep>1)S.obStep--;
  render();
}

// Update just the continue button enabled state without a full re-render
// so the keyboard stays open while typing
function obSyncContinue(key, optional){
  const val=(S.obData[key]||'').trim();
  const btn=document.querySelector('#ob-continue-btn');
  if(!btn)return;
  const ok=key==='height'&&!obPrefersMetric()?obImperialHeightOk():(optional||val.length>0);
  if(key==='height'&&!obPrefersMetric()){
    S.obData.height=ok?(String(S.obData.height_feet||'').trim()+"'"+String(S.obData.height_inches||'').trim()+'\"'):'';
  }
  btn.disabled=!ok;
  btn.style.background=ok?'var(--blue)':'var(--border)';
  btn.style.color=ok?'#fff':'var(--muted)';
  btn.style.cursor=ok?'pointer':'default';
  // Also update border of the input wrapper
  const inp=document.getElementById('ob-input-wrap')||document.getElementById('ob-input');
  if(inp)inp.style.border='2px solid '+(val?'var(--blue)':'var(--border)');
  const inp2=document.getElementById('ob-input-wrap-2');
  if(inp2&&key==='height')inp2.style.border='2px solid '+((S.obData.height_inches||'').trim()?'var(--blue)':'var(--border)');
}

function obNext(){
  const step=S.obStep;
  const def=OB_STEPS[step];
  if(def.type==='text'&&def.key==='height'&&!obPrefersMetric()){
    if(!obImperialHeightOk())return;
    S.obData.height=String(S.obData.height_feet||'').trim()+"'"+String(S.obData.height_inches||'').trim()+'\"';
  }
  if(def.type==='text'&&!def.optional&&!(S.obData[def.key]||'').trim())return;
  if(def.type==='choice'){
    const arr=S.obData[def.key]||[];
    if(!arr.length)return;
    const otherSel=arr.includes('__other__');
    if(otherSel&&!(S.obData[def.key+'_other']||'').trim())return;
    // Flatten: replace __other__ with actual text, join multiple selections
    const resolved=arr.map(function(v){return v==='__other__'?(S.obData[def.key+'_other']||'').trim():v;}).filter(Boolean);
    S.obData[def.key]=def.multi?resolved.join(', '):resolved[0];
    if(def.key==='unit_system'){
      S.unit=String(S.obData.unit_system).toLowerCase().indexOf('metric')>=0?'kg':'lbs';
      persist('ll_unit',S.unit);
    }
  }
  if(step===OB_STEPS.length-2){
    // Last real step — trigger AI generation
    obGenerate();
  } else {
    S.obStep++;
    render();
    // Auto-focus text inputs
    setTimeout(function(){const el=document.getElementById('ob-input');if(el)el.focus();},80);
  }
}

function obNum(val,fallback){
  const m=String(val||'').match(/\d+/);
  return m?Number(m[0]):fallback;
}
function obDuration(val,fallback){
  const nums=(String(val||'').match(/\d+/g)||[]).map(Number);
  if(nums.length>=2)return Math.round((nums[0]+nums[1])/2);
  return nums.length?nums[0]:fallback;
}
function obList(val){
  return String(val||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
}
function obHas(text,words){
  text=String(text||'').toLowerCase();
  return words.some(function(w){return text.indexOf(w)>=0;});
}
function obCanonicalProfile(d){
  const duration=obDuration(d.session_duration,60);
  const goals=obList(d.goal);
  const primaryGoal=goals[0]||'General fitness';
  return{
    name:d.name||'',
    age:d.age||'',
    primaryGoal:primaryGoal,
    secondaryGoal:goals.slice(1).join(', '),
    experience:d.experience||'',
    trainingAge:d.experience||'',
    daysPerWeek:obNum(d.days_per_week,3),
    duration:duration,
    exercisesPerSession:duration<=45?4:duration<=60?5:duration<=75?6:7,
    equipment:d.equipment||'',
    priorityMuscles:obList(d.priority_muscles),
    limitations:d.injuries?obList(d.injuries):[],
    exercisePreferences:d.exercise_preferences||'',
    exerciseDislikes:d.exercise_dislikes||'',
    splitPreference:d.split_pref||''
  };
}
function obSplitTemplates(){
  return[
    {id:'full_3',name:'Full Body x3',days:3,labels:['full','full','full'],goals:['strength','fitness','fat','athletic'],experience:['beginner','intermediate'],recovery:'low',minDuration:30,equipment:['all'],strengths:['High practice frequency for major movement patterns','Efficient fit for three training days','Simple progression with strong recovery margin'],tradeoffs:['Less per-session specialization than PPL','Exercise selection needs to stay focused']},
    {id:'ul_full_3',name:'Upper / Lower / Full Body',days:3,labels:['upper','lower','full'],goals:['strength','muscle','fitness'],experience:['intermediate','advanced'],recovery:'medium',minDuration:45,equipment:['all'],strengths:['Blends focused upper/lower work with one full-body exposure','Good balance for mixed strength and muscle goals'],tradeoffs:['Less simple than Full Body x3','Weekly lower-body stress can be uneven']},
    {id:'ul_2',name:'Upper/Lower x2',days:4,labels:['upper','lower','upper','lower'],goals:['strength','muscle','fitness','fat'],experience:['beginner','intermediate','advanced'],recovery:'medium',minDuration:45,equipment:['all'],strengths:['Clean four-day structure','Balances frequency and recovery','Easy to progress compounds and accessories'],tradeoffs:['Less movement-specific than PPL','Lower days can feel dense if recovery is poor']},
    {id:'full_ul_4',name:'Full Body + Upper/Lower',days:4,labels:['full','upper','lower','full'],goals:['fitness','fat','athletic','strength'],experience:['beginner','intermediate'],recovery:'medium',minDuration:40,equipment:['all'],strengths:['More full-body practice without six training days','Good for general fitness and fat-loss consistency'],tradeoffs:['Less specialization than Upper/Lower x2','Can feel repetitive if exercise variety matters']},
    {id:'ppl_ul_5',name:'PPL + Upper/Lower',days:5,labels:['push','pull','legs','upper','lower'],goals:['muscle','strength'],experience:['intermediate','advanced'],recovery:'high',minDuration:55,equipment:['gym','barbell','dumbbell','machine'],strengths:['Focused push/pull/legs days plus a second upper/lower exposure','Strong weekly volume for hypertrophy','Clean five-day schedule'],tradeoffs:['Higher weekly recovery demand','Less ideal for beginners or very short sessions']},
    {id:'ul_full_5',name:'Upper/Lower + Full Body',days:5,labels:['upper','lower','upper','lower','full'],goals:['strength','fitness','fat','muscle'],experience:['beginner','intermediate','advanced'],recovery:'medium',minDuration:45,equipment:['all'],strengths:['High frequency without a complicated split','Good fit when strength practice and recovery both matter'],tradeoffs:['Less body-part specialization than PPL','The full-body day should stay moderate']},
    {id:'ppl_2',name:'PPL x2',days:6,labels:['push','pull','legs','push','pull','legs'],goals:['muscle','strength'],experience:['intermediate','advanced'],recovery:'high',minDuration:55,equipment:['gym','barbell','dumbbell','machine'],strengths:['Two weekly exposures for push, pull, and legs','Clean six-day structure with no random extra day','Enough room for compounds plus accessories'],tradeoffs:['High weekly recovery demand','Can be too much for beginners or very short sessions']},
    {id:'ul_3',name:'Upper/Lower x3',days:6,labels:['upper','lower','upper','lower','upper','lower'],goals:['strength','muscle'],experience:['intermediate','advanced'],recovery:'high',minDuration:50,equipment:['all'],strengths:['Very high lift practice frequency','Clean repeated structure across six days','Strong fit for strength-focused users with enough time'],tradeoffs:['Repeated lower days require good recovery','Less session variety than PPL x2']},
    {id:'arnold_6',name:'Arnold Split',days:6,labels:['chest_back','shoulders_arms','legs','chest_back','shoulders_arms','legs'],goals:['muscle'],experience:['advanced'],recovery:'high',minDuration:60,equipment:['gym','dumbbell','machine'],strengths:['Dedicated body-part focus','High weekly accessory volume','Good for advanced hypertrophy specialization'],tradeoffs:['Less efficient for beginners','Less conservative for shoulder limitations']},
    {id:'short_6',name:'Upper/Lower x3 Short Sessions',days:6,labels:['upper','lower','upper','lower','upper','lower'],goals:['fitness','fat','strength'],experience:['beginner','intermediate'],recovery:'medium',minDuration:30,equipment:['all'],strengths:['Six short sessions without pretending volume can be huge','Keeps each workout focused and recoverable','Better fit for limited session length'],tradeoffs:['Requires restraint on exercise count','Lower per-session volume than standard six-day splits']}
  ];
}
function obGoalKey(p){
  const goal=String(p.primaryGoal+' '+p.secondaryGoal).toLowerCase();
  if(goal.indexOf('strong')>=0||goal.indexOf('strength')>=0)return'strength';
  if(goal.indexOf('muscle')>=0||goal.indexOf('bigger')>=0)return'muscle';
  if(goal.indexOf('fat')>=0||goal.indexOf('lean')>=0)return'fat';
  if(goal.indexOf('athletic')>=0)return'athletic';
  return'fitness';
}
function obExpKey(p){
  const exp=String(p.experience).toLowerCase();
  if(exp.indexOf('starting')>=0||exp.indexOf('beginner')>=0||exp.indexOf('<')>=0)return'beginner';
  if(exp.indexOf('5+')>=0||exp.indexOf('advanced')>=0)return'advanced';
  return'intermediate';
}
function obEquipKey(p){
  const eq=String(p.equipment).toLowerCase();
  if(eq.indexOf('full')>=0||eq.indexOf('commercial')>=0)return'gym';
  if(eq.indexOf('barbell')>=0||eq.indexOf('rack')>=0)return'barbell';
  if(eq.indexOf('dumbbell')>=0)return'dumbbell';
  if(eq.indexOf('cable')>=0||eq.indexOf('machine')>=0)return'machine';
  if(eq.indexOf('bodyweight')>=0)return'bodyweight';
  return'all';
}
function obRecoveryDemandValue(v){return v==='high'?3:v==='medium'?2:1;}
function obProfileRecoveryCapacity(p){
  const exp=obExpKey(p);
  let cap=exp==='advanced'?3:exp==='intermediate'?2:1;
  if(p.duration<45)cap-=.5;
  if(p.limitations.length)cap-=.5;
  return Math.max(1,cap);
}
function obTemplateScore(t,p){
  const goal=obGoalKey(p);
  const exp=obExpKey(p);
  const equip=obEquipKey(p);
  const pref=String(p.splitPreference||'').toLowerCase();
  const pri=p.priorityMuscles.map(function(m){return m.toLowerCase();}).join(' ');
  const lim=String(p.limitations.join(' ')).toLowerCase();
  let score=0;
  const reasons=[];
  const tradeoffs=t.tradeoffs.slice();
  if(t.days===p.daysPerWeek){score+=3;reasons.push('Matches your '+p.daysPerWeek+' available training days');}
  else score-=4*Math.abs(t.days-p.daysPerWeek);
  if(t.goals.indexOf(goal)>=0){score+=2.2;reasons.push('Strong fit for '+obGoalTheme(p).label);}
  else score+=.4;
  if(t.experience.indexOf(exp)>=0){score+=1.2;reasons.push('Appropriate for your training experience');}
  else{
    score-=1.2;
    tradeoffs.unshift('Less ideal for your current training experience.');
  }
  if(p.duration>=t.minDuration){score+=1;reasons.push('Fits '+p.duration+'-minute sessions');}
  else{
    score-=1.8;
    tradeoffs.unshift('Your preferred sessions are short for this split.');
  }
  if(t.id==='short_6'&&p.duration>45){
    score-=3;
    tradeoffs.unshift('This short-session variant is unnecessary for your preferred session length.');
  }
  const demand=obRecoveryDemandValue(t.recovery);
  const capacity=obProfileRecoveryCapacity(p);
  if(capacity>=demand){score+=1.1;reasons.push('Recovery demand is realistic for your profile');}
  else{
    score-=1.6*(demand-capacity);
    tradeoffs.unshift('Recovery demand may be high for your current profile.');
  }
  if(t.equipment.indexOf('all')>=0||t.equipment.indexOf(equip)>=0){score+=.8;reasons.push('Works with '+(p.equipment||'your equipment'));}
  else{
    score-=1;
    tradeoffs.unshift('Equipment fit is less direct.');
  }
  if(pri.indexOf('arms')>=0&&(t.id.indexOf('ppl')>=0||t.id.indexOf('arnold')>=0))score+=.5;
  if(pri.indexOf('upper chest')>=0&&(t.id.indexOf('ppl')>=0||t.id.indexOf('arnold')>=0))score+=.4;
  if(lim.indexOf('shoulder')>=0&&t.id.indexOf('arnold')>=0)score-=1.2;
  if(pref&&pref.indexOf('let')<0){
    if(pref.indexOf('push')>=0&&t.id.indexOf('ppl')>=0){score+=.8;reasons.push('Matches your split preference');}
    if(pref.indexOf('upper')>=0&&t.id.indexOf('ul')>=0){score+=.8;reasons.push('Matches your split preference');}
    if(pref.indexOf('full')>=0&&t.id.indexOf('full')>=0){score+=.8;reasons.push('Matches your split preference');}
    if(pref.indexOf('bro')>=0&&t.id.indexOf('arnold')>=0){score+=1;reasons.push('Closest clean match to your body-part split preference');}
  }
  return Object.assign({},t,{score:Math.round(score*10)/10,reasons:reasons.slice(0,4),tradeoffs:tradeoffs.slice(0,3)});
}
function obGoalTheme(p){
  const goal=String(p.primaryGoal+' '+p.secondaryGoal).toLowerCase();
  if(goal.indexOf('strong')>=0||goal.indexOf('strength')>=0)return{
    label:'strength progression',
    phrase:'strength improves through frequent, repeatable practice of major movement patterns',
    bullet:'Best aligned with strength progression'
  };
  if(goal.indexOf('muscle')>=0||goal.indexOf('bigger')>=0)return{
    label:'muscle growth',
    phrase:'muscle growth responds well to enough weekly volume, repeatable effort, and recoverable frequency',
    bullet:'Supports weekly hypertrophy volume'
  };
  if(goal.indexOf('fat')>=0||goal.indexOf('lean')>=0)return{
    label:'fat loss',
    phrase:'fat loss training works best when lifting is consistent, recoverable, and paired with enough total weekly work',
    bullet:'Keeps training consistent during fat loss'
  };
  if(goal.indexOf('athletic')>=0)return{
    label:'athletic performance',
    phrase:'athletic training benefits from balanced movement practice without letting one session create too much fatigue',
    bullet:'Balances movement practice and recovery'
  };
  return{
    label:'general fitness',
    phrase:'general fitness improves best when the week is balanced, repeatable, and easy to recover from',
    bullet:'Balances strength, muscle, and recovery'
  };
}
function obDisplaySplitName(name){
  const map={
    'Upper/Lower + Full Body':'5-Day Upper/Lower Hybrid',
    'Upper/Lower x3 Short Sessions':'Short-Session Upper/Lower'
  };
  return map[name]||name;
}
function obCoachSummary(template,p){
  const name=obDisplaySplitName(template.name);
  const goal=obGoalKey(p);
  if(template.id==='ul_full_5')return name+' gives you frequent muscle stimulation while keeping the week manageable enough to recover well and stay consistent.';
  if(template.id==='short_6')return name+' keeps each workout focused and realistic, so six training days do not turn into six high-volume sessions.';
  if(template.id==='ppl_2')return name+' gives push, pull, and leg work two clean exposures per week with enough room for compounds and accessories.';
  if(template.id==='ul_3')return name+' creates frequent upper- and lower-body practice while keeping each day focused.';
  if(template.id==='full_3')return name+' keeps the week simple, repeatable, and productive by practicing the major movement patterns every workout.';
  if(template.id==='ul_2')return name+' balances muscle-building volume with enough recovery between upper- and lower-body sessions.';
  if(template.id==='ppl_ul_5')return name+' blends focused push, pull, and leg work with a second upper/lower exposure for more weekly volume.';
  if(template.id==='arnold_6')return name+' gives each body area dedicated attention while spreading volume across the week.';
  if(goal==='fat')return name+' keeps lifting consistent and recoverable while supporting overall weekly work.';
  return name+' gives your week a clean structure that is easy to follow and adjust.';
}
function obConfidence(best,candidates,p){
  const next=candidates[1]||{score:best.score};
  const gap=best.score-next.score;
  const answered=[p.primaryGoal,p.daysPerWeek,p.duration,p.equipment,p.experience].filter(Boolean).length;
  if(best.score>=8&&gap>=.6&&answered>=5)return'High';
  if(best.score>=7&&gap>=.3)return'High';
  if(best.score>=6)return'Medium';
  return'Low';
}
function obWhySummary(split,p){
  const theme=obGoalTheme(p);
  const rows=[
    'Matches your '+p.daysPerWeek+' training day'+(p.daysPerWeek===1?'':'s'),
    'Fits '+p.duration+'-minute sessions',
    theme.bullet
  ];
  if(p.equipment)rows.push('Works with '+p.equipment);
  if(p.limitations.length)rows.push('Accounts for your limitations');
  return rows.slice(0,4);
}
function obExpectations(template,p){
  const goal=obGoalKey(p);
  if(template.id==='ul_full_5')return{
    recovery:'Moderate recovery demand. Most users adapt within 2-3 weeks if the Full Body day stays controlled.',
    progression:'Compound lifts usually improve before isolation exercises because they get more frequent practice.',
    focus:'Prioritize the Upper and Lower days. Treat Full Body as supplemental volume, not a max-effort day.',
    watchouts:'If recovery drops, reduce Full Body volume first before changing the whole split.',
    tradeoffs:'Less specialized than a dedicated PPL split, but easier to recover from for many lifters.'
  };
  if(template.id==='short_6')return{
    recovery:'Low-to-moderate per-session stress, but consistency matters because you train often.',
    progression:'Expect technique and rep quality to improve first, then load progression as sessions feel easier.',
    focus:'Keep workouts tight. Hit the main pattern, add a small amount of accessory work, then get out.',
    watchouts:'Do not let short sessions become full-length workouts six days in a row.',
    tradeoffs:'Lower per-session volume than standard six-day splits.'
  };
  if(template.id==='ppl_2')return{
    recovery:'High weekly training demand. Recovery should be monitored closely during the first few weeks.',
    progression:'Push, pull, and leg patterns each get two chances to progress every week.',
    focus:'Keep the first compound lift of each day as the anchor, then use accessories to support it.',
    watchouts:'Avoid turning every accessory into a max-effort set; fatigue can accumulate quickly.',
    tradeoffs:'Less forgiving than four- or five-day splits if sleep, stress, or soreness slip.'
  };
  if(template.id==='ul_3')return{
    recovery:'High frequency with manageable session focus, but lower-body recovery needs attention.',
    progression:'Major lifts can progress quickly because practice frequency is high.',
    focus:'Rotate hard and moderate efforts so repeated Upper and Lower days stay productive.',
    watchouts:'If joints or lower back feel beat up, reduce lower-day accessory volume first.',
    tradeoffs:'Less variety than PPL, but stronger movement-practice rhythm.'
  };
  if(template.id==='full_3')return{
    recovery:'Low-to-moderate recovery demand with rest days naturally spaced between sessions.',
    progression:'Movement skill and consistency usually improve before big load jumps.',
    focus:'Make each workout balanced: one push, one pull, one squat/lunge, and one hinge pattern.',
    watchouts:'Do not cram too many exercises into each session; quality matters more than variety.',
    tradeoffs:'Less specialization than higher-day splits.'
  };
  if(template.id==='ul_2')return{
    recovery:'Moderate recovery demand with clear separation between upper and lower stress.',
    progression:'Compounds usually lead progress, with accessories improving more gradually.',
    focus:'Treat each Upper and Lower day as a primary training day, not a filler workout.',
    watchouts:'Lower days can get dense; keep hinge and squat volume recoverable.',
    tradeoffs:'Less movement-specific than PPL, but simpler and more recoverable.'
  };
  return{
    recovery:'Recovery demand should be manageable if effort and volume stay consistent.',
    progression:'Expect main lifts and repeated movement patterns to improve first.',
    focus:'Prioritize the main lift or movement pattern of each day before accessories.',
    watchouts:'If performance drops across multiple workouts, reduce accessory volume first.',
    tradeoffs:'Every split trades specialization, frequency, and recovery differently.'
  };
}
function obSplitFit(split,p){
  const theme=obGoalTheme(p);
  const name=String(split||'');
  const n=name.toLowerCase();
  const days=p.daysPerWeek;
  const duration=p.duration;
  const equip=p.equipment||'your available equipment';
  const goal=p.primaryGoal||'your goal';
  const base='You selected '+goal+' as your primary goal, can train '+days+' day'+(days===1?'':'s')+' per week, prefer about '+duration+' minute sessions, and have access to '+equip+'. ';
  if(n.indexOf('full body')>=0)return base+'Because '+theme.phrase+', '+name+' lets you train push, pull, squat, and hinge patterns multiple times per week while staying within your preferred session length.';
  if(n.indexOf('upper/lower')>=0||n.indexOf('upper / lower')>=0)return base+'Because '+theme.phrase+', '+name+' separates upper- and lower-body stress so each session stays focused while still giving each area repeated weekly practice.';
  if(n.indexOf('ppl')>=0)return base+'Because '+theme.phrase+', '+name+' gives push, pull, and leg patterns a clean weekly structure with no random extra day.';
  if(n.indexOf('arnold')>=0)return base+'Because '+theme.phrase+', '+name+' gives dedicated attention to chest/back, shoulders/arms, and legs while spreading the volume across the week.';
  return base+'Because '+theme.phrase+', '+name+' arranges your week around the schedule, equipment, and recovery constraints you gave Forma.';
}
function obTemplateAlternativeReason(row,best,p){
  if(row.days!==p.daysPerWeek)return row.name+' does not match your '+p.daysPerWeek+' available training days as cleanly.';
  if(row.score>=best.score-.4)return row.name+' was close, but '+best.name+' had the stronger overall fit for your goal, recovery, and session length.';
  if(row.tradeoffs&&row.tradeoffs.length)return row.tradeoffs[0];
  return row.name+' was considered, but '+best.name+' fit your onboarding profile more cleanly.';
}
function obValidatePlanText(text,template,p){
  const lower=String(text||'').toLowerCase();
  const selected=String(obDisplaySplitName(template.name)).toLowerCase();
  if(lower.indexOf(selected)<0)return false;
  const all=obSplitTemplates().map(function(t){return obDisplaySplitName(t.name).toLowerCase();}).filter(function(n){return n!==selected&&selected.indexOf(n)<0;});
  return !all.some(function(n){return lower.indexOf(n)>=0;});
}
function obTrainingDays(days){
  const map={2:['mon','thu'],3:['mon','wed','fri'],4:['mon','tue','thu','fri'],5:['mon','tue','wed','thu','fri'],6:['mon','tue','wed','thu','fri','sat']};
  return map[Math.max(2,Math.min(6,days))]||map[3];
}
function obExercise(name,reason,targets,goal,alternative){return{name:name,reason:reason,targets:targets,goal:goal,alternative:alternative};}
function obFilterExercises(items,p){
  const dislike=String(p.exerciseDislikes||'').toLowerCase();
  const norm=function(n){return typeof caNormName==='function'?caNormName(n):String(n||'').toLowerCase();};
  const dislikes=dislike.split(/[,;]+/).map(function(s){return norm(s);}).filter(Boolean);
  if(!dislikes.length)return items;
  return items.filter(function(item){
    const n=norm(item.name);
    return !dislikes.some(function(d){return n.indexOf(d)>=0||d.indexOf(n)>=0;});
  });
}
function obExercisePool(split,p){
  const goal=p.primaryGoal;
  const eq=String(p.equipment).toLowerCase();
  const lim=String(p.limitations.join(' ')).toLowerCase();
  const pri=p.priorityMuscles.join(' ').toLowerCase();
  const dislike=String(p.exerciseDislikes||'').toLowerCase();
  const body=eq.indexOf('bodyweight')>=0;
  const fullGym=eq.indexOf('full')>=0||eq.indexOf('commercial')>=0;
  const avoidCableMachine=obHas(dislike,['machine','machines','cable','cables']);
  const avoidFreeWeights=obHas(dislike,['free weight','free weights']);
  const avoidBarbell=avoidFreeWeights||obHas(dislike,['barbell']);
  const avoidDb=avoidFreeWeights||obHas(dislike,['dumbbell','dumbbells']);
  const hasCable=(fullGym||eq.indexOf('cable')>=0||eq.indexOf('machine')>=0)&&!avoidCableMachine;
  const hasBarbell=(fullGym||eq.indexOf('barbell')>=0||eq.indexOf('rack')>=0)&&!avoidBarbell;
  const hasDb=(fullGym||eq.indexOf('dumbbell')>=0)&&!avoidDb;
  const limited=(body||hasDb)&&!fullGym&&!hasCable&&!hasBarbell;
  const shoulder=lim.indexOf('shoulder')>=0;
  const upperChest=pri.indexOf('upper chest')>=0;
  const arms=pri.indexOf('arms')>=0;
  const pressMain=limited?(hasDb?'Dumbbell Floor Press':'Push-Up'):(shoulder?(hasDb?'Dumbbell Bench Press':hasCable?'Chest Press Machine':'Push-Up'):hasBarbell?'Bench Press':hasCable?'Chest Press Machine':hasDb?'Dumbbell Floor Press':'Push-Up');
  const pressMainWhy=limited?'Chosen to match dumbbell/bodyweight equipment.':shoulder?'Chosen over barbell bench to reduce shoulder stress.':'Chosen because it is easy to progressively overload.';
  const inclinePress=limited?(hasDb?'Incline Push-Up':'Push-Up'):(upperChest||shoulder?(hasDb?'Incline Dumbbell Press':hasCable?'Incline Chest Press Machine':'Incline Push-Up'):hasBarbell?'Incline Bench':hasCable?'Incline Chest Press Machine':hasDb?'Incline Dumbbell Press':'Incline Push-Up');
  const verticalPress=limited?(hasDb?'Dumbbell Shoulder Press':'Pike Push-Up'):(shoulder?(hasBarbell?'Landmine Press':hasDb?'Dumbbell Shoulder Press':hasCable?'Shoulder Press Machine':'Pike Push-Up'):hasBarbell?'Overhead Press':hasCable?'Shoulder Press Machine':hasDb?'Dumbbell Shoulder Press':'Pike Push-Up');
  const chestAccessory=limited?(arms?'Close-Grip Push-Up':hasDb?'Dumbbell Fly':'Push-Up'):arms?(hasCable?'Tricep Pushdown':hasDb?'Dumbbell Skull Crusher':'Close-Grip Push-Up'):(hasCable?'Cable Fly':hasDb?'Dumbbell Fly':'Push-Up');
  const tricepsAccessory=hasCable?'Overhead Cable Tricep Extension':hasDb?'Dumbbell Skull Crusher':'Close-Grip Push-Up';
  const chestFly=hasCable?'Cable Fly':hasDb?'Dumbbell Fly':'Push-Up';
  const pressVolume=hasCable?'Chest Press Machine':hasDb?'Dumbbell Floor Press':'Push-Up';
  const sideDelt=hasCable?'Cable Lateral Raise':hasDb||fullGym?'Lateral Raise':hasBarbell?'Plate Raise':'Pike Push-Up Hold';
  const verticalPull=body?'Pull-ups':hasCable?'Lat Pulldown':hasDb?'Dumbbell Pullover':'Inverted Row';
  const horizontalPull=limited?(hasDb?'One-Arm Dumbbell Row':'Inverted Row'):hasCable?'Seated Cable Row':hasBarbell?'Barbell Row':hasDb?'One-Arm Dumbbell Row':'Inverted Row';
  const rowAccessory=hasCable?'Chest-Supported Row':hasBarbell?'Pendlay Row':hasDb?'Chest-Supported Dumbbell Row':'Inverted Row';
  const rearDelt=hasCable?'Face Pull':hasDb?'Rear Delt Fly':'Band Pull-Apart';
  const curl=hasBarbell&&!hasDb&&!hasCable?'Barbell Curl':'Bicep Curl';
  const hinge=hasBarbell?'Romanian Deadlift':hasDb?'Dumbbell Romanian Deadlift':hasCable?'Cable Pull-Through':'Single-Leg Glute Bridge';
  const heavyHinge=hasBarbell?'Deadlift':hasDb?'Dumbbell Romanian Deadlift':hasCable?'Cable Pull-Through':'Hip Thrust';
  const squatPattern=body?'Bulgarian Split Squat':hasBarbell?'Squat':hasCable?'Leg Press':hasDb?'Bulgarian Split Squat':'Bodyweight Squat';
  const quadAccessory=body?'Reverse Lunge':hasCable?'Leg Extension':hasDb?'Goblet Squat':'Step-Up';
  const hamAccessory=hasCable?'Leg Curl':hasDb?'Dumbbell Hip Thrust':'Glute Bridge';
  const push=[
    obExercise(pressMain,'Main horizontal press for '+goal+'.', 'Chest, triceps',goal,pressMainWhy),
    obExercise(inclinePress,'Adds upper-chest volume and a different pressing angle.','Upper chest, front delts',goal,'Chosen over flat-only pressing to match your priorities.'),
    obExercise(verticalPress,'Trains vertical pressing without duplicating bench work.','Shoulders, triceps',goal,shoulder?'Chosen over strict OHP because it is usually more shoulder-friendly.':'Chosen for clear strength progression.'),
    obExercise(sideDelt,'Direct side-delt work with low joint cost.','Shoulders',goal,'Chosen over another heavy press to manage fatigue.'),
    obExercise(chestAccessory,'Adds targeted accessory volume where compounds are less specific.','Triceps/chest',goal,'Chosen as the accessory slot after compounds.'),
    obExercise(tricepsAccessory,'Adds a second triceps angle when session time allows.','Triceps',goal,'Chosen over another press to add direct arm volume without more heavy pressing.'),
    obExercise(arms?chestFly:pressVolume,'Adds chest volume without another heavy compound.','Chest',goal,'Chosen as a low-fatigue finisher for longer push sessions.')
  ];
  const pull=[
    obExercise(verticalPull,'Vertical pull for lat width and shoulder balance.','Back, biceps',goal,body?'Chosen because bodyweight equipment is available.':'Chosen because load is easy to scale.'),
    obExercise(horizontalPull,'Horizontal pull to balance pressing volume.','Mid-back, lats',goal,'Chosen over another pulldown for movement balance.'),
    obExercise(rearDelt,'Rear-delt and upper-back work to support shoulder health.','Rear delts, upper back',goal,'Chosen because it pairs well with pressing volume.'),
    obExercise(curl,'Direct elbow-flexion work for arm priority and tracking.','Biceps',goal,'Chosen over more back work to include direct arm volume.'),
    obExercise(arms?'Hammer Curl':heavyHinge,'Adds arm/brachialis work or a heavy hinge depending on priority.','Biceps/forearms or posterior chain',goal,'Chosen to match priority muscles and weekly fatigue.'),
    obExercise(hasCable?'Straight-Arm Pulldown':'Hammer Curl','Adds lat isolation or an arm-friendly accessory when time allows.','Lats/biceps',goal,'Chosen over extra rowing to reduce overlap.'),
    obExercise(rowAccessory,'Adds another back slot for longer pull sessions.','Back, biceps',goal,'Chosen over unrelated filler to keep the day pull-focused.')
  ];
  const legs=[
    obExercise(squatPattern,'Primary squat-pattern lift.','Quads, glutes',goal,'Chosen over machines when skill and loading matter.'),
    obExercise(hinge,'Primary hinge for hamstrings and glutes.','Hamstrings, glutes',goal,'Chosen over conventional deadlift for hypertrophy-friendly tension.'),
    obExercise(quadAccessory,'Extra quad volume without as much skill demand as squats.','Quads, glutes',goal,'Chosen to add volume while managing fatigue.'),
    obExercise(hamAccessory,'Direct posterior-chain accessory work.','Hamstrings/glutes',goal,'Chosen because hinges do not fully cover this function.'),
    obExercise('Calf Raise','Direct calf work with simple progression.','Calves',goal,'Chosen as a low-fatigue accessory.'),
    obExercise('Hip Thrust','Adds glute-focused volume without another squat pattern.','Glutes',goal,'Chosen as a lower-body accessory with manageable fatigue.'),
    obExercise('Plank','Core stability with low equipment demand.','Core',goal,'Chosen as a low-fatigue finisher for longer lower-body sessions.')
  ];
  const upper=push.slice(0,3).concat(pull.slice(0,3),[arms?pull[3]:push[4]]);
  const lower=legs;
  const full=[push[0],pull[0],legs[0],legs[1],push[3],pull[3]];
  const priority=[upperChest?push[1]:push[0],arms?pull[3]:pull[1],arms?push[4]:push[3],legs[1],pull[2]];
  const map={push:push,pull:pull,legs:legs,upper:upper,lower:lower,full:full,priority:priority,chest_back:[push[0],push[1],pull[0],pull[1],pull[2],push[6],pull[6]],shoulders_arms:[push[2],push[3],pull[3],obExercise('Hammer Curl','Second direct biceps/forearm pattern for arm priority.','Biceps, forearms',goal,'Chosen over another curl variation for a different grip.'),push[4],push[5],pull[5]]};
  let rows=obFilterExercises((map[split]||full).slice(0,p.exercisesPerSession),p).filter(function(item,i,arr){
    return arr.findIndex(function(r){return r.name===item.name;})===i;
  });
  const fallback=obFilterExercises([
    obExercise(hasDb?'Goblet Squat':hasCable?'Leg Press':'Step-Up','Safe lower-body volume that fits limited equipment.','Quads, glutes',goal,'Chosen as a fallback when another movement was excluded.'),
    obExercise(hasDb?'One-Arm Dumbbell Row':hasCable?'Seated Cable Row':'Inverted Row','Equipment-matched horizontal pulling.','Back, biceps',goal,'Chosen as a fallback to keep push/pull balance.'),
    obExercise('Glute Bridge','Low-skill posterior-chain work.','Glutes, hamstrings',goal,'Chosen as a fallback when hinging options are limited.'),
    obExercise('Plank','Core stability with low equipment demand.','Core',goal,'Chosen as a low-risk filler that supports general training.'),
    obExercise('Calf Raise','Simple accessory work with minimal recovery cost.','Calves',goal,'Chosen as a fallback accessory.')
  ],p);
  fallback.forEach(function(item){
    if(rows.length>=p.exercisesPerSession)return;
    if(!rows.some(function(r){return r.name===item.name;}))rows.push(item);
  });
  return rows.slice(0,p.exercisesPerSession);
}
function obBuildProgram(d){
  const p=obCanonicalProfile(d);
  const candidates=obSplitTemplates().filter(function(t){return t.days===p.daysPerWeek;}).map(function(t){return obTemplateScore(t,p);}).sort(function(a,b){return b.score-a.score;});
  const best=candidates[0];
  SPLIT_LBL.full='Full Body';SPLIT_LBL.priority='Priority';SPLIT_LBL.chest_back='Chest & Back';SPLIT_LBL.shoulders_arms='Shoulders & Arms';
  const seq=best.labels.slice();
  const trainDays=obTrainingDays(p.daysPerWeek);
  const schedule={mon:'rest',tue:'rest',wed:'rest',thu:'rest',fri:'rest',sat:'rest',sun:'rest'};
  trainDays.forEach(function(day,i){schedule[day]=seq[i]||'full';});
  const splitEx={};
  const exerciseReasons={};
  [...new Set(seq)].forEach(function(split){
    const rows=obExercisePool(split,p);
    splitEx[split]=rows.map(function(r){return r.name;});
    exerciseReasons[split]=rows.map(function(r){return r;});
  });
  let text=obCoachSummary(best,p);
  if(!obValidatePlanText(text,best,p)){
    text=obDisplaySplitName(best.name)+' gives your training week a clean structure that is easy to follow, recover from, and adjust.';
  }
  const alternatives=candidates.filter(function(row){return row.id!==best.id;}).slice(0,2).map(function(row){
    return{split:row.name,reason:obTemplateAlternativeReason(row,best,p)};
  });
  return{
    profile:p,
    candidates:candidates,
    selectedSplit:obDisplaySplitName(best.name),
    internalSplit:best.name,
    confidence:obConfidence(best,candidates,p),
    fitSummary:obWhySummary(best.name,p),
    benefits:best.strengths,
    tradeoffs:best.tradeoffs,
    expectations:obExpectations(best,p),
    alternatives:alternatives,
    schedule:schedule,
    splitEx:splitEx,
    exerciseReasons:exerciseReasons,
    text:text
  };
}

async function obGenerate(){
  S.obStep=OB_STEPS.length-1; // show generating screen
  render();
  const d=S.obData;
  try{
    const plan=obBuildProgram(d);
    S.profile.name=d.name||S.profile.name;
    S.profile.goal=d.goal||S.profile.goal;
    S.profile.experience=d.experience||S.profile.experience;
    S.profile.session_duration=plan.profile.duration;
    S.profile.exercises_per_session=plan.profile.exercisesPerSession;
    S.profile.equipment=d.equipment||S.profile.equipment;
    S.profile.injuries=d.injuries||S.profile.injuries;
    S.profile.preferences=[d.exercise_preferences?('Likes: '+d.exercise_preferences):'',d.exercise_dislikes?('Avoids: '+d.exercise_dislikes):''].filter(Boolean).join(' | ');
    S.profile.program_reasoning=plan;
    if(d.bodyweight)S.profile.bodyweight=parseFloat(d.bodyweight)||S.profile.bodyweight;
    if(d.height)S.profile.height=d.height;
    S.schedule=plan.schedule;
    S.splitEx=Object.assign({},S.splitEx,plan.splitEx);
    persist('ll_profile',S.profile);
    persist('ll_schedule',S.schedule);
    persist('ll_splits',S.splitEx);
    S.scheduleRationale={text:plan.text,dismissed:false,details:plan};
    S.messages=[{role:'ai',text:'I built your program from your onboarding answers: '+plan.selectedSplit+' across '+plan.profile.daysPerWeek+' training days, with exercise choices matched to your goal, equipment, schedule, and limitations.',time:NOW(),actions:[]}];
  }catch(e){
    console.warn('[obGenerate error]',e.message);
    // Apply what we can from the form data directly
    S.profile.name=d.name||S.profile.name;
    S.profile.goal=d.goal||S.profile.goal;
    S.profile.experience=d.experience||S.profile.experience;
    S.profile.equipment=d.equipment||S.profile.equipment;
    S.profile.injuries=d.injuries||S.profile.injuries;
    if(d.bodyweight)S.profile.bodyweight=parseFloat(d.bodyweight)||S.profile.bodyweight;
    if(d.height)S.profile.height=d.height;
    persist('ll_profile',S.profile);
  }
  S.onboarded=true;
  persist('ll_onboarded',true);
  S.obStep=0;
  S.obData={};
  S.view='home';
  if(shouldShowFeatureTour())S.tourPrompt=true;
  render();
}

function startOnboarding(){
  S.obStep=0;
  S.obData={};
  S.obLoading=false;
  render();
}

function skipOnboarding(){
  S.onboarded=true;
  persist('ll_onboarded',true);
  S.view='home';
  if(shouldShowFeatureTour())S.tourPrompt=true;
  render();
}

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
