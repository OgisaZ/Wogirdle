"use strict";
let i = 0;

class InputsView {
  disableAll() {
    let playingDiv = document.querySelector(`.playing-div`);
    let inputs = document.querySelectorAll(`.input`);
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
    let guessesLeft = document.querySelector(`.guesses-left`);

    if (playingDiv.nextElementSibling !== null)
      playingDiv.nextElementSibling.remove();
    playingDiv.insertAdjacentHTML(`beforebegin`, `${htmlString}</div>`);
    playingDiv.insertAdjacentHTML(`beforebegin`, `<br>`);
    if (guessesLeft.textContent === `1`) playingDiv.remove();
  }
}
export default new InputsView();
