import { KEYBOARD_LAYOUT } from "./keyboardKeys.js";
import { General } from "./General.js";
import { Keys } from "./Keys.js";

class Keyboard extends General {
  constructor(appWrapper = null) {
    super();
    this.shiftMode = false;
    this.capsMode = false;
    this.language = "ru";
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

    this.updateTextInLatterKeys();

    this.createHandlerOnMouse();
    this.createHandlerOnKey();
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
      this.createKeyboardRowBlock(keyboardBlock, rowKeys);
    });
    this.appWrapper.append(keyboardBlock);
  }

  createKeyboardRowBlock(keyboardBlock, rowKeys) {
    let rowBlock = this.createDomElement("div", "", ["keyboard__row"]);
    rowKeys.forEach((keyCode) => {
      let keyBlock = new Keys(keyCode);
      rowBlock.append(keyBlock.getHtmlCode());
    });

    keyboardBlock.append(rowBlock);
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

  //------UPDATE METHODS-----------------------//
  updateTextInLatterKeys() {
    document.querySelectorAll(".key--latter").forEach((keyBlock) => {
      this.updateKeyText(keyBlock);
    });
  }

  updateKeyText(keyBlock) {
    let keyText = ";";
    if (this.shiftMode) {
      keyText = keyBlock.dataset[`${this.language}Shift`];
      if (this.capsMode) keyText = keyText.toLowerCase();
    } else {
      keyText = keyBlock.dataset[`${this.language}`];
      if (this.capsMode) keyText = keyText.toUpperCase();
    }
    keyBlock.innerText = keyText;
    return;
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
    let keyData = document.querySelector(`[data-key-code="${keyCode}"]`);
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
        this.updateTextInLatterKeys();
      }
      if (keyCode === "CapsLock") {
        if (this.capsMode) {
          this.capsMode = false;
          document
            .querySelector(".key--caps")
            .classList.remove("key--caps-active");
        } else {
          this.capsMode = true;
          document
            .querySelector(".key--caps")
            .classList.add("key--caps-active");
        }
        this.updateTextInLatterKeys();
      }
      if (
        ((keyCode === "AltLeft" || keyCode === "AltRight") && event.ctrlKey) ||
        ((keyCode === "ControlLeft" || keyCode === "ControlRight") &&
          event.altKey)
      ) {
        this.language = this.language === "ru" ? "en" : "ru";
        this.updateTextInLatterKeys();
      }
    }
    if (event.type === "mouseup" || event.type === "keyup") {
      if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") {
        this.shiftMode = false;
        this.updateTextInLatterKeys();
      }
    }
  }
}

let keyboard = new Keyboard();
