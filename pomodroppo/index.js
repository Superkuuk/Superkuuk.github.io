var timerDisplay = document.getElementById("timer");
var notificationCheckBox = document.getElementById('notification');
var alarmCheckbox = document.getElementById('alarm');
var flashCheckbox = document.getElementById('flash');
var progressbar = document.getElementById('progressbar');
var pomInterval;
var pomTime;
var inputTime;
var startTime;
var updatedTime;
var difference;
var tInterval;
var atInterval;
var flash = false;
var running = 0;
var w;
var notifications = false;
var audio = new Audio('alarm4.wav');
// audio.loop = true;

function setPomodoro(m){
  resetTimer();
  inputTime = m;
  pomInterval = m*60000;
  // pomInterval = 5000; // Debug time (5s)
  m = (m < 10) ? "0" + m : m;
  timerDisplay.innerHTML = '00:'+m+':00:000';
}

function startTimer(){
  if(!running){
    resetTimer();
    startTime = new Date().getTime();
    //pomTime = new Date(startTime + pomInterval);
    tInterval = setInterval(getShowTime, 1);
// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.

    running = 1;
    progressbar.style.top = "100vh";
  }
}

function resetTimer(){
  clearInterval(atInterval);
  clearInterval(tInterval);
  difference = 0;
  running = 0;
  timerDisplay.innerHTML = '00:00:00:000';
  progressbar.style.top = "100vh";
  audio.pause();
}

function getShowTime(){
  updatedTime = new Date().getTime();

  difference = pomInterval - ( updatedTime - startTime );

  if (Math.floor(difference) > 0) {
    // var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    var milliseconds = Math.floor((difference % (1000 * 60)) / 100);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
    timerDisplay.innerHTML = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    document.title = minutes + ':' + seconds;

    var progress = 100 * difference / pomInterval;
    progressbar.style.top = progress + "vh";
  } else {
    endTimer();
  }
}

function endTimer(){
  resetTimer();
  progressbar.style.top = "0";

  if (notificationCheckBox.checked) {
    var n = new Notification("Pomodroppo", {
      tag: 'Pomodroppo',
      body: inputTime + " minuten zijn verlopen!",
      image: 'alarm.png',
      badge: 'alarm.png',
      requireInteraction: true
    });
  }

  if (flashCheckbox.checked) {
    atInterval = setInterval(afterTimer, 500);
  }

  if (alarmCheckbox.checked) {
    audio.currentTime = 4;
    audio.play();
  }
}

function afterTimer() {
  if (flash) {
    progressbar.style.backgroundColor = "#F2C572";
    document.title = "EINDE";
  } else {
    progressbar.style.backgroundColor = "#D98555";
    document.title = "XXXXX";
  }
  flash = !flash;
}


notificationCheckBox.addEventListener('click', function() {
  notifications = notificationCheckBox.checked;
  if (notifications) {
    if (window.Notification && Notification.permission !== "denied") {
      let notificationPromise = Notification.requestPermission();
    } else {
      alert("Je mag geen notificaties krijgen :(");
    }
  }
});
