<template>
  <div :class="['menu', 'flex', 'items-center', 'mx-auto']">
    <div
      :class="[
        'punctuationPanel',
        'flex',
        'items-center',
        'gap-2',
        selectedMenuOption === 'story' ? 'hidden' : '',
      ]"
    >
      <span
        :class="[selectedOptions.symbol ? 'active' : '', 'text']"
        @click="handleExtraClick('symbol')"
      >
        <font-awesome-icon :icon="['fas', 'hashtag']" /> symbols</span
      >
      <span
        :class="[selectedOptions.number ? 'active' : '', 'text']"
        @click="handleExtraClick('number')"
      >
        <font-awesome-icon :icon="['fas', 'arrow-down-1-9']" /> numbers</span
      >
    </div>

    <div
      :class="[
        'menuPanel',
        'flex',
        'items-center',
        'gap-4',
        selectedMenuOption === 'time' || selectedMenuOption === 'word'
          ? 'active'
          : '',
      ]"
    >
      <span
        :class="[selectedOptions.menu === 'time' ? 'active' : '', 'text']"
        @click="handleSelectedMenu('time')"
        ><font-awesome-icon :icon="['fas', 'clock']" /> time</span
      >
      <span
        :class="[selectedOptions.menu === 'word' ? 'active' : '', 'text']"
        @click="handleSelectedMenu('word')"
        ><font-awesome-icon :icon="['fas', 'font']" /> word</span
      >
      <span
        :class="[selectedOptions.menu === 'story' ? 'active' : '', 'text']"
        @click="handleSelectedMenu('story')"
        ><font-awesome-icon :icon="['fas', 'dragon']" /> story</span
      >
    </div>
    <div
      :class="[
        'chooseOptions',
        'flex',
        'items-center',
        selectedMenuOption === 'story' ? 'hidden' : '',
      ]"
    >
      <div
        v-if="selectedMenuOption === 'time'"
        :class="['timeOptions', 'flex', 'items-center', 'gap-4']"
      >
        <span
          :class="[selectedOptions.option === 30 ? 'active' : '', 'text']"
          @click="handleSelectedOption(30)"
          >30</span
        >
        <span
          :class="[selectedOptions.option === 60 ? 'active' : '', 'text']"
          @click="handleSelectedOption(60)"
          >60</span
        >
        <span
          :class="[selectedOptions.option === 90 ? 'active' : '', 'text']"
          @click="handleSelectedOption(90)"
          >90</span
        >

        <span
          :class="[
            selectedOptions.option !== 30 &&
            selectedOptions.option !== 60 &&
            selectedOptions.option !== 90
              ? 'active'
              : '',
            'text',
          ]"
          @click="handleInputBox"
        >
          <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
        </span>
        <div
          :class="[
            'flex',
            'items-center',
            'gap-4',
            'custom-box',
            selectedOptions.customInputOpen ? 'active' : '',
          ]"
        >
          <input
            type="text"
            id="timeInput"
            v-model="customTimeInput"
            :placeholder="time_constant"
            @focus="handleCustomInputFocus"
            autocomplete="off"
            @keydown.enter="handleSelectedOption({ customTimeInput })"
            @blur="handleBlur"
          />
        </div>
      </div>
      <div
        v-else="selectedMenuOption === 'word'"
        :class="['wordOptions', 'flex', 'items-center', 'gap-4']"
      >
        <span
          :class="[selectedOptions.option === 50 ? 'active' : '', 'text']"
          @click="handleSelectedOption(50)"
          >50</span
        >
        <span
          :class="[selectedOptions.option === 100 ? 'active' : '', 'text']"
          @click="handleSelectedOption(100)"
          >100</span
        >
        <span
          :class="[selectedOptions.option === 150 ? 'active' : '', 'text']"
          @click="handleSelectedOption(150)"
          >150</span
        >
        <span
          :class="[
            selectedOptions.option !== 50 &&
            selectedOptions.option !== 100 &&
            selectedOptions.option !== 150
              ? 'active'
              : '',
            'text',
          ]"
          @click="handleInputBox"
        >
          <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
        </span>
        <div
          :class="[
            'flex',
            'items-center',
            'gap-4',
            'custom-box',
            selectedOptions.customInputOpen ? 'active' : '',
          ]"
        >
          <input
            type="text"
            id="wordInput"
            v-model="customWordInput"
            :placeholder="word_constant"
            @focus="handleCustomInputFocus"
            @blur="handleBlur"
            autocomplete="off"
            @keydown.enter="handleSelectedOption({ customWordInput })"
          />
        </div>
      </div>
    </div>

    <div
      :class="[
        'storyOptions',
        'flex',
        'items-center',
        'gap-4',
        selectedMenuOption === 'story' ? '' : 'hidden',
      ]"
    >
      <span
        :class="[selectedOptions.option === 'short' ? 'active' : '', 'text']"
        @click="handleSelectedOption('short')"
        >short</span
      >
      <span
        :class="[selectedOptions.option === 'medium' ? 'active' : '', 'text']"
        @click="handleSelectedOption('medium')"
        >medium</span
      >
      <span
        :class="[selectedOptions.option === 'long' ? 'active' : '', 'text']"
        @click="handleSelectedOption('long')"
        >long</span
      >
    </div>
    <div
      :class="[
        shouldTipsBoxShow ? 'opacity-100 z-10' : 'opacity-0 -z-10',
        'absolute',
        'top-[140%]',
        'left-[88%]',
        'transition-opacity',
      ]"
    >
      <TipsBox
        message="You can adjust to your liking and press 'Enter'."
        @confirm="closeTipsBox"
      />
    </div>
  </div>
</template>
<script>
import { useTypingStore } from "@/stores/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import TipsBox from "./TipsBox.vue";
import { ref, onMounted, toRefs, watch, reactive } from "vue";

export default {
  name: "MenuV2",
  components: { FontAwesomeIcon, TipsBox },
  setup() {
    const typingStore = useTypingStore();
    const {
      selectedMenuOption,
      story_constant,
      word_constant,
      time_constant,
      symbol,
      number,
      focus,
    } = toRefs(typingStore);
    const selectedOptions = reactive({
      menu: "time",
      option: 30,
      number: false,
      symbol: false,
      customInputOpen: false,
    });
    const shouldTipsBoxShow = ref(false);
    const closeTipsBox = () => {
      typingStore.saveToLocalStorage({ newToHere: false });
      shouldTipsBoxShow.value = false;
    };

    const customTimeInput = ref("");
    const customWordInput = ref("");

    const handleSelectedMenu = (option) => {
      selectedMenuOption.value = option;
      selectedOptions.menu = option;
    };

    const handleSelectedOption = (option = null) => {
      if (option === null) return;
      if (selectedOptions.menu === "time") {
        let input;
        if (typeof option === "object") {
          // handle custom input and close the input box
          selectedOptions.customInputOpen = false;
          input = option.customTimeInput;
        } else {
          input = option;
        }
        const intValue = parseInt(input);
        time_constant.value = intValue;
        selectedOptions.option = intValue;
      } else if (selectedOptions.menu === "word") {
        let input;
        if (typeof option === "object") {
          // handle custom input and close the input box
          selectedOptions.customInputOpen = false;
          input = option.customWordInput;
        } else {
          input = option;
        }
        const intValue = parseInt(input);
        word_constant.value = intValue;
        selectedOptions.option = intValue;
      } else {
        story_constant.value = option;
        selectedOptions.option = option;
      }
    };

    const handleInputBox = () => {
      const newToHere =
        typingStore.retrieveFromLocalStorage("newToHere") ?? true;
      shouldTipsBoxShow.value = newToHere ? true : false;
      selectedOptions.customInputOpen = !selectedOptions.customInputOpen;
      handleSelectedOption();
    };

    const handleExtraClick = (option) => {
      switch (option) {
        case "symbol":
          selectedOptions.symbol = !symbol.value;
          symbol.value = !symbol.value;
          break;
        case "number":
          selectedOptions.number = !number.value;
          number.value = !number.value;
          break;
        default:
          symbol.value = false;
          number.value = false;
      }
    };
    const handleCustomInputFocus = () => {
      focus.value = true;
      if (selectedMenuOption.value === "time") {
        document.querySelector("#timeInput").select();
      } else if (selectedMenuOption.value === "word") {
        document.querySelector("#wordInput").select();
      }
    };
    const handleBlur = () => {
      focus.value = false;
    };
    watch(
      () => selectedMenuOption.value,
      (newValue) => {
        if (newValue === "time") {
          selectedOptions.option = time_constant.value;
        } else if (newValue === "word") {
          selectedOptions.option = word_constant.value;
        } else {
          selectedOptions.option = story_constant.value;
        }
      }
    );
    return {
      time_constant,
      word_constant,
      selectedMenuOption,
      selectedOptions,
      handleInputBox,
      handleSelectedOption,
      handleSelectedMenu,
      handleExtraClick,
      customTimeInput,
      customWordInput,
      shouldTipsBoxShow,
      closeTipsBox,
      handleCustomInputFocus,
      handleBlur,
    };
  },
};
</script>
