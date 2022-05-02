export const KEYBOARD_KEYS = [
  [
    //ROW 1
    getKey("ё", "Ё", "`", "~", 192),
    getKey("1", "!", "1", "!", 49),
    getKey("2", '"', "2", "@", 50),
    getKey("3", "№", "3", "#", 51),
    getKey("4", ";", "4", "$", 52),
    getKey("5", "%", "5", "%", 53),
    getKey("6", ":", "6", "^", 54),
    getKey("7", "?", "7", "&", 55),
    getKey("8", "*", "8", "*", 56),
    getKey("9", "(", "9", "(", 57),
    getKey("0", ")", "0", ")", 48),
    getKey("-", "_", "-", "_", 189),
    getKey("=", "+", "=", "+", 187),
    {
      staticText: "Backspace",
      additionalClass: ["key--backspace", "key--flex"],
      code: 8,
    },
  ],
  [
    //ROW 2
    {
      staticText: "Tab",
      additionalClass: ["key--tab,l", "key--flex"],
      code: 9,
    },
    getKey("й", "Й", "q", "Q", 81),
    getKey("ц", "Ц", "w", "W", 87),
    getKey("у", "У", "e", "E", 69),
    getKey("к", "К", "r", "R", 82),
    getKey("е", "Е", "t", "T", 84),
    getKey("н", "Н", "y", "Y", 89),
    getKey("г", "Г", "u", "U", 85),
    getKey("ш", "Ш", "i", "I", 73),
    getKey("щ", "Щ", "o", "O", 79),
    getKey("з", "З", "p", "P", 80),
    getKey("х", "{", "[", "{", 219),
    getKey("ъ", "Ъ", "]", "}", 221),
    getKey("\\", "/", "\\", "|", 220),
    { staticText: "Del", additionalClass: ["key--del", "key--flex"], code: 46 },
  ],

  [
    //ROW 3
    {
      staticText: "CapsLock",
      additionalClass: ["key--caps", "key--flex"],
      code: 20,
    },
    getKey("ф", "Ф", "a", "A", 65),
    getKey("ы", "Ы", "s", "S", 83),
    getKey("в", "В", "d", "D", 68),
    getKey("а", "А", "f", "F", 70),
    getKey("п", "П", "g", "G", 71),
    getKey("р", "Р", "h", "H", 72),
    getKey("о", "О", "j", "J", 74),
    getKey("л", "Л", "k", "K", 75),
    getKey("д", "Д", "l", "L", 76),
    getKey("ж", "Ж", ";", ":", 186),
    getKey("э", "Э", "'", '"', 222),
    {
      staticText: "Enter",
      additionalClass: ["key--enter", "key--flex"],
      code: 20,
    },
  ],

  [
    //ROW 4
    {
      staticText: "Shift",
      additionalClass: ["key--shift", "key--flex"],
      code: "ShiftLeft",
    },
    getKey("я", "Я", "z", "Z", 90),
    getKey("ч", "Ч", "x", "X", 88),
    getKey("с", "С", "c", "C", 67),
    getKey("м", "М", "v", "V", 86),
    getKey("и", "И", "b", "B", 66),
    getKey("т", "Т", "n", "N", 78),
    getKey("ь", "Ь", "m", "M", 77),
    getKey("б", "Б", ",", '<"', 188),
    getKey("ю", "Ю", ".", ">", 190),
    getKey(".", ",", "/", "?", 191),
    getKey("▲", "▲", "▲", "▲", 38),
    {
      staticText: "Shift",
      additionalClass: ["key--shift", "key--flex"],
      code: "ShiftRight",
    },
  ],
  [
    {
      //ROW 5
      staticText: "Ctrl",
      additionalClass: ["key--ctrl"],
      code: "ControlLeft",
    },
    {
      staticText: "Win",
      additionalClass: ["key--shift", "key--flex"],
      code: 91,
    },
    {
      staticText: "Alt",
      additionalClass: ["key--alt", "key--flex"],
      code: "AltLeft",
    },
    {
      staticText: "Space",
      additionalClass: ["key--space"],
      code: 32,
    },
    {
      staticText: "Alt",
      additionalClass: ["key--alt", "key--flex"],
      code: "AltRight",
    },
    getKey("◄", "◄", "◄", "◄", 37),
    getKey("▼", "▼", "▼", "▼", 40),
    getKey("►", "►", "►", "►", 39),
    {
      staticText: "Ctrl",
      additionalClass: ["key--ctrl"],
      code: "ControlRight",
    },
  ],
];

function getKey(ruDefault, ruShift, enDefault, enShift, code) {
  return {
    ruDefault,
    ruShift,
    enDefault,
    enShift,
    code,
  };
}
