const hoursShow = document.querySelector('.hours');
const minutesShow = document.querySelector('.minutes');
const secondsShow = document.querySelector('.seconds');
const notificationMessage = document.querySelector('.notification-message');
const notification = document.querySelector('#notification') as HTMLElement;

let hours = '';
let minutes = '';
let seconds = '';

// Récupère les valeurs dans le localStorage
if (localStorage.getItem('hours') === null) {
  hours = '23';
} else {
  hours = localStorage.getItem('hours');
}
if (localStorage.getItem('minutes') === null) {
  minutes = '59';
} else {
  minutes = localStorage.getItem('minutes');
}
if (localStorage.getItem('seconds') === null) {
  seconds = '59';
} else {
  seconds = localStorage.getItem('seconds');
}

import tmi from 'tmi.js';

const client = new tmi.Client({
	channels: [ 'ponce' ]
});

client.connect();

client.on('cheer', (channel, userstate) => {
  console.log(channel["display-name"]);
  console.log(userstate.bits);
  console.log('ici')
  notificationMessage.innerHTML = `${userstate.bits} bits offerts par ${channel["display-name"]}`
  notification.style.transform = 'translateY(0)';
  notification.style.opacity = '1';
  setTimeout(() => {
    notification.style.transform = 'translateY(50%)';
    notification.style.opacity = '0';
  }, 5000);
});

// Rajoute un zéro avant le nombre si il est inférieur à 10
const addZero = (value: number | string) => {
  if (typeof value === 'number') {
    value = value.toString(); // Convertit le nombre en chaîne de caractères
  }
  if (value.length === 1) {
    return `0${value}`;
  }
  return value;
};

// Function qui décrémente le temps et qui change les autres valeurs en fonction des conditions présentes dans la fonction
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

// Function qui affiche le temps et qui le stop quand on arrive à 0
const showTime = () => {
  timer();
  hoursShow.innerHTML = hours;
  minutesShow.innerHTML = minutes;
  secondsShow.innerHTML = seconds;
  localStorage.setItem('hours', hours);
  localStorage.setItem('minutes', minutes);
  localStorage.setItem('seconds', seconds);
  if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
    clearInterval(intervalId);
  }
};

let intervalId = setInterval(showTime, 1000);
