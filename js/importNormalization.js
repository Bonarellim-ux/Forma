// Import normalization helpers for Forma backup and legacy workout data.
function normalizeImportedWeight(value,unit){
  if(value===undefined||value===null||value==='')return 0;
  const text=String(value).trim().toLowerCase();
  const num=typeof value==='number'?value:parseFloat(text.replace(/,/g,''));
  if(!Number.isFinite(num))return 0;
  if(text.includes('lb')||unit==='lbs')return num/KG2LB;
  if(text.includes('kg')||unit==='kg')return num;
  return unit==='lbs'?num/KG2LB:num;
}

function normalizeImportedSet(set,unit){
  if(!set)return{w:0,r:0};
  const hasInternalW=set.w!==undefined;
  const hasInternalR=set.r!==undefined;
  const out=Object.assign({},set);
  if(!hasInternalW){
    const rawWeight=set.weight!==undefined?set.weight:(set.lbs!==undefined?set.lbs:set.kg);
    const rawUnit=set.lbs!==undefined?'lbs':(set.kg!==undefined?'kg':(set.unit||unit||S.unit));
    out.w=normalizeImportedWeight(rawWeight,rawUnit);
  }else{
    out.w=Number(set.w)||0;
  }
  if(!hasInternalR){
    out.r=Number(set.reps!==undefined?set.reps:(set.rep!==undefined?set.rep:0))||0;
  }else{
    out.r=Number(set.r)||0;
  }
  out.warmup=!!(set.warmup||set.isWarmup);
  return out;
}

function normalizeImportedWorkouts(workouts,unit){
  if(!Array.isArray(workouts))return [];
  return workouts.map(function(workout){
    if(!workout||!Array.isArray(workout.exercises))return null;
    const normalized=Object.assign({},workout);
    normalized.exercises=workout.exercises.filter(Boolean).map(function(ex){
      const cleanEx=Object.assign({},ex);
      cleanEx.sets=Array.isArray(ex.sets)?ex.sets.map(function(set){return normalizeImportedSet(set,unit);}).filter(Boolean):[];
      return cleanEx;
    });
    return normalized;
  }).filter(Boolean);
}
