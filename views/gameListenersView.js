"use strict";
import { div } from "../definitions.js";
import { callControllerAgain } from "../controller.js";
class GameListenersView {
  addEnterHandler(handler, modelThis) {
    document.addEventListener(`keyup`, (e) => {
      if (e.key !== `Enter`) return;
      handler.call(modelThis);
    });
  }
  addAgainHandler() {
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
      callControllerAgain();
    });
  }
}

export default new GameListenersView();
