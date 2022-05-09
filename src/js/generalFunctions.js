const createDomElement = (tagName, innerText = null, classes = null) => {
  const element = document.createElement(tagName);
  if (innerText) element.innerText = innerText;
  if (classes) element.classList.add(...classes);
  return element;
};

export default createDomElement;
