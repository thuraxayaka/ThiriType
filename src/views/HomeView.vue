<template>
  <div class="lg:w-4/5 lg:mx-auto flex flex-col justify-between min-h-screen">
    <div class="mt-8">
      <Header />
      <div class="mt-20">
        <MenuV2 />
      </div>
    </div>

    <div>
      <div v-if="status !== 'finished'">
        <Typing />
      </div>
      <div v-else>
        <Stats />
      </div>
    </div>
    <div class="mb-10">
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import MenuV2 from "@/components/MenuV2.vue";
import Typing from "@/components/Typing.vue";
import Stats from "@/components/Stats.vue";
import Footer from "@/components/Footer.vue";
import TipsBox from "@/components/TipsBox.vue";
import { useTypingStore } from "@/stores/store";
import { toRefs, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "HomeView",
  components: {
    Header,
    Typing,
    Stats,
    FontAwesomeIcon,
    MenuV2,
    TipsBox,
    Footer,
  },
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
