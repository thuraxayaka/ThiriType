import { defineStore } from "pinia";
import { ref, reactive, computed, onMounted } from "vue";
import { generateWords } from "@/utils/GenerateWords";
import generateStory from "@/utils/GenerateStories";
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
  const story_constant = ref("short");
  const difficulty = ref("normal");
  const focus = ref(true);
  const theme = ref("Lavender Twilight");

  onMounted(() => {
    const localTheme = retrieveFromLocalStorage("theme");
    theme.value = localTheme || "Lavender Twilight";
  });
  const getWords = computed(() => {
    if (selectedMenuOption.value === "word") {
      words.length = 0;
      words.push(
        ...generateWords(word_constant.value, number.value, symbol.value).map(
          (word) => word.val
        )
      );
      return words;
    } else if (selectedMenuOption.value === "story") {
      words.length = 0;

      const data = generateStory(story_constant.value);

      const wordsArr = [];
      data?.story.forEach((sentence) => {
        wordsArr.push(...sentence.split(" "));
      });

      words.push(...wordsArr);
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
  const saveToLocalStorage = (data) => {
    if (localStorage.getItem("user")) {
      const prevData = JSON.parse(localStorage.getItem("user"));
      const newData = { ...prevData, ...data };
      localStorage.setItem("user", JSON.stringify(newData));
    }
    localStorage.setItem("user", JSON.stringify(data));
  };
  const retrieveFromLocalStorage = (props = null) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    if (user[props] !== undefined) return user[props];
    return props;
  };
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
  const toKebabCase = (str) => {
    return str.toLowerCase().split(" ").join("-");
  };
  const changeTheme = () => {
    document.body.className = "";
    document.body.classList.add(toKebabCase(theme.value));
    saveToLocalStorage({ theme: theme.value });
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
    story_constant,
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
    saveToLocalStorage,
    retrieveFromLocalStorage,
    focus,
    theme,
    changeTheme,
  };
});
