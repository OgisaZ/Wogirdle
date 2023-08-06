"use strict";
export let inputs = document.querySelectorAll(`.input`);
import { hardModeCheckBox } from "./definitions.js";
import { againDiv } from "./definitions.js";
import { guessesLeft } from "./definitions.js";
import { inputCaller } from "./controller.js";
import { GUESSES } from "./config.js";
let i = 0;
let usedGoodWords = [];
let usedBadWords = [];
const modal = document.querySelector(`.modal`);
class Model {
  gameState = {
    finalWord: `house`,
    definition: `No definition found`,
    guesses: GUESSES,
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
    againDiv.style.display = `none`;
    this.gameState.guesses = 5;
    usedGoodWords = [];
    usedBadWords = [];
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

  enterEventListener() {
    const lastInput = inputs[inputs.length - 1];
    if (lastInput.value === ``) return;
    this.isWordReal(this.getLetters(true), true);
  }

  getLetters(full = false) {
    let lettersArr = [];
    inputs.forEach((e) => {
      lettersArr.push(e.value);
    });
    let letters = lettersArr.map((e) => e.toLowerCase());
    if (letters.join(``).length !== inputs.length) {
      letters = [];
      return;
    }

    if (letters.join(``) === this.gameState.finalWord[0] && i === 0) {
      // You win
      againDiv.style.display = `flex`;
      inputs.forEach((e) => (e.disabled = `true`));
      againDiv.insertAdjacentHTML(
        `afterbegin`,
        `<span class="definition">${this.gameState.finalWord}: ${this.gameState.definition}</span>`
      );
      i++;
    }
    // You lose :(
    if (this.gameState.guesses <= 0 && i === 0) {
      againDiv.style.display = `flex`;
      inputs.forEach((e) => (e.disabled = `true`));
      againDiv.insertAdjacentHTML(
        `afterbegin`,
        `<span class="definition">You Lost! The word was ${this.gameState.finalWord}.</span>`
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

  async isWordReal(word, goMore = false) {
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
        this.gameState.guesses--;
        guessesLeft.innerHTML = this.gameState.guesses + 1;
      } else return true;
    } catch (err) {
      const fail = document.querySelector(`.fail`);
      clearTimeout(this.timeout);
      fail.style.opacity = 1;
      fail.style.display = `block`;
      fail.textContent = err.message;
      this.timeout = setTimeout(() => {
        fail.style.opacity = 0;
        fail.style.display = `none`;
      }, 1000);
      return false;
    }
  }

  checkIfGotWord() {
    const { grayPositions, yellowPositions, greenPositions } =
      this.findColorPositions();

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
  findColorPositions() {
    // Proveri da li je svaki input pun
    const letters = this.getLetters(false);
    const finalWordArray = this.gameState.finalWord[0].split(``);
    const finalArrayCopy = finalWordArray.slice();
    if (hardModeCheckBox.checked) {
      console.log(usedGoodWords);
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
  async getRandomWord() {
    try {
      modal.showModal();
      const word = await fetch(
        `https://random-word-api.vercel.app/api?words=1&length=5`
      );
      const json = await word.json();
      this.gameState.finalWord = json;
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
