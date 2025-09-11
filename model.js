"use strict";
export let inputs = document.querySelectorAll(`.input`);
import { hardModeCheckBox } from "./declarations.js";
import { againDiv } from "./declarations.js";
import { inputCaller } from "./controller.js";
import { GUESSES } from "./config.js";
let i = 0;
let usedGoodWords = [];
let usedBadWords = [];
let aaa = 0;
let stringify = ``;
const modal = document.querySelector(`.modal`);
const finishModal = document.querySelector(`.finish-modal`);
const finishEmojisHTML = document.querySelector(`.finish-emojis`);
const finishText = document.querySelector(`.finish-text`);
const finishButtonDiv = document.querySelector(`.finish-div`);
let won = true;
class Model {
  gameState = {
    finalWord: `house`,
    definition: `No definition found`,
    guesses: GUESSES,
    bannedSymbols: [`/`, ``, `?`, `%`],
    secretWords: [
      `ogisa`,
      `kuzma`,
      `maden`,
      `stefi`,
      `fajni`,
      `hinty`,
      `gojko`,
      `niger`,
      `tejce`,
    ],
    usedHint: false,
  };
  timeout;
  resetAll() {
    inputs.forEach((e) => {
      e.classList.remove(`input`);
    });
    inputs = document.querySelectorAll(`.input`);
    this.addListeners();
    this.getRandomWord();
    i = 0;
    document.querySelector(`.again`).previousElementSibling.outerHTML = ``;
    document.querySelector(`.hint`).innerHTML = ``;
    againDiv.style.display = `none`;
    this.gameState.guesses = 5;
    this.gameState.usedHint = false;
    usedGoodWords = [];
    usedBadWords = [];
    const keysHTML = document.querySelectorAll(`.key`);
    keysHTML.forEach((e) => {
      e.style.backgroundColor = `var(--header)`;
      e.style.color = `var(--header-font-color)`;
    });
    stringify = ``;
    finishButtonDiv.style.display = `none`;
    finishModal.close();
    finishModal.style.opacity = 0;
  }

  pressedKeyboardModel(key) {
    let shouldStop = false;
    inputs.forEach((e) => {
      if (shouldStop) return;
      if (
        key === `back` &&
        (e.value === `` || inputs[inputs.length - 1].value)
      ) {
        if (inputs[inputs.length - 1].value) {
          inputs[inputs.length - 1].value = ``;
          inputs[inputs.length - 1].classList.remove(`used`);
        } else {
          e.previousElementSibling.value = ``;
          e.previousElementSibling.classList.remove(`used`);
        }
        shouldStop = true;
      }

      if (e.value === `` && key.length === 1) {
        e.value = key;

        this.keyPressAny(e, key);
        if (usedBadWords.includes(key)) {
          e.classList.add(`used`);
        }
        shouldStop = true;
      }
    });
    if (key === `enter`) {
      this.enterEventListener(`keyboard`);
    }
  }
  updateKeyboard() {
    const { grayPositions, yellowPositions, greenPositions } =
      this.findColorPositions(false);
    grayPositions.forEach((e) => {
      const findIt = document.querySelectorAll(
        `[data-key~="${e.value.toLowerCase()}"]`
      );
      findIt[0].style.backgroundColor = `var(--used)`;
    });
    yellowPositions.forEach((e) => {
      const findIt = document.querySelectorAll(
        `[data-key~="${e.value.toLowerCase()}"]`
      );
      if (findIt[0].style.backgroundColor === `greenyellow`) return;
      findIt[0].style.backgroundColor = `yellow`;
      findIt[0].style.color = `black`;
    });
    greenPositions.forEach((e) => {
      const findIt = document.querySelectorAll(
        `[data-key~="${e.value.toLowerCase()}"]`
      );
      findIt[0].style.backgroundColor = `greenyellow`;
      findIt[0].style.color = `black`;
    });
  }

  keyPressAny(e, keyboard = false) {
    let targetElement = e.target;
    let key = e.key;
    if (!e.key) {
      targetElement = e;
      key = keyboard;
    }
    const nextInput = targetElement.nextElementSibling;
    if (key === ` `) return;
    // Ako pretisnes backspace

    if (key === `Backspace`) {
      const previousInput = targetElement.previousElementSibling;
      targetElement.classList.remove(`used`);
      if (previousInput === null) {
        // Ako ne postoji vise, tjst ako si na prvi ondak return i nista ne radi sa taj backspace
        return;
      }
      // Ako ima slovo ispred, onda nemoj da menjas fokus na previous, ako nema ispred slovo onda izbrisi i stavi fokus na prethodni input
      if (nextInput?.value === `` || nextInput === null) previousInput.focus();
      // Ako je sve ok onda fokusiraj prethodni field
    } else {
      // Ako je nesto sto nije backspace

      // Ako je valid onda pisi

      if (
        targetElement.value.length >= 1 &&
        nextInput !== null &&
        key.length === 1 &&
        nextInput.value === 0
      ) {
        if (!keyboard) nextInput.value = key;
        if (usedBadWords.includes(key)) {
          if (!keyboard) {
            nextInput.classList.add(`used`);
            nextInput.focus();
          } else targetElement.classList.add(`used`);
        }
      }

      // Ako nema nista sledece onda vrati se, a ako ima, i ako si fokusiran na polje gde vec ima slovo, ako pretisnes slovo onda ce te fokusira na sledece polje i napisace tu sta si sad pretisnuo!!!
      if (nextInput === null) return;
      if (targetElement.value.length === 1 && key.length === 1) {
        if (!keyboard) {
          nextInput.value = key;
          nextInput.focus();
        }
        if (usedBadWords.includes(key)) {
          if (!keyboard) {
            nextInput.classList.add(`used`);
            nextInput.focus();
          } else targetElement.classList.add(`used`);
        }
      }
    }
  }
  addListeners() {
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
        this.keyPressAny(e);
      });
    });
  }

  enterEventListener(keyboard = false) {
    const lastInput = inputs[inputs.length - 1];
    if (lastInput.value === ``) return;
    this.isWordReal(this.getLetters(true), true, keyboard ? `keyboard` : false);
  }
  stringifyColors() {
    inputs.forEach((e) => {
      stringify += `${e.classList[e.classList.length - 1]}`;
    });
    stringify += `\n`;
    return stringify;
  }
  makeColorToEmojis() {
    const emojiString = stringify
      .replaceAll(`gray`, `⬛`)
      .replaceAll(`yellow`, `🟨`)
      .replaceAll(`green`, `🟩`)
      .trim();

    return emojiString;
  }
  makeFinalModalContents() {
    const emojis = this.makeColorToEmojis();
    finishEmojisHTML.textContent = emojis;
    if (won)
      finishText.textContent = `You guessed the word in ${
        GUESSES + 1 - this.gameState.guesses
      } tries. ${this.gameState.usedHint ? `But you used a hint.` : ``}`;
    if (!won) finishText.textContent = `You didn't guess the word`;
  }
  copyEventListener() {
    try {
      if (won)
        navigator.clipboard.writeText(
          `I guessed the word *${this.gameState.finalWord}* in ${
            GUESSES - this.gameState.guesses
          } tries. ${
            this.gameState.usedHint ? `But I used a hint.` : ``
          }\n${this.makeColorToEmojis()}\nhttps://ogisaz.github.io/Wogirdle/`
        );
      if (!won)
        navigator.clipboard.writeText(
          `I didn't guess the word *${
            this.gameState.finalWord
          }*. I mean it was absurd!${
            this.gameState.usedHint ? `Even with a hint!` : ``
          }\n${this.makeColorToEmojis()}\nhttps://ogisaz.github.io/Wogirdle/`
        );
      finishText.textContent = `Copied to clipboard!`;
    } catch (err) {
      alert(`Couldn't copy to clipboard.`);
      console.log(err);
    }
  }
  checkIfWin() {
    const letters = this.getLetters();

    if (letters.join(``) === this.gameState.finalWord[0] && i === 0) {
      // You win
      won = true;
      setTimeout(() => {
        finishModal.showModal();
        finishModal.style.opacity = 1;
      }, 1000);
      finishButtonDiv.style.display = `flex`;
      againDiv.style.display = `flex`;
      inputs.forEach((e) => (e.disabled = `true`));
      againDiv.insertAdjacentHTML(
        `afterbegin`,
        `<span class="definition"><strong>${this.gameState.finalWord}</strong>: ${this.gameState.definition}</span>`
      );
      i++;
      return true;
    }
    return false;
  }
  checkIfLoser() {
    if (this.gameState.guesses <= 0 && i === 0) {
      won = false;
      // this.makeFinalModalContents();
      setTimeout(() => {
        finishModal.showModal();
        finishModal.style.opacity = 1;
      }, 1000);

      finishButtonDiv.style.display = `flex`;
      againDiv.style.display = `flex`;
      inputs.forEach((e) => (e.disabled = `true`));

      againDiv.insertAdjacentHTML(
        `afterbegin`,
        `<span class="definition">You Lost! The word was ${this.gameState.finalWord}.<br> ${this.gameState.definition}</span>`
      );
      i++;
      return true;
    }
    return false;
  }
  getLetters(full = false) {
    let lettersArr = [];

    inputs.forEach((e) => {
      lettersArr.push(e.value);
    });
    let letters = lettersArr.map((e) => e.toLowerCase());
    let lettersString = letters.join(``).toLowerCase();
    // Invalid inputs
    letters.forEach((e) => {
      if (this.gameState.bannedSymbols.includes(e)) {
        this.showFail(`Not valid input.`);
        throw new Error(`Not valid input.`);
      }
    });
    if (letters.join(``).length !== inputs.length) {
      letters = [];
      return;
    }

    const lettersLower = letters.map((e) => {
      return e.toLowerCase();
    });

    if (!full) return lettersLower;
    else return lettersString;
  }
  checkSecretInputs(word) {
    let message,
      time = 2500;
    switch (word) {
      case `ogisa`:
        message = `Hey that's me!`;

        break;
      case `kuzma`:
        message = `Tipican kuzma npc play. E de si olivera aj cuti nekad a?`;
        break;
      case `maden`:
        message = `E madene e madene gde si madene. Opicen u glavu Enough These Fa`;
        break;
      case `stefi`:
        message = `The king himself. Pali siege.`;
        break;
      case `fajni`:
        message = `<img class="fit-pic" src="./src/fajni.png">`;
        time = 4000;
        break;
      case `hinty`:
        let doubleLetters = false;
        let hintText = document.querySelector(`.hint`);
        let lettersSet = new Set(Array.from(...this.gameState.finalWord));
        if (lettersSet.size < 5) doubleLetters = true;
        message = `Definition: ${this.gameState.definition}<br> ${
          doubleLetters
            ? `<br>There are repeating letters`
            : `<br>There are no repeating letters`
        }`;
        hintText.innerHTML = message;
        this.gameState.usedHint = true;
        break;
      case `gojko`:
        message = `<img class="fit-pic" src="./src/gojko.png">`;
        time = 4000;
        break;
      case `niger`:
        message = `The country, right?`;
        break;
      case `tejce`:
        message = `Volim te <3`;
        break;

      default:
        break;
    }
    this.showFail(message, time);
  }
  flippingAnimation() {
    const previousInputs =
      document.querySelectorAll(`.previous`)[
        document.querySelectorAll(`.previous`).length - 1
      ].children;
    const arr = [].slice.call(previousInputs);
    arr.forEach(function (tile, i) {
      tile.classList.add("flip");
    });
  }
  showFail(message, time = 1000) {
    const fail = document.querySelector(`.fail`);
    clearTimeout(this.timeout);
    fail.style.opacity = 1;
    fail.style.display = `block`;
    fail.innerHTML = message;
    this.timeout = setTimeout(() => {
      fail.style.opacity = 0;
      fail.style.display = `none`;
    }, time);
  }

  async isWordReal(word, goMore = false, keyboard = false) {
    try {
      const dictionaryAPI = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const dictionary = await dictionaryAPI.json();
      if (dictionary.title === `No Definitions Found`)
        throw new Error(`Can't find word in words list.`);

      if (goMore) {
        this.checkIfGotWord();
        inputCaller();
        this.flippingAnimation();

        this.gameState.guesses--;
        if (!keyboard) inputs[0].focus();
      } else return true;
    } catch (err) {
      console.log(err.message);
      this.showFail(err.message);
      if (this.gameState.secretWords.includes(word)) {
        this.checkSecretInputs(word);
      }
      return false;
    }
  }

  checkIfGotWord() {
    const { grayPositions, yellowPositions, greenPositions } =
      this.findColorPositions();
    grayPositions.forEach((e, i) => {
      e.classList.add(`gray`);
    });
    yellowPositions.forEach((e) => {
      e.classList.add(`yellow`);
    });
    greenPositions.forEach((e, i) => {
      e.classList.add(`green`);
    });
    this.stringifyColors();
    if (this.checkIfWin) this.makeFinalModalContents();
  }
  findColorPositions(keyboard = true) {
    // Proveri da li je svaki input pun
    const letters = this.getLetters(false);
    this.checkIfWin();
    // You lose :(
    this.checkIfLoser();

    const finalWordArray = this.gameState.finalWord[0].split(``);
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
    if (keyboard) this.updateKeyboard();

    return { grayPositions, yellowPositions, greenPositions };
  }
  async getRandomWord() {
    try {
      modal.showModal();
      const word = await fetch(
        `https://random-word-api.vercel.app/api?words=1&length=5`
      );
      const json = await word.json();
      this.gameState.finalWord = json;
      if (this.gameState.finalWord === `yo-yo`) this.getRandomWord();
      const dictionaryAPI = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${this.gameState.finalWord}`
      );

      const dictionary = await dictionaryAPI.json();
      this.gameState.definition =
        dictionary[0].meanings[0].definitions[0].definition;
      inputs.forEach((e) => e.classList.remove(`hidden`));

      modal.close();
    } catch (err) {
      modal.close();
      this.getRandomWord(modal);
      return;
    }
  }
}

export default new Model();
