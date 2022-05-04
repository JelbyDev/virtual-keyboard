import { KEYBOARD_KEYS } from "./keyboardKeys.js";
import { General } from "./General.js";

export class Keys extends General {
  constructor(keyCode) {
    super();
    this.keyCode = keyCode;
    this.keyData = KEYBOARD_KEYS[keyCode];
  }

  getHtmlCode() {
    let keyBlockClasses = ["key"];
    if (this.keyData.letterKey) keyBlockClasses.push("key--latter");
    if (this.keyData.additionalClasses)
      keyBlockClasses = [...keyBlockClasses, ...this.keyData.additionalClasses];

    let keyBlock = this.createDomElement("div", "", keyBlockClasses);

    if (this.keyData.letterKey) {
      keyBlock.dataset.ru = this.keyData["ru"]["text"];
      keyBlock.dataset.ruShift = this.keyData["ru"]["shiftText"];
      keyBlock.dataset.en = this.keyData["en"]["text"];
      keyBlock.dataset.enShift = this.keyData["en"]["shiftText"];
    } else if (this.keyData.systemKey) {
      keyBlock.innerText = this.keyData.text;
    }

    keyBlock.dataset.keyCode = this.keyCode;

    return keyBlock;
  }
}
