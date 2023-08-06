"use strict";
const helpModal = document.querySelector(`.help-modal`);
const closeQuestion = document.querySelectorAll(`.close`);
const questionMark = document.querySelector(`.question`);

class helpView {
  addHelpListeners() {
    questionMark.addEventListener(`click`, (e) => {
      helpModal.showModal();
    });
    closeQuestion.forEach((e) => {
      e.addEventListener(`click`, (e) => {
        e.target.parentElement.close();
      });
    });
  }
}

export default new helpView();
