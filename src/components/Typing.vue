<template>
  <div class="flex items-center gap-6">
    <div
      :class="[
        'counter',
        status === 'started' && selectedMenuOption === 'time' ? 'active' : '',
      ]"
    >
      <span class="time">{{ formattedTime }}</span>
    </div>
    <div
      :class="[
        'word-counter',
        status === 'started' &&
        (selectedMenuOption === 'word' || selectedMenuOption === 'story')
          ? 'active'
          : '',
      ]"
    >
      <span class="word-count"
        >{{ currentWordIndex + 1 }}/{{ words.length }}</span
      >
    </div>
    <span :class="['capslock-btn', capslockOn ? 'active' : '']"
      ><font-awesome-icon :icon="['fas', 'lock']" /> Capslock</span
    >
  </div>

  <div class="words-wrapper">
    <div
      :class="[
        'flex',
        'items-center',
        'justify-center',
        'gap-2',
        'blur-screen',
        'cursor-pointer',
        inputFocus ? 'hidden' : '',
      ]"
      @click="focusInput"
    >
      <font-awesome-icon :icon="['fas', 'arrows-to-circle']" />
      <p>Click Here or Press Any Key To Continue</p>
    </div>

    <div class="words flex flex-wrap items-start gap-x-8" @click="focusInput">
      <div
        v-for="(word, idx) in words"
        :ref="(el) => (wordsRef[idx] = el)"
        :key="`word.${idx}.${word}`"
        :class="getWordClassName(word, idx)"
      >
        <span
          v-for="(char, i) in word"
          :key="i"
          :class="getCharacterClassName(word, idx, char, i)"
          >{{ char }}</span
        >
        <span
          v-for="(char, index) in displayExtraCharacter(word, idx)"
          :class="getExtraCharacterClassName(idx, index, word)"
          >{{ char }}</span
        >
      </div>

      <input
        v-model="userInput"
        id="userInput"
        type="text"
        ref="inputRef"
        autocomplete="off"
        @keydown="handleKeyDown"
        @input="handleInputChange"
        @keyup="handleKeyUp"
        @blur="handleBlur"
        @focusin="focusInput"
      />
    </div>
  </div>
  <div
    v-show="status === 'started'"
    class="flex items-center justify-center mt-12"
  >
    <font-awesome-icon
      :icon="['fas', 'rotate-right']"
      class="reset"
      @click="restart"
    />
  </div>
</template>

<script>
import { ref, reactive, watch, computed, onMounted, toRefs } from "vue";

import Menu from "./Menu.vue";
import { useTypingStore } from "@/stores/store.js";
import { utils } from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  components: {
    Menu,
    FontAwesomeIcon,
  },
  setup() {
    const typingStore = useTypingStore();
    const { isObjectEmpty, clearAll } = utils;
    const {
      selectedMenuOption,
      status,
      word_constant,
      time_constant,
      story_constant,
      timePassed,
      symbol,
      number,
      difficulty,
      getWords,
      completeChallenge,
      focus,
    } = toRefs(typingStore);
    const userInput = ref("");
    const words = getWords;
    const currentWordIndex = ref(0);
    const currentCharIndex = ref(-1);
    const currentChar = ref(null);
    const currentRef = ref(null);
    const inputRef = ref(null);
    const wordsRef = reactive([]);
    const capslockOn = ref(false);
    const inputFocus = ref(false);

    const wpmKeyStroke = ref(0);
    const rawKeyStroke = ref(0);
    let wpmHistory = reactive({});
    const prevErrorCount = ref(0);
    const shouldGenerateNewWords = ref(false);
    let charHistory = reactive({});
    let wordHistory = reactive({});
    let correctWords = reactive({});
    let errorWords = reactive({});
    let extraChars = reactive({});

    const intervalId = ref(null);
    const timeoutId = ref(null);
    const currentTime = ref(null);

    onMounted(() => {
      focusInput();
    });
    //Computed Values

    const formattedTime = computed(() => {
      const hour = Math.floor(currentTime.value / 3600);
      const min = Math.floor((currentTime.value % 3600) / 60);
      const sec = Math.floor((currentTime.value % 3600) % 60);
      if (!hour && !min) return sec;
      else if (!hour && min)
        return sec < 10 ? `${min}:0${sec}` : `${min}:${sec}`;
      else {
        if (min < 10) {
          if (sec < 10) return `${hour}:0${min}:0${sec}`;
          else return `${hour}:0${min}:${sec}`;
        } else {
          if (sec < 10) return `${hour}:${min}:0${sec}`;
          else return `${hour}:${min}:${sec}`;
        }
      }
    });

    let charStats = computed(() => {
      const correctCount = Object.values(charHistory).filter(
        (value) => value === true
      ).length;
      const incorrectCount = Object.values(charHistory).filter(
        (value) => value === false
      ).length;
      const missingCharCount = Object.values(charHistory).filter(
        (key) => key === undefined
      ).length;
      const extraCharCount = Object.values(extraChars).reduce(
        (sum, count) => sum + count,
        0
      );
      const accuracy =
        correctCount === 0
          ? 0
          : Math.floor(
              (correctCount /
                (correctCount + incorrectCount + missingCharCount)) *
                100
            );
      return {
        correct: correctCount,
        incorrect: incorrectCount,
        missing: missingCharCount,
        extra: extraCharCount,
        accuracy,
      };
    });

    //watch;
    watch(
      /*check whether user focus is on any of input if so we remove global keydown listener
       */
      () => focus.value,
      (newValue) => {
        if (newValue === true) {
          document.removeEventListener("keydown", focusInput);
        } else {
          document.addEventListener("keydown", focusInput);
        }
      }
    );
    watch(shouldGenerateNewWords, (newValue) => {
      if (newValue) {
        typingStore.generateNewWords();
        shouldGenerateNewWords.value = false;
      }
    });
    watch(currentWordIndex, (newIndex, oldIndex) => {
      if (selectedMenuOption.value === "time") {
        if (currentWordIndex.value === words.value.length - 10) {
          shouldGenerateNewWords.value = true;
        }
      }
      if (currentWordIndex.value === words.value.length) {
        return;
      }
      if (status.value === "started") {
        const prevEle = wordsRef[oldIndex];
        const nextEle = wordsRef[newIndex];
        const prevWordOffset = prevEle.offsetLeft;
        const nextWordOffset = nextEle.offsetLeft;
        if (prevWordOffset > nextWordOffset) {
          prevEle.scrollIntoView();
        }
      }
    });

    const shouldStop = computed(() => {
      if (difficulty.value === "master") {
        if (
          !isObjectEmpty(extraChars) ||
          !Object.values(charHistory).every((isCorrect) => isCorrect)
        ) {
          completeChallenge.value = false;
          return true;
        }
      } else if (difficulty.value === "hard") {
        if (!isObjectEmpty(errorWords)) {
          completeChallenge.value = false;
          return true;
        }
      }
      if (selectedMenuOption.value === "time") {
        debugger;
        if (currentTime.value === 0) {
          completeChallenge.value = true;
          return true;
        }
      }
      if (
        selectedMenuOption.value === "word" ||
        selectedMenuOption.value === "story"
      ) {
        const lastIndex = words.value.length - 1;
        if (currentWordIndex.value === lastIndex) {
          const lastWord = words.value[lastIndex];
          if (currentCharIndex.value === lastWord.length - 1) {
            completeChallenge.value = true;
            return true;
          }
        }
      }

      return false;
    });

    watch(currentTime, () => {
      if (shouldStop.value === true) finish();
      if (wpmKeyStroke.value === 0) {
        return;
      }
      calculateWpm();
    });

    watch(
      [
        () => time_constant.value,
        () => word_constant.value,
        () => selectedMenuOption.value,
        () => symbol.value,
        () => story_constant.value,
        () => number.value,
        () => difficulty.value,
      ],
      () => {
        restart();
      }
    );
    watch([charHistory, extraChars, userInput], () => {
      if (shouldStop.value) finish();
    });
    watch([userInput, currentTime], ([newInput]) => {
      if (status.value === "finished" || !status.value) {
        userInput.value = "";
        return;
      }
      wordHistory[currentWordIndex.value] = newInput.trim();
    });

    const start = () => {
      if (status.value !== "started") typingStore.$patch({ status: "started" });
      startTimer();
    };

    const finish = () => {
      status.value = "finished";
      clearInterval(intervalId.value);
      clearAll(typingStore.charStats);
      clearAll(typingStore.testResult);
      Object.assign(typingStore.charStats, { ...charStats.value });
      Object.assign(typingStore.testResult, { ...wpmHistory });
    };

    const restart = () => {
      currentChar.value = null;
      currentCharIndex.value = -1;
      currentWordIndex.value = 0;
      userInput.value = "";
      currentRef.value = null;
      clearAll(wordHistory);
      clearAll(charHistory);
      clearAll(correctWords);
      clearAll(errorWords);
      clearAll(extraChars);
      clearAll(wpmHistory);

      if (typingStore.restart) {
        typingStore.restart();
      }
      clearTimeout(timeoutId.value);
      clearInterval(intervalId.value);
      currentTime.value = null;
      wordsRef[0].scrollIntoView();
      focusInput();
    };

    const startTimer = () => {
      if (selectedMenuOption.value === "time") {
        currentTime.value = time_constant.value;
        intervalId.value = setInterval(() => {
          if (!inputFocus.value) return; //if not focused pause timer
          currentTime.value--;
        }, 1000);
      } else if (
        selectedMenuOption.value === "word" ||
        selectedMenuOption.value === "story"
      ) {
        currentTime.value = 0;
        intervalId.value = setInterval(() => {
          if (!inputFocus.value) return; // if not focused pause timer
          currentTime.value++;
        }, 1000);
      }
    };

    const calculateWpm = () => {
      let passingTime;
      if (selectedMenuOption.value === "time") {
        passingTime = time_constant.value - currentTime.value;
      } else if (
        selectedMenuOption.value === "word" ||
        selectedMenuOption.value === "story"
      ) {
        passingTime = currentTime.value;
      }
      if (passingTime === 0) return;

      typingStore.timePassed = passingTime;
      const totalCharTyped = Object.keys(charHistory).length;
      const raw = Math.floor(((totalCharTyped / 5) * 60) / passingTime);
      const realWpm = Math.floor(
        ((charStats.value.correct / 5) * 60) / passingTime
      );
      const errors =
        charStats.value.incorrect +
        charStats.value.missing +
        charStats.value.extra -
        prevErrorCount.value;
      prevErrorCount.value += errors;

      wpmHistory[passingTime] = { wpm: realWpm, raw: raw, errors };
    };

    const handleSelectedTime = (data) => {
      typingStore.$patch({
        time_constant: data.time,
        selectedMenuOption: "time",
      });
    };

    const handleSelectedWord = (data) => {
      typingStore.$patch({
        selectedMenuOption: "word",
        word_constant: data.count,
      });
    };

    const handleSelectedOption = (data) => {
      typingStore.$patch({ number: data.number, symbol: data.symbol });
    };

    const handleStorySelected = (data) => {
      typingStore.$patch({ selectedMenuOption: data });
    };

    const handleDifficulty = (data) => {
      typingStore.$patch({
        selectedMenuOption: data.option,
        difficulty: data.difficulty,
      });
    };
    const handleKeyUp = (e) => {
      capslockOn.value = e.getModifierState("CapsLock");
    };
    const handleKeyDown = (e) => {
      if (status.value === "finished") {
        return;
      }

      capslockOn.value = e.getModifierState("CapsLock");
      const key = e.key;

      if (status.value !== "started" && status.value !== "finished") {
        start();
      }

      //handle esc
      if (key === "Escape") {
        return;
      }

      //disable capslock
      if (key === "CapsLock") {
        e.preventDefault();
        return;
      }
      //disable shift alt ctrl
      if (key === "Shift" || key === "Alt" || key === "Control") {
        e.preventDefault();
        return;
      }

      //handle tabs key
      if (key === "Tab") {
        e.preventDefault();
        return;
      }

      //handle backspace
      if (key === "Backspace") {
        // TODO: handle backspace
        const keyString = currentWordIndex.value + "." + currentCharIndex.value;
        let prevWord = wordHistory[currentWordIndex.value - 1] || "";
        if (currentCharIndex.value < 0) {
          //prevent over deleting
          if (currentWordIndex.value - 1 in errorWords) {
            currentWordIndex.value--;
            currentChar.value = "";
            currentCharIndex.value = prevWord.length - 1;
            userInput.value = prevWord + " ";
          }

          return;
        }

        currentCharIndex.value--;
        delete charHistory[keyString];
        currentChar.value = "";
        return;
      }

      //handle space
      if (key === " ") {
        if (currentCharIndex.value === -1) {
          return;
        }
        const isPrevWordCorrect = checkPrevWords();

        if (isPrevWordCorrect) {
          userInput.value = "";
          currentChar.value = "";
        }
        currentCharIndex.value = -1;
        currentWordIndex.value++;
        return;
      }

      if (status.value === "started") {
        rawKeyStroke.value++;
        if (/[0-9a-zA-Z]/.test(key)) {
          wpmKeyStroke.value++;
        }
      }

      currentCharIndex.value = currentCharIndex.value + 1;
      currentChar.value = key;
    };

    const checkPrevWords = () => {
      wpmKeyStroke.value++;
      const correctWord = words.value[currentWordIndex.value];
      const userTypedWord = userInput.value.trim();
      const isCorrect = correctWord === userTypedWord;
      wordHistory[currentWordIndex.value] = userTypedWord;
      if (isCorrect && userTypedWord.length === correctWord.length) {
        correctWords[currentWordIndex.value] = true;

        if (currentWordIndex.value in errorWords) {
          delete errorWords[currentWordIndex.value];
        }
        userInput.value = "";
        return true;
      }

      if (currentWordIndex.value in correctWords) {
        delete correctWords[currentWordIndex.value];
      }
      errorWords[currentWordIndex.value] = false;
      userInput.value = "";
      return false;
    };

    const focusInput = () => {
      focus.value = true;
      inputFocus.value = true;
      clearTimeout(timeoutId.value);
      inputRef.value?.focus();
    };

    const handleBlur = () => {
      focus.value = false;
      timeoutId.value = setTimeout(() => {
        inputFocus.value = false;
      }, 1000);
    };

    const getWordClassName = (word, wordIdx) => {
      if (wordIdx === currentWordIndex.value)
        return "word active-word flex items-center gap-1";

      if (wordIdx in wordHistory) {
        if (word !== wordHistory[wordIdx])
          return "word error-word flex items-center gap-1";
      }
      return "word flex items-center gap-1";
    };

    const getCharacterClassName = (word, wordIdx, char, charIdx) => {
      let keyString = wordIdx + "." + charIdx;

      if (
        wordIdx === currentWordIndex.value &&
        currentCharIndex.value + 1 === charIdx &&
        currentCharIndex.value + 1 !== word.length
      ) {
        return "caret-left char";
      }

      if (charHistory[keyString] === true) {
        if (
          currentCharIndex.value === word.length - 1 &&
          currentCharIndex.value === charIdx &&
          currentWordIndex.value === wordIdx
        ) {
          return " char caret-right correct-char";
        }

        return "correct-char char";
      }
      if (charHistory[keyString] === false) {
        if (
          currentCharIndex.value === word.length - 1 &&
          currentWordIndex.value === wordIdx &&
          currentCharIndex.value === charIdx
        ) {
          return "char caret-right error-char";
        }
        return "error-char char";
      }

      if (
        currentCharIndex.value === charIdx &&
        currentWordIndex.value === wordIdx &&
        currentChar.value
      ) {
        if (currentChar.value === char) {
          charHistory[keyString] = true;
          return "correct-char char";
        } else {
          charHistory[keyString] = false;
          return "error-char char";
        }
      } else {
        if (wordIdx < currentWordIndex.value) {
          charHistory[keyString] = undefined;
        }
      }

      return "char";
    };

    const getExtraCharacterClassName = (wordIdx, extraIdx, word) => {
      let input = wordHistory[wordIdx];
      if (!input) input = userInput.value.trim();
      if (wordIdx > currentWordIndex.value) return null;

      const extraChars = input.substring(word.length);
      if (wordIdx === currentWordIndex.value) {
        if (extraIdx === extraChars.length - 1)
          return "error-char char caret-right";
      }

      return "error-char char";
    };

    const displayExtraCharacter = (word, wordIdx) => {
      let curInput = wordHistory[wordIdx];
      if (!curInput) curInput = userInput.value.trim();
      if (wordIdx > currentWordIndex.value) {
        return null;
      }

      if (curInput.length <= word.length) {
        return null;
      } else {
        const extraWords = curInput.substring(word.length);
        extraChars[wordIdx] = extraWords.length;
        return extraWords.split("");
      }
    };

    return {
      userInput,
      words,
      formattedTime,
      charStats,
      currentWordIndex,
      handleDifficulty,
      handleStorySelected,
      handleSelectedOption,
      handleSelectedWord,
      handleSelectedTime,
      handleKeyDown,
      handleKeyUp,
      inputRef,
      focusInput,
      getWordClassName,
      getCharacterClassName,
      getExtraCharacterClassName,
      displayExtraCharacter,
      wordsRef,
      selectedMenuOption,
      status,
      word_constant,
      time_constant,
      timePassed,
      symbol,
      number,
      difficulty,
      extraChars,
      restart,
      capslockOn,
      inputFocus,
      handleBlur,
    };
  },
};
</script>
