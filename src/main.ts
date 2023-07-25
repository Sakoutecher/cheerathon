const hoursShow = document.querySelector('.hours');
const minutesShow = document.querySelector('.minutes');
const secondsShow = document.querySelector('.seconds');
const notificationMessage = document.querySelector('.notification-message');
const notification = document.querySelector('#notification') as HTMLElement;

let hours = '';
let minutes = '';
let seconds = '';
const tempsInitial = '00:00:06';

// Récupère les valeurs dans le localStorage
if (localStorage.getItem('hours') === null) {
  hours = '23';
} else {
  hours = localStorage.getItem('hours').toString();
}
if (localStorage.getItem('minutes') === null) {
  minutes = '59';
} else {
  minutes = localStorage.getItem('minutes').toString();
}
if (localStorage.getItem('seconds') === null) {
  seconds = '59';
} else {
  seconds = localStorage.getItem('seconds').toString();
}

const calcBits = (temps, multiplicateur) => {
  // Analyser le temps donné au format "hh:mm:ss"
  const [heures, minutes, secondes] = temps.split(':').map(Number);

  // Convertir le temps en secondes
  const totalSecondes = heures * 3600 + minutes * 60 + secondes;

  // Multiplier par le multiplicateur
  const tempsMultiplie = totalSecondes * multiplicateur;

  // Convertir le temps résultant en format "hh:mm:ss"
  const heuresResultat = Math.floor(tempsMultiplie / 3600);
  const minutesResultat = Math.floor((tempsMultiplie % 3600) / 60);
  const secondesResultat = tempsMultiplie % 60;

  // Formater le résultat avec deux chiffres pour chaque partie (exemple: "02:03:05")
  const tempsFormate = `${heurePad(heuresResultat)}:${heurePad(minutesResultat)}:${heurePad(secondesResultat)}`;

  return tempsFormate;
}

// Fonction pour ajouter un zéro devant les chiffres inférieurs à 10
function heurePad(valeur) {
  return valeur < 10 ? '0' + valeur : valeur;
}

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

const removeLeadingZero = (input) => {

  const firstDigit = input[0];
  const secondDigit = input[1];

  if (firstDigit !== "0") {
    return input;
  } else {
    return secondDigit ;
  }
}

import tmi from 'tmi.js';

const client = new tmi.Client({
	channels: [ 'batsave' ]
});

client.connect();

client.on('cheer', (_channel, userstate) => {
  let addedTime = calcBits(tempsInitial, userstate.bits).split(':');
  hours = (parseInt(hours) + parseInt(removeLeadingZero(addedTime[0]))).toString();
  minutes = (parseInt(minutes) + parseInt(removeLeadingZero(addedTime[1]))).toString();
  if (parseInt(minutes) > 59) {
    minutes = (parseInt(minutes) - 60).toString();
    hours = (parseInt(hours) + 1).toString();
  }
  seconds = (parseInt(seconds) + parseInt(removeLeadingZero(addedTime[2]))).toString();
  if (parseInt(seconds) > 59) {
    seconds = (parseInt(seconds) - 60).toString();
    minutes = (parseInt(minutes) + 1).toString();
  }
  notificationMessage.innerHTML = `${userstate.bits} bits offerts par ${userstate["display-name"]}`
  notification.style.transform = 'translateY(0)';
  notification.style.opacity = '1';
  setTimeout(() => {
    notificationMessage.innerHTML = `+ ${calcBits(tempsInitial, userstate.bits)}`
  }, 3000)
  setTimeout(() => {
    notification.style.transform = 'translateY(50%)';
    notification.style.opacity = '0';
  }, 7000);
});

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
};

// Function qui affiche le temps et qui le stop quand on arrive à 0
const showTime = () => {
  timer();
  hoursShow.innerHTML = addZero(hours);
  minutesShow.innerHTML = addZero(minutes);
  secondsShow.innerHTML = addZero(seconds);
  localStorage.setItem('hours', hours);
  localStorage.setItem('minutes', minutes);
  localStorage.setItem('seconds', seconds);
  if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
    clearInterval(intervalId);
  }
};

let intervalId = setInterval(showTime, 1000);
