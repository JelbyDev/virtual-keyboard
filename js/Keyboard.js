import { KEYBOARD_LAYOUT } from "./keyboardData.js";
import createDomElement from "./generalFunctions.js";
import Keys from "./Keys.js";

class Keyboard {
  constructor() {
    this.shiftMode = false;
    this.capsMode = false;
    this.language = localStorage.getItem("language") ?? "ru";
    this.htmlBlocks = {};
    this.keys = {};
  }

  initKeyboard() {
    this.createAppWrapper();
    this.createTitleBlok();
    this.createTextareaBlock();
    this.createKeyboardBlock();
    this.createInfoBlock();
    this.updateTextOnLetterKeys();
    this.createHandlerOnKeys();
  }

  createAppWrapper() {
    this.htmlBlocks.appWrapper = createDomElement("section", "", [
      "virtual-keyboard",
    ]);
    document.body.prepend(this.htmlBlocks.appWrapper);
  }

  createTitleBlok() {
    const titleBlock = createDomElement("h1", "Virtual keyboard");
    this.htmlBlocks.appWrapper.append(titleBlock);
  }

  createTextareaBlock() {
    const textareaBlock = createDomElement("textarea", "", [
      "letter-field",
    ]);
    this.htmlBlocks.appWrapper.append(textareaBlock);
    this.htmlBlocks.Textarea = textareaBlock;
  }

  createKeyboardBlock() {
    this.htmlBlocks.Keyboard = createDomElement("div", "", ["keyboard"]);
    KEYBOARD_LAYOUT.forEach((rowKeys) => {
      this.createKeyboardRowBlock(rowKeys);
    });
    this.htmlBlocks.appWrapper.append(this.htmlBlocks.Keyboard);
  }

  createKeyboardRowBlock(rowKeys) {
    const rowBlock = createDomElement("div", "", ["keyboard__row"]);
    rowKeys.forEach((keyCode) => {
      this.keys[keyCode] = new Keys(keyCode);
      rowBlock.append(this.keys[keyCode].htmlElement);
    });

    this.htmlBlocks.Keyboard.append(rowBlock);
  }

  createInfoBlock() {
    const infoBlock = createDomElement("div", "", ["information"]);
    const systemInfoBlock = createDomElement("p", "Keyboard for OC Window");
    const languageInfoBlock = createDomElement("p", "Language change: Ctr + Alt");
    infoBlock.append(systemInfoBlock);
    infoBlock.append(languageInfoBlock);
    this.htmlBlocks.appWrapper.append(infoBlock);
  }

  updateTextOnLetterKeys() {
    Object.values(this.keys).forEach((key) => {
      this.updateTextOnKey(key);
    });
  }

  updateTextOnKey(key) {
    if (!key.isLetter()) return false;
    const keyBlock = key.htmlElement;
    let keyText = ";";
    if (this.shiftMode) {
      keyText = keyBlock.dataset[`${this.language}Shift`];
      if (this.capsMode) keyText = keyText.toLowerCase();
    } else {
      keyText = keyBlock.dataset[`${this.language}`];
      if (this.capsMode) keyText = keyText.toUpperCase();
    }
    keyBlock.innerText = keyText;
    return true;
  }

  createHandlerOnKeys() {
    Object.values(this.keys).forEach((activeKey) => {
      const element = activeKey.htmlElement;
      element.addEventListener("mousedown", (event) => this.handlerClickOnKey(event, event.currentTarget.dataset.keyCode));
      element.addEventListener("mouseup", (event) => this.handlerClickOnKey(event, event.currentTarget.dataset.keyCode));
    });
    document.body.addEventListener("keydown", (event) => this.handlerClickOnKey(event, event.code));
    document.body.addEventListener("keyup", (event) => this.handlerClickOnKey(event, event.code));
  }

  handlerClickOnKey(event, keyCode) {
    this.activeKey = (keyCode in this.keys) ? this.keys[keyCode] : false;
    if (!this.activeKey) return false;
    event.preventDefault();
    this.toggleActiveClassOnKey(event);

    const handlerSystemKeys = this.getHandlerListOnSystemKeys();
    if (event.type === "keyup" || event.type === "mouseup") {
      if (this.activeKey.keyCode === "ShiftLeft" || this.activeKey.keyCode === "ShiftRight") {
        this.handlerShiftClick(false);
      } else if (this.activeKey.keyCode === "CapsLock") {
        this.fixMultiKeydownClickOnCaps = false;
      }
    } else if (this.activeKey.keyCode in handlerSystemKeys) {
      handlerSystemKeys[this.activeKey.keyCode](event);
    } else {
      this.updateTextareaValue(this.activeKey.htmlElement.innerHTML);
    }

    return true;
  }

  toggleActiveClassOnKey(event) {
    if (event.type === "mousedown" || event.type === "keydown") {
      this.activeKey.htmlElement.classList.add("key--active");
    }
    if (event.type === "mouseup" || event.type === "keyup") {
      this.activeKey.htmlElement.classList.remove("key--active");
    }
  }

  getHandlerListOnSystemKeys() {
    return {
      ShiftLeft: () => this.handlerShiftClick(true),
      ShiftRight: () => this.handlerShiftClick(true),
      CapsLock: (event) => this.handlerCapsLockClick(event),
      AltLeft: (event) => this.handlerLanguageSwitchClick(event),
      AltRight: (event) => this.handlerLanguageSwitchClick(event),
      ControlLeft: (event) => this.handlerLanguageSwitchClick(event),
      ControlRight: (event) => this.handlerLanguageSwitchClick(event),
      Space: () => this.updateTextareaValue(" "),
      Enter: () => this.updateTextareaValue("\n"),
      Tab: () => this.updateTextareaValue("    ", 4),
      Backspace: () => this.updateTextareaValue("", 0, "Backspace"),
      Delete: () => this.updateTextareaValue("", 0, "Delete"),
    };
  }

  handlerCapsLockClick() {
    if (this.fixMultiKeydownClickOnCaps === true) return false;
    this.fixMultiKeydownClickOnCaps = true;

    this.capsMode = this.capsMode !== true;
    if (this.capsMode === true) {
      this.activeKey.htmlElement.classList.add("key--caps-active");
    } else {
      this.activeKey.htmlElement.classList.remove("key--caps-active");
    }
    this.updateTextOnLetterKeys();
    return true;
  }

  handlerShiftClick(shiftMode) {
    if (shiftMode === this.shiftMode) return false;
    this.shiftMode = shiftMode;
    this.updateTextOnLetterKeys();
    return true;
  }

  handlerLanguageSwitchClick(event) {
    if (
      ((this.activeKey.keyCode === "AltLeft" || this.activeKey.keyCode === "AltRight") && event.ctrlKey)
      || ((this.activeKey.keyCode === "ControlLeft" || this.activeKey.keyCode === "ControlRight")
        && event.altKey)
    ) {
      this.language = this.language === "ru" ? "en" : "ru";
      localStorage.setItem("language", this.language);
      this.updateTextOnLetterKeys();
    }
  }

  updateTextareaValue(addedText = "", cursorShift = 1, deleteMode = false) {
    const cursorStart = this.htmlBlocks.Textarea.selectionStart;
    const cursorEnd = this.htmlBlocks.Textarea.selectionEnd;
    const currentValue = this.htmlBlocks.Textarea.value;
    let currentCursorShift = cursorShift;

    let textBeforeCursor = currentValue.substring(0, cursorStart);
    let textAfterCursor = currentValue.substring(
      cursorEnd,
      currentValue.length,
    );

    if (deleteMode && cursorStart === cursorEnd) {
      if (deleteMode === "Backspace") {
        if (textBeforeCursor) {
          currentCursorShift = -1;
          textBeforeCursor = textBeforeCursor.slice(0, -1);
        }
      } else if (textAfterCursor) {
        textAfterCursor = textAfterCursor.slice(1);
      }
    }

    this.htmlBlocks.Textarea.focus();
    this.htmlBlocks.Textarea.value = textBeforeCursor + addedText + textAfterCursor;
    this.htmlBlocks.Textarea.setSelectionRange(
      cursorStart + currentCursorShift,
      cursorStart + currentCursorShift,
    );
  }
}

export default Keyboard;
