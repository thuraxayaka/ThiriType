<template>
    <div :class="['menu','flex',
        selectedMenuOption === 'time' || 
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty' ? 'active' : '',
    'items-center','justify-center','mx-auto']">
        <div :class="['symbolAndNum',
            selectedMenuOption === 'time' || 
            selectedMenuOption === 'word' ||
            selectedMenuOption === 'difficulty' ? '' : 'hidden']">
            <div :class="['menu-item','cursor-pointer','flex','items-center','justify-cetner','lg:gap-4','sm:gap-4']">
                <span :class="['menu-text',symbol ? 'active': '']"
                @click="handleOptionsSelect({symbol: !symbol,number})"
                >
                symbols
                </span>
                <span :class="['menu-text',number ? 'active' : '']"
                @click="handleOptionsSelect({symbol,number: !number})"
                >
                numbers
                </span>
            </div>
        </div>
        <div :class="['inline-spacer', selectedMenuOption === 'time' || 
            selectedMenuOption === 'word' ||
            selectedMenuOption === 'difficulty' ? '' : 'hidden']"></div>
        <div class="fixed-menu  flex items-center justify-center lg:gap-4 sm:gap-2">
          
            <span 
            :class="['menu-text',selectedMenuOption === 'time' ? 'active' : '']" 
            @click="selectedTime()">
                time
            </span>
            <span 
            :class="['menu-text',selectedMenuOption === 'word' ? 'active' : '']"
            @click="selectedWord()">
                word
            </span>
            <span 
            :class="['menu-text',selectedMenuOption === 'quote' ? 'active' : '']" 
            @click="selectedQuote()">
                quotes
            </span>
            <span 
            :class="['menu-text',selectedMenuOption === 'difficulty' ? 'active' : '']" 
            @click="selectedDifficulty(difficulty)">
                difficulty
            </span>
            
       </div>
       <div :class="['inline-spacer', selectedMenuOption === 'time' || 
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty' ? '' : 'hidden']"></div>
  
       <div :class="['timeOpt','menu-item','cursor-pointer','items-center','justify-cetner','lg:gap-6','sm:gap-4',
        selectedMenuOption === 'time' ? '' : 'hidden',customTimeBoxActive ? 'custom-box-active' : '']">
                <span :class="['menu-text',timeOption == 1 ? 'active' : ''
                    ]" @click="handleSelectedTime(30)">30</span>
                <span :class="['menu-text',timeOption == 2 ? 'active' : ''
                    ]" @click="handleSelectedTime(60)">60</span>
                <span :class="['menu-text',timeOption == 3 ? 'active' : ''
                    ]" @click="handleSelectedTime(90)">90</span>
               
                <span :class="['menu-text','custom-box','custom-time',timeOption == 4 ? 'active' : '']"
                @click="handleSelectedTime()">
                    custom
                </span>
                <div class="custom-input-box">
                    <input type="text" id="timeInput" class='input' 
                     @keydown.enter="handleTimeInput"
                     v-model="customTimeInput"
                     placeholder="0"/>
                </div>
                
        </div>
       <div :class="['wordOpt','menu-item','cursor-pointer','items-center','justify-cetner','lg:gap-6','sm:gap-4',
        selectedMenuOption === 'word' ? '' : 'hidden',customWordBoxActive ? 'custom-box-active' : '']">
                <span :class="['menu-text',wordOption == 1 ? 'active' : ''
                    ]" @click="handleSelectedWord(50)">50</span>
                <span :class="['menu-text',wordOption == 2 ? 'active' : ''
                    ]" @click="handleSelectedWord(100)">100</span>
                <span :class="['menu-text',wordOption == 3 ? 'active' : ''
                    ]" @click="handleSelectedWord(150)">150</span>
                <span :class="['menu-text','custom-box','custom-word',wordOption == 4  ? 'active' : '']"
                @click="handleSelectedWord()">
                    custom
                </span>
                <div class="custom-input-box">
                    <input type="text" 
                    id="wordInput" 
                    @keydown.enter="handleWordInput"
                    v-model="customWordInput"
                    class='input' 
                    placeholder="0"/>
                </div>
        </div>
       <div :class="['difficultyOpt','menu-item','cursor-pointer','items-center','justify-cetner','lg:gap-4','sm:gap-4',
        selectedMenuOption === 'difficulty' ? '' : 'hidden']">
                <span :class="['menu-text',difficulty == 'normal' ? 'active' : ''
                    ]" @click="selectedDifficulty('normal')">normal</span>
                <span :class="['menu-text',difficulty == 'hard' ? 'active' : ''
                    ]" @click="selectedDifficulty('hard')">hard</span>
                <span :class="['menu-text',difficulty == 'master' ? 'active' : ''
                    ]" @click="selectedDifficulty('master')">master</span>
        </div>
       
       
       
    </div>
 
   
    
</template>
<script>
import {ref, onMounted, toRefs} from 'vue';

export default {
    props: ['selectedMenuOption','number','symbol','time_constant','word_constant','difficulty'],
    emits: ['getSelectedTime', 'getSelectedWord', 'getDifficulty', 'getQuoteSelected', 'getOptions'],
    setup(props,{emit}) {
        const customWordBoxActive = ref(false);
        const customTimeBoxActive = ref(false);
        const customWordInput = ref('');
        const customTimeInput = ref('');
        const timeout = ref(null);
        const timeOption = ref(0);
        const wordOption = ref(0);
        const {difficulty,selectedMenuOption} = toRefs(props);
        
        onMounted(() => {
            handleSelectedWord(props.word_constant);
            handleSelectedTime(props.time_constant);
        }) 

       
        const selectedTime = (t = 60) => {
            emit('getSelectedTime',{option:'time',time:t}); 
            
        };
        const selectedWord = (n = 100) => {
            emit('getSelectedWord',{option: 'word',count: n});
        };
        const handleOptionsSelect = (option) =>{
            emit('getOptions',option);
        };
        const selectedDifficulty = (difficulty) =>{
            emit('getDifficulty',{option:'difficulty',difficulty})
        };
        const selectedQuote = () => {
            emit('getQuoteSelected','quote')
        };
        const handleSelectedTime = (t  = null) => {
            customTimeBoxActive.value = false;
            if(t !== null) selectedTime(t); 
            if(t == 30) {
                timeOption.value = 1;
            }
            else if(t == 60) {
                timeOption.value = 2;
               
            }
            else if(t == 90) {
                timeOption.value = 3; 
            }
            else {
                timeOption.value = 4;
                customTimeBoxActive.value = !customTimeBoxActive.value;
            }    
        };
        const handleSelectedWord = (n  = null) => {
            customWordBoxActive.value = false;
            if(n !== null) selectedWord(n); 
            if(n == 50) {
                wordOption.value = 1;
            }
            else if(n == 100) {
                wordOption.value = 2;
               
            }
            else if(n == 150) {
                wordOption.value = 3; 
            }
            else {
                wordOption.value = 4;
                customWordBoxActive.value = !customWordBoxActive.value;
            }    
        };
        const handleTimeInput = (e) =>  {
            selectedTime(parseInt(customTimeInput.value));
            customTimeInput.value = '';   
        };
        const handleWordInput = (e) => {
            selectedWord(parseInt(customWordInput.value));
            customWordInput.value = ''; 
        };

        return {
            customWordBoxActive,customTimeBoxActive,customWordInput,customTimeInput,timeout,timeOption,wordOption,
            handleWordInput,handleTimeInput,selectedTime,selectedDifficulty,selectedQuote,
            selectedWord,handleOptionsSelect,handleSelectedWord,handleSelectedTime,difficulty,
            selectedMenuOption
        }
    },
  
}
</script>
<style lang="scss" scoped>
@import '../theme.scss';

.menu {
    background: $Lilac;
    border-radius: 15px;
    width: max-content;
    user-select: none;
    transform-style: preserve-3d;
    transition: border-radius 0.2s ease-in;
    perspective: 200px;
    color: white;
    font-family: $Poppins;
    }

    .fixed-menu {
        padding: 10px;
        
        .menu-text {
            &.active {
                color: $Magenta;
                font-weight: semi-bold;
            }
            &:hover {
                cursor: pointer;
            }
        }
    }
    
    .timeOpt,.wordOpt,.difficultyOpt,.symbolAndNum {
        transition: width 0.2s ease-in,border-radius 0.4s ease-in;
        -o-transition: width 0.2s ease-in,border-radius 0.4s ease-in;
        -moz-transition: width 0.2s ease-in,border-radius 0.4s ease-in;
        -webkit-transition: width 0.2s ease-in,border-radius 0.4s ease-in;
        max-width: 400px;
        opacity: 1;
        display: flex;
        padding: 10px;
        overflow: hidden;
        animation: appear 0.4s linear  forwards;
        -o-animation: appear 0.4s linear  forwards;
        -moz-animation: appear 0.4s linear  forwards;
        -webkit-animation: appear 0.4s linear  forwards;
        
        .menu-text:hover {
            cursor: pointer;
        }
        &.hidden {
            animation: disappear 0.1s linear  forwards;
            -o-animation: disappear 0.1s linear  forwards;
            -moz-animation: disappear 0.1s linear  forwards;
            -webkit-animation: disappear 0.1s linear  forwards;
            opacity: 0;
            padding: 0;
            border-radius: 0;
        }
    }
    .timeOpt,.wordOpt,.difficultyOpt {
        border-radius: 0 12px 12px 0;

        .menu-text {
            &.active {
                color: $Magenta;
                font-weight: semibold;
            }
        }
    }
    .symbolAndNum {
        border-radius: 12px 0 0 12px;
        margin-left: 12px;
        .menu-text {
            &.active {
                color: $Magenta;
                font-weight: semibold;
            }
        }
    }
    .timeOpt,.wordOpt {
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
        background: rgba(255,255,255,0.24);
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
            max-width: 400px;
        }
    }
    @keyframes appear {
        from {
            max-width: 0; 
        }
        to {
            max-width: 400px;
        }
    }

    @keyframes disappear {
        to {
            max-width: 0; 
        }
        from {
            max-width: 400px;
        }
    }
    @keyframes inputAppear {
        from {
            max-width: 0;
        }to {
            max-width: 120px;
        }
    }
    @keyframes inputDisappear {
        from {
            max-width: 120px;
        }to {
            max-width: 0;
        }
    }
    

    
   
</style>