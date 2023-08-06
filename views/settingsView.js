"use strict";
let root = document.documentElement;

const darkMode = document.querySelector(`.dark-mode`);
const lightMode = document.querySelector(`.light-mode`);
let mode = localStorage.getItem(`mode`) || `light`;
const settingsModal = document.querySelector(`.settings-modal`);
const settingsBtn = document.querySelector(`.settings`);
const hardModeCheckBox = document.querySelector(`.checkbox-hard`);
const hardMode = localStorage.getItem(`hardmode`) || false;
if (hardMode === `true`) {
  hardModeCheckBox.checked = true;
}
class settingsView {
  addSettingsListeners() {
    if (mode === `dark`) {
      this.changeToDarkMode();
    }
    darkMode.addEventListener(`click`, this.changeToDarkMode);
    lightMode.addEventListener(`click`, this.changeToLightMode);
    settingsBtn.addEventListener(`click`, (e) => {
      settingsModal.showModal();
    });
    hardModeCheckBox.addEventListener(`change`, (e) => {
      if (localStorage.getItem(`hardmode`) === `true`) {
        localStorage.setItem(`hardmode`, false);
      } else localStorage.setItem(`hardmode`, true);
    });
  }
  changeToDarkMode() {
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
  changeToLightMode() {
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
}

export default new settingsView();
