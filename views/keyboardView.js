"use strict";

import { pressedKeyboard } from "../controller.js";

class keyboardView {
  addKeyboardListener() {
    const containerKeyboard = document.querySelector(`.container-keyboard`);
    const inputs = document.querySelector(`.input`);
    containerKeyboard.addEventListener(`click`, (e) => {
      console.log(inputs);
      if (inputs.disabled) return;
      if (
        !e.target.parentElement.classList.contains(`key`) &&
        !e.target.classList.contains(`key`)
      )
        return;
      if (!e.target.dataset.key) {
        this.keyPress(e.target.parentElement.dataset.key);
      } else this.keyPress(e.target.dataset.key);
    });
  }
  keyPress(key) {
    pressedKeyboard(key);
  }
}

export default new keyboardView();
