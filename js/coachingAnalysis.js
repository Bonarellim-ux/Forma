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
function caMuscleTags(name){
  const n=caNormName(name);
  const tags=[];
  if(/\b(bench|incline|chest press|push up|push-up|dip|fly|crossover)\b/.test(n))tags.push('chest');
  if(/\b(row|pull up|pull-up|pullups|pull ups|chin|pulldown|deadlift|straight arm pulldown)\b/.test(n))tags.push('back');
  if(/\b(overhead press|shoulder press|arnold press|military press|landmine press|lateral raise|front raise|rear delt|face pull|reverse fly)\b/.test(n))tags.push('shoulders');
  if(/\b(curl|hammer|preacher|chin up|chin-up)\b/.test(n))tags.push('biceps');
  if(/\b(tricep|pushdown|skull|extension|dip|bench|press)\b/.test(n))tags.push('triceps');
  if(/\b(squat|leg press|hack squat|lunge|split squat|step up|leg extension)\b/.test(n))tags.push('quads');
  if(/\b(deadlift|romanian|rdl|good morning|leg curl)\b/.test(n))tags.push('hamstrings');
  if(/\b(deadlift|romanian|rdl|hip thrust|glute bridge|squat|leg press|lunge|split squat)\b/.test(n))tags.push('glutes');
  return tags.length?tags:['other'];
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
  return{exercise:name,group:caMuscleGroup(name),muscleTags:caMuscleTags(name),role:caExerciseRole(name),trend:trend,trendScore:caRound(score,2),e1rmChange:e1rmChange,recentRepTrend:repChange>0?'up':repChange<0?'down':'flat',repChange:repChange,confidence:caConfidence(sessions.length,signalsAgree),priorityWeight:caPriorityWeight(name),importanceScore:caRound(Math.abs(score)*caPriorityWeight(name)+(trend==='declining'?1:0),2),recentTop:caRound(toDisp(recent.topW),1)+' '+uLbl()+' x '+recent.topR,baselineTop:caRound(toDisp(baseline.topW),1)+' '+uLbl()+' x '+baseline.topR,sessions:sessions.length};
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
function caAggregateRows(label,rows){
  const avg=rows.length?rows.reduce(function(a,e){return a+e.trendScore;},0)/rows.length:0;
  return{label:label,avgTrendScore:caRound(avg,2),overall:rows.length?caTrendFromScore(avg):'no_data',improvers:rows.filter(function(e){return e.trend==='improving';}).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,4).map(function(e){return e.exercise+' +'+Math.abs(e.e1rmChange)+' '+uLbl();}),laggers:rows.filter(function(e){return e.trend!=='improving';}).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,4).map(function(e){return e.exercise+': '+e.trend+' ('+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+uLbl()+')';}),exercises:rows.map(function(e){return e.exercise+': '+e.trend+' ('+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+uLbl()+')';})};
}
function caAnalyzeDetailedMuscleGroups(exercises){
  const names=['chest','back','shoulders','biceps','triceps','quads','hamstrings','glutes'];
  const out={};
  names.forEach(function(name){out[name]=caAggregateRows(name,exercises.filter(function(e){return e.muscleTags&&e.muscleTags.indexOf(name)!==-1;}));});
  return out;
}
function caAnalyzeMovementPatterns(exercises){
  const roles=['horizontal_press','incline_press','vertical_press','horizontal_pull','vertical_pull','squat_pattern','hinge_pattern','elbow_extension','isolation'];
  const out={};
  roles.forEach(function(role){out[role]=caAggregateRows(caRoleLabel(role),exercises.filter(function(e){return e.role===role;}));});
  return out;
}
function caPattern(pattern,confidence,evidence,score,type,meta){
  const out={pattern:pattern,confidence:confidence,evidence:evidence.filter(Boolean),importanceScore:caRound(score||1,2),type:type||'pattern'};
  if(meta)Object.keys(meta).forEach(function(k){out[k]=meta[k];});
  return out;
}
function caRoleLabel(role){
  const labels={
    horizontal_press:'horizontal pressing',
    incline_press:'incline pressing',
    vertical_press:'vertical pressing',
    elbow_extension:'triceps/elbow-extension work',
    horizontal_pull:'horizontal pulling',
    vertical_pull:'vertical pulling',
    squat_pattern:'squat-pattern work',
    hinge_pattern:'hinge-pattern work',
    isolation:'isolation work',
    other:'other work'
  };
  return labels[role]||role.replace(/_/g,' ');
}
function caTitleCase(s){s=String(s||'');return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
function caRowsForRoles(exercises,roles,trend){
  return exercises.filter(function(e){return roles.indexOf(e.role)!==-1&&(!trend||e.trend===trend);});
}
function caRoleEvidence(rows,word){
  return rows.map(function(e){return e.exercise+' '+word+' ('+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+uLbl()+')';});
}
function caRoleListLabel(roles){
  const labels=roles.map(caRoleLabel);
  if(labels.length<=1)return labels[0]||'movement';
  if(labels.length===2)return labels[0]+' and '+labels[1];
  return labels.slice(0,-1).join(', ')+', and '+labels[labels.length-1];
}
function caContradictionConfidence(decliners,improvers){
  const count=decliners.length+improvers.length;
  const highConf=count>=4&&decliners.concat(improvers).every(function(e){return e.confidence!=='low';});
  if(highConf)return 'high';
  if(count>=3)return 'medium';
  return 'low';
}
function caContradictionExplanations(spec){
  const down=caRoleListLabel(spec.downRoles);
  const up=caRoleListLabel(spec.upRoles);
  const explanations=[
    'The lagging movement may have an exercise-specific technique, setup, or skill bottleneck.',
    'Recent training emphasis may be favoring '+up+' more than '+down+'.',
    'Fatigue, soreness, or recovery timing may be affecting the lagging movement more than the improving one.',
    'A joint, range-of-motion, or comfort issue may be changing mechanics on the lagging movement.'
  ];
  if(spec.group==='push')explanations.splice(1,0,'A triceps, shoulder, pec, or lockout bottleneck may be limiting one pressing pattern more than another.');
  if(spec.group==='pull')explanations.splice(1,0,'Upper-back, lat, grip, or bracing demands may be limiting one pull pattern more than another.');
  if(spec.group==='legs')explanations.splice(1,0,'Quad, posterior-chain, bracing, or depth demands may be separating squat and hinge progress.');
  return explanations.slice(0,4);
}
function caAddContradiction(patterns,exercises,spec,baseScore){
  const decliners=caRowsForRoles(exercises,spec.downRoles,'declining');
  const stalled=caRowsForRoles(exercises,spec.downRoles,'stable').filter(function(e){return e.sessions>=3;});
  const laggers=decliners.concat(stalled);
  const improvers=caRowsForRoles(exercises,spec.upRoles,'improving');
  if(!laggers.length||!improvers.length)return;
  const declinerWeight=laggers.reduce(function(a,e){return a+e.priorityWeight;},0);
  const improverWeight=improvers.reduce(function(a,e){return a+e.priorityWeight;},0);
  const evidence=caRoleEvidence(decliners,'declining').concat(caRoleEvidence(stalled,'stalled')).concat(caRoleEvidence(improvers,'improving'));
  const score=(baseScore||10)+Math.min(2,(declinerWeight+improverWeight)/8);
  const lagWord=decliners.length?'declining':'stalled';
  const actualDownRoles=[...new Set(laggers.map(function(e){return e.role;}))];
  const actualUpRoles=[...new Set(improvers.map(function(e){return e.role;}))];
  const upVerb=actualUpRoles.length===1?'is':'are';
  const actualSpec={group:spec.group,downRoles:actualDownRoles,upRoles:actualUpRoles};
  patterns.push(caPattern(caTitleCase(caRoleListLabel(actualDownRoles))+' '+lagWord+' while '+caRoleListLabel(actualUpRoles)+' '+upVerb+' improving.',caContradictionConfidence(laggers,improvers),evidence,score,'movement_contradiction',{
    group:spec.group,
    decliningRoles:actualDownRoles,
    improvingRoles:actualUpRoles,
    possibleExplanations:caContradictionExplanations(actualSpec)
  }));
}
function caDetectContradictions(exercises,groups){
  const patterns=[];
  const specs=[
    {group:'push',downRoles:['horizontal_press'],upRoles:['vertical_press','incline_press']},
    {group:'push',downRoles:['vertical_press'],upRoles:['horizontal_press','incline_press']},
    {group:'push',downRoles:['elbow_extension'],upRoles:['horizontal_press','incline_press','vertical_press']},
    {group:'push',downRoles:['horizontal_press','incline_press','vertical_press'],upRoles:['elbow_extension']},
    {group:'legs',downRoles:['squat_pattern'],upRoles:['hinge_pattern']},
    {group:'legs',downRoles:['hinge_pattern'],upRoles:['squat_pattern']},
    {group:'pull',downRoles:['horizontal_pull'],upRoles:['vertical_pull','hinge_pattern']},
    {group:'pull',downRoles:['vertical_pull'],upRoles:['horizontal_pull','hinge_pattern']},
    {group:'pull',downRoles:['hinge_pattern'],upRoles:['horizontal_pull','vertical_pull']}
  ];
  specs.forEach(function(spec){caAddContradiction(patterns,exercises,spec,10);});
  Object.keys(groups).forEach(function(group){
    const rows=exercises.filter(function(e){return e.group===group;});
    const decliners=rows.filter(function(e){return e.trend==='declining';});
    const improvers=rows.filter(function(e){return e.trend==='improving';});
    const hasSpecific=patterns.some(function(p){return p.group===group&&p.evidence.some(function(ev){return decliners.concat(improvers).some(function(e){return ev.indexOf(e.exercise)!==-1;});});});
    if(decliners.length&&improvers.length&&!hasSpecific){
      patterns.push(caPattern(caTitleCase(group)+' has mixed signals: '+decliners.map(function(e){return e.exercise;}).slice(0,2).join(', ')+' declining while '+improvers.map(function(e){return e.exercise;}).slice(0,2).join(', ')+' improves.',caContradictionConfidence(decliners,improvers),caRoleEvidence(decliners,'declining').concat(caRoleEvidence(improvers,'improving')),9,'movement_contradiction',{
        group:group,
        decliningRoles:[...new Set(decliners.map(function(e){return e.role;}))],
        improvingRoles:[...new Set(improvers.map(function(e){return e.role;}))],
        possibleExplanations:caContradictionExplanations({group:group,downRoles:[...new Set(decliners.map(function(e){return e.role;}))],upRoles:[...new Set(improvers.map(function(e){return e.role;}))]})
      }));
    }
  });
  return patterns;
}
function caDetectPatterns(exercises,groups){
  const patterns=[];
  caDetectContradictions(exercises,groups).forEach(function(p){patterns.push(p);});
  const compounds=exercises.filter(function(e){return e.priorityWeight>=3;});
  const isolations=exercises.filter(function(e){return e.priorityWeight<=2&&(e.role==='isolation'||e.role==='elbow_extension');});
  const directArms=exercises.filter(function(e){return /\b(curl|hammer|preacher|tricep|pushdown|skull)\b/.test(caNormName(e.exercise));});
  const compAvg=compounds.length?compounds.reduce(function(a,e){return a+e.trendScore;},0)/compounds.length:0;
  const isoAvg=isolations.length?isolations.reduce(function(a,e){return a+e.trendScore;},0)/isolations.length:0;
  const armAvg=directArms.length?directArms.reduce(function(a,e){return a+e.trendScore;},0)/directArms.length:0;
  const improvingCompounds=compounds.filter(function(e){return e.trend==='improving';});
  const laggingArms=directArms.filter(function(e){return e.trend!=='improving';});
  if(improvingCompounds.length>=2&&laggingArms.length>=2&&armAvg<=.1){
    patterns.push(caPattern('Direct arm work is lagging while compound lifts are progressing.','medium',laggingArms.map(function(e){return e.exercise+': '+e.trend+' ('+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+uLbl()+')';}).concat(improvingCompounds.slice(0,4).map(function(e){return e.exercise+' improving (+'+Math.abs(e.e1rmChange)+' '+uLbl()+')';})),14,'program_pattern',{
      possibleExplanations:['Arms may already be receiving enough indirect volume from compounds.','Isolation movements may be progressing more slowly than compound lifts, which is normal.','Direct arm volume or frequency may be too low to drive separate progress.','The current arm exercise selection may not fit the lifter as well as the compound work.']
    }));
  }
  if(compounds.length>=2&&isolations.length>=2&&compAvg>=.35&&isoAvg<=.1)patterns.push(caPattern('Compound lifts are improving while isolation work is flat or lagging.','medium',['Compounds average trend score '+caRound(compAvg,2),'Isolations average trend score '+caRound(isoAvg,2)],11,'program_pattern',{possibleExplanations:['Compounds may be getting the best effort and recovery.','Isolation progress may need smaller jumps, more reps, or more consistent execution.','Accessory volume may be serving maintenance while compounds drive the main adaptation.']}));
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
  const seen={};
  function add(title,confidence,evidence,score){hypotheses.push({hypothesis:title,confidence:confidence,evidence:evidence.filter(Boolean),importanceScore:score||1});}
  patterns.filter(function(p){return p.type==='program_pattern'||p.type==='movement_contradiction';}).slice(0,2).forEach(function(p){
    (p.possibleExplanations||[]).slice(0,4).forEach(function(h,i){
      if(seen[h])return;
      seen[h]=true;
      add(h,p.confidence!=='low'&&i<2?'medium':'low',p.evidence,10-i);
    });
  });
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
  const patternItems=patterns.map(function(p){return{type:p.type==='program_pattern'?'program_pattern':'pattern',name:p.pattern,confidence:p.confidence,importanceScore:p.importanceScore,evidence:p.evidence};});
  const exerciseItems=exercises.filter(function(e){return e.trend==='declining';}).map(function(e){return{type:'exercise',name:e.exercise+' decline',confidence:e.confidence,importanceScore:e.importanceScore,evidence:[e.exercise+' '+e.e1rmChange+' '+uLbl(),e.recentTop+' vs '+e.baselineTop]};});
  return patternItems.concat(exerciseItems).sort(function(a,b){return b.importanceScore-a.importanceScore;}).slice(0,6);
}
function buildCoachingAnalysis(){
  const exercises=caAllExerciseNames().map(caAnalyzeExercise).filter(Boolean).sort(function(a,b){return b.importanceScore-a.importanceScore;});
  const muscleGroups=caAnalyzeMuscleGroups(exercises);
  const detailedMuscleGroups=caAnalyzeDetailedMuscleGroups(exercises);
  const movementPatterns=caAnalyzeMovementPatterns(exercises);
  const patterns=caDetectPatterns(exercises,muscleGroups);
  const hypotheses=caGenerateHypotheses(patterns,exercises);
  const priorities=caRankPriorities(exercises,patterns);
  return{generatedAt:new Date().toISOString(),unit:uLbl(),exerciseAnalysis:exercises,muscleGroups:muscleGroups,detailedMuscleGroups:detailedMuscleGroups,movementPatterns:movementPatterns,patterns:patterns,hypotheses:hypotheses,priorities:priorities,topPriority:priorities[0]||null};
}
function formatCoachingAnalysisForPrompt(analysis){
  if(!analysis)analysis=buildCoachingAnalysis();
  if(!analysis.exerciseAnalysis.length)return 'COACHING ANALYSIS: not enough working-set history yet.';
  function lines(arr,mapper,empty){return arr&&arr.length?arr.map(mapper).join('\n'):empty;}
  const programPatterns=analysis.patterns.filter(function(p){return p.type==='program_pattern';});
  const contradictions=analysis.patterns.filter(function(p){return p.type==='movement_contradiction';});
  const otherPatterns=analysis.patterns.filter(function(p){return p.type!=='movement_contradiction'&&p.type!=='program_pattern';});
  const detailedGroupLines=Object.keys(analysis.detailedMuscleGroups||{}).map(function(k){
    const g=analysis.detailedMuscleGroups[k];
    if(!g||!g.exercises.length)return '';
    return k.toUpperCase()+': '+g.overall+' (avg '+g.avgTrendScore+') | laggers: '+(g.laggers.join(', ')||'none')+' | improvers: '+(g.improvers.join(', ')||'none');
  }).filter(Boolean).join('\n');
  const movementLines=Object.keys(analysis.movementPatterns||{}).map(function(k){
    const m=analysis.movementPatterns[k];
    if(!m||!m.exercises.length)return '';
    return m.label+': '+m.overall+' (avg '+m.avgTrendScore+') | laggers: '+(m.laggers.join(', ')||'none')+' | improvers: '+(m.improvers.join(', ')||'none');
  }).filter(Boolean).join('\n');
  const groupLines=Object.keys(analysis.muscleGroups).map(function(k){
    const g=analysis.muscleGroups[k];
    return k.toUpperCase()+': '+g.overall+' (avg '+g.avgTrendScore+') | decliners: '+(g.strongestDecliners.join(', ')||'none')+' | improvers: '+(g.strongestImprovers.join(', ')||'none');
  }).join('\n');
  return 'COACHING ANALYSIS (computed before AI reasoning; evaluate all five levels before answering)\n'+
    'Top priority: '+(analysis.topPriority?analysis.topPriority.name+' | Confidence: '+analysis.topPriority.confidence:'none')+'\n\n'+
    'Level 1 - Individual exercise analysis (do not stop here):\n'+lines(analysis.exerciseAnalysis.slice(0,12),function(e){return '- '+e.exercise+': '+e.trend+', e1RM change '+(e.e1rmChange>0?'+':'')+e.e1rmChange+' '+analysis.unit+', reps '+e.recentRepTrend+', confidence '+e.confidence+', role '+e.role+', muscles '+(e.muscleTags||[]).join('/');},'none')+'\n\n'+
    'Level 2 - Specific muscle-group analysis:\n'+(detailedGroupLines||'none')+'\n\n'+
    'Broad split-group analysis:\n'+groupLines+'\n\n'+
    'Level 3 - Movement-pattern analysis:\n'+(movementLines||'none')+'\n\n'+
    'Level 4 - Program-level patterns (rank before muscle, movement, and exercise observations):\n'+lines(programPatterns,function(p){return '- Pattern: '+p.pattern+' Confidence: '+p.confidence+'. Evidence: '+p.evidence.join('; ')+'. Hypotheses, not facts: '+(p.possibleExplanations||[]).join('; ');},'none strong enough')+'\n\n'+
    'Contradictory movement patterns:\n'+lines(contradictions,function(p){return '- Pattern: '+p.pattern+' Confidence: '+p.confidence+'. Evidence: '+p.evidence.join('; ')+'. Hypotheses, not facts: '+(p.possibleExplanations||[]).join('; ');},'none strong enough')+'\n\n'+
    'Other higher-level patterns:\n'+lines(otherPatterns,function(p){return '- '+p.pattern+' Confidence: '+p.confidence+'. Evidence: '+p.evidence.join('; ');},'none strong enough')+'\n\n'+
    'Level 5 - Ranked root-cause hypotheses (not facts):\n'+lines(analysis.hypotheses,function(h,i){return (i+1)+'. '+h.hypothesis+' Confidence: '+h.confidence+'. Evidence: '+h.evidence.join('; ');},'none')+'\n\n'+
    'Priority ranking:\n'+lines(analysis.priorities,function(p,i){return (i+1)+'. '+p.name+' ['+p.type+'] score '+p.importanceScore+' confidence '+p.confidence;},'none');
}
