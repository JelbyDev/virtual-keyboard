import { KEYBOARD_KEYS, KEYBOARD_LAYOUT } from "./keyboardKeys.js";

document.addEventListener("keydown", (event) => {});

class General {
  constructor() {}
  createDomElement(tagName, innerText = null, classes = null) {
    let element = document.createElement(tagName);
    if (innerText) element.innerText = innerText;
    if (classes) element.classList.add(...classes);
    return element;
  }
}

class Keys extends General {
  constructor(...params) {
    super();
    [this.language, this.shiftMode, this.capsMode] = [...params];
  }

  changeShiftMode(shiftMode) {
    this.shiftMode = shiftMode;
  }

  changeCapsMode() {
    this.capsMode = capsMode;
  }

  changeLanguage(language) {
    this.language = language;
  }

  getKeyData(keyCode) {
    return KEYBOARD_KEYS[keyCode];
  }

  getKeyInHtml(keyCode) {
    let keyData = this.getKeyData(keyCode);
    let keyBlockClasses = ["key"];
    if (keyData.letterKey) keyBlockClasses.push("key--latter");
    if (keyData.additionalClasses)
      keyBlockClasses = [...keyBlockClasses, ...keyData.additionalClasses];

    let keyBlock = this.createDomElement("div", "1", keyBlockClasses);
    keyBlock.dataset.keyCode = keyCode;
    this.updateKeyText(keyBlock, keyData);

    return keyBlock;
  }

  updateKeyText(keyBlock, keyData) {
    if (keyData.systemKey) {
      keyBlock.innerText = keyData.text;
      return;
    }

    let keyText = ";";
    if (this.shiftMode) {
      keyText = keyData[this.language].shiftText;
      if (this.capsMode) keyText = keyText.toLowerCase();
    } else {
      keyText = keyData[this.language].text;
      if (this.capsMode) keyText = keyText.toUpperCase();
    }
    keyBlock.innerText = keyText;
    return;
  }
}

class Keyboard extends General {
  constructor(appWrapper = null) {
    super();
    this.shiftMode = false;
    this.capsMode = false;
    this.language = "ru";
    this.keysClass = new Keys(this.language, this.shiftMode, this.capsMode);
    this.appWrapper = appWrapper
      ? document.querySelector(appWrapper)
      : this.createAppWrapper();
    this.initKeyboard();
  }

  initKeyboard() {
    this.createTitleBlok();
    this.createTextareaBlock();
    this.createKeyboardBlock();
    this.createInfoBlock();
  }

  clickKeyboardKey(event) {
    if (event.type === "mousedown")
      event.currentTarget.classList.add("key--active");
    if (event.type === "mouseup")
      event.currentTarget.classList.remove("key--active");
  }

  //------CREATE METHODS-----------------------//
  createAppWrapper() {
    let appWrapper = this.createDomElement("section", "", ["app"]);
    document.body.prepend(appWrapper);
    return appWrapper;
  }

  createTitleBlok() {
    let titleBlock = this.createDomElement("h1", "Виртуальная клавиатура");
    this.appWrapper.append(titleBlock);
  }

  createTextareaBlock() {
    let textareaBlock = this.createDomElement("textarea");
    this.appWrapper.append(textareaBlock);
  }

  createKeyboardBlock() {
    let keyboardBlock = this.createDomElement("div", "", ["keyboard"]);
    KEYBOARD_LAYOUT.forEach((rowKeys) => {
      let keyboardRowBlock = this.getKeyboardRowBlock(rowKeys);
      keyboardBlock.append(keyboardRowBlock);
    });
    this.appWrapper.append(keyboardBlock);
  }

  createInfoBlock() {
    let systemInfoBlock = this.createDomElement(
      "p",
      "Клава сделана под Windows"
    );
    let languageInfoBlock = this.createDomElement("p", "Смена языка");
    this.appWrapper.append(systemInfoBlock);
    this.appWrapper.append(languageInfoBlock);
  }

  //------GET METHODS-----------------------//
  getKeyboardRowBlock(rowKeys) {
    let rowBlock = this.createDomElement("div", "", ["keyboard__row"]);
    rowKeys.forEach((keyCode) => {
      rowBlock.append(this.keysClass.getKeyInHtml(keyCode));
    });
    return rowBlock;
  }
}

let keyboard = new Keyboard();
