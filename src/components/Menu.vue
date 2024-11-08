<template>
  <div :class="['menu', 'flex', 'items-center', 'justify-center', 'mx-auto']">
    <div
      :class="[
        'symbolAndNum',
        selectedMenuOption === 'time' || selectedMenuOption === 'word'
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
          <font-awesome-icon :icon="['fas', 'arrow-down-1-9']" /> numbers
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
        :class="[
          'menu-text',
          'flex',
          'gap-1',
          'items-center',
          selectedMenuOption === 'time' ? 'active' : '',
        ]"
        @click="selectedTime('select')"
      >
        <font-awesome-icon :icon="['fas', 'clock']" /> time
      </span>
      <span
        :class="[
          'menu-text',
          'flex',
          'items-center',
          'gap-1',
          selectedMenuOption === 'word' ? 'active' : '',
        ]"
        @click="selectedWord('select')"
      >
        <font-awesome-icon :icon="['fas', 'font']" /> word
      </span>
      <span
        :class="[
          'menu-text',
          'flex',
          'items-center',
          'gap-1',
          selectedMenuOption === 'quote' ? 'active' : '',
        ]"
        @click="selectedQuote('select')"
      >
        <font-awesome-icon :icon="['fas', 'quote-left']" /> quotes
      </span>

      <div class="dropdown menu-text flex items-center gap-1">
        <span @click="dropdownActive = !dropdownActive">
          <font-awesome-icon :icon="['fas', 'fa-star']" /> difficulty
        </span>
        <div
          :class="[
            'diff-opt',
            'flex',
            'flex-col',
            'items-center',
            dropdownActive ? '' : 'hide',
          ]"
        >
          <span class="option disabled">Select Difficulty</span>
          <span
            :class="['option', difficulty === 'normal' ? 'active' : '']"
            @click="selectedDifficulty('normal')"
            >normal</span
          >

          <span
            :class="['option', difficulty === 'hard' ? 'active' : '']"
            @click="selectedDifficulty('hard')"
            >hard</span
          >

          <span
            :class="['option', difficulty === 'master' ? 'active' : '']"
            @click="selectedDifficulty('master')"
            >master</span
          >
        </div>
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

    <div
      :class="[
        'timeOpt',
        'menu-item',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'lg:gap-6',
        'sm:gap-4',
        selectedMenuOption === 'time' ? '' : 'hidden',
        customTimeBoxActive ? 'custom-box-active' : '',
      ]"
    >
      <span
        :class="['menu-text', options.time === 1 ? 'active' : '']"
        @click="handleOptions({ time: 30 })"
        >30</span
      >
      <span
        :class="['menu-text', options.time === 2 ? 'active' : '']"
        @click="handleOptions({ time: 60 })"
        >60</span
      >
      <span
        :class="['menu-text', options.time === 3 ? 'active' : '']"
        @click="handleOptions({ time: 90 })"
        >90</span
      >

      <span
        :class="[
          'menu-text',
          'custom-box',
          'custom-time',
          options.time === 4 ? 'active' : '',
        ]"
        @click="handleOptions({ time: 'custom' })"
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
        :class="['menu-text', options.word === 1 ? 'active' : '']"
        @click="handleOptions({ word: 50 })"
        >50</span
      >
      <span
        :class="['menu-text', options.word === 2 ? 'active' : '']"
        @click="handleOptions({ word: 100 })"
        >100</span
      >
      <span
        :class="['menu-text', options.word === 3 ? 'active' : '']"
        @click="handleOptions({ word: 150 })"
        >150</span
      >
      <span
        :class="[
          'menu-text',
          'custom-box',
          'custom-word',
          options.word === 4 ? 'active' : '',
        ]"
        @click="handleOptions({ word: 'custom' })"
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
        'wordOpt',
        'menu-item',
        'cursor-pointer',
        'items-center',
        'justify-center',
        'lg:gap-6',
        'sm:gap-4',
        selectedMenuOption === 'quote' ? '' : 'hidden',
        customQuoteBoxActive ? 'custom-box-active' : '',
      ]"
    >
      <span
        :class="['menu-text', options.quote === 1 ? 'active' : '']"
        @click="handleOptions({ quote: 'short' })"
        >short</span
      >
      <span
        :class="['menu-text', options.quote === 2 ? 'active' : '']"
        @click="handleOptions({ quote: 'medium' })"
        >medium</span
      >
      <span
        :class="['menu-text', options.quote === 3 ? 'active' : '']"
        @click="handleOptions({ quote: 'long' })"
        >long</span
      >
    </div>
  </div>
</template>
<script>
//TODO: handle custom input box not open
import { useTypingStore } from "@/stores/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, onMounted, toRefs, watch, reactive } from "vue";

export default {
  emits: [
    "getSelectedTime",
    "getSelectedWord",
    "getDifficulty",
    "getQuoteSelected",
    "getOptions",
  ],
  components: { FontAwesomeIcon },
  setup() {
    const typingStore = useTypingStore();
    const {
      word_constant,
      time_constant,
      difficulty,
      selectedMenuOption,
      status,
      symbol,
      number,
      quote_constant,
    } = toRefs(typingStore);
    const customWordBoxActive = ref(false);
    const customTimeBoxActive = ref(false);
    const customQuoteBoxActive = ref(false);
    const options = reactive({ time: 1, word: 1, quote: 1 });
    const dropdownActive = ref(false);
    const customWordInput = ref("");
    const customTimeInput = ref("");
    const timeout = ref(null);
    const timeOption = ref(0);
    const wordOption = ref(0);

    onMounted(() => {
      setTimeout(() => {
        document.querySelector(".menu").classList.add("active");
      }, 400);
    });

    watch(
      () => status.value,
      (newVal) => {
        if (newVal === "started") {
          document.querySelector(".menu").classList.remove("active");
        } else {
          document.querySelector(".menu").classList.add("active");
        }
      }
    );

    const selectedTime = (t) => {
      if (t === "select") {
        selectedMenuOption.value = "time";
        return;
      }
      time_constant.value = t;
    };
    const selectedWord = (n) => {
      if (n === "select") {
        selectedMenuOption.value = "word";
        return;
      }
      word_constant.value = n;
    };
    const selectedQuote = (q) => {
      if (q === "select") {
        selectedMenuOption.value = "quote";
        return;
      }
      quote_constant.value = q;
    };
    const handleOptionsSelect = (option) => {
      number.value = option.number;
      symbol.value = option.symbol;
    };
    const selectedDifficulty = (diff) => {
      dropdownActive.value = !dropdownActive;
      difficulty.value = diff;
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

    const handleOptions = (data) => {
      const { time, word, quote } = data;
      if (time) {
        switch (time) {
          case 30: {
            options.time = 1;
            selectedTime(parseInt(time));
            break;
          }
          case 60: {
            options.time = 2;
            selectedTime(parseInt(time));
            break;
          }
          case 90: {
            options.time = 3;
            selectedTime(parseInt(time));
            break;
          }
          case "custom": {
            options.time = 4;
            customTimeBoxActive.value = !customTimeBoxActive.value;
            selectedTime(60);
            break;
          }
        }
      } else if (word) {
        switch (word) {
          case 50: {
            options.word = 1;
            selectedWord(parseInt(word));
            break;
          }
          case 100: {
            options.word = 2;
            selectedWord(parseInt(word));
            break;
          }
          case 150: {
            options.word = 3;
            selectedWord(parseInt(word));
            break;
          }
          case "custom": {
            options.word = 4;
            customWordBoxActive.value = !customWordBoxActive.value;
            selectedWord(60);
            break;
          }
        }
      } else {
        switch (quote) {
          case "short": {
            options.quote = 1;
            selectedQuote(quote);
            break;
          }
          case "medium": {
            options.quote = 2;
            selectedQuote(quote);
            break;
          }
          case "long": {
            options.quote = 3;
            selectedQuote(quote);
            break;
          }
        }
      }
    };

    return {
      handleOptions,
      customWordBoxActive,
      customTimeBoxActive,
      customQuoteBoxActive,
      dropdownActive,
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
      difficulty,
      time_constant,
      word_constant,
      selectedMenuOption,
      status,
      symbol,
      number,
      options,
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
  font-size: 14px;
  opacity: 0;
  &.active {
    opacity: 1;
  }
}
.fixed-menu {
  padding: 10px 15px;
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
.dropdown {
  position: relative;
  z-index: 10;
  label {
    cursor: pointer;
  }
  .diff-opt {
    overflow: hidden;
    max-height: 0;
    border: 5px solid $Lilac;
    position: absolute;
    top: 155%;
    left: -50%;
    width: 180px;
    border-radius: 12px;
    background: $Lilac;
    text-align: center;
    animation: dropdownAppear 0.6s ease-in forwards;
    &.hide {
      animation: dropdownDisappear 0.4s linear forwards;
    }
    .option {
      border-radius: 5px;
      padding: 10px 35px;
      width: 100%;
      transition: color 0.2s ease, background 0.2s ease;
      &.active {
        background: $Magenta;
      }
      &.disabled {
        user-select: none;
        cursor: default;
        padding: 10px 0;
        font-size: 1em;
        color: #ebebe4;
      }
      &:not(.disabled):hover {
        background: white;
        color: $Lilac;
      }
    }
  }
}
.timeOpt,
.wordOpt,
.symbolAndNum {
  transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -o-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -moz-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  -webkit-transition: width 0.4s ease-in, border-radius 0.4s ease-in;
  opacity: 1;
  display: flex;
  padding: 10px 15px;
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
      height: auto;
      padding-left: 5px;
    }
  }
  input {
    max-width: 0;
    border: none;
    outline: none;
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
    max-height: 0;
  }
  to {
    max-width: 500px;
    max-height: max-content;
  }
}
@keyframes appear {
  from {
    max-width: 0;
    max-height: 0px;
  }
  to {
    max-width: 500px;
    max-height: max-content;
  }
}

@keyframes disappear {
  to {
    max-width: 0;
    height: auto;
  }
  from {
    max-width: 500px;
    height: auto;
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
@keyframes dropdownAppear {
  from {
    max-height: 0;
  }
  to {
    max-height: 200px;
  }
}
@keyframes dropdownDisappear {
  from {
    max-height: 200px;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}
</style>
