#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_PATH=path.join(ROOT,'dev','reports','calibration_handoff.md');

const DEFAULT_EXERCISE='Bench Press';
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
    id:'1',
    label:'Too hard continues',
    sessions:[{w:60,r:5},{w:60,r:4},{w:60,r:4},{w:60,r:4}],
    expectation:'Should not suddenly recommend add_reps after calibration reduced or held load.',
    expectAt4:{
      mustNotAction:['add_reps','early_add_reps','add_weight','early_add_weight'],
      preferAction:['hold','reduce_or_recover','early_repeat'],
      consistentWithCalibration:true
    }
  },
  {
    id:'2',
    label:'Overestimated continues',
    sessions:[{w:50,r:4},{w:50,r:3},{w:50,r:3},{w:50,r:3}],
    expectation:'Should not suddenly recommend add_reps when still below minTarget.',
    expectAt4:{
      mustNotAction:['add_reps','early_add_reps','add_weight','early_add_weight'],
      preferAction:['hold','reduce_or_recover','early_repeat'],
      consistentWithCalibration:true
    }
  },
  {
    id:'3',
    label:'Inconsistent continues',
    sessions:[{w:60,r:10},{w:60,r:5},{w:60,r:8},{w:60,r:7}],
    expectation:'Should repeat or hold — not null and not aggressive progression.',
    expectAt4:{
      mustNotAction:['add_weight','early_add_weight'],
      preferAction:['hold','early_repeat','early_add_reps','add_reps'],
      requireSuggestion:true,
      consistentWithCalibration:true
    }
  },
  {
    id:'4',
    label:'Too easy continues',
    sessions:[{w:60,r:10},{w:60,r:10},{w:60,r:10},{w:70,r:8}],
    expectation:'Should continue sensible progression or repeat after weight increase.',
    expectAt4:{
      mustNotAction:[],
      preferAction:['add_reps','early_add_reps','hold','early_repeat','add_weight','early_add_weight'],
      requireSuggestion:true,
      consistentWithCalibration:true
    }
  },
  {
    id:'5',
    label:'Appropriate continues',
    sessions:[{w:60,r:8},{w:60,r:8},{w:60,r:7},{w:60,r:8}],
    expectation:'Should recommend small rep progression or repeat.',
    expectAt4:{
      mustNotAction:['add_weight','early_add_weight','reduce_or_recover'],
      preferAction:['add_reps','early_add_reps','hold','early_repeat'],
      requireSuggestion:true,
      consistentWithCalibration:true
    }
  }
];

function loadFormaRecommendationContext(){
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
    setTimeout:function(){},
    document:{documentElement:{getAttribute:function(){return 'light';}}},
    localStorage:{getItem:function(){return null;},setItem:function(){},removeItem:function(){}},
    S:{unit:'lbs',workouts:[],profile:{},schedule:{},splitEx:{}}
  };
  context.window=context;
  vm.createContext(context);
  [
    'js/utils.js',
    'js/constants.js',
    'js/exerciseSubstitutions.js',
    'js/plateCalculator.js',
    'js/recommendations.js'
  ].forEach(function(rel){
    vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),context,{filename:rel});
  });
  return context;
}

function cleanDetail(detail){
  return String(detail||'')
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function isoDaysAgo(days){
  const d=new Date();
  d.setDate(d.getDate()-days);
  return d.toISOString().slice(0,10);
}

function buildWorkouts(context,exercise,sessions){
  const chronological=sessions.slice().reverse();
  return chronological.map(function(session,index){
    const daysAgo=(chronological.length-index)*3;
    return{
      date:isoDaysAgo(daysAgo),
      exercises:[{
        name:exercise,
        sets:[{w:context.toKg(session.w),r:session.r,warmup:false}]
      }]
    };
  });
}

function summarizeSuggestion(sug){
  if(!sug){
    return{
      hasSuggestion:false,
      dir:'',
      action:'',
      state:'',
      weightDisp:'',
      repTarget:'',
      reason:'',
      confidence:'',
      trend:'',
      detail:'',
      explanation:'No deterministic recommendation was returned.'
    };
  }
  return{
    hasSuggestion:true,
    dir:sug.dir||'',
    action:sug.action||'',
    state:sug.state||'',
    weightDisp:sug.weightDisp!==undefined?sug.weightDisp:'',
    repTarget:sug.repTarget||'',
    reason:sug.reason||'',
    confidence:sug.confidence||'',
    trend:sug.trend||'',
    detail:cleanDetail(sug.detail),
    explanation:cleanDetail(sug.detail).split('Why:\n')[1]||cleanDetail(sug.detail)
  };
}

function sessionHistory(sessions){
  return sessions.map(function(s){return s.w+'×'+s.r;}).join(' → ');
}

function enginePhase(sessionCount){
  return sessionCount<4?'calibration (starterOverloadSuggestion)':'full engine (4+ sessions)';
}

function formatRec(s){
  if(!s.hasSuggestion)return 'none';
  return (s.dir==='up'?'↑ ':s.dir==='down'?'↓ ':'')+s.weightDisp+' lb × '+s.repTarget+' ('+s.action+')';
}

function evaluateAt4(expect,sug){
  const issues=[];
  if(!expect)return{pass:true,issues:issues,consistent:true};

  if(expect.requireSuggestion&&!sug.hasSuggestion){
    issues.push('Expected a recommendation but got none');
  }
  if(expect.mustNotAction&&expect.mustNotAction.includes(sug.action)){
    issues.push('Action "'+sug.action+'" should not occur at session 4 handoff');
  }
  if(expect.preferAction&&expect.preferAction.length&&sug.hasSuggestion&&!expect.preferAction.includes(sug.action)){
    issues.push('Action "'+sug.action+'" is outside preferred set ['+expect.preferAction.join(', ')+']');
  }

  return{
    pass:!issues.length,
    issues:issues,
    consistent:issues.length===0
  };
}

function analyzeHandoff(at3,at4,scenario){
  const notes=[];
  if(!at3.suggestion.hasSuggestion&&at4.suggestion.hasSuggestion){
    notes.push('Recommendation appears only after handoff to full engine.');
  }
  if(at3.suggestion.hasSuggestion&&!at4.suggestion.hasSuggestion){
    notes.push('Regression: calibration gave guidance but full engine returned none.');
  }
  if(at3.suggestion.action!==at4.suggestion.action){
    notes.push('Action changed: '+at3.suggestion.action+' (session 3) → '+(at4.suggestion.action||'none')+' (session 4).');
  }
  if(at3.suggestion.dir!==at4.suggestion.dir){
    notes.push('Direction changed: '+at3.suggestion.dir+' → '+(at4.suggestion.dir||'—')+'.');
  }
  if(['add_reps','early_add_reps'].includes(at4.suggestion.action)&&['hold','reduce_or_recover','early_repeat'].includes(at3.suggestion.action)){
    notes.push('Handoff conflict: calibration held/reduced but full engine pushes rep progression.');
  }
  if(!at4.suggestion.hasSuggestion&&scenario.id==='3'){
    notes.push('Full engine silence on inconsistent data — same gap calibration fixed at session 3.');
  }
  return notes;
}

function runScenario(context,scenario,exercise){
  const results=[];
  [3,4].forEach(function(count){
    const sessions=scenario.sessions.slice(0,count);
    context.S.unit='lbs';
    context.S.workouts=buildWorkouts(context,exercise,sessions);
    context.S.profile=Object.assign({},TEST_PROFILE);
    const sug=context.getOverloadSuggestion(exercise,'');
    const profile=context.exerciseProgressionProfile(exercise);
    results.push({
      sessionCount:count,
      phase:enginePhase(count),
      sessions:sessions,
      sessionHistory:sessionHistory(sessions),
      profile:profile,
      suggestion:summarizeSuggestion(sug)
    });
  });

  const at3=results.find(function(r){return r.sessionCount===3;});
  const at4=results.find(function(r){return r.sessionCount===4;});
  const evaluation=evaluateAt4(scenario.expectAt4,at4.suggestion);
  const handoffNotes=analyzeHandoff(at3,at4,scenario);

  return{
    scenarioId:scenario.id,
    scenarioLabel:scenario.label,
    expectation:scenario.expectation,
    at3:at3,
    at4:at4,
    evaluation:evaluation,
    handoffNotes:handoffNotes
  };
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildGuardRecommendation(results){
  const lines=[];
  const regressive=results.filter(function(r){
    return r.handoffNotes.some(function(n){return n.indexOf('Handoff conflict')>=0;});
  });
  const silent=results.filter(function(r){
    return !r.at4.suggestion.hasSuggestion&&r.at3.suggestion.hasSuggestion;
  });
  const addRepsBelowMin=results.filter(function(r){
    return ['add_reps','early_add_reps'].includes(r.at4.suggestion.action)&&
      (r.scenarioId==='1'||r.scenarioId==='2');
  });

  lines.push('## Guard recommendation');
  lines.push('');

  if(addRepsBelowMin.length){
    lines.push('**Yes — the full engine likely needs a small guard against `add_reps` below `minTarget`.**');
    lines.push('');
    lines.push('Scenarios '+addRepsBelowMin.map(function(r){return r.scenarioId;}).join(' and ')+' show calibration correctly holding or reducing at session 3, then the full engine recommends `add_reps` at session 4 while reps remain below the 6-rep lower bound for bench.');
    lines.push('');
    lines.push('Suggested guard (for future implementation, not applied here):');
    lines.push('- In `classifyProgressionState` or before `building_reps` / `add_reps` output in `getOverloadSuggestion`, skip rep progression when `last.topR < profile.minTarget` or when recent max reps at the working weight are below `minTarget`.');
    lines.push('- Prefer `hold` or `reduce_or_recover` to match calibration behavior.');
  }else{
    lines.push('**No urgent `add_reps`-below-`minTarget` guard needed** based on these scenarios.');
  }

  if(silent.length){
    lines.push('');
    lines.push('**Silence regression at handoff:** '+silent.map(function(r){return 'Scenario '+r.scenarioId;}).join(', ')+' lose recommendations when switching to the full engine.');
  }

  if(regressive.length&&!addRepsBelowMin.length){
    lines.push('');
    lines.push('**Other handoff inconsistencies** detected — see scenario notes below.');
  }

  if(!addRepsBelowMin.length&&!silent.length&&!regressive.length){
    lines.push('');
    lines.push('All five handoff scenarios behave consistently with calibration-phase intent.');
  }

  lines.push('');
  return lines.join('\n');
}

function buildReport(results){
  const lines=[];
  lines.push('# Calibration → Full Engine Handoff Test');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: verify that exercises with 4 logged sessions do not regress after 1–3 session calibration logic. **No production code was modified for this report.**');
  lines.push('');
  lines.push('Exercise: **Bench Press** (minTarget 6, maxTarget 10). Threshold: `< 4` sessions → calibration, `≥ 4` → full engine.');
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  const passCount=results.filter(function(r){return r.evaluation.pass;}).length;
  lines.push('**Session-4 expectation pass rate:** '+passCount+'/'+results.length);
  lines.push('');

  lines.push('| # | Scenario | Session 3 (calibration) | Session 4 (full engine) | Consistent? | Pass |');
  lines.push('|---:|---|---|---|:---:|:-:|');
  results.forEach(function(r){
    lines.push('| '+[
      r.scenarioId,
      r.scenarioLabel,
      formatRec(r.at3.suggestion),
      formatRec(r.at4.suggestion),
      r.handoffNotes.some(function(n){return n.indexOf('conflict')>=0||n.indexOf('Regression')>=0||n.indexOf('silence')>=0;})?'✗':'✓',
      r.evaluation.pass?'✓':'✗'
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');

  lines.push(buildGuardRecommendation(results));
  lines.push('---');
  lines.push('');
  lines.push('## Detailed results');
  lines.push('');

  results.forEach(function(r){
    lines.push('### Scenario '+r.scenarioId+': '+r.scenarioLabel);
    lines.push('');
    lines.push('**History (recent → older):** '+sessionHistory(r.at4.sessions));
    lines.push('');
    lines.push('**Expected at session 4:** '+r.expectation);
    lines.push('');
    lines.push('| Sessions | Engine | Recommendation | Action | Dir |');
    lines.push('|---:|---|---|---|---|');
    [r.at3,r.at4].forEach(function(row){
      const s=row.suggestion;
      lines.push('| '+[
        row.sessionCount,
        row.phase,
        s.hasSuggestion?s.weightDisp+' lb × '+s.repTarget:'none',
        s.action||'—',
        s.dir||'—'
      ].map(escapeMd).join(' | ')+' |');
    });
    lines.push('');
    if(r.handoffNotes.length){
      lines.push('**Handoff notes:**');
      r.handoffNotes.forEach(function(n){lines.push('- '+n);});
      lines.push('');
    }
    if(r.evaluation.issues.length){
      lines.push('**Issues:** '+r.evaluation.issues.join('; '));
      lines.push('');
    }
    if(r.at4.suggestion.detail){
      lines.push('<details>');
      lines.push('<summary>Full session-4 recommendation detail</summary>');
      lines.push('');
      lines.push('```');
      lines.push(r.at4.suggestion.detail);
      lines.push('```');
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  });

  return lines.join('\n');
}

function main(){
  const context=loadFormaRecommendationContext();
  if(typeof context.getOverloadSuggestion!=='function'){
    throw new Error('getOverloadSuggestion was not loaded');
  }

  const results=SCENARIOS.map(function(scenario){
    return runScenario(context,scenario,DEFAULT_EXERCISE);
  });

  const report=buildReport(results);
  fs.mkdirSync(path.dirname(REPORT_PATH),{recursive:true});
  fs.writeFileSync(REPORT_PATH,report);

  console.log('Wrote '+path.relative(ROOT,REPORT_PATH));
  results.forEach(function(r){
    console.log('Scenario '+r.scenarioId+': session3='+formatRec(r.at3.suggestion)+' | session4='+formatRec(r.at4.suggestion)+(r.evaluation.pass?' ✓':' ✗'));
  });
  const pass=results.filter(function(r){return r.evaluation.pass;}).length;
  console.log('Session-4 pass: '+pass+'/'+results.length);
}

main();
