const hoursShow = document.querySelector('.hours');
const minutesShow = document.querySelector('.minutes');
const secondsShow = document.querySelector('.seconds');
const cheerathonContainer = document.querySelector('.cheerathon-container') as HTMLElement;

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
  if (localStorage.getItem(`${userstate["display-name"]}`) === null) {
    localStorage.setItem(`${userstate["display-name"]}`, `${userstate["display-name"]} - ${userstate.bits}`);
  } else if (localStorage.getItem(`${userstate["display-name"]}`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-1`, `${userstate["display-name"]} - ${userstate.bits}`);
  } else if (localStorage.getItem(`${userstate["display-name"]}-1`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-2`, `${userstate["display-name"]} - ${userstate.bits}`);
  } else if (localStorage.getItem(`${userstate["display-name"]}-2`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-3`, `${userstate["display-name"]} - ${userstate.bits}`);
  } else if (localStorage.getItem(`${userstate["display-name"]}-3`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-4`, `${userstate["display-name"]} - ${userstate.bits}`);
  }else if (localStorage.getItem(`${userstate["display-name"]}-4`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-5`, `${userstate["display-name"]} - ${userstate.bits}`);
  } else if (localStorage.getItem(`${userstate["display-name"]}-5`) !== null) {
    localStorage.setItem(`${userstate["display-name"]}-6`, `${userstate["display-name"]} - ${userstate.bits}`);
  }
});

const verifNewBits = async () => {
  for (var key in localStorage) {
    if (key !== 'hours' && key !== 'minutes' && key !== 'seconds') {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        let userstate = {
          "display-name": value.split(' - ')[0],
          bits: value.split(' - ')[1]
        };
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
        let newNotification = document.createElement('div');
        newNotification.classList.add(`notification-${userstate["display-name"]}`);
        newNotification.id = 'notification'
        newNotification.innerHTML = `<span class="notification-message">${userstate.bits} bits offerts par ${userstate["display-name"]}</span>`
        cheerathonContainer.appendChild(newNotification);
        setTimeout(() => {
          newNotification.style.display = 'flex';
          newNotification.style.opacity = '1';
        }, 500)
        setTimeout(() => {
          newNotification.innerHTML = `<span class="notification-message">+ ${calcBits(tempsInitial, userstate.bits)}</span>`
        }, 5000)
        setTimeout(() => {
          newNotification.style.opacity = '0';
        }, 7000);
        setTimeout(() => {
          newNotification.style.display = 'none';
        }, 7500);
        localStorage.removeItem(key);
      }
    }
  }
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
  verifNewBits()
  if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
    clearInterval(intervalId);
  }
};


let intervalId = setInterval(showTime, 1000);
