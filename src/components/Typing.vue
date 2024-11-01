<template>
    <!-- <div class="lg:w-[300px] mx-auto mb-24">
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
    </div> -->
    <div :class="['counter',stateStore.status === 'started' ? 'active' : '']">
        <span class="time">{{ formattedTime }}</span> 
    </div>
    <div class="words flex flex-wrap items-start gap-6" @click="focusInput">
        <div v-for="(word,idx) in words" :ref="(el) => wordsRef[idx] = el" :key="`word.${idx}.${word}`" :class='getWordClassName(word,idx)'>
            <span v-for="(char,i) in word" :key="i" :class="getCharacterClassName(word,idx,char,i)">{{char}}</span>
            <span v-for="(char,index) in displayExtraCharacter(word,idx)" :class="getExtraCharacterClassName(idx,index,word)">{{ char }}</span>
        </div>
        <input v-model="userInput"
        id="userinput" 
        type="text" 
        ref="inputRef"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
        />
    </div>
   
  
    
</template>

<script>
import {ref,reactive,watch,computed, onMounted} from 'vue';
import { generateWords } from '@/utils/GenerateWords';
import Menu from './Menu.vue';
import {useTestStore,useTypingStateStore} from '@/stores/store.js';


export default {
    components: {
        Menu
    },
    setup() {
    const stateStore = useTypingStateStore();
    const testStore = useTestStore();
    const userInput = ref('');
    const currentWordIndex = ref(0);
    const currentCharIndex = ref(-1);
    const currentChar = ref(null);
    const currentRef = ref(null);
    const inputRef = ref(null);
    const wordsRef = ref([]);

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
    const currentTime = ref(null);

 

    onMounted(() => {
        focusInput();
    })
    //Computed Values
    const words = computed(() => generateWords(50,stateStore.number,stateStore.symbol).map((word) => word.val));
    const formattedTime = computed(() => {
        const hour = Math.floor(currentTime.value / 3600);
        const min = Math.floor((currentTime.value % 3600)/60);
        const sec = Math.floor((currentTime.value % 3600)%60);
        if(!hour && !min) return sec;
        else if(!hour && min)   return sec < 10 ? `${min}:0${sec}`: `${min}:${sec}`;
        else {
            if(min < 10) {
                if(sec < 10)  return `${hour}:0${min}:0${sec}`;
                else return `${hour}:0${min}:${sec}`;
            }else {
                if(sec < 10)  return `${hour}:${min}:0${sec}`;
                else return `${hour}:${min}:${sec}`;
            }
        }
    });

    let charStats = computed(() => {
        const correctCount = Object.values(charHistory).filter((value) => value === true).length;
        const incorrectCount = Object.values(charHistory).filter((value) => value === false).length;
        const missingCharCount = Object.values(charHistory).filter((key) => key === undefined).length;
        const extraCharCount = Object.values(extraChars).reduce((sum,count) =>  sum + count,0);
        const accuracy = correctCount === 0 ? 0 : Math.floor((correctCount / (correctCount+incorrectCount+missingCharCount)) * 100);
        return {correct:correctCount,incorrect: incorrectCount,missing: missingCharCount,extra : extraCharCount,accuracy };
    });


    //watch 
    watch(currentWordIndex,(newIndex,oldIndex) => {
        if(stateStore.status === 'started') {
            const prevEle = wordsRef.value[oldIndex];
            const nextEle = wordsRef.value[newIndex];
            const prevWordOffset =prevEle.offsetLeft;
            const nextWordOffset =nextEle.offsetLeft;
            if(prevWordOffset > nextWordOffset) {
                prevEle.scrollIntoView();
            }

        }
    })


    watch(currentTime,() => {
        if(stateStore.status === 'started') {
                if(wpmKeyStroke.value === 0) {
                    return;
                }
                calculateWpm();
            }
    })

   watch([()=> stateStore.time_constant,() => stateStore.word_constant,() => stateStore.selectedMenuOption,
    () => stateStore.symbol , () => stateStore.number, () =>  stateStore.difficulty
   ],() => {
        restart();
  
   })

    stateStore.$subscribe((mutation,state) => {
        if(mutation.events.includes('status')) console.log(mutation.events);
        // restart();
    })

    watch(userInput,(newVal,oldVal) => {
        if(stateStore.status  === 'finished') return;
        wordHistory[currentWordIndex.value] = newVal.trim();
    })
    //methods 

    const start = () => {
        if(stateStore.status !== 'started') stateStore.$patch({status: 'started'});
        
        timerCounter();
    }

    const finish = () => {
        
        stateStore.setStatus('finished');
        Object.assign(testStore.charStats,{...charStats.value});
        Object.assign(testStore.testResult,{...wpmHistory});
    }

    const restart = () => {
        stateStore.status = '';
        currentChar.value = null;
        currentCharIndex.value = -1;
        currentWordIndex.value = 0;
        userInput.value = '';
        currentRef.value = null;
        wordHistory = {};
        charHistory = {};
        correctWords = {};
        errorWords = {};
        extraChars = {};
        wpmHistory = {};
        if(testStore.clearAll) {
            testStore.clearAll();
        }
        
        clearInterval(intervalId.value);
        currentTime.value = null;
        wordsRef.value[0].scrollIntoView();
        focusInput();
    }

    const timerCounter = () => {
        currentTime.value =  stateStore.time_constant;
        intervalId.value = setInterval(() => {
            if(currentTime.value === 0) {
                finish();
                clearInterval(intervalId.value);
                return;
            }
            currentTime.value--;
        },1000);
    }

    const calculateWpm = () => {
        const passingTime = stateStore.time_constant - currentTime.value; 
        if(passingTime === 0 ) return;
        testStore.timePassed = passingTime;
        const totalCharTyped =  Object.keys(charHistory).length;
        const raw = Math.floor(((totalCharTyped/5)*60) / passingTime);
        const realWpm =  Math.floor(((charStats.value.correct/5) * 60) / passingTime);
        const errors = (charStats.value.incorrect + charStats.value.missing+ charStats.value.extra) - prevErrorCount.value;
        prevErrorCount.value += errors;

        
        wpmHistory[passingTime] = {wpm: realWpm,raw: raw,errors};

       
    }

    const handleSelectedTime = (data) => {
        stateStore.$patch({time_constant: data.time,selectedMenuOption : 'time'})
    }

    const handleSelectedWord = (data) => {
        stateStore.$patch({selectedMenuOption: 'word',word_constant : data.count})
    }

    const handleSelectedOption = (data) => {
        stateStore.$patch({number: data.number,symbol: data.symbol});
    }

    const handleQuoteSelected = (data) => {
        stateStore.$patch({selectedMenuOption: data});
    }

    const handleDifficulty = (data) => {
        stateStore.$patch({selectedMenuOption: data.option,difficulty: data.difficulty});
    }

    const handleKeyUp = (e) => {

    }

    const handleKeyDown = (e) => {
        if(stateStore.status === 'finished') {
                return;
            }
            const key = e.key;
            const keyCode = e.keyCode;
            
            if(stateStore.status !== 'started'
            && stateStore.status !== 'finished'
            ) {
                start();
            }
            
          
            //handle esc
            if(keyCode === 27) {
                return;
            }

            //disable capslock
            if(keyCode === 20 ) {
                e.preventDefault();
                return;
            }
            //disable shift alt ctrl
            if(keyCode >= 16 && keyCode <= 18) {
                e.preventDefault();
                return;
            }

            //handle tabs key
            if(keyCode == 9) {
                e.preventDefault();
                return;
            }
            
            //handle backspace
            if(keyCode === 8) {
                const keyString = currentWordIndex.value + "." + currentCharIndex.value;
                let prevWord = wordHistory[currentWordIndex.value-1] || '' ;
                if(currentCharIndex.value < 0) { //prevent overdeleting
                    if(currentWordIndex.value-1 in errorWords) {
                      
                        
                        currentWordIndex.value--;
                        currentChar.value='';
                        currentCharIndex.value= prevWord.length-1;
                        userInput.value = prevWord + " ";
                       
                    }

                    return;
                }
                
                currentCharIndex.value--;
                delete charHistory[keyString];
                
                currentChar.value='';
                return;
            }

            //handle space
            if(keyCode === 32) {
                if(currentCharIndex.value === -1) {
                    return;
                }
                const isPrevWordCorrect = checkPrevWords();
                
                if(isPrevWordCorrect) {
                    userInput.value = '';                    
                    currentChar.value = "";
                }
                currentCharIndex.value=-1;
                currentWordIndex.value++;
                return;
            }

            if(stateStore.status === 'started') {
                rawKeyStroke.value++;
                if(keyCode >= 65 && keyCode <= 90) {
                    wpmKeyStroke.value++;
                }

            }

            currentCharIndex.value = currentCharIndex.value+1;
            currentChar.value = key;
    }

    const checkPrevWords = () => {
        wpmKeyStroke.value++;
        const correctWord = words[currentWordIndex.value];
        const userTypedWord = userInput.value.trim();
        const isCorrect = correctWord === userTypedWord;
        wordHistory[currentWordIndex.value] = userTypedWord;
        if(isCorrect && userTypedWord.length === correctWord.length) {
            correctWords[currentWordIndex.value] = true;
            
            if(currentWordIndex.value in errorWords) {
                delete errorWords[currentWordIndex.value];
            }
            userInput.value = '';
            return true;
        }
        
        if(currentWordIndex.value in correctWords) {
            delete correctWords[currentWordIndex.value];
        }
        errorWords[currentWordIndex.value] = false;
        userInput.value = '';
        return false;
    }

    const focusInput = () => {
        inputRef.value.focus();
    }

    const getWordClassName = (word,wordIdx) => {
        if(wordIdx === currentWordIndex.value) return 'word active-word flex items-center gap-1'
            
        if(wordIdx in wordHistory) {
            if(word !== wordHistory[wordIdx]) return 'word error-word flex items-center gap-1';    
        }
        return 'word flex items-center gap-1'
    }

    const getCharacterClassName = (word,wordIdx,char,charIdx) => {
        let keyString = wordIdx + "." + charIdx;
          
        if(wordIdx === currentWordIndex.value  &&
        currentCharIndex.value+1 === charIdx
        && currentCharIndex.value+1 !== word.length)
        {
        return "caret-left char"; 
        }
        
        if(charHistory[keyString] === true) {
        
        if(currentCharIndex.value === word.length-1
            &&
            currentCharIndex.value === charIdx
            && 
            currentWordIndex.value === wordIdx
        ) {
            return ' char caret-right correct-char';
        }
        return 'correct-char char';
        }
        if(charHistory[keyString] === false) {
        if(currentCharIndex.value === word.length-1 
            &&
            currentWordIndex.value === wordIdx
            && 
            currentCharIndex.value === charIdx
        ) {
            return 'char caret-right error-char';
        }
        return 'error-char char';
        }
    
        if(currentCharIndex.value === charIdx 
            && currentWordIndex.value === wordIdx
            && currentChar.value
            ) {
            
                if(currentChar.value === char) {
                    charHistory[keyString] = true;
                    return 'correct-char char';
                }else {
                    charHistory[keyString] = false;
                    return 'error-char char';
                }   
        }else {
            if(wordIdx < currentWordIndex.value) {
                charHistory[keyString] = undefined;
            }
        }
    
        return 'char';
         
    }

    const getExtraCharacterClassName = (wordIdx,extraIdx,word) => {
        let input = wordHistory[wordIdx];
        if(!input) input = userInput.value.trim();
        if(wordIdx >currentWordIndex.value) return null;

        const extraChars = input.substring(word.length);
        if(wordIdx === currentWordIndex.value) {
            if(extraIdx === extraChars.length-1) return 'error-char char caret-right';
        }


        return 'error-char char'
    }
    
    const displayExtraCharacter = (word,wordIdx) => {
        let curInput = wordHistory[wordIdx];
        if(!curInput) curInput = userInput.value.trim();
        if(wordIdx > currentWordIndex.value) {
            return null;
        }
        
        
        if(curInput.length <= word.length) {
            return null;
        }else {
            const extraWords = curInput.substring(word.length);
            extraChars[wordIdx] = extraWords.length;
            return extraWords.split('');
        }
    }
    return {
        userInput,words,formattedTime,charStats,handleDifficulty,handleQuoteSelected,handleSelectedOption,
        handleSelectedWord,handleSelectedTime,handleKeyUp,handleKeyDown,
        inputRef,focusInput,getWordClassName,getCharacterClassName,getExtraCharacterClassName,
        displayExtraCharacter,wordsRef,testStore,stateStore

    }
    
    }
}
</script>

<style lang="scss" scoped> 
@import '../theme.scss';
@keyframes expand {
    0% {
        height:0;
        opacity: 0;
        
    }
    100% {
        height: 2px;
        opacity: 1;
    }
}
    .counter {
        padding-left: 20px;
        display: none;
        &.active {
            display: block;
            .time {
                color: $Orchid;
                font-family: $Font;
                font-size: 40px;
                font-weight: semi-bold;
            }
        }
    }
    .words {
        position: realtive;
        border-radius: 12px;
        // background: #F0F0F0;
        height: 210px;
        overflow: hidden;
        font-family: $Font;
        font-size: 2em;
        padding: 20px;
        
        letter-spacing: -0.1em;
        .word{
            color: $Lilac;
            
            &.active-word {
                border-bottom:1px solid $Amethyst;
            }
            &.error-word {
                border-bottom:1px solid red;
            }
            .char{
                position: relative;
                &.caret-left {
                    display: inline-block;
                    &::before{
                        content: "|";
                        color: $DarkerOrchid;
                        width:5px;
                        height: 5px;
                        position: absolute;
                        top: -5%;
                        left: -60%;
                        animation: expand 1s infinite ease-out;
                    }
                }

                &.caret-right {
                    &::after {
                        content: "|";
                        width: 2px;
                        color: $DarkerOrchid;
                        height: 5px;
                        position: absolute;
                        top: -5%;
                        right:25%;
                        animation: expand 1s infinite ease-out;
                    }
                }
                &.correct-char {
                    color: $Amethyst;
                }
                &.error-char {
                    color: $HotPink;
                }
                &.extra-char {
                    color: $Magenta;
                }
            }
        }
        #userinput {
            opacity:0;
            position: absolute;
            z-index: 2;
        }
    }
</style>