import {defineStore} from 'pinia';
import {ref,reactive, computed} from 'vue';
export const useTestStore = defineStore('test-store',() => {

    
    let testResult = reactive({});
    const charStats = reactive({accuracy:0,correct:0,incorrect:0,missing:0,extra:0});
    const timePassed = ref(0);


    const getTimeArr = computed(() => {
        return Object.keys(testResult);
    })
    
    const getWpmArr = computed(() => {
        return Object.values(testResult).map((res) => res.wpm);
    })

    const getRawArr = computed(() => {
        return Object.values(testResult).map((res) => res.raw);
    })
    const getErrorArr = computed(() => {
        return Object.values(testResult).map((res) => res.errors);
    })
    



    function clearAll() {
        Object.keys(testResult).forEach((key) => delete testResult[key]);
        Object.keys(charStats).forEach((key) => delete charStats[key]);
    }
    

    

    return {testResult,charStats,timePassed,getTimeArr,getWpmArr,getRawArr,getErrorArr,clearAll};
});






export const useTypingStateStore = defineStore('typing-state-store',() => {
    // TODO: merge other values here
    const status = ref('')
    const selectedMenuOption = ref('time');
    const symbol = ref(false);
    const number = ref(false);
    const time_constant =  ref('30');
    const word_constant =  ref('30');
    const difficulty =  ref('normal');
    

    
    const setSelectedMenu = (value) => {
        console.log(value);
        selectedMenuOption.value = value; 
    }

    const setStatus = (value) => {
        status.value = value;
    }
    
    const setTimeConstant = (value) => {
        time_constant.value = value;
    }
    

    return {
        status,setSelectedMenu,symbol,number,time_constant,word_constant,difficulty,setStatus,setTimeConstant,selectedMenuOption
    }

})




