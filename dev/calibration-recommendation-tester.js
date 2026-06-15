#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_PATH=path.join(ROOT,'dev','reports','calibration_recommendations.md');

const DEFAULT_EXERCISE='Bench Press';
const SESSION_COUNTS=[1,2,3];

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
    id:'A',
    label:'Too easy',
    sessions:[{w:60,r:10},{w:60,r:10},{w:60,r:10}],
    expectation:'Increase more aggressively when reps exceed target range at stable weight.',
    expect:{
      at3:{dir:['up'],action:['early_add_weight','add_weight'],weightAboveLast:true},
      flags:['May only add one standard jump (+5 lb) despite 3 sessions well above maxTarget']
    }
  },
  {
    id:'B',
    label:'Appropriate',
    sessions:[{w:60,r:8},{w:60,r:8},{w:60,r:7}],
    expectation:'Small progression or repeat at same weight.',
    expect:{
      at3:{dir:['same'],action:['early_add_reps','early_repeat','add_reps','hold']},
      flags:[]
    }
  },
  {
    id:'C',
    label:'Too hard',
    sessions:[{w:60,r:5},{w:60,r:4},{w:60,r:4}],
    expectation:'Repeat or reduce load when reps stay below minimum target and decline.',
    expect:{
      at3:{dir:['same','down'],action:['early_repeat','hold','reduce_or_recover'],mustNotAction:['early_add_reps','early_add_weight','add_reps','add_weight']},
      flags:['Should not push rep progression when below minTarget with declining performance']
    }
  },
  {
    id:'D',
    label:'Very inconsistent',
    sessions:[{w:60,r:10},{w:60,r:5},{w:60,r:8}],
    expectation:'Repeat at same weight to gather more data; avoid progression on noisy signal.',
    expect:{
      at3:{dir:['same'],action:['early_repeat','hold'],mustNotAction:['early_add_reps','early_add_weight','add_weight']},
      flags:['Should detect rep variance and hold rather than progress']
    }
  },
  {
    id:'E',
    label:'Strong beginner',
    sessions:[{w:95,r:10},{w:95,r:10},{w:95,r:10}],
    expectation:'Faster calibration upward when load is clearly submaximal across sessions.',
    expect:{
      at3:{dir:['up'],action:['early_add_weight','add_weight'],weightAboveLast:true},
      flags:['May treat strong beginner same as moderate overload (+5 lb only)']
    }
  },
  {
    id:'F',
    label:'Overestimated novice',
    sessions:[{w:50,r:4},{w:50,r:3},{w:50,r:3}],
    expectation:'Reduce load safely when reps are well below minimum and trending down.',
    expect:{
      at3:{dir:['same','down'],action:['early_repeat','hold','reduce_or_recover'],mustNotAction:['early_add_reps','early_add_weight','add_reps','add_weight']},
      flags:['Should reduce or hold, not add reps, when load was overestimated']
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
      weight:'',
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
    weight:sug.weightDisp!==undefined?sug.weightDisp:'',
    weightDisp:sug.weightDisp!==undefined?sug.weightDisp:'',
    repTarget:sug.repTarget||'',
    reason:sug.reason||'',
    confidence:sug.confidence||'',
    trend:sug.trend||'',
    detail:cleanDetail(sug.detail),
    explanation:cleanDetail(sug.detail).split('Why:\n')[1]||cleanDetail(sug.detail)
  };
}

function lastSessionWeight(sessions){
  return sessions.length?sessions[0].w:null;
}

function evaluateExpectation(expect,sug,sessions){
  const issues=[];
  const notes=[];
  if(!expect)return{pass:true,issues:issues,notes:notes};

  if(expect.dir&&expect.dir.length&&!expect.dir.includes(sug.dir)){
    issues.push('Expected dir in ['+expect.dir.join(', ')+'] but got "'+sug.dir+'"');
  }
  if(expect.action&&expect.action.length&&!expect.action.includes(sug.action)){
    issues.push('Expected action in ['+expect.action.join(', ')+'] but got "'+sug.action+'"');
  }
  if(expect.mustNotAction&&expect.mustNotAction.includes(sug.action)){
    issues.push('Action "'+sug.action+'" should not occur for this scenario');
  }
  if(expect.weightAboveLast){
    const lastW=lastSessionWeight(sessions);
    const recW=parseFloat(sug.weightDisp);
    if(!(recW>lastW)){
      issues.push('Expected recommended weight above last session ('+lastW+' lb) but got '+recW+' lb');
    }
  }
  if(expect.weightBelowLast){
    const lastW=lastSessionWeight(sessions);
    const recW=parseFloat(sug.weightDisp);
    if(!(recW<lastW)){
      issues.push('Expected recommended weight below last session ('+lastW+' lb) but got '+recW+' lb');
    }
  }

  return{pass:!issues.length,issues:issues,notes:notes};
}

function runScenarioAtCount(context,scenario,sessionCount,exercise){
  const sessions=scenario.sessions.slice(0,sessionCount);
  context.S.unit='lbs';
  context.S.workouts=buildWorkouts(context,exercise,sessions);
  context.S.profile=Object.assign({},TEST_PROFILE);

  const sug=context.getOverloadSuggestion(exercise,'');
  const summary=summarizeSuggestion(sug);
  const profile=context.exerciseProgressionProfile(exercise);
  const recent=context.getRecentExerciseSessions(exercise,6);

  const expectKey='at'+sessionCount;
  const expect=scenario.expect[expectKey]||null;
  const evaluation=evaluateExpectation(expect,summary,sessions);

  let established=null;
  if(sessionCount===3){
    const extendedWorkouts=buildWorkouts(context,exercise,scenario.sessions.concat([scenario.sessions[scenario.sessions.length-1]]));
    context.S.workouts=extendedWorkouts;
    const establishedSug=context.getOverloadSuggestion(exercise,'');
    established=summarizeSuggestion(establishedSug);
    context.S.workouts=buildWorkouts(context,exercise,sessions);
  }

  return{
    scenarioId:scenario.id,
    scenarioLabel:scenario.label,
    sessionCount:sessionCount,
    exercise:exercise,
    sessions:sessions,
    sessionHistory:sessions.map(function(s){return s.w+'×'+s.r;}).join(' → '),
    profile:profile,
    recentCount:recent.length,
    phase:recent.length<4?'calibration (starterOverloadSuggestion)':'established (full engine)',
    suggestion:summary,
    evaluation:evaluation,
    establishedAt4:established,
    expectation:scenario.expectation,
    scenarioFlags:scenario.expect.flags||[]
  };
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildWeaknessAnalysis(results){
  const lines=[];
  const failures=results.filter(function(r){return !r.evaluation.pass;});
  const calibrationResults=results.filter(function(r){return r.sessionCount<=3;});
  const at3=results.filter(function(r){return r.sessionCount===3;});

  lines.push('## Weakness analysis');
  lines.push('');
  lines.push('Calibration path: `getOverloadSuggestion` routes to `starterOverloadSuggestion` when `sessions.length < 4` (i.e. **1–3 sessions**). At **4+ sessions**, the established full engine runs unchanged.');
  lines.push('');

  lines.push('### Scenario pass rate (3 sessions)');
  lines.push('');
  lines.push('| Scenario | Pass | Recommendation | Issue |');
  lines.push('|---|---|---|---|');
  at3.forEach(function(r){
    const s=r.suggestion;
    const rec=s.hasSuggestion?
      (s.dir==='up'?'↑ ':'')+s.weight+' lb × '+s.repTarget+' ('+s.action+')':
      'none';
    lines.push('| '+[
      r.scenarioId+': '+r.scenarioLabel,
      r.evaluation.pass?'✓':'✗',
      rec,
      r.evaluation.issues.join('; ')||'—'
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');

  lines.push('### Calibration vs established engine (3 sessions → 4 sessions)');
  lines.push('');
  lines.push('| Scenario | At 3 sessions | At 4 sessions (same history + duplicate) | Divergence |');
  lines.push('|---|---|---|---|');
  at3.forEach(function(r){
    const cal=r.suggestion;
    const est=r.establishedAt4;
    const calText=cal.hasSuggestion?cal.weight+' lb, '+cal.action+' ('+cal.dir+')':'none';
    const estText=est&&est.hasSuggestion?est.weight+' lb, '+est.action+' ('+est.dir+')':'none';
    const diverge=cal.action!==(est&&est.action)||cal.dir!==(est&&est.dir)||cal.weight!==(est&&est.weight);
    lines.push('| '+[
      r.scenarioId,
      calText,
      estText,
      diverge?'Different engine path / outcome':'Same outcome'
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');

  lines.push('### Identified weaknesses in current calibration logic');
  lines.push('');

  const weaknessBullets=[];

  if(failures.length){
    weaknessBullets.push('**Remaining expectation failures:** '+failures.length+' case(s) still fail automated checks — review detailed results below.');
  }else{
    weaknessBullets.push('_All six calibration scenarios pass at 3 sessions with current heuristics._');
  }

  weaknessBullets.forEach(function(b){lines.push('- '+b);});
  lines.push('');

  lines.push('### Failure count by session count');
  lines.push('');
  SESSION_COUNTS.forEach(function(count){
    const subset=results.filter(function(r){return r.sessionCount===count;});
    const fail=subset.filter(function(r){return !r.evaluation.pass;}).length;
    lines.push('- **'+count+' session(s):** '+fail+'/'+subset.length+' scenarios failed expectations');
  });
  lines.push('');
  lines.push('**Total expectation failures:** '+failures.length+'/'+calibrationResults.length);
  lines.push('');

  return lines.join('\n');
}

function buildReport(results){
  const lines=[];
  lines.push('# Calibration Recommendation Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: stress-test Forma recommendations during the **calibration phase** (1–3 logged sessions). Uses production `getOverloadSuggestion` / `starterOverloadSuggestion`.');
  lines.push('');
  lines.push('Exercise: **'+DEFAULT_EXERCISE+'** (upper compound; minTarget 6, maxTarget 10, jump 5 lb).');
  lines.push('Profile: '+TEST_PROFILE.sex+', '+TEST_PROFILE.age+'y, '+TEST_PROFILE.height+', '+TEST_PROFILE.bodyweight+' lb, '+TEST_PROFILE.experience+'.');
  lines.push('');
  lines.push(buildWeaknessAnalysis(results));
  lines.push('---');
  lines.push('');
  lines.push('## Detailed results');
  lines.push('');

  SCENARIOS.forEach(function(scenario){
    lines.push('### Scenario '+scenario.id+': '+scenario.label);
    lines.push('');
    lines.push('**Expected:** '+scenario.expectation);
    if(scenario.expect.flags&&scenario.expect.flags.length){
      lines.push('');
      lines.push('**Known risk flags:** '+scenario.expect.flags.join(' '));
    }
    lines.push('');
    lines.push('| Sessions | History (recent → older) | Phase | Dir | Action | Weight | Reps | Pass | Issues |');
    lines.push('|---:|---|---|---|---|---:|---|:---:|---|');

    SESSION_COUNTS.forEach(function(count){
      const r=results.find(function(row){
        return row.scenarioId===scenario.id&&row.sessionCount===count;
      });
      if(!r)return;
      const s=r.suggestion;
      lines.push('| '+[
        count,
        r.sessionHistory,
        r.phase,
        s.dir||'—',
        s.action||'—',
        s.weight!==''?s.weight+' lb':'—',
        s.repTarget||'—',
        r.evaluation.pass?'✓':'✗',
        r.evaluation.issues.join('; ')||'—'
      ].map(escapeMd).join(' | ')+' |');
    });
    lines.push('');

    const at3=results.find(function(r){return r.scenarioId===scenario.id&&r.sessionCount===3;});
    if(at3&&at3.suggestion.detail){
      lines.push('<details>');
      lines.push('<summary>Full recommendation detail (3 sessions)</summary>');
      lines.push('');
      lines.push('```');
      lines.push(at3.suggestion.detail);
      lines.push('```');
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  });

  lines.push('## Appendix: calibration decision tree (sessions 1–3)');
  lines.push('');
  lines.push('1. **High rep variance at same weight (range ≥ 3)** → `early_repeat` (stabilize).');
  lines.push('2. **Below minTarget** → `hold` (repeat) or `reduce_or_recover` if well below min.');
  lines.push('3. **Stable at/above maxTarget** → `early_add_weight` (1× jump; 2× for stable compound triples).');
  lines.push('4. **In range below maxTarget** → `early_add_reps`.');
  lines.push('5. **At maxTarget but not confirmed** → `early_repeat`.');
  lines.push('');
  lines.push('At **4+ sessions**, the established full engine runs unchanged.');
  lines.push('');

  return lines.join('\n');
}

function main(){
  const context=loadFormaRecommendationContext();
  if(typeof context.getOverloadSuggestion!=='function'){
    throw new Error('getOverloadSuggestion was not loaded from js/recommendations.js');
  }

  const results=[];
  SCENARIOS.forEach(function(scenario){
    SESSION_COUNTS.forEach(function(count){
      results.push(runScenarioAtCount(context,scenario,count,DEFAULT_EXERCISE));
    });
  });

  const report=buildReport(results);
  fs.mkdirSync(path.dirname(REPORT_PATH),{recursive:true});
  fs.writeFileSync(REPORT_PATH,report);

  const at3=results.filter(function(r){return r.sessionCount===3;});
  const failures=results.filter(function(r){return !r.evaluation.pass;});
  console.log('Wrote '+path.relative(ROOT,REPORT_PATH));
  console.log('Scenarios: '+SCENARIOS.length+', session counts: '+SESSION_COUNTS.join('/')+', total cases: '+results.length);
  console.log('3-session pass: '+(at3.length-failures.filter(function(r){return r.sessionCount===3;}).length)+'/'+at3.length);
  console.log('Total expectation failures: '+failures.length+'/'+results.length);
}

main();
