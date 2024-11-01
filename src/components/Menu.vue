<template>
  <div :class="['menu', 'flex', 'items-center', 'justify-center', 'mx-auto']">
    <div
      :class="[
        'symbolAndNum',
        selectedMenuOption === 'time' ||
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty'
          ? ''
          : 'hidden',
      ]"
    >
      <div
        :class="[
          'menu-item',
          'cursor-pointer',
          'flex',
          'items-center',
          'justify-center',
          'lg:gap-4',
          'sm:gap-4',
        ]"
      >
        <span
          :class="['menu-text', symbol ? 'active' : '']"
          @click="handleOptionsSelect({ symbol: !symbol, number })"
        >
          <font-awesome-icon :icon="['fas', 'hashtag']" /> symbols
        </span>
        <span
          :class="['menu-text', number ? 'active' : '']"
          @click="handleOptionsSelect({ symbol, number: !number })"
        >
          <font-awesome-icon :icon="['fas', 'arrow-up-1-9']" /> numbers
        </span>
      </div>
    </div>
    <div
      :class="[
        'inline-spacer',
        selectedMenuOption === 'time' ||
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty'
          ? ''
          : 'hidden',
      ]"
    ></div>
    <div class="fixed-menu flex items-center justify-center lg:gap-4 sm:gap-2">
      <span
        :class="['menu-text', selectedMenuOption === 'time' ? 'active' : '']"
        @click="selectedTime()"
      >
        <font-awesome-icon :icon="['fas', 'clock']" /> time
      </span>
      <span
        :class="['menu-text', selectedMenuOption === 'word' ? 'active' : '']"
        @click="selectedWord()"
      >
        <font-awesome-icon :icon="['fas', 'font']" /> word
      </span>
      <span
        :class="['menu-text', selectedMenuOption === 'quote' ? 'active' : '']"
        @click="selectedQuote()"
      >
        <font-awesome-icon :icon="['fas', 'quote-left']" /> quotes
      </span>
      <span
        :class="[
          'menu-text',
          selectedMenuOption === 'difficulty' ? 'active' : '',
        ]"
        @click="selectedDifficulty(difficulty)"
      >
        <font-awesome-icon :icon="['fas', 'star']" /> difficulty
      </span>
    </div>
    <div
      :class="[
        'inline-spacer',
        selectedMenuOption === 'time' ||
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty'
          ? ''
          : 'hidden',
      ]"
    ></div>

    <div
      :class="[
        'timeOpt',
        'menu-item',
        'cursor-pointer',
        'items-center',
        'justify-cetner',
        'lg:gap-6',
        'sm:gap-4',
        selectedMenuOption === 'time' ? '' : 'hidden',
        customTimeBoxActive ? 'custom-box-active' : '',
      ]"
    >
      <span
        :class="['menu-text', timeOption === 1 ? 'active' : '']"
        @click="handleSelectedTime(30)"
        >30</span
      >
      <span
        :class="['menu-text', timeOption === 2 ? 'active' : '']"
        @click="handleSelectedTime(60)"
        >60</span
      >
      <span
        :class="['menu-text', timeOption === 3 ? 'active' : '']"
        @click="handleSelectedTime(90)"
        >90</span
      >

      <span
        :class="[
          'menu-text',
          'custom-box',
          'custom-time',
          timeOption === 4 ? 'active' : '',
        ]"
        @click="handleSelectedTime()"
      >
        <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
      </span>
      <div class="custom-input-box">
        <input
          type="text"
          id="timeInput"
          class="input"
          @keydown.enter="handleTimeInput"
          v-model="customTimeInput"
          :placeholder="time_constant"
        />
      </div>
    </div>
    <div
      :class="[
        'wordOpt',
        'menu-item',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'lg:gap-6',
        'sm:gap-4',
        selectedMenuOption === 'word' ? '' : 'hidden',
        customWordBoxActive ? 'custom-box-active' : '',
      ]"
    >
      <span
        :class="['menu-text', wordOption === 1 ? 'active' : '']"
        @click="handleSelectedWord(50)"
        >50</span
      >
      <span
        :class="['menu-text', wordOption === 2 ? 'active' : '']"
        @click="handleSelectedWord(100)"
        >100</span
      >
      <span
        :class="['menu-text', wordOption === 3 ? 'active' : '']"
        @click="handleSelectedWord(150)"
        >150</span
      >
      <span
        :class="[
          'menu-text',
          'custom-box',
          'custom-word',
          wordOption === 4 ? 'active' : '',
        ]"
        @click="handleSelectedWord()"
      >
        <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
      </span>
      <div class="custom-input-box">
        <input
          type="text"
          id="wordInput"
          @keydown.enter="handleWordInput"
          v-model="customWordInput"
          class="input"
          :placeholder="word_constant"
        />
      </div>
    </div>
    <div
      :class="[
        'difficultyOpt',
        'menu-item',
        'cursor-pointer',
        'items-center',
        'justify-cetner',
        'lg:gap-4',
        'sm:gap-4',
        selectedMenuOption === 'difficulty' ? '' : 'hidden',
      ]"
    >
      <span
        :class="['menu-text', difficulty === 'normal' ? 'active' : '']"
        @click="selectedDifficulty('normal')"
        >normal</span
      >
      <span
        :class="['menu-text', difficulty === 'hard' ? 'active' : '']"
        @click="selectedDifficulty('hard')"
        >hard</span
      >
      <span
        :class="['menu-text', difficulty === 'master' ? 'active' : '']"
        @click="selectedDifficulty('master')"
        >master</span
      >
    </div>
  </div>
</template>
<script>
import { useTypingStore } from "@/stores/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, toRefs } from "vue";

export default {
  props: [
    "selectedMenuOption",
    "number",
    "symbol",
    "time_constant",
    "word_constant",
    "difficulty",
  ],
  emits: [
    "getSelectedTime",
    "getSelectedWord",
    "getDifficulty",
    "getQuoteSelected",
    "getOptions",
  ],
  components: { FontAwesomeIcon },
  setup(props, { emit }) {
    const typingStore = useTypingStore();
    const { word_constant, time_constant } = toRefs(typingStore);
    const customWordBoxActive = ref(false);
    const customTimeBoxActive = ref(false);
    const customWordInput = ref("");
    const customTimeInput = ref("");
    const timeout = ref(null);
    const timeOption = ref(0);
    const wordOption = ref(0);
    const { difficulty, selectedMenuOption } = toRefs(props);

    onMounted(() => {
      handleSelectedWord(word_constant.value);
      handleSelectedTime(time_constant.value);
      setTimeout(() => {
        document.querySelector(".menu").classList.add("active");
      }, 400);
    });

    const selectedTime = (t = null) => {
      if (t == null) t = time_constant;
      emit("getSelectedTime", { option: "time", time: t });
    };
    const selectedWord = (n = null) => {
      if (n === null) n = word_constant;
      emit("getSelectedWord", { option: "word", count: n });
    };
    const handleOptionsSelect = (option) => {
      emit("getOptions", option);
    };
    const selectedDifficulty = (difficulty) => {
      emit("getDifficulty", { option: "difficulty", difficulty });
    };
    const selectedQuote = () => {
      emit("getQuoteSelected", "quote");
    };
    const handleSelectedTime = (t = null) => {
      customTimeBoxActive.value = false;
      if (t !== null) selectedTime(t);
      if (t === 30) {
        timeOption.value = 1;
      } else if (t === 60) {
        timeOption.value = 2;
      } else if (t === 90) {
        timeOption.value = 3;
      } else {
        timeOption.value = 4;
        customTimeBoxActive.value = !customTimeBoxActive.value;
      }
    };
    const handleSelectedWord = (n = null) => {
      customWordBoxActive.value = false;
      if (n !== null) selectedWord(n);
      if (n === 50) {
        wordOption.value = 1;
      } else if (n === 100) {
        wordOption.value = 2;
      } else if (n === 150) {
        wordOption.value = 3;
      } else {
        wordOption.value = 4;
        customWordBoxActive.value = !customWordBoxActive.value;
      }
    };
    const handleTimeInput = (e) => {
      selectedTime(parseInt(customTimeInput.value));
      customTimeInput.value = "";
    };
    const handleWordInput = (e) => {
      //TODO:handle string input
      const input = customWordInput.value;
      let numberOfWord;
      try {
        numberOfWord = parseInt(input, 10);
        if (isNaN(numberOfWord)) {
          throw new Error("Invalid Input: Not a number");
        }
      } catch (err) {
        console.log(err.message);
      }
      selectedWord(numberOfWord);
      customWordInput.value = "";
    };

    return {
      customWordBoxActive,
      customTimeBoxActive,
      customWordInput,
      customTimeInput,
      timeout,
      timeOption,
      wordOption,
      handleWordInput,
      handleTimeInput,
      selectedTime,
      selectedDifficulty,
      selectedQuote,
      selectedWord,
      handleOptionsSelect,
      handleSelectedWord,
      handleSelectedTime,
      difficulty,
      time_constant,
      word_constant,
      selectedMenuOption,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../theme.scss";

.menu {
  background: $Lilac;
  border-radius: 15px;
  width: max-content;
  user-select: none;
  transition: border-radius 0.2s ease-in, opacity 0.4s ease-in;
  color: white;
  font-family: $Poppins;
  opacity: 0;
  &.active {
    opacity: 1;
  }
}
.fixed-menu {
  padding: 10px;
  width: max-content;
  .menu-text {
    &.active {
      color: $Magenta;
      font-weight: bold;
    }
    &:hover {
      cursor: pointer;
    }
  }
}

.timeOpt,
.wordOpt,
.difficultyOpt,
.symbolAndNum {
  transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -o-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -moz-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -webkit-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  max-width: 400px;
  opacity: 1;
  display: flex;
  padding: 10px;
  overflow: hidden;
  animation: appear 0.5s ease-in forwards;
  -o-animation: appear 0.5s ease-in forwards;
  -moz-animation: appear 0.5s ease-in forwards;
  -webkit-animation: appear 0.5s ease-in forwards;

  .menu-text:hover {
    cursor: pointer;
  }
  &.hidden {
    animation: disappear 0.5s ease-out forwards;
    -o-animation: disappear 0.5s ease-out forwards;
    -moz-animation: disappear 0.5s ease-out forwards;
    -webkit-animation: disappear 0.5s ease-out forwards;
    opacity: 0;
    padding: 0;
    border-radius: 0;
  }
}
.timeOpt,
.wordOpt,
.difficultyOpt {
  border-radius: 0 12px 12px 0;

  .menu-text {
    &.active {
      color: $Magenta;
      font-weight: bold;
    }
  }
}
.symbolAndNum {
  border-radius: 12px 0 0 12px;
  margin-left: 12px;
  .menu-text {
    &.active {
      color: $Magenta;
      font-weight: bold;
    }
  }
}
.timeOpt,
.wordOpt {
  &.custom-box-active {
    input {
      animation: inputAppear 0.2s linear forwards;
      max-width: 120px;
      padding-left: 5px;
    }
  }
  input {
    max-width: 0;
    border: none;
    outline: none;
    // padding-left: 5px;
    color: $Magenta;
    border-radius: 2px 5px 5px 2px;
    animation: inputDisappear 0.2s linear forwards;
  }
}
.inline-spacer {
  background: rgba(255, 255, 255, 0.24);
  width: 8px;
  height: 25px;
  border-radius: 12px;

  &.hidden {
    display: none;
  }
}
@-moz-keyframes appear {
  from {
    max-width: 0;
  }
  to {
    max-width: 450px;
  }
}
@keyframes appear {
  from {
    max-width: 0;
  }
  to {
    max-width: 450px;
  }
}

@keyframes disappear {
  to {
    max-width: 0;
  }
  from {
    max-width: 450px;
  }
}
@keyframes inputAppear {
  from {
    max-width: 0;
  }
  to {
    max-width: 120px;
  }
}
@keyframes inputDisappear {
  from {
    max-width: 120px;
  }
  to {
    max-width: 0;
  }
}
</style>
