export const createDomElement = (tagName, innerText = null, classes = null) => {
  const element = document.createElement(tagName);
  if (innerText) element.innerText = innerText;
  if (classes) element.classList.add(...classes);
  return element;
};

export const decodeHtmlSpecialChars = (string) => {
  if (!string) return string;
  const parser = new DOMParser();
  const parserFromString = parser.parseFromString(string, "text/html");
  return parserFromString.body.textContent;
};
