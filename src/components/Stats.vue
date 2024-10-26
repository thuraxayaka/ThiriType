<template>
    <div class="w-4/5 h-auto mx-auto">
        <Line :data="data" :options="options" />
    </div>
   
   
</template>
<script>
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
        LineController,
        ScatterController,
        Filler,
        elements
    } from 'chart.js'
    import {Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, LineController, LineElement,PointElement,Title,ScatterController, Tooltip, Legend,Filler)
    import  {reactive} from 'vue';
    import { useTestStore } from '@/stores/store.js';
    export default {

        components: {
            Line
        },
        props: [],
        setup(props) {
           
          
            const testStore = useTestStore();
            const data = reactive({
                labels:  testStore.getTimeArr,
                
                datasets: [
                    {   
                        type: 'line',
                        data :  testStore.getWpmArr,
                        label: 'wpm',
                        tension: 0.4,
                        borderColor: '#9966CC',
                        // fill: true,
                        // backgroundColor: '#FF00FF',
                    },
                    {   
                        type: 'line',
                        data :  testStore.getRawArr,
                        label: 'raw',
                        tension: 0.4,
                        borderColor: '#FF69B4',
                        // fill: true,
                        // backgroundColor: '#FF00FF',
                    },
                    {   
                        type: 'scatter',
                        data : testStore.getErrorArr,
                        label: 'errors',
                        backgroundColor: 'rgb(255,0,0)',
                        yAxisID: 'y2'
                        

                    }
                ]
            });
           
            const options = reactive({
                responsive: true,
               
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        position: 'bottom',
                        
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Words Per Minute',
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    },
                    y2 : {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Errors',
                        },
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            })
            // onMounted(() => {
            //    if(chartRef.value) console.log('he');
            // })
            // watch([() => testStore.getTimeArr,() => testStore.getErrorArr, () => testStore.getRawArr, () => testStore.getWpmArr],
            // ([newTimeArr,newErrArr,newRawArr,newWpmArr]) => {
                
            //     data.labels.length = 0;
            //     for(let i=0; i < data.datasets.length-1; i++) {
            //         data.datasets[i].data.length = 0;
            //     }
            //     data.labels.push(...newTimeArr);
            //     document.getElementById('chart').update()

            // })
         

            
            
            return {data,options}
        }

    }
</script>
<style lang="scss" scoped>
@import '../theme.scss';

</style>