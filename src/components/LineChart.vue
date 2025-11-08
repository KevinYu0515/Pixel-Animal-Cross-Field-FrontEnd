<template>
    <Line :key="chartKey" :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
declare module 'chart.js' {
  interface Chart {
    $fadeStart?: number
  }
}

import { ref, watch, toRaw } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { generateExampleData } from '@/utils/geneateData'

const chartKey = ref(0)
const props = defineProps<{ data: ChartCoordiate[], title: string, label: string }>()

const chartData = ref({
  datasets: [
    {
      label: props.label || '比例 (%)',
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66,165,245,0.2)',
      data: props.data.length === 0 ? generateExampleData() : props.data,
      tension: 0.3,
      fill: true,
      borderWidth: 2,
      pointRadius: 4
    }
  ]
})

watch(
  () => props.data,
  (newVal) => {
    chartData.value.datasets[0].data = newVal.length > 0 ? toRaw(newVal) : generateExampleData();
    chartKey.value++;
  },
  { immediate: true, deep: true }
)

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, Filler)

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'minute',
        stepSize: 10,
        displayFormats: { minute: 'HH:mm' }
      },
      title: { display: true, text: '時間 (HH:mm)' },
      ticks: { autoSkip: true, maxTicksLimit: 10 }
    },
    y: {
      min: 0,
      max: 100,
      title: { display: true, text: '比例 (%)' },
      ticks: { stepSize: 10 }
    }
  },
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: props.title || '折線圖 (比例 vs 時間)' }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}
</style>
