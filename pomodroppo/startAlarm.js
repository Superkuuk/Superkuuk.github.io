setTimeout(function(){
  var audio = new Audio('alarm.mp3');
  audio.play();
  postMessage(1);
}, 4000);
