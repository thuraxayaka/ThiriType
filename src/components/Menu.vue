<template>
    <div :class="['menu','flex',
        selectedMenuOption === 'time' || 
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty' ? 'active' : '',
    'items-center','justify-center','mx-auto']">
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
            @click="selectedDifficulty()">
                difficulty
            </span>
            
       </div>
  
       <div :class="['flexible-menu-right','menu-item','cursor-pointer','flex','items-center','justify-cetner','lg:gap-6','sm:gap-4',
        selectedMenuOption === 'time' ? 'active' : '',customBoxActive ? 'custom-box-active' : '']">
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
       <div :class="['flexible-menu-right','menu-item','cursor-pointer','flex','items-center','justify-cetner','lg:gap-6','sm:gap-4',
        selectedMenuOption === 'word' ? 'active' : '',customBoxActive ? 'custom-box-active' : '']">
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
                    placeholder=""/>
                </div>
        </div>
       <div :class="['flexible-menu-right','menu-item','cursor-pointer','flex','items-center','justify-cetner','lg:gap-4','sm:gap-4',
        selectedMenuOption === 'difficulty' ? 'active' : '']">
                <span :class="['menu-text',difficulty == 'normal' ? 'active' : ''
                    ]" @click="selectedDifficulty('normal')">normal</span>
                <span :class="['menu-text',difficulty == 'hard' ? 'active' : ''
                    ]" @click="selectedDifficulty('hard')">hard</span>
                <span :class="['menu-text',difficulty == 'master' ? 'active' : ''
                    ]" @click="selectedDifficulty('master')">master</span>
        </div>
       
       
       <div :class="['flexible-menu-left',
        selectedMenuOption === 'time' || 
        selectedMenuOption === 'word' ||
        selectedMenuOption === 'difficulty' ? 'active' : '']"
        
        >
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
    </div>

    
</template>
<script>
import {ref, onMounted, toRefs} from 'vue';

export default {
    props: ['selectedMenuOption','number','symbol','time_constant','word_constant','difficulty'],
    emits: ['getSelectedTime', 'getSelectedWord', 'getDifficulty', 'getQuoteSelected', 'getOptions'],
    setup(props,{emit}) {
        const customBoxActive = ref(false);
        const customWordInput = ref('');
        const customTimeInput = ref('');
        const timeout = ref(null);
        const timeOption = ref(0);
        const wordOption = ref(0);
        const {difficulty} = toRefs(props);
        
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
        const selectedDifficulty = (difficulty = 'normal') =>{
            emit('getDifficulty',{option:'difficulty',difficulty})
        };
        const selectedQuote = () => {
            emit('getQuoteSelected','quote')
        };
        const handleSelectedTime = (t  = null) => {
            customBoxActive.value = false;
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
                customBoxActive.value = !customBoxActive.value;
            }    
        };
        const handleSelectedWord = (n  = null) => {
            customBoxActive.value = false;
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
                customBoxActive.value = !customBoxActive.value;
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
            customBoxActive,customWordInput,customTimeInput,timeout,timeOption,wordOption,
            handleWordInput,handleTimeInput,selectedTime,selectedDifficulty,selectedQuote,
            selectedWord,handleOptionsSelect,handleSelectedWord,handleSelectedTime,difficulty
        }
    },
  
}
</script>
<style lang="scss" scoped>
@import '../theme.scss';

    .menu {
        background: $Lilac;
        border-radius: 15px;
        gap: 1rem;
        padding: 10px;
        position: relative;
        user-select: none;
        transform-style: preserve-3d;
        transition: border-radius 0.2s ease-in;
        perspective: 200px;
        .fixed-menu {
            width: 200px;
            .menu-text {
                color: white;
                font-family: $Font;
                transition: transform 0.4s ease;
                &:hover{
                    color: $Rose;
                    cursor:pointer;
                    transform: scale(1.1);
                }
                &.active {
                    color: $Magenta;
                    font-weight: bold;
                }
            }
        }
        &.active {
            border-radius:0;
            &::before {
                content: '';
                position: absolute;
                top: 25%;
                left: 0%;
                width: 3px;
                background: $Magenta;
                height: 25px;
                color: $Magenta;
               
            }
            &::after {
                content: '';
                position: absolute;
                top: 25%;
                right: -0.5%;
                width: 3px;
                background: $Magenta;
                height: 25px;
                color: $Magenta;
               
            }
        }
        .flexible-menu-left {
            position: absolute;
            transition: 0.6s ease-out all;
            background: $Lilac;
            color: white;
            user-select: none;
            right: 40%;
            padding: 10px;
            display: flex;
            transform: translateZ(-1000px);
            align-items: center;
            justify-content: center;
            border-radius: 15px 0 0 15px;
            font-family: $Font;

            &.active {
                right: 100%;
                transform: translateZ(0);
                
                .menu-text {
                    &:hover {
                        color: $Rose;
                    }
                    &.active {
                        color: $Magenta;
                    }
                }
                
            }
        }
        .flexible-menu-right {
            position: absolute;
            transition: 0.6s ease-out all;
            background: $Lilac;
            color: white;
            left: -20%;
            width: 220px;
            user-select: none;
            padding: 10px;
            display: flex;
            transform: translateZ(-1000px);
            align-items: center;
            justify-content: center;
            border-radius: 0 15px 15px 0;
            font-family: $Font;
            transform-style: preserve-3d;
            perspective: 200px;
           
            .custom-input-box {
                    border-radius: 8px;
                    width: 150px;
                    z-index: -99;
                    transform: translateZ(-1000px);
                    color: $Magenta;
                    position: absolute;
                    right: 100%;
                    background: $Lilac;
                    top: 0;
                    transition: 0.6s ease-out all;
                    .input {
                        outline:none;
                        border: none;
                        border-radius: 5px;
                        background: #f5f5f5;
                        width: 100%;
                        padding-left: 10px;
                    }
            }
            

            &.custom-box-active {
                border-radius: 0;    
                .custom-input-box {
                    right:-68%;
                    top:0%;
                    transform: translateZ(0);
                    padding: 10px;
                    border-radius: 0 15px 15px 0;
                }
                
                &::after {
                    content: '';
                    position: absolute;
                    top: 25%;
                    right: -0.5%;
                    width: 3px;
                    background: $Magenta;
                    height: 25px;
                    color: $Magenta;
                }
            }
            
            &.active {
                left: 100%;
                transform: translateZ(0);
                
                .menu-text {
                    &:hover {
                        color: $Rose;
                    }
                    
                    &.active {
                        color: $Magenta;
                    }
                    
                }
               
                
            }
            
        }
       
    }
   
</style>