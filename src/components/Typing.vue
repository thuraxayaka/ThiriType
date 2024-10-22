<template>
    <div class="lg:w-[300px] mx-auto mb-24">
        <Menu 
        @getSelectedTime="handleSelectedTime"
        @getSelectedWord="handleSelectedWord"
        @getDifficulty="handleDifficulty"
        @getQuoteSelected="handleQouteSelected"
        @getOptions="handleSelectedOption"
        :symbol="symbol" 
        :number="number" 
        :selectedMenuOption="selectedMenuOption" 
        :time_constant="time_constant" 
        :word_constant="word_constant"
        :difficulty ="difficulty"/>
    </div>
    <div :class="['counter',status === 'started' ? 'active' : '']">
        <span class="time">{{ formattedTime }}</span> 
    </div>
    <div class="words flex flex-wrap items-start gap-6" @click="focusInput">
        <div v-for="(word,idx) in words" :ref="`word${idx}`" :key="word" :class='getWordClassName(word,idx)'>
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
import { generateWords } from '@/utils/GenerateWords';
import Menu from './Menu.vue';

export default {
    name: "Typing",
    components: {Menu},
    mounted() {
        this.focusInput();
    },
    data() {
        return {
            userInput: '',
            currentWordIndex : 0,
            currentCharIndex : -1,
            currentChar: null,
            currentRef: null,

            wpmKeyStroke: 0,
            rawKeyStroke: 0,
            wpmHistory: {},
            wpm: 0,
            rawWpm: 0,
            prevErrorCount:0,

            shouldGenerateNewWords: false,
            charHistory:{},
            wordHistory: {},
            correctWords: {},
            errorWords: {},
            extraChars: {},

            symbol: false,
            number: false,

            charStats: {},
            status: '',
            intervalId: null,
            currentTime: null,
            
            selectedMenuOption: 'time',
            time_constant: 60,
            word_constant: 50,
            difficulty: 'normal'
        }
    },
    watch: {
        currentWordIndex(newIndex,oldIndex) { // scroll as user types
            if(this.status === 'started') {
                const prevEle = this.$refs[`word${oldIndex}`][0];
                const nextEle = this.$refs[`word${newIndex}`][0];
                const prevWordOffset =prevEle.offsetLeft;
                const nextWordOffset =nextEle.offsetLeft;
                if(prevWordOffset > nextWordOffset) {
                    prevEle.scrollIntoView();
                }

            }
        },
       
       
        currentTime(newVal,oldVal) {
            if(this.status === 'started') {
                if(this.wpmKeyStroke === 0) {
                    return;
                }
                this.calculateWpm();
            }
        },
        userInput(newVal,oldVal) {
            if(this.status  === 'finished') return;
            this.wordHistory[this.currentWordIndex] = newVal.trim();
        },  
        time_constant() {
            this.restart();
        },
        word_constant() {
            this.restart();
        },
        difficulty() {
            this.restart();
        },
        words() {
            this.restart();
        },

        

    },
    computed: {
        words() {
            return generateWords(50,this.number,this.symbol).map((word) =>  word.val);
        },
        formattedTime() {
            const hour = Math.floor(this.currentTime / 3600);
            const min = Math.floor((this.currentTime % 3600)/60);
            const sec = Math.floor((this.currentTime % 3600)%60);
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
        },
        correctCharCount() {
            return Object.values(this.charHistory).filter((value) => value === true).length;
        },
        incorrectCharCount() {
            return  Object.values(this.charHistory).filter((value) => value === false).length;
        },
        missingCharCount() {
            return Object.values(this.charHistory).filter((key) => key === undefined).length;
        },
        extraCharCount() {
            return Object.values(this.extraChars).reduce((sum,count) =>  sum + count,0);
        }
    },
    methods: {
        start() {
            if(this.status !== 'started') {
                this.status = 'started';
            }
            this.timerCounter();
        },
        finish() {
            this.status = 'finished';

            // this.calculateWpm();
        },
        calculateWpm() {
           
            const passingTime = this.time_constant - this.currentTime; //passing time in sec

            if(passingTime === 0 ) return;

            const totalCharTyped =  Object.keys(this.charHistory).length;
            
            const rawWpm = Math.floor(((totalCharTyped/5)*60) / passingTime);
            const realWpm =  Math.floor(((this.correctCharCount/5) * 60) / passingTime);
            const accuracy = this.correctCharCount === 0 ? 0 : Math.floor((this.correctCharCount / (this.correctCharCount+this.incorrectCharCount+this.extraCharCount)) * 100);
            const errors = (this.incorrectCharCount + this.missingCharCount + this.extraCharCount) - this.prevErrorCount;
            this.prevErrorCount += errors;

            this.wpm = realWpm;
            this.rawWpm = rawWpm;
            this.wpmHistory[passingTime] = {wpm: realWpm,raw: rawWpm,errors};
           
            this.charStats = {accuracy,correctCharCount: this.correctCharCount, incorrectCharCount: this.incorrectCharCount, missingCharCount: this.missingCharCount,extraCharCount : this.extraCharCount};
            
        },
        restart() {
            this.status = '';
            this.currentChar = null;
            this.currentCharIndex = -1;
            this.currentWordIndex = 0;
            this.userInput = '';
            this.currentRef = null;
            this.wordHistory = {};
            this.charHistory = {};
            this.errorWords = {};
            this.extraChars= {};
            this.correctWords = {};
            clearInterval(this.intervalId);
            this.currentTime = null;
            this.$refs[`word${0}`][0].scrollIntoView();
            this.focusInput();
        },
        timerCounter() {
            this.currentTime = this.time_constant;
            this.intervalId = setInterval(() => {
                if(this.currentTime === 0) {
                    this.finish();
                    clearInterval(this.intervalId);
                    return;
                }
                this.currentTime--;
            },1000)
        },
        handleSelectedTime(data) {
            this.selectedMenuOption = data.option;
            this.time_constant = data.time;
        },
        handleSelectedWord(data) {
            this.selectedMenuOption = data.option;
            this.word_constant = data.count;
        },
        handleSelectedOption(data) {
            this.number = data.number;
            this.symbol  = data.symbol;
        },
        handleQouteSelected(data) {
            this.selectedMenuOption = data;
        },
        handleDifficulty(data) {
            this.selectedMenuOption = data.option;
            this.difficulty = data.difficulty;
        },
        handleKeyUp(e) {

        },
        handleKeyDown(e) {
            if(this.status === 'finished') {
                return;
            }
            const key = e.key;
            const keyCode = e.keyCode;
            
            if(this.status !== 'started'
            && this.status !== 'finished'
            ) {
                this.start();
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
                const keyString = this.currentWordIndex + "." + this.currentCharIndex;
                let prevWord = this.wordHistory[this.currentWordIndex-1] || '' ;
                if(this.currentCharIndex < 0) { //prevent overdeleting
                    if(this.currentWordIndex-1 in this.errorWords) {
                      
                        
                        this.currentWordIndex--;
                        this.currentChar='';
                        this.currentCharIndex= prevWord.length-1;
                        this.userInput = prevWord + " ";
                       
                    }

                    return;
                }
                
                this.currentCharIndex--;
                delete this.charHistory[keyString];
                
                this.currentChar='';
                return;
            }

            //handle space
            if(keyCode === 32) {
                if(this.currentCharIndex === -1) {
                    return;
                }
                const isPrevWordCorrect = this.checkPrevWords();
                
                if(isPrevWordCorrect) {
                    this.userInput = '';                    
                    this.currentChar = "";
                }
                this.currentCharIndex=-1;
                this.currentWordIndex++;
                return;
            }

            if(this.status === 'started') {
                this.rawKeyStroke++;
                if(keyCode >= 65 && keyCode <= 90) {
                    this.wpmKeyStroke++;
                }

            }

            this.currentCharIndex = this.currentCharIndex+1;
            this.currentChar = key;

        },
        checkPrevWords() {
            this.wpmKeyStroke++;
            const correctWord = this.words[this.currentWordIndex];
            const userTypedWord = this.userInput.trim();
            const isCorrect = correctWord === userTypedWord;
            this.wordHistory[this.currentWordIndex] = userTypedWord;
            if(isCorrect && userTypedWord.length === correctWord.length) {
                this.correctWords[this.currentWordIndex] = true;
                
                if(this.currentWordIndex in this.errorWords) {
                    delete this.errorWords[this.currentWordIndex];
                }
                this.userInput = '';
                return true;
            }
            
            if(this.currentWordIndex in this.correctWords) {
                delete this.correctWords[this.currentWordIndex];
            }
            this.errorWords[this.currentWordIndex] = false;
            this.userInput = '';
            return false;

        },
        focusInput() {
            this.$refs.inputRef.focus();
        },
        getWordClassName(word,wordIdx) {
            if(wordIdx === this.currentWordIndex) return 'word active-word flex items-center gap-1'
            
            if(wordIdx in this.wordHistory) {
                if(word !== this.wordHistory[wordIdx]) return 'word error-word flex items-center gap-1';    
            }
            return 'word flex items-center gap-1'
        },
        getCharacterClassName(word,wordIdx,char,charIdx) {
           let keyString = wordIdx + "." + charIdx;
          
           if(wordIdx === this.currentWordIndex  &&
            this.currentCharIndex+1 === charIdx
            && this.currentCharIndex+1 !== word.length)
            {
             return "caret-left char"; 
           }
           
           if(this.charHistory[keyString] === true) {
            
            if(this.currentCharIndex === word.length-1
                &&
                this.currentCharIndex === charIdx
                && 
                this.currentWordIndex === wordIdx
            ) {
                return ' char caret-right correct-char';
            }
            return 'correct-char char';
           }
           if(this.charHistory[keyString] === false) {
            if(this.currentCharIndex === word.length-1 
                &&
                this.currentWordIndex === wordIdx
                && 
                this.currentCharIndex === charIdx
            ) {
                return 'char caret-right error-char';
            }
            return 'error-char char';
           }
      
        if(this.currentCharIndex === charIdx 
           && this.currentWordIndex === wordIdx
           && this.currentChar
           ) {
             
                if(this.currentChar === char) {
                    this.charHistory[keyString] = true;
                    return 'correct-char char';
                }else {
                    this.charHistory[keyString] = false;
                    return 'error-char char';
                }   
        }else {
            if(wordIdx < this.currentWordIndex) {
                this.charHistory[keyString] = undefined;
            }
        }
      
        return 'char';
           
          
           
           
           
        },
        getExtraCharacterClassName(wordIdx,extraIdx,word) {
            let input = this.wordHistory[wordIdx];
            if(!input) input = this.userInput.trim();
            if(wordIdx > this.currentWordIndex) return null;

            const extraChars = input.substring(word.length);
            if(wordIdx === this.currentWordIndex) {
                if(extraIdx === extraChars.length-1) return 'error-char char caret-right';
            }


            return 'error-char char'
        },
        displayExtraCharacter(word,wordIdx) {
            
            let curInput = this.wordHistory[wordIdx];
            if(!curInput) curInput = this.userInput.trim();
            if(wordIdx > this.currentWordIndex) {
                return null;
            }
           
          
            if(curInput.length <= word.length) {
                return null;
            }else {

                const extraWords = curInput.substring(word.length);
                this.extraChars[wordIdx] = extraWords.length;
                return extraWords.split('');
            }
            
            
        },
        
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