import { KEYBOARD_LAYOUT } from "./keyboardKeys.js";
import { General } from "./General.js";
import { Keys } from "./Keys.js";

class Keyboard extends General {
  constructor(appWrapper = null) {
    super();
    this.shiftMode = false;
    this.capsMode = false;
    this.language = "ru";

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
      if (keyCode === "Space") {
        this.updateTextareaValue(" ");
      } else if (keyCode === "Enter") {
        this.updateTextareaValue("\n");
      } else if (keyCode === "Tab") {
        this.updateTextareaValue("    ", 4);
      } else if (keyCode === "Backspace") {
        this.deleteTextareaValue("Backspace");
      } else if (keyCode === "Delete") {
        this.deleteTextareaValue("Delete");
      } else {
        this.updateTextareaValue(currentKeyBlock.innerHTML);
      }
    }
  }

  updateTextareaValue(addedText = "", textSize = 1) {
    let cursorStart = this.htmlBlocks.Textarea.selectionStart;
    let cursorEnd = this.htmlBlocks.Textarea.selectionEnd;
    let currentValue = this.htmlBlocks.Textarea.value;

    let textBeforeCursor = currentValue.substring(0, cursorStart);
    let textAfterCursor = currentValue.substring(
      cursorEnd,
      currentValue.length
    );

    this.htmlBlocks.Textarea.value =
      textBeforeCursor + addedText + textAfterCursor;
    this.htmlBlocks.Textarea.setSelectionRange(
      cursorStart + textSize,
      cursorStart + textSize
    );
  }

  deleteTextareaValue(deleteType) {
    let cursorStart = this.htmlBlocks.Textarea.selectionStart;
    let cursorEnd = this.htmlBlocks.Textarea.selectionEnd;
    let currentValue = this.htmlBlocks.Textarea.value;

    let cursorShift = 0;
    let textBeforeCursor = currentValue.substring(0, cursorStart);
    let textAfterCursor = currentValue.substring(
      cursorEnd,
      currentValue.length
    );

    if (cursorStart === cursorEnd) {
      if (deleteType === "Backspace") {
        if (textBeforeCursor) {
          cursorShift = -1;
          textBeforeCursor = textBeforeCursor.slice(0, -1);
        }
      } else if (deleteType === "Delete") {
        if (textAfterCursor) textBeforeCursor = textBeforeCursor.slice(0, -1);
      }
    }

    this.htmlBlocks.Textarea.value = textBeforeCursor + textAfterCursor;
    this.htmlBlocks.Textarea.setSelectionRange(
      cursorStart + cursorShift,
      cursorStart + cursorShift
    );
  }

  setCapsMode(capsMode) {
    if (capsMode === false) {
      this.capsMode = true;
      document.querySelector(".key--caps").classList.add("key--caps-active");
    } else {
      this.capsMode = false;
      document.querySelector(".key--caps").classList.remove("key--caps-active");
    }
    this.updateTextInLatterKeys();
  }

  handlerSystemKey(event, keyCode) {
    if (event.type === "mousedown" || event.type === "keydown") {
      if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") {
        this.shiftMode = true;
        this.updateTextInLatterKeys();
      }else if (keyCode === "CapsLock") 
        this.setCapsMode(this.capsMode === true ? false : true);
      }else if (
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
keyboard.initKeyboard();
