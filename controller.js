"use strict";
// I tried following the MVC architecture model but i got reeeeeallly angry after some time so there are maybe some badly placed things...
import model from "./model.js";
import listenersView from "./views/gameListenersView.js";
import { inputs } from "./model.js";
import inputsView from "./views/inputsView.js";
import { GUESSES } from "./config.js";
import helpView from "./views/helpView.js";
import settingsView from "./views/settingsView.js";
import keyboardView from "./views/keyboardView.js";
const modal = document.querySelector(`.modal`);
function init() {
  // let guessesLeft = document.querySelector(`.guesses-left`);
  // guessesLeft.innerHTML = GUESSES + 1;
  model.getRandomWord();
  model.addListeners();
  listenersView.addEnterHandler(model.enterEventListener, model);
  listenersView.addAgainHandler();
  listenersView.addCopyHandler(model.copyEventListener, model);
  listenersView.addFinishHandler();
  keyboardView.addKeyboardListener();
  helpView.addHelpListeners();
  settingsView.addSettingsListeners();
  //   model.enterEventListener();
}
init();
export function inputCaller() {
  inputsView.disableAll(model.gameState.guesses);
}
export function callControllerAgain() {
  model.resetAll();

  // let guessesLeft = document.querySelector(`.guesses-left`);
  // guessesLeft.innerHTML = GUESSES + 1;
}
export function pressedKeyboard(key) {
  model.pressedKeyboardModel(key);
}
const cheat = document.querySelectorAll(`.styling-in-help`);
const cheatWord = document.querySelector(`.help-h1`);
let cheatCount = 0;
cheat[1].addEventListener(`click`, (e) => {
  cheatCount++;
  if (cheatCount >= 3) {
    cheatWord.innerHTML = `${model.gameState.finalWord}`;
    cheatCount = 0;
  }
});
