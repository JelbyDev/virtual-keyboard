import { KEYBOARD_KEYS } from "./keyboardKeys.js";

document.addEventListener("keydown", (event) => {});

class Keyboard {
  constructor() {
    this.initKeyboard();
  }

  initKeyboard() {
    let wrapper = document.createElement("div");
    wrapper.classList.add("keyboard");

    KEYBOARD_KEYS.forEach((rowElement, rowIndex) => {
      let rowWrapper = document.createElement("div");
      rowWrapper.classList.add("keyboard__row");

      rowElement.forEach((element, index) => {
        rowWrapper.append(this.createHtmlKey(element, index));
      });

      wrapper.append(rowWrapper);
    });

    document.body.append(wrapper);
  }

  createHtmlKey(keyInfo) {
    let keyWrapper = document.createElement("div");
    keyWrapper.classList.add("key", `key--code-${keyInfo.code}`);
    if (keyInfo.additionalClass)
      keyWrapper.classList.add(...keyInfo.additionalClass);
    if ("staticText" in keyInfo) {
      keyWrapper.innerText = keyInfo.staticText;
    } else {
      keyWrapper.append(
        this.createLanguageTextInKey("ruDefault", keyInfo.ruDefault)
      );
      keyWrapper.append(
        this.createLanguageTextInKey("ruShift", keyInfo.ruShift)
      );
      keyWrapper.append(
        this.createLanguageTextInKey("enDefault", keyInfo.enDefault)
      );
      keyWrapper.append(
        this.createLanguageTextInKey("enShift", keyInfo.enShift)
      );
    }
    return keyWrapper;
  }

  createLanguageTextInKey(language, text) {
    let languageBlock = document.createElement("div");
    languageBlock.classList.add(`key--${language}`);
    languageBlock.innerText = text;
    return languageBlock;
  }
}

let keyboard = new Keyboard();
