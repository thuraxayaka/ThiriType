<template>
  <div class="lg:w-4/5 lg:mx-auto">
    <div className="mt-4">
      <Header />
    </div>
    <div class="mx-auto mt-40 mb-10">
      <Menu
        @getSelectedTime="handleSelectedTime"
        @getSelectedWord="handleSelectedWord"
        @getDifficulty="handleDifficulty"
        @getQuoteSelected="handleQuoteSelected"
        @getOptions="handleSelectedOption"
        :symbol="symbol"
        :number="number"
        :selectedMenuOption="selectedMenuOption"
        :time_constant="time_constant"
        :word_constant="word_constant"
        :difficulty="difficulty"
      />
    </div>
    <div v-if="status !== 'finished'">
      <Typing />
    </div>
    <div v-else>
      <Stats />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import Typing from "@/components/Typing.vue";
import Stats from "@/components/Stats.vue";
import { useTypingStore } from "@/stores/store";
import { toRefs, watch } from "vue";
export default {
  name: "HomeView",
  components: { Header, Typing, Stats, Menu },
  setup() {
    const typingStore = useTypingStore();
    const {
      number,
      symbol,
      difficulty,
      selectedMenuOption,
      word_constant,
      time_constant,
      status,
    } = toRefs(typingStore);

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

    const handleQuoteSelected = (data) => {
      typingStore.$patch({ selectedMenuOption: data });
    };

    const handleDifficulty = (data) => {
      typingStore.$patch({
        selectedMenuOption: data.option,
        difficulty: data.difficulty,
      });
    };
    const restart = () => {
      status.value = "";
    };
    watch(
      [
        () => time_constant.value,
        () => word_constant.value,
        () => selectedMenuOption.value,
        () => symbol.value,
        () => number.value,
        () => difficulty.value,
      ],
      () => {
        typingStore.restart();
      }
    );

    return {
      handleSelectedOption,
      handleSelectedTime,
      handleDifficulty,
      handleQuoteSelected,
      handleSelectedWord,
      symbol,
      number,
      difficulty,
      selectedMenuOption,
      word_constant,
      time_constant,
      status,
    };
  },
};
</script>
