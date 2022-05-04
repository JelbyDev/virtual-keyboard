import { KEYBOARD_LAYOUT } from "./keyboardKeys.js";
import { General } from "./General.js";
import { Keys } from "./Keys.js";

class Keyboard extends General {
  constructor(appWrapper = null) {
    super();
    this.shiftMode = false;
    this.capsMode = false;
    this.language = localStorage.getItem("language") ?? "ru";

    this.htmlBlocks = {
      appWrapper: appWrapper
        ? document.querySelector(appWrapper)
        : this.createAppWrapper(),
    };
  }

  initKeyboard() {
    this.createTitleBlok();
    this.createTextareaBlock();
    this.createKeyboardBlock();
    this.createInfoBlock();
    this.updateTextOnLetterKeys();
    this.createHandlerOnKeys();
  }

  //------CREATE HTML STRUCTURE-----------------------//
  createAppWrapper() {
    let appWrapper = this.createDomElement("section", "", ["virtual-keyboard"]);
    document.body.prepend(appWrapper);
    return appWrapper;
  }

  createTitleBlok() {
    let titleBlock = this.createDomElement("h1", "Виртуальная клавиатура");
    this.htmlBlocks.appWrapper.append(titleBlock);
  }

  createTextareaBlock() {
    let textareaBlock = this.createDomElement("textarea", "", ["letter-field"]);
    this.htmlBlocks.appWrapper.append(textareaBlock);
    this.htmlBlocks.Textarea = textareaBlock;
  }

  createKeyboardBlock() {
    let keyboardBlock = this.createDomElement("div", "", ["keyboard"]);
    KEYBOARD_LAYOUT.forEach((rowKeys) => {
      this.createKeyboardRowBlock(keyboardBlock, rowKeys);
    });
    this.htmlBlocks.appWrapper.append(keyboardBlock);
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
    this.htmlBlocks.appWrapper.append(infoBlock);
  }

  //------UPDATE KEYS TEXT-----------------------//
  updateTextOnLetterKeys() {
    document.querySelectorAll(".key--latter").forEach((keyBlock) => {
      this.updateTextOnKey(keyBlock);
    });
  }

  updateTextOnKey(keyBlock) {
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

  //------HANDLERS-----------------------//
  createHandlerOnKeys() {
    document.querySelectorAll(".key").forEach((element) => {
      element.addEventListener("mousedown", (event) => {
        this.handlerClickOnKey(event, event.currentTarget.dataset.keyCode);
      });
      element.addEventListener("mouseup", (event) =>
        this.handlerClickOnKey(event, event.currentTarget.dataset.keyCode)
      );
    });
    document.body.addEventListener("keydown", (event) =>
      this.handlerClickOnKey(event, event.code)
    );
    document.body.addEventListener("keyup", (event) =>
      this.handlerClickOnKey(event, event.code)
    );
  }

  handlerClickOnKey(event, keyCode) {
    let currentKeyBlock = document.querySelector(
      `[data-key-code='${keyCode}']`
    );
    if (!currentKeyBlock) return;

    event.preventDefault();

    this.toggleActiveClassOnKey(event, currentKeyBlock);

    let handlerSystemKeys = this.getHandlerListOnSystemKeys();
    if (event.type === "keyup" || event.type === "mouseup") {
      if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") {
        this.handlerShiftClick(false);
      }
    } else if (handlerSystemKeys.hasOwnProperty(keyCode)) {
      handlerSystemKeys[keyCode](event, keyCode);
    } else {
      this.updateTextareaValue(currentKeyBlock.innerHTML);
    }
  }

  toggleActiveClassOnKey(event, keyBlock) {
    if (event.type === "mousedown" || event.type === "keydown")
      keyBlock.classList.add("key--active");
    if (event.type === "mouseup" || event.type === "keyup")
      keyBlock.classList.remove("key--active");
  }

  getHandlerListOnSystemKeys() {
    return {
      ShiftLeft: (event, keyCode) => this.handlerShiftClick(true),
      ShiftRight: (event, keyCode) => this.handlerShiftClick(true),
      CapsLock: (event, keyCode) => this.handelCapsLockClick(event),
      AltLeft: (event, keyCode) =>
        this.handelLanguageSwitchClick(event, keyCode),
      AltRight: (event, keyCode) =>
        this.handelLanguageSwitchClick(event, keyCode),
      ControlLeft: (event, keyCode) => this.handelLanguageSwitchClick(event),
      ControlRight: (event, keyCode) => this.handelLanguageSwitchClick(event),
      Space: () => this.updateTextareaValue(" "),
      Enter: () => this.updateTextareaValue("\n"),
      Tab: () => this.updateTextareaValue("    ", 4),
      Backspace: () => this.updateTextareaValue("", 0, "Backspace"),
      Delete: () => this.updateTextareaValue("", 0, "Delete"),
    };
  }

  handelCapsLockClick(event) {
    this.capsMode = this.capsMode === true ? false : true;
    if (this.capsMode === true) {
      document.querySelector(".key--caps").classList.add("key--caps-active");
    } else {
      document.querySelector(".key--caps").classList.remove("key--caps-active");
    }
    this.updateTextOnLetterKeys();
  }

  handlerShiftClick(shiftMode) {
    if (shiftMode === this.shiftMode) return false;
    this.shiftMode = shiftMode;
    this.updateTextOnLetterKeys();
  }

  handelLanguageSwitchClick(event, keyCode) {
    if (
      ((keyCode === "AltLeft" || keyCode === "AltRight") && event.ctrlKey) ||
      ((keyCode === "ControlLeft" || keyCode === "ControlRight") &&
        event.altKey)
    ) {
      this.language = this.language === "ru" ? "en" : "ru";
      localStorage.setItem("language", this.language);
      this.updateTextOnLetterKeys();
    }
  }

  updateTextareaValue(addedText = "", cursorShift = 1, deleteMode = false) {
    let cursorStart = this.htmlBlocks.Textarea.selectionStart;
    let cursorEnd = this.htmlBlocks.Textarea.selectionEnd;
    let currentValue = this.htmlBlocks.Textarea.value;

    let textBeforeCursor = currentValue.substring(0, cursorStart);
    let textAfterCursor = currentValue.substring(
      cursorEnd,
      currentValue.length
    );

    if (deleteMode && cursorStart === cursorEnd) {
      if (deleteMode === "Backspace") {
        if (textBeforeCursor) {
          cursorShift = -1;
          textBeforeCursor = textBeforeCursor.slice(0, -1);
        }
      } else {
        if (textAfterCursor) {
          textAfterCursor = textAfterCursor.slice(1);
        }
      }
    }

    this.htmlBlocks.Textarea.value =
      textBeforeCursor + addedText + textAfterCursor;
    this.htmlBlocks.Textarea.setSelectionRange(
      cursorStart + cursorShift,
      cursorStart + cursorShift
    );
  }
}

let keyboard = new Keyboard();
keyboard.initKeyboard();
