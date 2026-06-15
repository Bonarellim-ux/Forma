#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_MD=path.join(ROOT,'dev','reports','ai_recommendation_consistency.md');
const REPORT_JSON=path.join(ROOT,'dev','reports','ai_recommendation_consistency.json');
const FORMA_AI_API='https://forma-proxy.bonarelli-m.workers.dev';
const FORMA_AI_MODEL='claude-sonnet-4-6';

const DRY_RUN=process.argv.includes('--dry-run');
const DELAY_MS=Math.max(0,(parseInt(process.env.FORMA_AI_DELAY_MS||'1500',10)||0));

const TEST_PROFILE={
  sex:'male',
  age:28,
  height:"5'10\"",
  bodyweight:170,
  experience:'Just starting out (< 6 months)',
  goal:'General fitness',
  equipment:'Full commercial gym'
};

const SCENARIOS=[
  {
    id:'first_time_calibration',
    name:'First-time calibration',
    exercise:'Bench Press',
    sessions:[],
    needsCalibrationLanguage:true
  },
  {
    id:'too_easy_calibration',
    name:'Too easy calibration',
    exercise:'Bench Press',
    sessions:[{w:60,r:10},{w:60,r:10},{w:60,r:10}],
    needsCalibrationLanguage:true
  },
  {
    id:'too_hard_calibration',
    name:'Too hard calibration',
    exercise:'Bench Press',
    sessions:[{w:60,r:5},{w:60,r:4},{w:60,r:4}],
    needsCalibrationLanguage:true
  },
  {
    id:'inconsistent_early_data',
    name:'Inconsistent early data',
    exercise:'Bench Press',
    sessions:[{w:60,r:10},{w:60,r:5},{w:60,r:8}],
    needsCalibrationLanguage:true
  },
  {
    id:'declining_established',
    name:'Declining established performance',
    exercise:'Bench Press',
    sessions:[{w:135,r:5},{w:135,r:6},{w:135,r:7},{w:135,r:8},{w:135,r:10}],
    needsCalibrationLanguage:false
  },
  {
    id:'dumbbell_per_hand',
    name:'Dumbbell per-hand',
    exercise:'DB Shoulder Press',
    sessions:[],
    needsCalibrationLanguage:true
  },
  {
    id:'unknown_category_fallback',
    name:'Unknown/category fallback',
    exercise:'Custom Strength Drill',
    sessions:[],
    needsCalibrationLanguage:true
  }
];

function loadFormaAIContext(){
  const context={
    console:console,
    Math:Math,
    Date:Date,
    Number:Number,
    String:String,
    Array:Array,
    Object:Object,
    RegExp:RegExp,
    parseFloat:parseFloat,
    parseInt:parseInt,
    isNaN:isNaN,
    fetch:fetch,
    setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{
      unit:'lbs',
      workouts:[],
      profile:{},
      schedule:{mon:'push',tue:'pull',wed:'legs',thu:'upper',fri:'lower',sat:'rest',sun:'rest'},
      splitEx:{
        push:['Bench Press','DB Shoulder Press','Incline Bench'],
        pull:['Lat Pulldown','Barbell Row'],
        legs:['Back Squat','Leg Press'],
        upper:['Bench Press','Lat Pulldown'],
        lower:['Back Squat','Romanian Deadlift'],
        rest:[]
      },
      workout:null,
      messages:[]
    }
  };
  context.window=context;
  vm.createContext(context);
  [
    'js/utils.js',
    'js/constants.js',
    'js/exerciseSubstitutions.js',
    'js/plateCalculator.js',
    'js/recommendations.js',
    'js/coachingAnalysis.js',
    'js/ai.js'
  ].forEach(function(rel){
    vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});
  });
  vm.runInContext([
    'function recommendationActionText(sug){',
    '  if(!sug||!sug.detail)return \'\';',
    '  const text=String(sug.detail).split(\'<br><br>Why:<br>\')[0].replace(/^I\\\'d recommend /,\'\').replace(/\\.$/,\'\');',
    '  return text.charAt(0).toUpperCase()+text.slice(1);',
    '}',
    'function recommendationWhyText(sug){',
    '  if(!sug||!sug.detail)return \'\';',
    '  const parts=String(sug.detail).split(\'<br><br>Why:<br>\');',
    '  return parts.length>1?parts[1].replace(/<br>/g,\'\\n\'):\'\';',
    '}'
  ].join('\n'),context,{filename:'dev/ui-helpers.js'});
  return context;
}

function cleanDetail(detail){
  return String(detail||'')
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,'')
    .replace(/\*\*/g,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function isoDaysAgo(days){
  const d=new Date();
  d.setDate(d.getDate()-days);
  return d.toISOString();
}

function buildWorkouts(context,exercise,sessions){
  const chronological=sessions.slice().reverse();
  return chronological.map(function(session,index){
    const daysAgo=(chronological.length-index)*3;
    return{
      date:isoDaysAgo(daysAgo),
      split:'push',
      exercises:[{
        name:exercise,
        sets:[{w:context.toKg(session.w),r:session.r,warmup:false}]
      }]
    };
  });
}

function actionKeywords(action){
  const map={
    baseline:['calibrat','baseline','start around','starting point','first logged'],
    early_add_weight:['increase','heavier','add weight','try','jump'],
    add_weight:['increase','heavier','add weight','try'],
    early_add_reps:['rep','same weight','keeping','aim for','add rep'],
    add_reps:['rep','same weight','keeping','aim for','add rep'],
    early_repeat:['repeat','same load','confirm','stabil'],
    hold:['repeat','hold','same load','stabil','rebuild'],
    reduce_or_recover:['reduce','lower','lighter','recover','rebuild','drop'],
    reduce_weight:['reduce','lower','lighter']
  };
  return map[action]||['recommend'];
}

function significantTokens(text){
  return String(text||'').toLowerCase()
    .replace(/[^a-z0-9\s-]/g,' ')
    .split(/\s+/)
    .filter(function(w){return w.length>3&&![
      'this','that','with','from','your','have','been','form','forma','because','would','should','about','after','before','there','their','which','while','where','when','what','into','only','also','just','very','more','than','them','then','will','does','did','been','being','were','they','them','these','those','could','might','likely','recommend','recommended','recommendation'
    ].includes(w);});
}

function overlapRatio(a,b){
  const A=new Set(significantTokens(a));
  const B=significantTokens(b);
  if(!A.size||!B.length)return 0;
  let hit=0;
  B.forEach(function(t){if(A.has(t))hit++;});
  return hit/Math.max(A.size,B.length);
}

function extractWeights(text){
  return (String(text||'').match(/\b(\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)\b/gi)||[])
    .map(function(m){return parseFloat(m);})
    .filter(function(n){return !isNaN(n);});
}

function engineSnapshot(context,scenario,sug){
  const why=cleanDetail(context.recommendationWhyText(sug));
  const actionText=sug?context.recommendationActionText(sug):'';
  let engineLine='';
  if(typeof context.aiRecommendationEngineLines==='function'){
    engineLine=(context.aiRecommendationEngineLines([scenario.exercise],1)||[])[0]||'';
  }
  return{
    hasSuggestion:!!sug,
    exercise:scenario.exercise,
    action:sug&&sug.action||'',
    dir:sug&&sug.dir||'',
    state:sug&&sug.state||'',
    weightDisp:sug&&sug.weightDisp!==undefined&&sug.weightDisp!==null?sug.weightDisp:'',
    repTarget:sug&&sug.repTarget||'',
    confidence:sug&&sug.confidence||'',
    source:sug&&sug.source||'',
    loadBasis:sug&&sug.loadBasis||'',
    reason:sug&&sug.reason||'',
    actionText:actionText,
    whyText:why,
    detail:sug?cleanDetail(sug.detail):'',
    engineLine:engineLine
  };
}

function compareAIResponse(scenario,engine,aiText,profile){
  const combined=String(aiText||'').toLowerCase();
  const issues=[];
  const checks={};

  if(!engine.hasSuggestion){
    checks.enginePresent='no';
    checks.aiResponded=combined?'yes':'no';
    return{checks:checks,issues:['No deterministic recommendation returned'],pass:false};
  }

  checks.enginePresent='yes';
  checks.aiResponded=combined?'yes':'no';

  const weights=extractWeights(combined);
  const targetWeight=parseFloat(engine.weightDisp);
  checks.weightMatch='n/a';
  if(!isNaN(targetWeight)&&targetWeight>0){
    const tol=engine.loadBasis==='per hand'?0.01:0.01;
    const match=weights.some(function(w){return Math.abs(w-targetWeight)<=tol;});
    checks.weightMatch=match?'yes':'no';
    if(!match)issues.push('AI did not mention engine weight '+targetWeight+' '+ (engine.loadBasis==='per hand'?'lb per hand':'lb'));
  }

  if(engine.loadBasis==='per hand'){
    checks.perHandMention=/per hand|each dumbbell|each hand|per dumbbell/.test(combined)?'yes':'partial';
    if(checks.perHandMention==='partial')issues.push('AI omitted per-hand basis for dumbbell load');
  }else{
    checks.perHandMention='n/a';
  }

  const repNums=(String(engine.repTarget||'').match(/\d+/g)||[]).map(Number);
  checks.repMatch='n/a';
  if(repNums.length){
    const repHit=repNums.some(function(r){return new RegExp('\\b'+r+'\\b').test(combined);})
      || (repNums.length===2&&new RegExp(repNums[0]+'\\s*[-–to]+\\s*'+repNums[1]).test(combined));
    checks.repMatch=repHit?'yes':'partial';
    if(!repHit)issues.push('AI did not clearly mention engine rep target '+engine.repTarget);
  }

  const actionWords=actionKeywords(engine.action);
  checks.actionMatch=actionWords.some(function(k){return combined.indexOf(k)!==-1;})?'yes':'no';
  if(checks.actionMatch==='no')issues.push('AI action language does not align with engine action '+engine.action);

  const overlap=overlapRatio(engine.whyText,combined);
  checks.reasoningOverlap=Math.round(overlap*100)+'%';
  checks.reasoningMatch=overlap>=0.18?'yes':overlap>=0.1?'partial':'no';
  if(checks.reasoningMatch==='no')issues.push('AI reasoning weakly overlaps engine why text ('+checks.reasoningOverlap+')');

  if(scenario.needsCalibrationLanguage||engine.confidence==='low'||String(engine.action||'').startsWith('early_')||engine.action==='baseline'){
    checks.calibrationLanguage=/calibrat|conservative|early|limited history|not a strength prediction|first logged|only \d+ logged|uncertain|low confidence|not confirmed/.test(combined)?'yes':'no';
    if(checks.calibrationLanguage==='no')issues.push('AI missing calibration/uncertainty language');
  }else{
    checks.calibrationLanguage='n/a';
  }

  const opposite={
    add_weight:['reduce','lower','lighter','deload'],
    early_add_weight:['reduce','lower','lighter','deload'],
    add_reps:['reduce weight','add weight','increase to'],
    early_add_reps:['reduce weight','add weight','increase to'],
    hold:['reduce to','deload'],
    early_repeat:['reduce to','deload'],
    reduce_or_recover:['increase to','add weight','go heavier'],
    baseline:['increase to','add weight','go heavier']
  };
  const bad=opposite[engine.action]||[];
  const futureProgression=/\b(would be warranted|once you|when you|after you|before moving up|next step after|that'?s when)\b/.test(combined);
  checks.noContradiction=!bad.some(function(k){return combined.indexOf(k)!==-1;})||futureProgression?'yes':'no';
  if(checks.noContradiction==='no'&&!futureProgression)issues.push('AI contradicts engine action with opposite progression language');

  if(!isNaN(targetWeight)&&targetWeight>0&&weights.length){
    const conflicting=weights.filter(function(w){return Math.abs(w-targetWeight)>1&&Math.abs(w-targetWeight)/Math.max(targetWeight,1)>.08;});
    const citesConflict=conflicting.some(function(w){
      return new RegExp('\\b'+w+'\\s*(?:lb|lbs|kg)\\b').test(combined)&&combined.indexOf(String(targetWeight))===-1;
    });
    if(citesConflict){
      checks.noContradiction='no';
      issues.push('AI cites a different working weight as the Forma recommendation');
    }
  }

  const profileText=JSON.stringify(profile||{}).toLowerCase();
  const invented=[];
  if(/sleep|fatigue|recovery issues|overtraining/.test(combined)&&!profileText.includes('sleep')&&!profileText.includes('fatigue')){
    invented.push('sleep/fatigue');
  }
  if(/injury|pain|shoulder issue|knee issue|irritation/.test(combined)&&!profileText.includes('injur')&&!profileText.includes('pain')){
    invented.push('injury/pain');
  }
  if(/nutrition|calorie|protein deficit/.test(combined)&&!profileText.includes('nutrition')&&!profileText.includes('calorie')){
    invented.push('nutrition');
  }
  checks.noInventedCauses=invented.length?'no':'yes';
  if(invented.length)issues.push('AI may invent causes not in profile/history: '+invented.join(', '));

  const pass=issues.length===0;
  return{checks:checks,issues:issues,pass:pass};
}

function setupScenarioContext(context,scenario){
  context.S.unit='lbs';
  context.S.workouts=buildWorkouts(context,scenario.exercise,scenario.sessions);
  context.S.profile=Object.assign({},TEST_PROFILE);
  context.S.workout={
    split:'push',
    exercises:[{
      name:scenario.exercise,
      inputW:'',
      inputR:'',
      sets:[]
    }]
  };
  context.S.messages=[];
}

function buildQuestion(scenario,engine){
  if(!engine.hasSuggestion){
    return 'Why did Forma recommend this for '+scenario.exercise+'? I do not see a recommendation in the app.';
  }
  return 'Why did Forma recommend this for '+scenario.exercise+'?';
}

async function askAI(context,question){
  if(typeof context.buildSysPrompt!=='function'){
    throw new Error('buildSysPrompt was not loaded from js/ai.js');
  }
  const system=context.buildSysPrompt(question)+
    '\n\nMODE: DEV AI RECOMMENDATION CONSISTENCY TEST. Answer the user question about Forma\'s deterministic recommendation engine. Explain what the engine currently suggests and why. Do not invent a different recommendation. If engine signals are present, align with them. Keep the answer concise (4-6 sentences).';
  const resp=await fetch(FORMA_AI_API,{
    method:'POST',
    headers:Object.assign({},context.apiHeaders(),{'Origin':'http://localhost'}),
    body:JSON.stringify({
      model:FORMA_AI_MODEL,
      max_tokens:2500,
      thinking:{type:'enabled',budget_tokens:1024},
      system:system,
      messages:[{role:'user',content:question}]
    })
  });
  const raw=await resp.text();
  if(!resp.ok){
    throw new Error('API HTTP '+resp.status+': '+raw.slice(0,200));
  }
  let data;
  try{
    data=JSON.parse(raw);
  }catch(e){
    throw new Error('API returned non-JSON: '+raw.slice(0,200));
  }
  if(data.error)throw new Error(data.error.message||'API error');
  const parsed=context.parseAIResponse(context.extractText(data.content));
  return parsed.message||context.extractText(data.content)||'(empty response)';
}

function sleep(ms){
  return new Promise(function(resolve){setTimeout(resolve,ms);});
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildReport(results,meta){
  const lines=[];
  lines.push('# AI / Recommendation Consistency Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: verify that when Forma\'s deterministic engine recommends something, the AI coach explains the same recommendation and does not invent a different one.');
  lines.push('');
  lines.push('Mode: **'+(meta.dryRun?'dry-run (engine only, no AI calls)':'live AI via production proxy')+'**');
  lines.push('Profile: '+TEST_PROFILE.sex+', '+TEST_PROFILE.age+'y, '+TEST_PROFILE.height+', '+TEST_PROFILE.bodyweight+' lb, '+TEST_PROFILE.experience+'.');
  lines.push('');

  const flagged=results.filter(function(r){return !r.comparison.pass||r.aiError;});
  lines.push('## Summary');
  lines.push('');
  lines.push('- Scenarios: '+results.length);
  lines.push('- Automated pass: '+(results.length-flagged.length)+'/'+results.length);
  lines.push('- AI errors: '+results.filter(function(r){return r.aiError;}).length);
  lines.push('');
  if(flagged.length){
    lines.push('### Flagged scenarios');
    lines.push('');
    flagged.forEach(function(r){
      lines.push('- **'+r.scenarioName+'**: '+(r.aiError||r.comparison.issues.join('; ')||'failed checks'));
    });
    lines.push('');
  }else{
    lines.push('_All scenarios passed automated consistency checks._');
    lines.push('');
  }

  lines.push('| Scenario | Exercise | Engine action | Weight | Reps | AI pass | Issues |');
  lines.push('|---|---|---|---:|---|:---:|---|');
  results.forEach(function(r){
    const e=r.engine;
    lines.push('| '+[
      r.scenarioName,
      r.exercise,
      e.action||'—',
      e.weightDisp!==''?e.weightDisp:'—',
      e.repTarget||'—',
      r.aiError?'error':(r.comparison.pass?'yes':'no'),
      r.aiError||r.comparison.issues.join('; ')||'—'
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Detailed cases');
  lines.push('');

  results.forEach(function(r){
    const e=r.engine;
    const c=r.comparison.checks||{};
    lines.push('### '+r.scenarioName);
    lines.push('');
    lines.push('**Exercise:** '+r.exercise);
    lines.push('');
    lines.push('**Session history (recent → older):** '+r.sessionHistory);
    lines.push('');
    lines.push('#### 1. Deterministic engine');
    lines.push('');
    lines.push('| Field | Value |');
    lines.push('|---|---|');
    lines.push('| Action | '+escapeMd(e.action||'—')+' |');
    lines.push('| Weight | '+escapeMd(e.weightDisp!==''?e.weightDisp+' lb'+(e.loadBasis==='per hand'?' per hand':''):'—')+' |');
    lines.push('| Rep target | '+escapeMd(e.repTarget||'—')+' |');
    lines.push('| Confidence | '+escapeMd(e.confidence||'—')+' |');
    lines.push('| Workout action | '+escapeMd(e.actionText||'—')+' |');
    lines.push('| Engine signal line | '+escapeMd(e.engineLine||'—')+' |');
    lines.push('| Why | '+escapeMd(e.whyText||'—')+' |');
    lines.push('');
    lines.push('#### 2. AI question');
    lines.push('');
    lines.push('```');
    lines.push(r.question);
    lines.push('```');
    lines.push('');
    lines.push('#### 3. AI response');
    lines.push('');
    if(r.aiError){
      lines.push('_AI call failed:_ '+escapeMd(r.aiError));
    }else if(meta.dryRun){
      lines.push('_Skipped in dry-run mode._');
    }else{
      lines.push('```');
      lines.push(r.aiResponse||'(empty)');
      lines.push('```');
    }
    lines.push('');
    lines.push('#### 4. Consistency checks');
    lines.push('');
    lines.push('| Check | Result |');
    lines.push('|---|---|');
    Object.keys(c).forEach(function(key){
      lines.push('| '+key+' | '+c[key]+' |');
    });
    lines.push('');
    lines.push('#### Manual review');
    lines.push('');
    lines.push('| matches engine? | same reasoning? | calibration ok? | invented causes? | notes |');
    lines.push('|:---:|:---:|:---:|:---:|---|');
    lines.push('| | | | | '+escapeMd(r.comparison.issues.join('; '))+' |');
    lines.push('');
  });

  lines.push('## Review guide');
  lines.push('');
  lines.push('- **Weight/rep/action match:** AI should describe the same next step the engine chose.');
  lines.push('- **Reasoning overlap:** AI should reuse engine evidence (history, target range, trend) rather than generic coaching.');
  lines.push('- **Calibration language:** baseline/early paths should mention limited history or conservative calibration.');
  lines.push('- **No contradiction:** AI must not recommend the opposite action or a different load as Forma\'s recommendation.');
  lines.push('- **No invented causes:** avoid sleep, injury, nutrition explanations unless present in profile/history.');
  lines.push('');

  return lines.join('\n');
}

async function main(){
  const context=loadFormaAIContext();
  if(typeof context.getOverloadSuggestion!=='function'){
    throw new Error('getOverloadSuggestion was not loaded');
  }

  const results=[];
  for(let i=0;i<SCENARIOS.length;i++){
    const scenario=SCENARIOS[i];
    setupScenarioContext(context,scenario);
    const sug=context.getOverloadSuggestion(scenario.exercise,'');
    const engine=engineSnapshot(context,scenario,sug);
    const question=buildQuestion(scenario,engine);
    const row={
      scenarioId:scenario.id,
      scenarioName:scenario.name,
      exercise:scenario.exercise,
      sessionHistory:scenario.sessions.length?scenario.sessions.map(function(s){return s.w+'×'+s.r;}).join(' → '):'(none)',
      question:question,
      engine:engine,
      aiResponse:'',
      aiError:'',
      comparison:{checks:{},issues:[],pass:false}
    };

    if(DRY_RUN){
      row.comparison={checks:{mode:'dry-run'},issues:[],pass:true};
    }else{
      try{
        row.aiResponse=await askAI(context,question);
        row.comparison=compareAIResponse(scenario,engine,row.aiResponse,context.S.profile);
      }catch(err){
        row.aiError=err&&err.message?err.message:String(err);
        row.comparison={checks:{aiCall:'failed'},issues:['AI call failed: '+row.aiError],pass:false};
      }
      if(DELAY_MS&&i<SCENARIOS.length-1)await sleep(DELAY_MS);
    }
    results.push(row);
    console.log('  '+scenario.name+': engine='+(engine.action||'none')+(row.aiError?' [AI error]':(DRY_RUN?' [dry-run]':(row.comparison.pass?' [pass]':' ['+row.comparison.issues.length+' flag(s)]'))));
  }

  const meta={dryRun:DRY_RUN,generatedAt:new Date().toISOString()};
  const report=buildReport(results,meta);
  fs.mkdirSync(path.dirname(REPORT_MD),{recursive:true});
  fs.writeFileSync(REPORT_MD,report);
  fs.writeFileSync(REPORT_JSON,JSON.stringify({meta:meta,results:results},null,2));

  const passCount=results.filter(function(r){return r.comparison.pass&&!r.aiError;}).length;
  console.log('Wrote '+path.relative(ROOT,REPORT_MD));
  console.log('Wrote '+path.relative(ROOT,REPORT_JSON));
  console.log('Pass: '+passCount+'/'+results.length+(DRY_RUN?' (dry-run — engine snapshots only)':''));
}

main().catch(function(err){
  console.error(err);
  process.exit(1);
});
