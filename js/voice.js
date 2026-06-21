function makeVoice(onFinal, onInterim, onStop){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Voice input not supported. Use Chrome.');return null;}
  let active=true;
  let rec=null;
  let failures=0;            // consecutive error restarts — reset on any successful result
  let restartTimer=null;     // pending auto-restart, cleared on stop()
  const MAX_FAILURES=6;
  function scheduleRestart(delay){
    if(restartTimer)clearTimeout(restartTimer);
    restartTimer=setTimeout(function(){restartTimer=null;start();},delay);
  }
  function retryAfterError(){
    if(!active)return;
    failures++;
    if(failures>MAX_FAILURES){
      // Persistent recoverable error — stop retrying instead of spinning every 300ms forever
      active=false;
      console.warn('Voice input: giving up after repeated errors.');
      if(onStop)onStop();
      return;
    }
    scheduleRestart(Math.min(300*Math.pow(2,failures-1),5000)); // exponential backoff, capped at 5s
  }
  function start(){
    if(!active)return;
    try{
      rec=new SR();
      rec.continuous=true;
      rec.interimResults=true;
      rec.lang='en-US';
      rec.maxAlternatives=3;
      rec.onresult=function(e){
        failures=0; // recognition is healthy again
        let fin='',interim='';
        for(let i=e.resultIndex;i<e.results.length;i++){
          if(e.results[i].isFinal) fin+=e.results[i][0].transcript+' ';
          else interim+=e.results[i][0].transcript;
        }
        if(fin)onFinal(fin.trim());
        onInterim(interim);
      };
      rec.onend=function(){
        // Auto-restart if still active (handles browser timeout on silence) — not an error
        if(active){scheduleRestart(150);}
        else{if(onStop)onStop();}
      };
      rec.onerror=function(err){
        if(err.error==='no-speech'||err.error==='aborted')return; // silence/manual stop — just restart
        if(err.error==='not-allowed'){alert('Microphone access denied.');active=false;if(onStop)onStop();return;}
        retryAfterError(); // other errors: back off, with a ceiling
      };
      rec.start();
    }catch(e){retryAfterError();}
  }
  start();
  return{stop:function(){active=false;if(restartTimer){clearTimeout(restartTimer);restartTimer=null;}try{if(rec)rec.stop();}catch(e){}}};
}
