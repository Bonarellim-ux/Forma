function makeVoice(onFinal, onInterim, onStop){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Voice input not supported. Use Chrome.');return null;}
  let active=true;
  let rec=null;
  function start(){
    if(!active)return;
    try{
      rec=new SR();
      rec.continuous=true;
      rec.interimResults=true;
      rec.lang='en-US';
      rec.maxAlternatives=3;
      rec.onresult=function(e){
        let fin='',interim='';
        for(let i=e.resultIndex;i<e.results.length;i++){
          if(e.results[i].isFinal) fin+=e.results[i][0].transcript+' ';
          else interim+=e.results[i][0].transcript;
        }
        if(fin)onFinal(fin.trim());
        onInterim(interim);
      };
      rec.onend=function(){
        // Auto-restart if still active (handles browser timeout on silence)
        if(active){setTimeout(start,150);}
        else{if(onStop)onStop();}
      };
      rec.onerror=function(err){
        if(err.error==='no-speech'||err.error==='aborted')return; // silence/manual stop — just restart
        if(err.error==='not-allowed'){alert('Microphone access denied.');active=false;if(onStop)onStop();return;}
        // For other errors, try restarting after a short delay
        if(active)setTimeout(start,300);
      };
      rec.start();
    }catch(e){if(active)setTimeout(start,300);}
  }
  start();
  return{stop:function(){active=false;try{if(rec)rec.stop();}catch(e){}}};
}
