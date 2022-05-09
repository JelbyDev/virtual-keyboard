import { KEYBOARD_KEYS } from "./keyboardData.js";
import createDomElement from "./generalFunctions.js";

class Keys {
  constructor(keyCode) {
    this.code = keyCode;
    this.createKeyData();
    this.createHtmlElement();
  }

  createKeyData() {
    const keyType = KEYBOARD_KEYS[this.code].pop();
    if (keyType === "system") this.getSystemKey(...KEYBOARD_KEYS[this.code]);
    if (keyType === "letter") this.getLetterKey(...KEYBOARD_KEYS[this.code]);
  }

  createHtmlElement() {
    let keyHtmlClasses = ["key"];
    if (this.data.letterKey) keyHtmlClasses.push("key--latter");
    if (this.data.additionalClasses) {
      keyHtmlClasses = [...keyHtmlClasses, ...this.data.additionalClasses];
    }

    this.keyHtml = createDomElement("div", "", keyHtmlClasses);

    if (this.data.letterKey) {
      this.keyHtml.dataset.ru = this.data.ru.text;
      this.keyHtml.dataset.ruShift = this.data.ru.shiftText;
      this.keyHtml.dataset.en = this.data.en.text;
      this.keyHtml.dataset.enShift = this.data.en.shiftText;
    } else if (this.data.systemKey) {
      this.keyHtml.innerText = this.data.text;
    }

    this.keyHtml.dataset.keyCode = this.code;
  }

  isLetter() {
    return this.data?.letterKey;
  }

  get htmlElement() {
    return this.keyHtml;
  }

  get keyCode() {
    return this.code;
  }

  getSystemKey(text, additionalClasses) {
    this.data = {
      text,
      additionalClasses,
      systemKey: true,
    };
  }

  getLetterKey(ruText, ruShiftText, enText, enShiftText) {
    this.data = {
      ru: { text: ruText, shiftText: ruShiftText },
      en: { text: enText, shiftText: enShiftText },
      letterKey: true,
    };
  }
}

export default Keys;
