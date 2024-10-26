<template>
  <div class="lg:w-4/5 lg:mx-auto">
    <div className="mt-4">
      <Header/>
    </div>
    <div class="lg:w-[300px] mx-auto mt-40 mb-10">
        <Menu 
        @getSelectedTime="handleSelectedTime"
        @getSelectedWord="handleSelectedWord"
        @getDifficulty="handleDifficulty"
        @getQuoteSelected="handleQuoteSelected"
        @getOptions="handleSelectedOption"
        :symbol="stateStore.symbol" 
        :number="stateStore.number" 
        :selectedMenuOption="stateStore.selectedMenuOption" 
        :time_constant="stateStore.time_constant" 
        :word_constant="stateStore.word_constant"
        :difficulty ="stateStore.difficulty"/>
    </div>
    <div v-if="stateStore.status !== 'finished'">
      <Typing/>
    </div>
    <div v-else>
      <Stats/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';
import Typing from '@/components/Typing.vue';
import Stats from '@/components/Stats.vue';
import { useTypingStateStore } from '@/stores/store';
import { watch } from 'vue';
export default {
  name: 'HomeView',
  components: {Header,Typing,Stats,Menu},
  setup() {
    const stateStore = useTypingStateStore();

    const handleSelectedTime = (data) => {
        // stateStore.setSelectedMenu(data.option);
        // stateStore.time_constant = data.time;
        stateStore.$patch({time_constant: data.time,selectedMenuOption : 'time'})
    }

    const handleSelectedWord = (data) => {
        // stateStore.setSelectedMenu(data.option);
        // stateStore.word_constant = data.count;
        stateStore.$patch({selectedMenuOption: 'word',word_constant : data.count})
    }

    const handleSelectedOption = (data) => {
        // stateStore.number = data.number;
        // stateStore.symbol = data.symbol;

        stateStore.$patch({number: data.number,symbol: data.symbol});
    }

    const handleQuoteSelected = (data) => {
        stateStore.$patch({selectedMenuOption: data});
    }

    const handleDifficulty = (data) => {
        // stateStore.setSelectedMenu(data.option);
        // stateStore.difficulty = data.difficulty;
        stateStore.$patch({selectedMenuOption: data.option,difficulty: data.difficulty});
    }
    const restart = () => {
      stateStore.status = '';
    }
    watch([()=> stateStore.time_constant,() => stateStore.word_constant,() => stateStore.selectedMenuOption,
      () => stateStore.symbol , () => stateStore.number, () =>  stateStore.difficulty
    ],() => {
          restart();
    })


    return {stateStore,handleSelectedOption,handleSelectedTime,handleDifficulty,handleQuoteSelected,handleSelectedWord}
  }
}
</script>
