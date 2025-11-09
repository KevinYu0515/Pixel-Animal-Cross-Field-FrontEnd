<template>
  <Line :key="chartKey" :data="chartData" :options="chartOptions" />
</template>

<script setup lang="js">
import { ref, watch, toRaw, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { easingEffects } from 'chart.js/helpers'
import 'chartjs-adapter-date-fns'
import { generateExampleData, densifyData } from '@/utils/geneateData'

const chartKey = ref(0);
const totalDuration = 10000;
const delayBetweenPoints = ref(0);
let restart = false;
const defaultData = ref(generateExampleData());
const props = defineProps({
  data: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  label: { type: String, default: '' }
})

const chartData = computed(() => ({
  datasets: [
    {
      label: props.label || '比例 (%)',
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66,165,245,0.2)',
      data: props.data.length === 0 ? defaultData.value : props.data,
      tension: 0.3,
      fill: true,
      borderWidth: 2,
      pointRadius: (ctx) => {
        const { x, y } = ctx.parsed;
        const isDefault = defaultData.value.some(p => p.x === x && p.y === y);
        return isDefault ? 4 : 0;
      },
    }
  ]
}))

const scales = {
  x: {
    type: 'time',
    time: {
      parser: (v) => new Date(v),
      unit: 'second',
      displayFormats: { second: 'HH:mm:ss', minute: 'HH:mm' }
    },
    ticks: { autoSkip: true, maxTicksLimit: 6 },
    title: { display: true, text: '時間 (HH:mm:ss)' }
  },
  y: {
    min: 0,
    max: 100,
    ticks: { stepSize: 10 },
    title: { display: true, text: '比例 (%)' }
  }
}

const previousY = (ctx) => {
  const firstY = ctx.chart.scales.y.getPixelForValue(ctx.dataset.data[0].y)
  return ctx.index === 0
    ? firstY
    : ctx.chart.getDatasetMeta(ctx.datasetIndex)
      .data[ctx.index - 1]
      .getProps(['y'], true).y
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints.value,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) return 0
        ctx.xStarted = true
        return ctx.index * delayBetweenPoints.value
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints.value,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) return 0
        ctx.yStarted = true
        return ctx.index * delayBetweenPoints.value
      }
    }
  },
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: props.title || '折線圖進度動畫' }
  },
  scales
}))

watch(
  () => props.data,
  (newVal) => {
    if (newVal.length === 0) defaultData.value = generateExampleData();
    else defaultData.value = toRaw(newVal);
    const newData = densifyData(defaultData.value);
    chartData.value.datasets[0].data = newData;
    delayBetweenPoints.value = totalDuration / newData.length;
    chartKey.value++;
  },
  { immediate: true, deep: true }
)

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Title, Tooltip, Legend, Filler)

</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}
</style>
