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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns'
import { generateExampleData, densifyData } from '@/utils/geneateData'

const chartKey = ref(0);
const totalDuration = 10000;
const delayBetweenPoints = ref(0);
const xMaxTicks = ref(10);
const defaultData = ref(generateExampleData());
const maxDefaultData = ref(0);
const minDefaultData = ref(0);
const props = defineProps({
  data: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  label: { type: String, default: '' },
  xMaxTicks: { type: Number, default: 10 },
})

let dataIndex = { "max": [], "min": [], "pair": [] };
let markedTop = [];
let markedBottom = [];
const chartData = computed(() => ({
  datasets: [
    {
      label: props.label || '比例 (%)',
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66,165,245,0.2)',
      data: props.data.length === 0 ? defaultData.value : props.data,
      tension: 0.3,
      fill: { target: {value: -10} },
      borderWidth: 2,
      pointRadius: (ctx) => {
        const { x, y } = ctx.parsed;
        const isDefault = defaultData.value.some(p => p.x === x && p.y === y);
        return isDefault ? 4 : 0;
      },
    }
  ],
}))

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
    title: { display: true, text: props.title || '折線圖進度動畫' },
    datalabels: {
      align: (ctx) => {
        const index = ctx.dataIndex;
        if (markedTop.includes(index)) return 'top';
        if (markedBottom.includes(index)) return 'bottom';
        return 'top';
      },
      anchor: (ctx) => {
        const index = ctx.dataIndex;
        if (markedTop.includes(index)) return 'end';
        if (markedBottom.includes(index)) return 'start';
      },
      offset: 10,
      clamp: true,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ff5722',
      borderWidth: 1,
      borderRadius: 6,
      color: '#ff5722',
      font: {
        weight: 'bold',
        size: 12,
        family: 'Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      padding: { top: 4, bottom: 4, left: 8, right: 8 },
      shadowBlur: 4,
      shadowColor: 'rgba(0,0,0,0.2)',
      display: (ctx) => {
        return dataIndex.max[0] === ctx.dataIndex || dataIndex.min[0] === ctx.dataIndex || dataIndex.pair.includes(ctx.dataIndex);
      },
      formatter: (value, ctx) => {
        const index = ctx.dataIndex;
        if (dataIndex.max.includes(index)) return `最高 ${value.y}%`;
        else if (dataIndex.min.includes(index)) return `最低 ${value.y}%`;
        else if (dataIndex.pair.includes(index)) return `${value.y}%`;
        return '';
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        parser: (v) => new Date(v),
        unit: 'minute',
        displayFormats: {  minute: 'HH:mm', hour: 'HH:mm' }
      },
      ticks: { autoSkip: true, maxTicksLimit: xMaxTicks.value },
      title: { display: true, text: '時間 (HH:mm)' }
    },
    y: {
      min: -10,
      max: 100,
      ticks: {
        stepSize: 10,
        callback: (value) => (value >= 0 ? value : ''),
       },
      title: { display: true, text: '比例 (%)' }
    }
  }
}))

watch(
  () => props.data,
  (newVal) => {
    if (newVal.length === 0) defaultData.value = generateExampleData();
    else defaultData.value = toRaw(newVal);
    const newData = densifyData(defaultData.value);
    chartData.value.datasets[0].data = newData;
    delayBetweenPoints.value = totalDuration / newData.length;
    xMaxTicks.value = props.xMaxTicks;

    dataIndex = { "max": [], "min": [], "pair": [] };
    markedTop = [];
    markedBottom = [];
    maxDefaultData.value = Math.max(...defaultData.value.map(d => d.y));
    minDefaultData.value = Math.min(...defaultData.value.map(d => d.y));
    dataIndex.max = [newData.findIndex(d => d.y === maxDefaultData.value)];
    dataIndex.min = [newData.findIndex(d => d.y === minDefaultData.value)];
    markedTop.push(dataIndex.max[0]);
    markedBottom.push(dataIndex.min[0]);

    let checkFlag = 0;
    let markedPair = [];
    for (let i = 1; i < defaultData.value.length; i++) {
      if (defaultData.value[i].y === dataIndex.max[0] || defaultData.value[i].y === dataIndex.min[0]) continue;
      if (!checkFlag && defaultData.value[i].y > defaultData.value[i - 1].y) {
        markedPair.push({
          idx: i - 1,
          y: defaultData.value[i - 1].y
        });
        checkFlag ^= 1;
      } else if (checkFlag && defaultData.value[i].y < defaultData.value[i - 1].y) {
        markedPair.push({
          idx: i - 1,
          y: defaultData.value[i - 1].y
        });
        checkFlag ^= 1;
      }
    }
    
    function mergeClosePairs(arr, threshold = 1) {
      const pairs = [];
      for (let i = 0; i < arr.length; i += 2) {
        if (i + 1 < arr.length) {
          pairs.push([arr[i], arr[i + 1]]);
        }
      }

      const merged = [pairs[0]];
      for (let i = 1; i < pairs.length; i++) {
        const prev = merged[merged.length - 1];
        const curr = pairs[i];
        if (curr[0].idx - prev[1].idx <= threshold) {
          prev[1].idx = curr[1].idx;
          prev[1].y = Math.max(prev[1].y, curr[1].y);
          prev[0].y = Math.min(prev[0].y, curr[0].y);
        } else {
          merged.push(curr);
        }
      }

      return merged.flat();
    }
    const merged = mergeClosePairs(markedPair, 3);

    console.log('marked pairs:', markedPair);
    console.log('merged pairs:', merged);
    checkFlag = 0;
    for (let p = 0, n = 0; p < merged.length && n < newData.length; n++) {
      if (newData[n].y === merged[p].y) {
        dataIndex.pair.push(n);
        p++;
        if (!checkFlag) markedBottom.push(n);
        else markedTop.push(n);
        checkFlag ^= 1;
      }
    }
    chartKey.value++;
  },
  { immediate: true, deep: true }
)

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Title, Tooltip, Legend, Filler, ChartDataLabels)

</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}
</style>
