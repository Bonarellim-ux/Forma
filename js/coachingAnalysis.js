// Coaching analysis layer for Forma.
// Runs before AI prompts so Claude sees prioritized patterns, not just raw trends.

function caNormName(name){
  return String(name||'').trim().toLowerCase().replace(/[-_]/g,' ').replace(/\s+/g,' ');
}
function caRound(n,digits){const p=Math.pow(10,digits||1);return Math.round((Number(n)||0)*p)/p;}
function caTrendFromScore(score){if(score>=0.35)return 'improving';if(score<=-0.35)return 'declining';return 'stable';}
function caConfidence(sessionCount,signalsAgree){if(sessionCount>=4&&signalsAgree)return 'high';if(sessionCount>=3)return 'medium';return 'low';}
function caExerciseRole(name){
  const n=caNormName(name);
  if(/\b(incline|low to high|low-to-high)\b/.test(n)&&/\b(press|bench|fly)\b/.test(n))return 'incline_press';
  if(/\b(bench|chest press|push up|push-up|dip|fly|crossover)\b/.test(n))return 'horizontal_press';
  if(/\b(overhead press|shoulder press|arnold press|landmine press|military press)\b/.test(n))return 'vertical_press';
  if(/\b(row|face pull|rear delt|reverse fly)\b/.test(n))return 'horizontal_pull';
  if(/\b(pull up|pull-up|pullups|pull ups|chin up|chin-up|pulldown|straight arm pulldown)\b/.test(n))return 'vertical_pull';
  if(/\b(squat|leg press|hack squat|lunge|split squat|step up|leg extension)\b/.test(n))return 'squat_pattern';
  if(/\b(deadlift|romanian|rdl|good morning|hip thrust|glute bridge|leg curl)\b/.test(n))return 'hinge_pattern';
  if(/\b(pushdown|skull|tricep|triceps extension)\b/.test(n))return 'elbow_extension';
  if(/\b(curl|extension|raise|calf)\b/.test(n))return 'isolation';
  return 'other';
}
function caMuscleGroup(name){
  const n=caNormName(name);
  if(/\b(bench|press|push up|push-up|dip|fly|crossover|tricep|pushdown|skull|lateral raise|front raise)\b/.test(n))return 'push';
  if(/\b(row|pull|pulldown|chin|curl|face pull|rear delt|reverse fly|deadlift)\b/.test(n))return 'pull';
  if(/\b(squat|leg|lunge|rdl|romanian|hip thrust|glute|calf|good morning)\b/.test(n))return 'legs';
  return 'other';
}
function caPriorityWeight(name){
  const n=caNormName(name);
  if(/\b(bench press|squat|deadlift|overhead press)\b/.test(n))return 4;
  if(/\b(incline|row|pull up|pull-up|pulldown|romanian|rdl|leg press|hip thrust|front squat)\b/.test(n))return 3;
  if(/\b(chest press|shoulder press|leg curl|leg extension|tricep|curl|face pull)\b/.test(n))return 2;
  if(/\b(calf|lateral raise|front raise|fly)\b/.test(n))return 1;
  return 1.5;
}
function caSessionTopSet(ex){
  const sets=((ex&&ex.sets)||[]).filter(function(s){return s&&!s.warmup&&Number(s.r)>0&&Number(s.w)>=0;});
  if(!sets.length)return null;
  return sets.reduce(function(best,set){return e1rm(Number(set.w),Number(set.r))>e1rm(Number(best.w),Number(best.r))?set:best;},sets[0]);
}
function caExerciseSessions(name,limit){
  const target=caNormName(name);
  return (S.workouts||[]).filter(function(w){return w&&w.date&&Array.isArray(w.exercises);}).slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);}).map(function(w){
    const ex=w.exercises.find(function(e){return e&&caNormName(e.name)===target;});
    const top=caSessionTopSet(ex);
    if(!top)return null;
    return{date:w.date,split:w.split,topW:Number(top.w)||0,topR:Number(top.r)||0,topE1:e1rm(Number(top.w)||0,Number(top.r)||0)};
  }).filter(Boolean).slice(0,limit||6);
}
function caAllExerciseNames(){
  const names=[];
  (S.workouts||[]).forEach(function(w){(w.exercises||[]).forEach(function(ex){if(ex&&ex.name&&!isCardioEx(ex.name)&&caSessionTopSet(ex))names.push(ex.name);});});
  return [...new Set(names)];
}
function caAnalyzeExercise(name){
  const sessions=caExerciseSessions(name,6);
  if(sessions.length<2)return null;
  const recent=sessions[0];
  const baseline=sessions[Math.min(sessions.length-1,3)];
  const e1rmChange=caRound(toDisp(recent.topE1)-toDisp(baseline.topE1),1);
  const repChange=recent.topR-baseline.topR;
  const e1Ratio=baseline.topE1>0?(recent.topE1-baseline.topE1)/baseline.topE1:0;
  let score=0;
  if(e1Ratio>.025)score+=1;else if(e1Ratio<-.025)score-=1;
  if(repChange>=2)score+=.4;else if(repChange<=-2)score-=.4;
  const trend=caTrendFromScore(score);
  const signalsAgree=(trend==='stable')||(e1rmChange>0&&repChange>=0)||(e1rmChange<0&&repChange<=0);
  return{exercise:name,group:caMuscleGroup(name),role:caExerciseRole(name),trend:trend,trendScore:caRound(score,2),e1rmChange:e1rmChange,recentRepTrend:repChange>0?'up':repChange<0?'down':'flat',repChange:repChange,confidence:caConfidence(sessions.length,signalsAgree),priorityWeight:caPriorityWeight(name),importanceScore:caRound(Math.abs(score)*caPriorityWeight(name)+(trend==='declining'?1:0),2),recentTop:caRound(toDisp(recent.topW),1)+' '+uLbl()+' x '+recent.topR,baselineTop:caRound(toDisp(baseline.topW),1)+' '+uLbl()+' x '+baseline.topR,sessions:sessions.length};
}
function caAnalyzeMuscleGroups(exercises){
  const groups={push:[],pull:[],legs:[]};
  exercises.forEach(function(ex){if(groups[ex.group])groups[ex.group].push(ex);});
  const out={};
  Object.keys(groups).forEach(function(group){
    const rows=groups[group];
    const avg=rows.length?rows.reduce(function(a,e){return a+e.trendScore;},0)/rows.length:0;
    out[group]={group:group,avgTrendScore:caRound(avg,2),overall:rows.length?caTrendFromScore(avg):'no_data',strongestImprovers:rows.filter(function(e){return e.trend==='improving';}).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,3).map(function(e){return e.exercise+' +'+Math.abs(e.e1rmChange)+' '+uLbl();}),strongestDecliners:rows.filter(function(e){return e.trend==='declining';}).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,3).map(function(e){return e.exercise+' '+e.e1rmChange+' '+uLbl();}),exercises:rows.map(function(e){return e.exercise+': '+e.trend+' ('+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+uLbl()+')';})};
  });
  return out;
}
function caRoleSummary(exercises,role){
  const rows=exercises.filter(function(e){return e.role===role;});
  const avg=rows.length?rows.reduce(function(a,e){return a+e.trendScore;},0)/rows.length:0;
  return{role:role,rows:rows,avg:avg,trend:rows.length?caTrendFromScore(avg):'no_data'};
}
function caPattern(pattern,confidence,evidence,score,type){return{pattern:pattern,confidence:confidence,evidence:evidence.filter(Boolean),importanceScore:caRound(score||1,2),type:type||'pattern'};}
function caDetectPatterns(exercises,groups){
  const patterns=[];
  const horizontal=caRoleSummary(exercises,'horizontal_press');
  const vertical=caRoleSummary(exercises,'vertical_press');
  const incline=caRoleSummary(exercises,'incline_press');
  const elbowExtension=caRoleSummary(exercises,'elbow_extension');
  const pressingDecliners=horizontal.rows.filter(function(e){return e.trend==='declining';}).concat(elbowExtension.rows.filter(function(e){return e.trend==='declining';}));
  const upwardPressImprovers=vertical.rows.filter(function(e){return e.trend==='improving';}).concat(incline.rows.filter(function(e){return e.trend==='improving';}));
  if(pressingDecliners.length>=1&&upwardPressImprovers.length>=1&&(horizontal.avg<=-.35||pressingDecliners.length>=2)){
    patterns.push(caPattern('Horizontal pressing is declining while vertical or incline pressing improves.',pressingDecliners.length+upwardPressImprovers.length>=3?'high':'medium',pressingDecliners.map(function(e){return e.exercise+' declining ('+e.e1rmChange+' '+uLbl()+')';}).concat(upwardPressImprovers.map(function(e){return e.exercise+' improving (+'+Math.abs(e.e1rmChange)+' '+uLbl()+')';})),10,'pressing_pattern_issue'));
  }
  const compounds=exercises.filter(function(e){return e.priorityWeight>=3;});
  const isolations=exercises.filter(function(e){return e.priorityWeight<=2&&(e.role==='isolation'||e.role==='elbow_extension');});
  const compAvg=compounds.length?compounds.reduce(function(a,e){return a+e.trendScore;},0)/compounds.length:0;
  const isoAvg=isolations.length?isolations.reduce(function(a,e){return a+e.trendScore;},0)/isolations.length:0;
  if(compounds.length>=2&&isolations.length>=2&&compAvg>=.35&&isoAvg<=.1)patterns.push(caPattern('Compound lifts are improving while isolation work is flat or lagging.','medium',['Compounds average trend score '+caRound(compAvg,2),'Isolations average trend score '+caRound(isoAvg,2)],6,'compound_vs_isolation'));
  if(groups.pull&&groups.push&&groups.pull.avgTrendScore-groups.push.avgTrendScore>=.7)patterns.push(caPattern('Pull training is progressing faster than push training.','medium',['Pull average trend score '+groups.pull.avgTrendScore,'Push average trend score '+groups.push.avgTrendScore],7,'pull_outpacing_push'));
  Object.keys(groups).forEach(function(group){
    const g=groups[group];
    if(!g||!g.exercises.length)return;
    if(g.overall==='declining'&&g.strongestDecliners.length>=2)patterns.push(caPattern(group.charAt(0).toUpperCase()+group.slice(1)+' is regressing across multiple exercises.',g.strongestDecliners.length>=3?'high':'medium',g.strongestDecliners,8,'group_regression'));
    const oneDecliner=exercises.filter(function(e){return e.group===group&&e.trend==='declining';});
    const groupImprovers=exercises.filter(function(e){return e.group===group&&e.trend==='improving';});
    if(oneDecliner.length===1&&groupImprovers.length>=2)patterns.push(caPattern(oneDecliner[0].exercise+' may be exercise-specific because the broader '+group+' group is progressing.','medium',[oneDecliner[0].exercise+' declining',groupImprovers.map(function(e){return e.exercise+' improving';}).join(', ')],5,'exercise_specific_issue'));
  });
  exercises.forEach(function(e){
    if(e.trend==='declining'&&Math.abs(e.repChange)<=1&&Math.abs(e.e1rmChange)<=5&&e.sessions>=3)patterns.push(caPattern(e.exercise+' looks plateaued rather than broadly regressing.','medium',[e.recentTop+' vs '+e.baselineTop],3,'plateau'));
  });
  const decliningCompounds=exercises.filter(function(e){return e.trend==='declining'&&e.priorityWeight>=3;});
  if(decliningCompounds.length>=2)patterns.push(caPattern('Possible recovery issue: multiple major compounds are declining.','medium',decliningCompounds.map(function(e){return e.exercise+' '+e.e1rmChange+' '+uLbl();}),9,'recovery_signal'));
  exercises.forEach(function(e){
    const sessions=caExerciseSessions(e.exercise,5);
    if(sessions.length<3)return;
    const current=sessions[0].topE1;
    const best=Math.max.apply(null,sessions.map(function(s){return s.topE1;}));
    if(best>current&&((best-current)/best)>.04)patterns.push(caPattern('Recent PR followed by short-term regression on '+e.exercise+'.','low',['Recent best e1RM '+caRound(toDisp(best),1)+' '+uLbl(),'Current e1RM '+caRound(toDisp(current),1)+' '+uLbl()],4,'post_pr_regression'));
  });
  return patterns.sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,8);
}
function caGenerateHypotheses(patterns,exercises){
  const hypotheses=[];
  function add(title,confidence,evidence,score){hypotheses.push({hypothesis:title,confidence:confidence,evidence:evidence.filter(Boolean),importanceScore:score||1});}
  const pressing=patterns.find(function(p){return p.type==='pressing_pattern_issue';});
  if(pressing){
    const notes=String((S.profile&&S.profile.injuries)||'')+' '+String((S.profile&&S.profile.preferences)||'');
    const mentionsShoulder=/shoulder|pec|elbow|wrist|chest/i.test(notes);
    add('Shoulder, pec, elbow, or setup issue may be affecting horizontal pressing more than vertical pressing.',mentionsShoulder?'medium':'low',pressing.evidence.concat(mentionsShoulder?'Profile notes mention possible upper-body irritation.':'No saved pain note; treat this as a pattern to monitor.'),9);
    add('Horizontal pressing technique or exercise-specific plateau may be limiting bench-style movements.','medium',pressing.evidence,8);
  }
  const recovery=patterns.find(function(p){return p.type==='recovery_signal';});
  if(recovery)add('Recovery, sleep, stress, or accumulated fatigue may be contributing.','medium',recovery.evidence,7);
  patterns.filter(function(p){return p.type==='exercise_specific_issue';}).forEach(function(p){add('Exercise-specific issue rather than whole muscle-group weakness.','medium',p.evidence,6);});
  const volumePattern=patterns.find(function(p){return p.type==='pull_outpacing_push';});
  if(volumePattern)add('Volume or recovery balance may favor pull work over push work right now.','medium',volumePattern.evidence,5);
  if(!hypotheses.length){
    const topDecliners=exercises.filter(function(e){return e.trend==='declining';}).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,2);
    if(topDecliners.length)add('Exercise-specific plateau is more likely than a broad program problem.','low',topDecliners.map(function(e){return e.exercise+' declining but no higher-level pattern was strong enough.';}),3);
  }
  return hypotheses.sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,5).map(function(h){return{hypothesis:h.hypothesis,confidence:h.confidence,evidence:h.evidence};});
}
function caRankPriorities(exercises,patterns){
  const patternItems=patterns.map(function(p){return{type:'pattern',name:p.pattern,confidence:p.confidence,importanceScore:p.importanceScore,evidence:p.evidence};});
  const exerciseItems=exercises.filter(function(e){return e.trend==='declining';}).map(function(e){return{type:'exercise',name:e.exercise+' decline',confidence:e.confidence,importanceScore:e.importanceScore,evidence:[e.exercise+' '+e.e1rmChange+' '+uLbl(),e.recentTop+' vs '+e.baselineTop]};});
  return patternItems.concat(exerciseItems).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,6);
}
function buildCoachingAnalysis(){
  const exercises=caAllExerciseNames().map(caAnalyzeExercise).filter(Boolean).sort(function(a,b){return b.importanceScore-a.importanceScore;});
  const muscleGroups=caAnalyzeMuscleGroups(exercises);
  const patterns=caDetectPatterns(exercises,muscleGroups);
  const hypotheses=caGenerateHypotheses(patterns,exercises);
  const priorities=caRankPriorities(exercises,patterns);
  return{generatedAt:new Date().toISOString(),unit:uLbl(),exerciseAnalysis:exercises,muscleGroups:muscleGroups,patterns:patterns,hypotheses:hypotheses,priorities:priorities,topPriority:priorities[0]||null};
}
function formatCoachingAnalysisForPrompt(analysis){
  if(!analysis)analysis=buildCoachingAnalysis();
  if(!analysis.exerciseAnalysis.length)return 'COACHING ANALYSIS: not enough working-set history yet.';
  function lines(arr,mapper,empty){return arr&&arr.length?arr.map(mapper).join('\n'):empty;}
  const groupLines=Object.keys(analysis.muscleGroups).map(function(k){
    const g=analysis.muscleGroups[k];
    return k.toUpperCase()+': '+g.overall+' (avg '+g.avgTrendScore+') | decliners: '+(g.strongestDecliners.join(', ')||'none')+' | improvers: '+(g.strongestImprovers.join(', ')||'none');
  }).join('\n');
  return 'COACHING ANALYSIS (computed before AI reasoning; prioritize this over isolated raw deltas)\n'+
    'Top priority: '+(analysis.topPriority?analysis.topPriority.name+' | Confidence: '+analysis.topPriority.confidence:'none')+'\n\n'+
    'Exercise-level trends:\n'+lines(analysis.exerciseAnalysis.slice(0,12),function(e){return '- '+e.exercise+': '+e.trend+', e1RM change '+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+analysis.unit+', reps '+e.recentRepTrend+', confidence '+e.confidence+', role '+e.role;},'none')+'\n\n'+
    'Muscle-group analysis:\n'+groupLines+'\n\n'+
    'Detected higher-level patterns:\n'+lines(analysis.patterns,function(p){return '- '+p.pattern+' Confidence: '+p.confidence+'. Evidence: '+p.evidence.join('; ');},'none strong enough')+'\n\n'+
    'Ranked hypotheses (not facts):\n'+lines(analysis.hypotheses,function(h,i){return (i+1)+'. '+h.hypothesis+' Confidence: '+h.confidence+'. Evidence: '+h.evidence.join('; ');},'none')+'\n\n'+
    'Priority ranking:\n'+lines(analysis.priorities,function(p,i){return (i+1)+'. '+p.name+' ['+p.type+'] score '+p.importanceScore+' confidence '+p.confidence;},'none');
}
