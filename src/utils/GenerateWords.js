import wordList from "word-list-json";
import EnglishMostFrequentWords from "@/assets/EnglishMostFrequent.json";
import { generateRandomNumber } from "./generateRand";
const generateWords = (count, number, symbol) => {
  console.log(wordList);
  const wordsArray = [];
  for (let i = 0; i < count; i++) {
    const rand = generateRandomNumber(0, 550);
    let word = EnglishMostFrequentWords[rand].val;
    if (number) {
      word = word + generateRandNum(1, 2);
    }
    if (symbol) {
      word += generateRandSymbol(1, 2);
    }
    wordsArray.push({ key: word, val: word });
  }

  return wordsArray;
};

const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbolArr = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "<",
  ">",
  "/",
  ":",
  ";",
  '"',
  "'",
  "?",
  ",",
  "|",
  ".",
  "{",
  "}",
  "[",
  "]",
  "+",
  "-",
  "_",
];

const generateRandWord = (charArr, min, max) => {
  const charLength = generateRandomNumber(min, max);
  return [...Array(charLength)].reduce((char) => {
    return char + charArr[generateRandomNumber(0, charArr.length - 1)];
  }, "");
};

const generateRandNum = (min, max) => generateRandWord(numArr, min, max);
const generateRandSymbol = (min, max) => generateRandWord(symbolArr, min, max);

export { generateWords };
