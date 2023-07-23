const hoursShow = document.querySelector('.hours');
const minutesShow = document.querySelector('.minutes');
const secondsShow = document.querySelector('.seconds');
const notificationMessage = document.querySelector('.notification-message');

let hours = 0;
let minutes = 0;
let seconds = 5;

const timer = () => {
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    minutes--;
  }
  if (minutes < 0) {
    minutes = 59;
    hours--;
  }
}

const showTime = () => {
  timer();
  hoursShow.innerHTML = hours.toString();
  minutesShow.innerHTML = minutes.toString();
  secondsShow.innerHTML = seconds.toString();
  if ((hours <= 0) && (minutes <= 0) && (seconds <= 0)) {
    clearInterval(intervalId);
  }
}

let intervalId = setInterval(showTime, 1000);
