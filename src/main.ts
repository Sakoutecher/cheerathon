const hoursShow = document.querySelector('.hours');
const minutesShow = document.querySelector('.minutes');
const secondsShow = document.querySelector('.seconds');
const notificationMessage = document.querySelector('.notification-message');

let hours = '15';
let minutes = '23';
let seconds = '45';

const addZero = (value: number | string) => {
  if (typeof value === 'number') {
    value = value.toString(); // Convertit le nombre en chaîne de caractères
  }
  if (value.length === 1) {
    return `0${value}`;
  }
  return value;
};

const timer = () => {
  seconds = (parseInt(seconds) - 1).toString();
  if (parseInt(seconds) < 0) {
    seconds = '59';
    minutes = (parseInt(minutes) - 1).toString();
  }
  if (parseInt(minutes) < 0) {
    minutes = '59';
    hours = (parseInt(hours) - 1).toString();
  }
  hours = addZero(hours);
  minutes = addZero(minutes);
  seconds = addZero(seconds);
};

const showTime = () => {
  timer();
  hoursShow.innerHTML = hours;
  minutesShow.innerHTML = minutes;
  secondsShow.innerHTML = seconds;
  if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
    clearInterval(intervalId);
  }
};

let intervalId = setInterval(showTime, 1000);
