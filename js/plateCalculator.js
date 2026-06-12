// Plate calculator helpers for barbell exercises.
const BARBELL_EX=['squat','deadlift','bench press','overhead press','barbell row','romanian deadlift','good morning','front squat','sumo deadlift','hip thrust','pendlay row','yates row','seal row'];
function isBarbell(exName){
  const n=(exName||'').toLowerCase();
  return BARBELL_EX.some(function(k){return n.includes(k);});
}
function calcPlates(totalLbs){
  const barWeight=45;
  const available=[45,35,25,10,5,2.5];
  let remaining=Math.max(0,(totalLbs-barWeight)/2);
  const result=[];
  available.forEach(function(p){
    const count=Math.floor(remaining/p+0.01); // +0.01 for float tolerance
    if(count>0){result.push({p:p,n:count});remaining=Math.round((remaining-p*count)*100)/100;}
  });
  return result;
}
function calcWorkoutPlates(dispW){
  const bar=S.unit==='lbs'?45:20;
  const plates=S.unit==='lbs'?[45,35,25,10,5,2.5]:[25,20,15,10,5,2.5,1.25];
  if(dispW<=bar)return null;
  let rem=(dispW-bar)/2;
  const result=[];
  for(const p of plates){
    while(rem>=p-0.01){result.push(p);rem=Math.round((rem-p)*100)/100;}
  }
  if(rem>0.15)return null; // can't make exact weight
  return{bar,plates:result};
}
function plateHtml(dispW){
  const p=calcWorkoutPlates(dispW);
  if(!p||!p.plates.length)return '';
  const colors={45:'#1A9ED4',35:'#D4A020',25:'#2DAA70',20:'#2DAA70',15:'#E8693A',10:'#7B6FE0',5:'#9AB8CC',2.5:'#C44',1.25:'#C44'};
  const counts={};
  p.plates.forEach(function(pl){counts[pl]=(counts[pl]||0)+1;});
  const dots=Object.keys(counts).map(function(pl){
    const c=colors[pl]||'#9AB8CC';
    return '<span class="plate-dot" style="--plate-color:'+c+'"></span>';
  }).join('');
  const txt=Object.keys(counts).map(function(pl){return(counts[pl]>1?counts[pl]+'x':'')+pl;}).join(' + ');
  return '<div class="plate-calc">'+
    '<span class="plate-visual" aria-label="Plate calculator">'+
      '<span class="plate-sleeve"></span>'+
      dots+
    '</span>'+
    '<span class="plate-text">'+p.bar+' '+uLbl()+' bar &middot; '+txt+' per side</span>'+
  '</div>';
}
function updatePlateCalc(i){
  const el=document.getElementById('plate'+i);
  if(!el||!S.workout||!S.workout.exercises||!S.workout.exercises[i])return;
  const ex=S.workout.exercises[i];
  const dW=parseFloat(document.getElementById('w'+i)&&document.getElementById('w'+i).value||0);
  el.innerHTML=(!isCardioEx(ex.name)&&isBarbell(ex.name)&&dW>0)?plateHtml(dW):'';
}
