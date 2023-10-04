"use strict";
let i = 0;
// import model from "../model";
class InputsView {
  disableAll(guesses) {
    let playingDiv = document.querySelector(`.playing-div`);
    let inputs = document.querySelectorAll(`.input`);
    if (i >= 1) return;
    let htmlString = `<div class="previous">`;
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
    // let guessesLeft = document.querySelector(`.guesses-left`);
    console.log(guesses);
    if (playingDiv.nextElementSibling !== null)
      playingDiv.nextElementSibling.remove();
    playingDiv.insertAdjacentHTML(`beforebegin`, `${htmlString}</div>`);
    playingDiv.insertAdjacentHTML(`beforebegin`, `<br>`);
    if (!guesses) playingDiv.remove();
  }
}
export default new InputsView();
