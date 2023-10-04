"use strict";
import { div } from "../declarations.js";
import { callControllerAgain } from "../controller.js";
import model from "../model.js";

class GameListenersView {
  addEnterHandler(handler, modelThis) {
    document.addEventListener(`keyup`, (e) => {
      if (e.key !== `Enter`) return;
      handler.call(modelThis);
    });
  }
  addCopyHandler(handler, modelThis) {
    document.querySelector(`.finish-copy`).addEventListener(`click`, (e) => {
      handler.call(modelThis);
    });
  }
  addFinishHandler() {
    document.querySelector(`.finish`).addEventListener(`click`, (e) => {
      document.querySelector(`.finish-modal`).showModal();
    });
  }
  addAgainHandler() {
    document.querySelector(`.again`).addEventListener(`click`, (e) => {
      div.innerHTML = `<div class="playing-div">
        <input
          type="text"
          maxlength="1"
          class="input styling"
          value=""
        />
        <input
          type="text"
          maxlength="1"
          class="input styling"
          value=""
        />
        <input
          type="text"
          maxlength="1"
          class="input styling"
          value=""
        />
        <input
          type="text"
          maxlength="1"
          class="input styling"
          value=""
        />
        <input
          type="text"
          maxlength="1"
          class="input styling"
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
      callControllerAgain();
    });
  }
}

export default new GameListenersView();
