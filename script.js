"use strict";

let inputs = document.querySelectorAll(`.input`);
const div = document.querySelector(`.div`);
let playingDiv = document.querySelector(`.playing-div`);
const againDiv = document.querySelector(`.again-div`);
const modal = document.querySelector(`.modal`);
let guessesLeft = document.querySelector(`.guesses-left`);
const hardModeCheckBox = document.querySelector(`.checkbox-hard`);
let usedBadWords = [];
let usedGoodWords = [];
let finalWord;
let guesses = 5;
guessesLeft.innerHTML = guesses + 1;
document.addEventListener(`keyup`, (e) => {
  const lastInput = inputs[inputs.length - 1];
  if (e.key !== `Enter` || lastInput.value === ``) return;

  isWordReal(getLetters(true));
});
addListeners();
function disableAll() {
  if (i >= 1) return;
  let htmlString = `<div>`;
  inputs.forEach((e) => {
    htmlString = `${htmlString} <input type="text" maxlength="1" value="${
      e.value
    }" disabled class="${e.classList.contains(`gray`) ? `gray` : `white`} ${
      e.classList.contains(`yellow`) ? `yellow` : `white`
    } ${e.classList.contains(`green`) ? `green` : `white`}  styling">`;

    e.classList.remove(`yellow`);
    e.classList.remove(`green`);
    e.classList.remove(`gray`);
    e.classList.remove(`used`);
    e.value = ``;
  });
  inputs[0].focus();
  playingDiv.nextElementSibling.remove();
  playingDiv.insertAdjacentHTML(`beforebegin`, `${htmlString}</div>`);
  playingDiv.insertAdjacentHTML(`beforebegin`, `<br>`);
}
function addListeners() {
  inputs.forEach((e, a) => {
    e.addEventListener(`input`, (el) => {
      // Ako taj input, ili keypress ne postoji onda return, a ako je space, nemoj da ga pises i nemoj dalje da fokusiras KONACNOOO

      if (el.data === null) return;
      if (el.data === ` `) {
        e.value = ``;
        return;
      }
      const nextInput = e.nextElementSibling;
      if (usedBadWords.includes(el.data.toLowerCase())) {
        e.classList.add(`used`);
      }
      if (nextInput === null) {
        return;
      }

      nextInput.focus();
    });
    e.addEventListener(`keyup`, (e) => {
      const nextInput = e.target.nextElementSibling;
      if (e.key === ` `) return;
      // Ako pretisnes backspace
      if (e.key === `Backspace`) {
        const previousInput = e.target.previousElementSibling;
        e.target.classList.remove(`used`);
        if (previousInput === null) {
          // Ako ne postoji vise, tjst ako si na prvi ondak return i nista ne radi sa taj backspace
          return;
        }

        // Ako ima slovo ispred, onda nemoj da menjas fokus na previous, ako nema ispred slovo onda izbrisi i stavi fokus na prethodni input
        if (nextInput?.value === `` || nextInput === null)
          previousInput.focus();
        // Ako je sve ok onda fokusiraj prethodni field
      } else {
        // Ako je nesto sto nije backspace

        // Ako je valid onda pisi
        if (
          e.target.value.length >= 1 &&
          nextInput !== null &&
          e.key.length === 1 &&
          nextInput.value === 0
        ) {
          nextInput.focus();
          nextInput.value = e.key;
          if (usedBadWords.includes(e.key)) {
            nextInput.classList.add(`used`);
          }
        }
        // Ako nema nista sledece onda vrati se, a ako ima, i ako si fokusiran na polje gde vec ima slovo, ako pretisnes slovo onda ce te fokusira na sledece polje i napisace tu sta si sad pretisnuo!!!
        if (nextInput === null) return;
        if (e.target.value.length === 1 && e.key.length === 1) {
          nextInput.value = e.key;
          nextInput.focus();
          if (usedBadWords.includes(e.key)) {
            nextInput.classList.add(`used`);
          }
        }
      }
    });
  });
}

let definition;
let i = 0;
async function getRandomWord() {
  try {
    modal.showModal();
    const word = await fetch(
      `https://random-word-api.vercel.app/api?words=1&length=5`
    );
    const json = await word.json();
    finalWord = json;
    const dictionaryAPI = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${finalWord}`
    );

    const dictionary = await dictionaryAPI.json();
    definition = dictionary[0].meanings[0].definitions[0].definition;
    inputs.forEach((e) => e.classList.remove(`hidden`));
    modal.close();
  } catch (err) {
    modal.close();
    getRandomWord();
    return;
  }
}
getRandomWord();

function getLetters(full = false) {
  let lettersArr = [];
  inputs.forEach((e) => {
    lettersArr.push(e.value);
  });
  let letters = lettersArr.map((e) => e.toLowerCase());
  if (letters.join(``).length !== inputs.length) {
    letters = [];
    return;
  }

  if (letters.join(``) === finalWord[0] && i === 0) {
    // You win
    againDiv.style.display = `flex`;
    inputs.forEach((e) => (e.disabled = `true`));
    againDiv.insertAdjacentHTML(
      `afterbegin`,
      `<span class="definition">${finalWord}: ${definition}</span>`
    );
    i++;
  }
  // You lose :(
  if (guesses <= 0 && i === 0) {
    againDiv.style.display = `flex`;
    inputs.forEach((e) => (e.disabled = `true`));
    againDiv.insertAdjacentHTML(
      `afterbegin`,
      `<span class="definition">You Lost! The word was ${finalWord}.</span>`
    );
    i++;
    return;
  }
  const lettersLower = letters.map((e) => {
    return e.toLowerCase();
  });
  if (!full) return lettersLower;
  else return letters.join(``).toLowerCase();
}

function checkIfGotWord() {
  const { grayPositions, yellowPositions, greenPositions } =
    findColorPositions();

  grayPositions.forEach((e) => {
    e.classList.add(`gray`);
  });
  yellowPositions.forEach((e) => {
    e.classList.add(`yellow`);
  });
  greenPositions.forEach((e) => {
    e.classList.add(`green`);
  });
}
function findColorPositions() {
  // Proveri da li je svaki input pun
  const letters = getLetters(false);
  const finalWordArray = finalWord[0].split(``);
  const finalArrayCopy = finalWordArray.slice();
  if (hardModeCheckBox.checked) {
    usedGoodWords.forEach((e) => {
      if (!letters.includes(e)) throw new Error(`Hard mode`);
    });
  }

  let yellowPositions = [];
  let greenPositions = [];
  let grayPositions = [];
  // For greens
  letters.forEach((e, i, a) => {
    // Ako postoji to slovo u final rec, nadji gde se nalazi, i ako je na isto mesto gde si ti stavio onda je zeleno, stavi ga u array za zelenilo i izbaci iz kopije gde se gleda da ne moze na isto mesto da budu dva zelena
    if (!finalArrayCopy.includes(e)) return;
    if (finalArrayCopy[i] === e) {
      greenPositions.push(inputs[i]);
      usedGoodWords.push(e);
      finalArrayCopy[i] = ``;
    }
  });

  // For yellows
  letters.forEach((e, i, a) => {
    // Gledaj dal postoji slovo, i ako postoji treba da NE bude u green array i da NE bude u istoj poziciji u final reci
    if (!finalArrayCopy.includes(e)) return;

    const positionInFinalWord = finalArrayCopy.indexOf(e);
    if (positionInFinalWord !== i && !greenPositions.includes(inputs[i])) {
      yellowPositions.push(inputs[i]);
      usedGoodWords.push(e);
      finalArrayCopy[finalArrayCopy.indexOf(e)] = ``;
    }
  });
  letters.forEach((e, i) => {
    if (
      !greenPositions.includes(inputs[i]) &&
      !yellowPositions.includes(inputs[i])
    ) {
      grayPositions.push(inputs[i]);
      usedBadWords.push(e);
    }
  });
  usedBadWords.forEach((e, i, arr) => {
    if (usedGoodWords.includes(e)) {
      arr[i] = ``;
    }
  });

  return { grayPositions, yellowPositions, greenPositions };
}
let timeout;

async function isWordReal(word, goMore = true) {
  try {
    const dictionaryAPI = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const dictionary = await dictionaryAPI.json();
    if (dictionary.title === `No Definitions Found`)
      throw new Error(`Can't find word in words list.`);
    const definition = dictionary[0].meanings[0].definitions[0].definition;
    if (goMore) {
      checkIfGotWord();
      disableAll();
      guesses--;
      guessesLeft.innerHTML = guesses + 1;
    } else return true;
  } catch (err) {
    const fail = document.querySelector(`.fail`);
    clearTimeout(timeout);
    fail.style.opacity = 1;
    fail.style.display = `block`;
    fail.textContent = err.message;
    timeout = setTimeout(() => {
      fail.style.opacity = 0;
      fail.style.display = `none`;
    }, 1000);
    console.log(`WROOONG`, err);
    return false;
  }
}
document.querySelector(`.again`).addEventListener(`click`, (e) => {
  div.innerHTML = `<span class="guesses">Guesses left: <span class="guesses-left"></span></span><div class="playing-div">
    <input
      type="text"
      maxlength="1"
      class="input hidden styling"
      value=""
    />
    <input
      type="text"
      maxlength="1"
      class="input hidden styling"
      value=""
    />
    <input
      type="text"
      maxlength="1"
      class="input hidden styling"
      value=""
    />
    <input
      type="text"
      maxlength="1"
      class="input hidden styling"
      value=""
    />
    <input
      type="text"
      maxlength="1"
      class="input hidden styling"
      value=""
    />
    `;
  for (let i = 0; i <= 4; i++) {
    div.insertAdjacentHTML(
      `beforeend`,
      `<div>
    <input
      type="text"
      maxlength="1"
      class="styling"
      value=""
      disabled
      style="margin-top: 10px"
    />
    <input
      type="text"
      maxlength="1"
      class="styling"
      value=""
      disabled
      style="margin-top: 10px"
    />
    <input
      type="text"
      maxlength="1"
      class="styling"
      value=""
      disabled
      style="margin-top: 10px"
    />
    <input
      type="text"
      maxlength="1"
      class="styling"
      value=""
      disabled
      style="margin-top: 10px"
    />
    <input
      type="text"
      maxlength="1"
      class="styling"
      value=""
      disabled
      style="margin-top: 10px"
    />
  </div>`
    );
  }
  inputs.forEach((e) => {
    e.classList.remove(`input`);
  });
  inputs = document.querySelectorAll(`.input`);
  playingDiv = document.querySelector(`.playing-div`);
  addListeners();
  getRandomWord();
  i = 0;
  document.querySelector(`.again`).previousElementSibling.outerHTML = ``;
  againDiv.style.display = `none`;
  guessesLeft = document.querySelector(`.guesses-left`);
  guesses = 5;
  guessesLeft.innerHTML = guesses + 1;
  usedGoodWords = [];
  usedBadWords = [];
});
const helpModal = document.querySelector(`.help-modal`);
const closeQuestion = document.querySelectorAll(`.close`);
const questionMark = document.querySelector(`.question`);
const darkMode = document.querySelector(`.dark-mode`);
const lightMode = document.querySelector(`.light-mode`);
questionMark.addEventListener(`click`, (e) => {
  helpModal.showModal();
});
closeQuestion.forEach((e) => {
  e.addEventListener(`click`, (e) => {
    e.target.parentElement.close();
  });
});
let root = document.documentElement;
let mode = localStorage.getItem(`mode`) || `light`;
if (mode === `dark`) changeToDarkMode();
function changeToDarkMode() {
  root.style.setProperty(`--background-color`, `var(--dark-mode)`);
  root.style.setProperty(`--header`, `var(--dark-header)`);
  root.style.setProperty(
    `--header-font-color`,
    `var(--dark-header-font-color)`
  );
  root.style.setProperty(`--shadow`, `var(--dark-shadow)`);
  darkMode.style.display = `none`;
  lightMode.style.display = `block`;
  lightMode.style.opacity = 1;
  localStorage.setItem(`mode`, `dark`);
}
function changeToLightMode() {
  root.style.setProperty(`--background-color`, `var(--light-mode)`);
  root.style.setProperty(`--header`, `var(--light-header)`);
  root.style.setProperty(
    `--header-font-color`,
    `var(--light-header-font-color)`
  );
  root.style.setProperty(`--shadow`, `var(--light-shadow)`);
  lightMode.style.display = `none`;
  darkMode.style.display = `block`;
  lightMode.style.opacity = 0;
  localStorage.setItem(`mode`, `light`);
}
darkMode.addEventListener(`click`, changeToDarkMode);
lightMode.addEventListener(`click`, changeToLightMode);

const cheat = document.querySelectorAll(`.styling-in-help`);
const cheatWord = document.querySelector(`.help-h1`);
let cheatCount = 0;
cheat[1].addEventListener(`click`, (e) => {
  cheatCount++;
  if (cheatCount >= 3) {
    cheatWord.innerHTML = `${finalWord}`;
    cheatCount = 0;
  }
});

const settingsModal = document.querySelector(`.settings-modal`);
const settingsBtn = document.querySelector(`.settings`);
settingsBtn.addEventListener(`click`, (e) => {
  settingsModal.showModal();
});
// window.addEventListener(`resize`, (e) => {
//   document.querySelector(`.styling`).style.width = `10vw`;
// });
