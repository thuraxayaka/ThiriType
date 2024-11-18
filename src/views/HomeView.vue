<template>
  <div class="lg:w-4/5 lg:mx-auto">
    <div class="mt-2">
      <Header />
    </div>
    <div class="mx-auto mt-10 mb-60">
      <Menu
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "HomeView",
  components: { Header, Typing, Stats, Menu, FontAwesomeIcon },
  setup() {
    const typingStore = useTypingStore();
    const {
      number,
      symbol,
      difficulty,
      selectedMenuOption,
      word_constant,
      time_constant,
      story_constant,
      status,
    } = toRefs(typingStore);

    const restart = () => {
      typingStore.restart();
    };
    watch(
      [
        () => time_constant.value,
        () => word_constant.value,
        () => selectedMenuOption.value,
        () => symbol.value,
        () => number.value,
        () => difficulty.value,
        () => story_constant.value,
      ],
      () => {
        restart();
      }
    );

    return {
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
