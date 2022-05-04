export class General {
  constructor() {}
  createDomElement(tagName, innerText = null, classes = null) {
    let element = document.createElement(tagName);
    if (innerText) element.innerText = innerText;
    if (classes) element.classList.add(...classes);
    return element;
  }
}
