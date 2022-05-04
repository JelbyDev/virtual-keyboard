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

  setShiftMode(shiftMode) {
    this.shiftMode = shiftMode;
  }

  setCapsMode(capsMode) {
    this.capsMode = capsMode;
  }

  setLanguage(language) {
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
    if (!keyData) keyData = this.getKeyData(keyBlock.dataset.keyCode);
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

    this.createHandlerOnMouse();
    this.createHandlerOnKey();
  }

  //------HANDLER METHODS-----------------------//
  createHandlerOnMouse() {
    document.querySelectorAll(".key").forEach((element) => {
      element.addEventListener("mousedown", (event) => {
        this.clickKeyboardKey(event, event.currentTarget.dataset.keyCode);
      });
      element.addEventListener("mouseup", (event) =>
        this.clickKeyboardKey(event, event.currentTarget.dataset.keyCode)
      );
    });
  }

  createHandlerOnKey() {
    document.body.addEventListener("keydown", (event) =>
      this.clickKeyboardKey(event, event.code)
    );
    document.body.addEventListener("keyup", (event) =>
      this.clickKeyboardKey(event, event.code)
    );
  }

  clickKeyboardKey(event, keyCode) {
    let keyData = this.keysClass.getKeyData(keyCode);
    if (!keyData) return false;

    let currentKeyBlock = document.querySelector(
      `[data-key-code='${keyCode}']`
    );

    if (event.type === "mousedown" || event.type === "keydown")
      currentKeyBlock.classList.add("key--active");
    if (event.type === "mouseup" || event.type === "keyup")
      currentKeyBlock.classList.remove("key--active");

    event.preventDefault();

    if (
      keyCode === "ShiftLeft" ||
      keyCode === "ShiftRight" ||
      keyCode === "CapsLock" ||
      keyCode === "AltLeft" ||
      keyCode === "AltRight" ||
      keyCode === "ControlLeft" ||
      keyCode === "ControlRight"
    ) {
      this.handlerSystemKey(event, keyCode);
    } else if (event.type === "keydown" || event.type === "mousedown") {
      let textareaBlock = document.querySelector("textarea");
      let textareaValue = textareaBlock.value;
      let cursorStart = textareaBlock.selectionStart;
      let cursorEnd = textareaBlock.selectionEnd;
      if (keyCode === "Space") {
        textareaValue = this.updateTextareaValue(textareaBlock, " ");
      } else if (keyCode === "Enter") {
        textareaValue = this.updateTextareaValue(textareaBlock, "\n");
      } else if (keyCode === "Tab") {
        textareaValue = this.updateTextareaValue(textareaBlock, "    ", 4);
      } else if (keyCode === "Backspace") {
        if (cursorStart === cursorEnd) {
          textareaValue = this.deleteLetterInTextarea(
            textareaBlock,
            cursorStart - 1,
            1,
            cursorStart - 1
          );
        } else {
          textareaValue = this.deleteLetterInTextarea(
            textareaBlock,
            cursorStart,
            cursorEnd,
            cursorStart
          );
        }
      } else if (keyCode === "Delete") {
        if (cursorStart === cursorEnd) {
          textareaValue = this.deleteLetterInTextarea(
            textareaBlock,
            cursorStart,
            1,
            cursorStart
          );
        } else {
          textareaValue = this.deleteLetterInTextarea(
            textareaBlock,
            cursorStart,
            cursorEnd,
            cursorStart
          );
        }
      } else {
        textareaValue = this.updateTextareaValue(
          textareaBlock,
          currentKeyBlock.innerHTML
        );
      }
      textareaBlock.value = textareaValue;
    }
  }

  updateTextareaValue(textareaBlock, addedText = "", textSize = 0) {
    let cursorStart = textareaBlock.selectionStart;
    let cursorEnd = textareaBlock.selectionEnd;
    let textareaValue = textareaBlock.value;

    let textBeforeCursor = textareaValue.substring(0, cursorStart);
    let textAfterCursor = textareaValue.substring(
      cursorStart,
      textareaValue.length
    );

    setTimeout(function () {
      textareaBlock.selectionStart = textareaBlock.selectionEnd =
        cursorStart + textSize + 1;
    }, 0);

    return textBeforeCursor + addedText + textAfterCursor;
  }

  deleteLetterInTextarea(
    textareaBlock,
    deleteStart,
    deleteEnd,
    cursorPositionAfterDelete,
    toReplace = ""
  ) {
    let textareaValue = textareaBlock.value.split("");
    if (
      deleteStart < 0 ||
      deleteStart > textareaValue.length ||
      textareaValue.length === 0
    )
      return textareaValue;
    textareaValue.splice(deleteStart, deleteEnd, toReplace);
    textareaValue = textareaValue.join("");
    setTimeout(function () {
      textareaBlock.selectionStart = textareaBlock.selectionEnd =
        cursorPositionAfterDelete;
    }, 0);
    return textareaValue;
  }

  handlerSystemKey(event, keyCode) {
    if (event.type === "mousedown" || event.type === "keydown") {
      if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") {
        this.shiftMode = true;
        this.keysClass.setShiftMode(true);
        document.querySelectorAll(".key--latter").forEach((keyBlock) => {
          this.keysClass.updateKeyText(keyBlock);
        });
      }
      if (keyCode === "CapsLock") {
        if (this.setCapsMode) {
          this.setCapsMode = false;
          event.currentTarget.classList.remove("key--caps-active");
        } else {
          this.setCapsMode = true;
          event.currentTarget.classList.add("key--caps-active");
        }
        this.keysClass.setCapsMode(this.setCapsMode);
        document.querySelectorAll(".key--latter").forEach((keyBlock) => {
          this.keysClass.updateKeyText(keyBlock);
        });
      }
      if (
        ((keyCode === "AltLeft" || keyCode === "AltRight") && event.ctrlKey) ||
        ((keyCode === "ControlLeft" || keyCode === "ControlRight") &&
          event.altKey)
      ) {
        this.language = this.language === "ru" ? "en" : "ru";
        this.keysClass.setLanguage(this.language);
        document.querySelectorAll(".key--latter").forEach((keyBlock) => {
          this.keysClass.updateKeyText(keyBlock);
        });
      }
    }
    if (event.type === "mouseup" || event.type === "keyup") {
      if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") {
        this.shiftMode = false;
        this.keysClass.setShiftMode(false);
        document.querySelectorAll(".key--latter").forEach((keyBlock) => {
          this.keysClass.updateKeyText(keyBlock);
        });
      }
    }
  }

  //------CREATE METHODS-----------------------//
  createAppWrapper() {
    let appWrapper = this.createDomElement("section", "", ["virtual-keyboard"]);
    document.body.prepend(appWrapper);
    return appWrapper;
  }

  createTitleBlok() {
    let titleBlock = this.createDomElement("h1", "Виртуальная клавиатура");
    this.appWrapper.append(titleBlock);
  }

  createTextareaBlock() {
    let textareaBlock = this.createDomElement("textarea", "", ["letter-field"]);
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
    let infoBlock = this.createDomElement("div", "", ["information"]);
    let systemInfoBlock = this.createDomElement(
      "p",
      "Клава сделана под Windows"
    );
    let languageInfoBlock = this.createDomElement("p", "Смена языка Ctr+Alt");
    infoBlock.append(systemInfoBlock);
    infoBlock.append(languageInfoBlock);
    this.appWrapper.append(infoBlock);
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
