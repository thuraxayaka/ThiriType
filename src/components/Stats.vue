<template>
  <div class="stats flex gap-4 mx-auto">
    <div class="flex flex-col gap-2 w-[10%]">
      <div class="flex flex-col gap-1">
        <span class="big-text">WPM</span>
        <span class="ultra-big-text">{{ overallWpm }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="big-text">Accuracy</span>
        <span class="ultra-big-text">{{ accuracy }}%</span>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <div class="h-[300px] w-full">
        <Line :data="data" :options="options" class="h-[300px]" />
      </div>
      <div class="flex items-center flex-col gap-2">
        <div class="flex gap-4 w-full items-start justify-around">
          <div class="flex flex-col items-start">
            <span class="sm-title">test type</span>
            <span class="sm-text">{{ selectedMenuOption }}</span>
            <span class="sm-text">{{ timePassed }}s</span>
            <span class="sm-text">{{ difficulty }}</span>
            <span class="sm-text">{{ completeChallenge ? "" : "failed" }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="sm-title">raw</span>
            <span class="lg-text">{{ overallRaw }}</span>
          </div>
          <div class="flex flex-col items-center characters">
            <span class="sm-title">characters</span>
            <span class="lg-text"
              >{{ correct }}/{{ incorrect }}/{{ missing }}/{{ extra }}</span
            >
            <span class="tooltip">
              correct/incorrect/missing/extra characters
            </span>
          </div>
          <div class="flex flex-col items-center">
            <span class="sm-title">time</span>
            <span class="lg-text">{{ timePassed }}s</span>
          </div>
        </div>

        <div class="flex items-center justify-center mt-4">
          <font-awesome-icon
            :icon="['fas', 'rotate-right']"
            class="reset"
            @click="restart"
          />
        </div>
      </div>
    </div>
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
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  ScatterController,
  Tooltip,
  Legend
);
import { reactive, toRefs } from "vue";
import { useTypingStore } from "@/stores/store.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  components: {
    Line,
    FontAwesomeIcon,
  },
  props: [],
  setup(props) {
    const typingStore = useTypingStore();
    const {
      charStats,
      testResult,
      timePassed,
      difficulty,
      getErrorArr,
      getRawArr,
      getWpmArr,
      selectedMenuOption,
      completeChallenge,
      theme,
    } = toRefs(typingStore);
    const result = Object.values(testResult.value);

    const overallWpm =
      result.length > 0
        ? Math.floor(
            result
              .map((res) => res.wpm)
              .reduce((acc, value) => acc + value, 0) / result.length
          )
        : 0;
    const overallRaw =
      result.length > 0
        ? Math.floor(
            result
              .map((res) => res.raw)
              .reduce((acc, value) => acc + value, 0) / result.length
          )
        : 0;

    const { correct, incorrect, missing, extra, accuracy } = charStats.value;
    const data = reactive({
      labels: typingStore.getTimeArr,

      datasets: [
        {
          type: "line",
          data: getWpmArr,
          label: "wpm",
          tension: 0.4,
          borderColor: "#9966CC",
        },
        {
          type: "line",
          data: getRawArr,
          label: "raw",
          tension: 0.4,
          borderColor: "#ff007c",
        },
        {
          type: "scatter",
          data: getErrorArr,
          label: "errors",
          backgroundColor: "rgb(255,0,0)",
          yAxisID: "y2",
          xAxisID: "x",
          pointStyle: "crossRot",
          pointRadius: 4,
          pointBorderWidth: 2,
          pointBorderColor: "red",
        },
      ],
    });

    const options = reactive({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color:
              theme.value === "Lavender Twilight" ? "#f7f7f7" : "#f7f7f720",
          },
          type: "linear",
          position: "bottom",
          beginAtZero: false,
          ticks: {
            callback: (xValue) => {
              return Number.isInteger(xValue) ? xValue : null;
            },
          },
        },
        y: {
          type: "linear",
          position: "left",
          grid: {
            color:
              theme.value === "Lavender Twilight" ? "#f7f7f7" : "#f7f7f720",
          },
          title: {
            display: true,
            text: "Words Per Minute",
          },
          beginAtZero: true,
        },
        y2: {
          type: "linear",
          position: "right",
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: "Errors",
          },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    });

    const restart = () => {
      typingStore.restart();
    };

    return {
      data,
      options,
      correct,
      incorrect,
      missing,
      extra,
      accuracy,
      testResult,
      timePassed,
      overallWpm,
      overallRaw,
      difficulty,
      selectedMenuOption,
      restart,
      completeChallenge,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../theme.scss";
</style>
