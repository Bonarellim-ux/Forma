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
  // 6 — experience (single)
  {type:'choice', multi:false, key:'experience', title:'How long have you been training?', subtitle:'Be honest — this shapes exercise selection.',
    options:[
      {val:'Just starting out (< 6 months)', svg:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>'},
      {val:'1–2 years',                      svg:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'},
      {val:'3–5 years',                      svg:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>'},
      {val:'5+ years, advanced lifter',      svg:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'},
    ]},
  // 7 — days per week (single)
  {type:'choice', multi:false, key:'days_per_week', title:'How many days can you train?', subtitle:'Be realistic with your schedule.',
    options:[
      {val:'2 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'3 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'4 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'5 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {val:'6 days per week', svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'},
    ]},
  // 8 — session length (single)
  {type:'choice', multi:false, key:'session_duration', title:'How long are your sessions?', subtitle:'Determines how many exercises to programme.',
    options:[
      {val:'30–45 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'45–60 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'60–75 minutes',  svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
      {val:'75–90+ minutes', svg:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'},
    ]},
  // 9 — equipment (multi-select)
  {type:'choice', multi:true, key:'equipment', title:'What equipment do you have?', subtitle:'Select everything available to you.',
    options:[
      {val:'Full commercial gym',          svg:'<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'},
      {val:'Barbell & rack',               svg:'<line x1="4" y1="12" x2="20" y2="12"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/>'},
      {val:'Dumbbells',                    svg:'<line x1="6" y1="12" x2="18" y2="12"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/>'},
      {val:'Cables & machines',            svg:'<rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/>'},
      {val:'Bodyweight only',              svg:'<circle cx="12" cy="5" r="3"/><path d="M6.5 8h11l-1 7h-3l-1 5h-2l-1-5H7l-1-7z"/>'},
    ]},
  // 10 — injuries (text, optional)
  {type:'text', key:'injuries', title:'Any injuries or limitations?', subtitle:'The AI will work around these. Leave blank if none.', placeholder:'e.g. bad lower back, left shoulder pain…', keyboard:'text', optional:true},
  // 11 — split preference (single)
  {type:'choice', multi:false, key:'split_pref', title:'Training split preference?', subtitle:'The AI will pick the best one if you\'re unsure.',
    options:[
      {val:'Push / Pull / Legs',   svg:'<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>'},
      {val:'Upper / Lower',        svg:'<line x1="12" y1="2" x2="12" y2="22"/><path d="M2 12h20"/>'},
      {val:'Full Body',            svg:'<circle cx="12" cy="12" r="10"/>'},
      {val:'Bro split',            svg:'<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 000-7.78z"/>'},
      {val:'Let the AI decide',    svg:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'},
    ]},
  // 12 — generating
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
      '<button onclick="S.obStep=1;render()" style="width:100%;max-width:320px;background:var(--blue);color:#fff;border:none;border-radius:14px;padding:17px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:-.2px">Get started →</button>'+
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
    const otherSel=arr.includes('__other__');
    const otherText=S.obData[def.key+'_other']||'';
    const canNext=arr.length>0&&(!otherSel||otherText.trim().length>0);
    return '<div style="display:flex;flex-direction:column;min-height:90vh;padding:0">'+
      obProgressBar(pct,step)+
      '<div style="flex:1;padding:28px 24px 16px;display:flex;flex-direction:column;overflow-y:auto">'+
        '<div style="font-size:24px;font-weight:800;color:var(--white);letter-spacing:-.5px;margin-bottom:8px;line-height:1.2">'+def.title+'</div>'+
        '<div style="font-size:14px;color:var(--sub);margin-bottom:20px;line-height:1.6">'+def.subtitle+(multi?' Select all that apply.':'')+'</div>'+
        '<div style="display:flex;flex-direction:column;gap:8px">'+
          def.options.map(function(opt){
            const sel=arr.includes(opt.val);
            return '<button class="ob-choice-btn" data-key="'+def.key+'" data-val="'+escH(opt.val)+'" data-multi="'+multi+'" '+
              'onclick="obToggleChoice(\''+def.key+'\',\''+opt.val.replace(/'/g,"\\'")+'\',' +multi+')" '+
              'style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:11px;'+
              'border:2px solid '+(sel?'var(--blue)':'var(--border)')+';'+
              'background:'+(sel?'rgba(26,158,212,.08)':'var(--s1)')+';'+
              'cursor:pointer;font-family:inherit;text-align:left;width:100%;transition:border-color .1s">'+
              '<div style="width:28px;height:28px;border-radius:7px;background:'+(sel?'rgba(26,158,212,.15)':'var(--s2)')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="'+(sel?'var(--blue)':'var(--sub)')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+opt.svg+'</svg>'+
              '</div>'+
              '<span class="ob-choice-label" style="font-size:14px;font-weight:'+(sel?700:500)+';color:'+(sel?'var(--blue)':'var(--white)')+'">'+opt.val+'</span>'+
              '<div class="ob-choice-check" style="margin-left:auto;flex-shrink:0;display:'+(sel?'flex':'none')+';width:18px;height:18px;border-radius:50%;background:var(--blue);align-items:center;justify-content:center">'+
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'+
              '</div>'+
            '</button>';
          }).join('')+
          // Other option
          '<button class="ob-choice-btn" data-key="'+def.key+'" data-val="__other__" data-multi="'+multi+'" '+
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
          '</button>'+
          // Other text input — only shown when Other is selected
          (otherSel?
            '<input id="ob-other-input" type="text" placeholder="Describe your goal…" '+
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
    '<button id="ob-continue-btn" onclick="obNext()" '+(canNext?'':'disabled')+
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

async function obGenerate(){
  S.obStep=OB_STEPS.length-1; // show generating screen
  render();
  const d=S.obData;
  const prompt=
    'New user onboarding data:\n'+
    'Name: '+(d.name||'not provided')+'\n'+
    'Age: '+(d.age||'not provided')+'\n'+
    'Preferred units: '+(d.unit_system||S.unit||'not provided')+'\n'+
    'Bodyweight: '+(d.bodyweight||'not provided')+' '+(obUnitFor('bodyweight')||'')+'\n'+
    'Height: '+(d.height||'not provided')+' '+(obUnitFor('height')||'')+'\n'+
    'Goal: '+(d.goal||'not provided')+'\n'+
    'Experience: '+(d.experience||'not provided')+'\n'+
    'Days per week: '+(d.days_per_week||'not provided')+'\n'+
    'Session length: '+(d.session_duration||'not provided')+'\n'+
    'Equipment: '+(d.equipment||'not provided')+'\n'+
    'Injuries/limitations: '+(d.injuries||'none')+'\n'+
    'Split preference: '+(d.split_pref||'not provided')+'\n\n'+
    'Based on this, do the following:\n'+
    '1. Call update_profile with name, goal, experience, session_duration, exercises_per_session (derive from session length), equipment, injuries, bodyweight (number only, already in user display unit), height (include unit or plain number as provided).\n'+
    '2. Call update_schedule to set the weekly schedule based on their days and split preference.\n'+
    '3. Call update_split_exercises to fill each split day with the best exercises for their goal and equipment.\n'+
    'Also include a "rationale" field in your JSON: 2–3 sentences explaining WHY you chose this specific schedule for them — mention the split type, days, and how it fits their goal. Make it personal and direct. Keep it under 60 words.\n'+
    'Respond ONLY with valid JSON: {"message":"...","rationale":"...","actions":[...]}';
  try{
    if(!hasKey())throw new Error(aiKeyMessage());
    const resp=await fetch(API,{method:'POST',headers:apiHeaders(),body:JSON.stringify({
      model:MODEL,max_tokens:4000,thinking:{type:'enabled',budget_tokens:1024},
      system:buildSysPrompt()+'\nYou are completing a new user onboarding. Apply all 3 actions (update_profile, update_schedule, update_split_exercises) based on the data provided. Respond ONLY with valid JSON: {"message":"...","rationale":"...","actions":[...]}',
      messages:[{role:'user',content:prompt}]
    })});
    const raw=await resp.text();
    const data=JSON.parse(raw);
    if(data.error)throw new Error(data.error.message);
    const parsed=parseAIResponse(extractText(data.content));
    (parsed.actions||[]).forEach(function(a){applyAction(a);});
    if(parsed.message){
      S.messages=[{role:'ai',text:parsed.message,time:NOW(),actions:[]}];
    }
    if(parsed.rationale){
      S.scheduleRationale={text:parsed.rationale,dismissed:false};
    }
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
    {view:'log',selector:'#sugtip-2',title:'Recommendations when they matter',text:'I won\'t interrupt every set. When your history shows a clear pattern, I\'ll explain what I\'d recommend next.',example:'You\'ve repeated 185x7 three times. I\'d recommend aiming for 8 reps before increasing weight.'},
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
        '<button class="tour-primary" onclick="startFeatureTour()" style="flex:1;border-radius:12px;padding:14px;font-size:14px;font-weight:800">Show me</button>'+
        '<button class="tour-secondary" onclick="skipFeatureTour()" style="flex:1;border-radius:12px;padding:14px;font-size:14px;font-weight:800">Skip</button>'+
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
          '<button class="tour-primary" onclick="finishFeatureTour()">Start using Forma</button>'+
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
        '<button class="tour-secondary" onclick="tourBack()" '+(S.tourStep===0?'disabled style="opacity:.45"':'')+'>Back</button>'+
        '<button class="tour-primary" onclick="tourNext()">'+(S.tourStep===steps.length-1?'Finish':'Next')+'</button>'+
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
