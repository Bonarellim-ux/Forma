#!/usr/bin/env node

const fs=require('fs');
const path=require('path');
const vm=require('vm');

const ROOT=path.resolve(__dirname,'..');
const REPORT_PATH=path.join(ROOT,'dev','reports','recommendation_explanations.md');

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
    id:1,
    name:'First-time no-history calibration',
    exercise:'Bench Press',
    sessions:[],
    notes:'Zero logged sessions; baseline calibration load.'
  },
  {
    id:2,
    name:'Early calibration too easy',
    exercise:'Bench Press',
    sessions:[{w:60,r:10},{w:60,r:10},{w:60,r:10}],
    notes:'Three sessions above max target at same weight.'
  },
  {
    id:3,
    name:'Early calibration too hard',
    exercise:'Bench Press',
    sessions:[{w:60,r:5},{w:60,r:4},{w:60,r:4}],
    notes:'Reps below min target and declining.'
  },
  {
    id:4,
    name:'Early inconsistent performance',
    exercise:'Bench Press',
    sessions:[{w:60,r:10},{w:60,r:5},{w:60,r:8}],
    notes:'High rep variance at same weight during calibration.'
  },
  {
    id:5,
    name:'Appropriate rep progression',
    exercise:'Bench Press',
    sessions:[{w:60,r:8},{w:60,r:8},{w:60,r:7}],
    notes:'In-range reps below max; should add reps before weight.'
  },
  {
    id:6,
    name:'Established steady progression',
    exercise:'Bench Press',
    sessions:[{w:135,r:10},{w:135,r:10},{w:135,r:10},{w:135,r:10},{w:135,r:10}],
    notes:'Four-plus sessions at top of target range; full engine weight increase.'
  },
  {
    id:7,
    name:'Plateau',
    exercise:'Bench Press',
    sessions:[{w:75,r:8},{w:75,r:8},{w:75,r:8},{w:75,r:8},{w:75,r:8}],
    notes:'Same weight and reps for multiple sessions without reaching max target.'
  },
  {
    id:8,
    name:'Declining performance',
    exercise:'Bench Press',
    sessions:[{w:135,r:5},{w:135,r:6},{w:135,r:7},{w:135,r:8},{w:135,r:10}],
    notes:'Rep trend declining at working weight across established history.'
  },
  {
    id:9,
    name:'Unknown/category fallback',
    exercise:'Custom Strength Drill',
    sessions:[],
    notes:'No history and no exact exercise match; category or unknown fallback.'
  },
  {
    id:10,
    name:'Dumbbell per-hand recommendation',
    exercise:'DB Shoulder Press',
    sessions:[],
    notes:'First-time dumbbell exercise; load basis should be per hand.'
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
    '}',
    'function homeLoadSuffix(sug){',
    '  return sug&&sug.loadBasis===\'per hand\'?\' per hand\':\'\';',
    '}',
    'function homeWeightText(sug){',
    '  if(!sug||sug.weightDisp===undefined||sug.weightDisp===null)return null;',
    '  return String(sug.weightDisp)+\' \'+uLbl()+homeLoadSuffix(sug);',
    '}',
    'function homeRecommendationLine(sug){',
    '  if(!sug)return \'\';',
    '  const wt=homeWeightText(sug);',
    '  if(sug.action===\'add_weight\'||sug.action===\'early_add_weight\')return wt?\'Increase to \'+wt:\'Add weight\';',
    '  if(sug.action===\'add_reps\'||sug.action===\'early_add_reps\')return wt?\'Stay at \'+wt:\'Add reps\';',
    '  if(sug.action===\'early_repeat\')return wt?\'Repeat \'+wt:\'Repeat last working set\';',
    '  if(sug.action===\'baseline\')return wt?\'Start around \'+wt:\'Set a baseline\';',
    '  if(sug.action===\'hold\'){',
    '    if(sug.reason===\'Hold progression\'&&wt)return \'Hold \'+wt;',
    '    if(wt)return \'Repeat \'+wt;',
    '    return \'Hold progression today\';',
    '  }',
    '  if(sug.action===\'reduce_weight\'&&wt)return \'Reduce to \'+wt;',
    '  if(sug.action===\'reduce_or_recover\'){',
    '    if(sug.dir===\'down\'&&wt)return \'Reduce to \'+wt;',
    '    return \'Hold progression today\';',
    '  }',
    '  const text=recommendationActionText(sug);',
    '  return text.replace(/\\s+and aiming for .*/i,\'\');',
    '}',
    'function homePlanShortText(exercise,sug){',
    '  const action=homeRecommendationLine(sug)',
    '    .replace(/^Stay at /,\'stay at \')',
    '    .replace(/^Increase to /,\'increase to \')',
    '    .replace(/^Repeat /,\'repeat \')',
    '    .replace(/^Start around /,\'start around \')',
    '    .replace(/^Hold /,\'hold \')',
    '    .replace(/^Reduce to /,\'reduce to \');',
    '  const short=(sug.action===\'add_reps\'||sug.action===\'early_add_reps\')&&sug.repTarget?\'aim for \'+sug.repTarget+\' reps\':action;',
    '  return exercise+\': \'+short;',
    '}'
  ].join('\n'),context,{filename:'dev/ui-helpers.js'});
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

function needsCalibrationLanguage(scenario,sug){
  if(!sug)return false;
  if(!scenario.sessions.length)return true;
  if(scenario.sessions.length<4)return true;
  if(sug.action==='baseline'||String(sug.action||'').startsWith('early_'))return true;
  if(sug.state==='baseline'||sug.state==='early_guidance'||sug.state==='early_progression')return true;
  if(sug.confidence==='low')return true;
  return false;
}

function analyzeExplanation(scenario,sug,actionText,whyText){
  const combined=(actionText+'\n'+whyText).toLowerCase();
  const detail=cleanDetail(sug&&sug.detail);
  const why=whyText.toLowerCase();
  const action=actionText.toLowerCase();

  const dataObservation=/(recent|last time|logged|session|working set|\d+\s*(lb|lbs|kg|×|x)\s*\d+|×| x )/.test(combined);
  const interpretation=/(because|since|target range|below|above|stable|inconsistent|declin|plateau|trend|varied|working range|mixed|goal is|informed by|category-based|starting point|conservative|calibration load|trending down|exercise-category match|per dumbbell)/.test(combined);
  const actionRationale=/(next|repeat|reduce|increase|add|hold|aim|before|keep|try|calibration|progress)/.test(combined);
  const needsUncertainty=needsCalibrationLanguage(scenario,sug);
  const uncertaintyLanguage=/(calibration|conservative|not a prediction|only \d+ logged|early|not confirmed|adjust after|no prior|broad movement|category match|low confidence|uncertain)/.test(combined);
  const uncertaintyOk=!needsUncertainty||uncertaintyLanguage;

  let noContradiction=true;
  const contradictionNotes=[];
  if(sug){
    if((sug.action==='add_weight'||sug.action==='early_add_weight')&&/(reduce|lower|too heavy|above your range)/.test(why)&&!/(before increasing|rebuild|keep reps in target)/.test(why)){
      noContradiction=false;
      contradictionNotes.push('Why mentions reduction/heaviness while action increases weight');
    }
    if((sug.action==='reduce_or_recover'||sug.action==='hold')&&sug.dir!=='down'&&/(increase to|try \d+|add weight|go heavier)/.test(action)){
      noContradiction=false;
      contradictionNotes.push('Action suggests increase while recommendation is hold/recover');
    }
    if(sug.action==='add_reps'&&/(reduce slightly|below the .* target range at)/.test(why)&&!/(before increasing|rebuild clean reps)/.test(why)){
      noContradiction=false;
      contradictionNotes.push('Why cites below-range struggle but action adds reps');
    }
    const actionWeightMatch=action.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs|kg)/);
    const recWeight=sug.weightDisp!==undefined&&sug.weightDisp!==null?String(sug.weightDisp):'';
    if(actionWeightMatch&&recWeight&&Math.abs(parseFloat(actionWeightMatch[1])-parseFloat(recWeight))>0.01){
      const actionSaysIncrease=(sug.action==='add_weight'||sug.action==='early_add_weight');
      if(!actionSaysIncrease){
        noContradiction=false;
        contradictionNotes.push('Action weight '+actionWeightMatch[1]+' does not match recommendation weight '+recWeight);
      }
    }
  }

  let noOverclaiming=true;
  const overclaimNotes=[];
  if(needsUncertainty&&/(confirmed trend|clearly ready|definitely|always|proven|long-term trend yet)/.test(combined)&&!/not a confirmed long-term trend yet/.test(combined)){
    if(/confirmed trend|clearly ready|definitely|always|proven/.test(combined)){
      noOverclaiming=false;
      overclaimNotes.push('Strong certainty language during calibration/low-history phase');
    }
  }
  if(sug&&sug.confidence==='low'&&/(high confidence|very confident|clear signal)/.test(combined)){
    noOverclaiming=false;
    overclaimNotes.push('High-confidence phrasing despite low recommendation confidence');
  }
  if(scenario.name==='Declining performance'&&/(ready to go heavier|increase to|try \d+ lb)/.test(action)){
    noOverclaiming=false;
    overclaimNotes.push('Progression language despite declining scenario');
  }

  return{
    dataObservation:dataObservation,
    interpretation:interpretation,
    actionRationale:actionRationale,
    uncertaintyLanguage:needsUncertainty?(uncertaintyLanguage?'yes':'no'):'n/a',
    uncertaintyOk:uncertaintyOk,
    noContradiction:noContradiction,
    noOverclaiming:noOverclaiming,
    contradictionNotes:contradictionNotes,
    overclaimNotes:overclaimNotes,
    detailLength:detail.length,
    whyLength:whyText.length
  };
}

function collectIssues(result){
  const issues=[];
  const c=result.checks;
  if(!result.suggestion.hasSuggestion)issues.push('No recommendation returned');
  if(!c.dataObservation)issues.push('Missing data observation');
  if(!c.interpretation)issues.push('Missing interpretation');
  if(!c.actionRationale)issues.push('Missing action rationale');
  if(c.uncertaintyLanguage==='no')issues.push('Missing calibration/uncertainty language when expected');
  if(!c.noContradiction)issues.push('Possible contradiction: '+c.contradictionNotes.join('; '));
  if(!c.noOverclaiming)issues.push('Possible overclaiming: '+c.overclaimNotes.join('; '));
  if(result.suggestion.hasSuggestion&&result.whyText.length>420)issues.push('Why text may be verbose ('+result.whyText.length+' chars)');
  if(result.homeCardText&&result.workoutActionText&&result.homeCardText.toLowerCase().indexOf('hold progression')===0&&result.workoutActionText.toLowerCase().indexOf('reduce')===0){
    issues.push('Home card and workout action diverge on hold vs reduce');
  }
  return issues;
}

function runScenario(context,scenario){
  context.S.unit='lbs';
  context.S.workouts=buildWorkouts(context,scenario.exercise,scenario.sessions);
  context.S.profile=Object.assign({},TEST_PROFILE);

  const sug=context.getOverloadSuggestion(scenario.exercise,'');
  const actionRaw=sug&&sug.detail?String(sug.detail).split('<br><br>Why:<br>')[0]:'';
  const workoutActionText=sug?context.recommendationActionText(sug):'';
  const whyText=sug?cleanDetail(context.recommendationWhyText(sug)):'';
  const homeCardText=sug?context.homeRecommendationLine(sug):'';
  const homePlanText=sug?context.homePlanShortText(scenario.exercise,sug):'';
  const phase=scenario.sessions.length<4?'calibration (starterOverloadSuggestion)':'established (full engine)';

  const suggestion={
    hasSuggestion:!!sug,
    dir:sug&&sug.dir||'',
    action:sug&&sug.action||'',
    state:sug&&sug.state||'',
    weightDisp:sug&&sug.weightDisp!==undefined?sug.weightDisp:'',
    repTarget:sug&&sug.repTarget||'',
    confidence:sug&&sug.confidence||'',
    source:sug&&sug.source||'',
    loadBasis:sug&&sug.loadBasis||'',
    reason:sug&&sug.reason||'',
    detail:sug?cleanDetail(sug.detail):'',
    actionRaw:cleanDetail(actionRaw)
  };

  const checks=analyzeExplanation(scenario,sug,workoutActionText,whyText);
  const result={
    scenarioId:scenario.id,
    scenarioName:scenario.name,
    scenarioNotes:scenario.notes,
    exercise:scenario.exercise,
    sessionHistory:scenario.sessions.length?scenario.sessions.map(function(s){return s.w+'×'+s.r;}).join(' → '):'(none)',
    phase:phase,
    suggestion:suggestion,
    workoutActionText:workoutActionText,
    homeCardText:homeCardText,
    homePlanText:homePlanText,
    whyText:whyText,
    checks:checks
  };
  result.issues=collectIssues(result);
  return result;
}

function yn(value){
  if(value==='n/a')return 'n/a';
  return value?'yes':'no';
}

function escapeMd(value){
  return String(value===undefined||value===null?'':value).replace(/\|/g,'\\|').replace(/\n/g,' ');
}

function buildIssueSummary(results){
  const lines=[];
  const flagged=results.filter(function(r){return r.issues.length;});
  const issueCounts={};
  flagged.forEach(function(r){
    r.issues.forEach(function(issue){
      const key=issue.split(':')[0];
      issueCounts[key]=(issueCounts[key]||0)+1;
    });
  });

  lines.push('## Automated issue summary');
  lines.push('');
  if(!flagged.length){
    lines.push('_No automated explanation issues flagged across the ten scenarios._');
  }else{
    lines.push('| Issue type | Count |');
    lines.push('|---|---:|');
    Object.keys(issueCounts).sort(function(a,b){return issueCounts[b]-issueCounts[a];}).forEach(function(key){
      lines.push('| '+escapeMd(key)+' | '+issueCounts[key]+' |');
    });
    lines.push('');
    lines.push('### Scenarios with flags');
    lines.push('');
    flagged.forEach(function(r){
      lines.push('- **'+r.scenarioName+'**: '+r.issues.join('; '));
    });
  }
  lines.push('');
  return lines.join('\n');
}

function buildReport(results){
  const lines=[];
  lines.push('# Recommendation Explanation Tester');
  lines.push('');
  lines.push('Generated: '+new Date().toISOString());
  lines.push('');
  lines.push('Purpose: evaluate whether Forma recommendation explanations are clear, trustworthy, and understandable. Uses production `getOverloadSuggestion` and the same UI text helpers as the app (`homeRecommendationLine`, `recommendationActionText`, `recommendationWhyText`). No AI API.');
  lines.push('');
  lines.push('Profile: '+TEST_PROFILE.sex+', '+TEST_PROFILE.age+'y, '+TEST_PROFILE.height+', '+TEST_PROFILE.bodyweight+' lb, '+TEST_PROFILE.experience+'.');
  lines.push('');
  lines.push(buildIssueSummary(results));
  lines.push('---');
  lines.push('');
  lines.push('## Scenario overview');
  lines.push('');
  lines.push('| # | Scenario | Exercise | Action | Home card | Workout action | Auto flags | clear? | trustworthy? | too verbose? | notes |');
  lines.push('|---:|---|---|---|---|---|---|:---:|:---:|:---:|---|');
  results.forEach(function(r){
    const s=r.suggestion;
    lines.push('| '+[
      r.scenarioId,
      r.scenarioName,
      r.exercise,
      s.action||'—',
      r.homeCardText||'—',
      r.workoutActionText||'—',
      r.issues.length?r.issues.length:'—',
      '',
      '',
      '',
      ''
    ].map(escapeMd).join(' | ')+' |');
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Detailed scenarios');
  lines.push('');

  results.forEach(function(r){
    const s=r.suggestion;
    const c=r.checks;
    lines.push('### '+r.scenarioId+'. '+r.scenarioName);
    lines.push('');
    lines.push('**Exercise:** '+r.exercise);
    lines.push('');
    lines.push('**Session history (recent → older):** '+r.sessionHistory);
    lines.push('');
    lines.push('**Engine phase:** '+r.phase);
    lines.push('');
    if(r.scenarioNotes)lines.push('**Scenario notes:** '+r.scenarioNotes);
    if(r.scenarioNotes)lines.push('');
    lines.push('| Field | Value |');
    lines.push('|---|---|');
    lines.push('| Recommendation action | '+escapeMd(s.action||'—')+' |');
    lines.push('| Direction | '+escapeMd(s.dir||'—')+' |');
    lines.push('| State | '+escapeMd(s.state||'—')+' |');
    lines.push('| Weight | '+escapeMd(s.weightDisp!==''?s.weightDisp+' lb':'—')+' |');
    lines.push('| Rep target | '+escapeMd(s.repTarget||'—')+' |');
    lines.push('| Confidence | '+escapeMd(s.confidence||'—')+' |');
    lines.push('| Source / load basis | '+escapeMd((s.source||'—')+' / '+(s.loadBasis||'—'))+' |');
    lines.push('| Home card text | '+escapeMd(r.homeCardText||'—')+' |');
    lines.push('| Home plan line | '+escapeMd(r.homePlanText||'—')+' |');
    lines.push('| Workout action text | '+escapeMd(r.workoutActionText||'—')+' |');
    lines.push('| Why / explanation | '+escapeMd(r.whyText||'—')+' |');
    lines.push('');
    lines.push('#### Explanation checks');
    lines.push('');
    lines.push('| Check | Result |');
    lines.push('|---|---|');
    lines.push('| Data observation | '+yn(c.dataObservation)+' |');
    lines.push('| Interpretation | '+yn(c.interpretation)+' |');
    lines.push('| Action rationale | '+yn(c.actionRationale)+' |');
    lines.push('| Uncertainty / calibration language (when needed) | '+c.uncertaintyLanguage+' |');
    lines.push('| No contradiction | '+yn(c.noContradiction)+' |');
    lines.push('| No overclaiming | '+yn(c.noOverclaiming)+' |');
    lines.push('');
    lines.push('#### Manual review');
    lines.push('');
    lines.push('| clear? | trustworthy? | too verbose? | notes |');
    lines.push('|:---:|:---:|:---:|---|');
    lines.push('| | | | '+escapeMd(r.issues.join('; '))+' |');
    lines.push('');
    if(s.detail){
      lines.push('<details>');
      lines.push('<summary>Full recommendation detail</summary>');
      lines.push('');
      lines.push('```');
      lines.push(s.detail);
      lines.push('```');
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  });

  lines.push('## Review guide');
  lines.push('');
  lines.push('- **Data observation:** cites logged sets, reps, weights, or recent session pattern.');
  lines.push('- **Interpretation:** explains what the data means (in/out of range, stable, inconsistent, declining).');
  lines.push('- **Action rationale:** ties the recommended next step to the interpretation.');
  lines.push('- **Uncertainty language:** baseline and early calibration should say conservative / limited history / not a strength prediction.');
  lines.push('- **No contradiction:** action line, home card, and why text should agree on hold vs progress vs reduce.');
  lines.push('- **No overclaiming:** avoid definite progression claims when confidence is low or history is short.');
  lines.push('');

  return lines.join('\n');
}

function main(){
  const context=loadFormaRecommendationContext();
  if(typeof context.getOverloadSuggestion!=='function'){
    throw new Error('getOverloadSuggestion was not loaded from js/recommendations.js');
  }

  const results=SCENARIOS.map(function(scenario){
    return runScenario(context,scenario);
  });

  const report=buildReport(results);
  fs.mkdirSync(path.dirname(REPORT_PATH),{recursive:true});
  fs.writeFileSync(REPORT_PATH,report);

  const flagged=results.filter(function(r){return r.issues.length;});
  console.log('Wrote '+path.relative(ROOT,REPORT_PATH));
  console.log('Scenarios: '+results.length+', automated flags: '+flagged.length);
  results.forEach(function(r){
    console.log('  '+r.scenarioId+'. '+r.scenarioName+': '+(r.suggestion.action||'none')+(r.issues.length?' ['+r.issues.length+' flag(s)]':''));
  });
}

main();
