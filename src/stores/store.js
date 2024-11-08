import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { generateWords } from "@/utils/GenerateWords";
export const useTypingStore = defineStore("typing-store", () => {
  let testResult = reactive({});
  const charStats = reactive({
    accuracy: 0,
    correct: 0,
    incorrect: 0,
    missing: 0,
    extra: 0,
  });
  const timePassed = ref(0);
  const status = ref("");
  const completeChallenge = ref(false);
  const words = reactive([]);
  const selectedMenuOption = ref("time");
  const symbol = ref(false);
  const number = ref(false);
  const time_constant = ref(30);
  const word_constant = ref(50);
  const quote_constant = ref("short");
  const difficulty = ref("normal");

  const getWords = computed(() => {
    if (selectedMenuOption.value === "word") {
      words.length = 0;
      words.push(
        ...generateWords(word_constant.value, number.value, symbol.value).map(
          (word) => word.val
        )
      );
      return words;
    } else {
      words.length = 0;
      words.push(
        ...generateWords(200, number.value, symbol.value).map(
          (word) => word.val
        )
      );
      return words;
    }
  });

  const generateNewWords = () => {
    words.push(
      ...generateWords(200, number.value, symbol.value).map((word) => word.val)
    );
  };
  const getTimeArr = computed(() => {
    return Object.keys(testResult);
  });

  const getWpmArr = computed(() => {
    return Object.values(testResult).map((res) => res.wpm);
  });

  const getRawArr = computed(() => {
    return Object.values(testResult).map((res) => res.raw);
  });
  const getErrorArr = computed(() => {
    const keys = Object.keys(testResult);
    const values = Object.values(testResult);
    const errArr = [];
    for (let i = 0; i < keys.length - 1; i++) {
      if (values[i].errors !== 0) {
        const obj = { x: keys[i], y: values[i].errors };
        errArr.push(obj);
      }
    }
    return errArr;
  });

  const restart = () => {
    Object.keys(testResult).forEach((key) => delete testResult[key]);
    Object.keys(charStats).forEach((key) => delete charStats[key]);
    timePassed.value = 0;
    status.value = "";
  };

  return {
    testResult,
    charStats,
    timePassed,
    getTimeArr,
    getWpmArr,
    getRawArr,
    getErrorArr,
    restart,
    quote_constant,
    status,
    symbol,
    number,
    time_constant,
    word_constant,
    difficulty,
    selectedMenuOption,
    getWords,
    words,
    completeChallenge,
    generateNewWords,
  };
});
