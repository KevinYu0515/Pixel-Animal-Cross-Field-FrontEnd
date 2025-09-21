<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
} from 'chart.js'
import streamingPlugin from 'chartjs-plugin-streaming'
import 'chartjs-adapter-date-fns'
import { Line } from 'vue-chartjs'
import type { Chart, ChartOptions } from 'chart.js';
import { toRef } from 'vue';

ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, LinearScale,
  PointElement, TimeScale,
  streamingPlugin, 
)

const props = defineProps<{ data: ChartCoordiate[] }>();
const data = toRef(props, 'data'); 

const env = {
  "dev": {
    timeInterval: 1000,
    maxPoints: 10
  },
  "prod": {
    timeInterval: 1000,
    maxPoints: 10
  }
}

const currentEnv = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
const { timeInterval, maxPoints } = env[currentEnv];

const chartData = {
  datasets: [
    {
      label: 'Usage',
      data: process.env.NODE_ENV === 'production' ? [...data.value] : [
        ...Array.from({ length: maxPoints - 1 }, (_, i) => ({
        x: Date.now() - timeInterval * (maxPoints - i),
        y: Math.floor(Math.random() * 100)
      })),{
          x: Date.now(),
          y: Math.floor(Math.random() * 100)
        }
      ],
      borderColor: '#42a5f5',
      borderWidth: 2,
      backgroundColor: 'rgba(66,165,245,0.2)',
      tension: 0.3,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#1e88e5',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    },
  ]
}

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true }
  },
  scales: {
    x: {
        type: 'realtime',
        realtime: {
            frameRate: 30,
            duration: timeInterval * maxPoints,
            refresh: timeInterval,
            delay: timeInterval,
            pause: false,
            onRefresh: (chart: Chart) => {  
                chart.data.datasets[0].data.push({
                    x: Date.now(),
                    y: Math.floor(Math.random() * 100)
                });
            },
        },
        ticks: {
            autoSkip: true,
            maxTicksLimit: maxPoints
        },
        title: { display: true, text: '時間 (HH:mm:ss)' },
    },
    y: {
      min: 0,
      max: 100,
      ticks: {
        callback: (value: string | number) => (Number(value) + '%')
      },
      title: { display: true, text: '百分比' }
    }
  }
}
</script>

<template>
    <Line :data="chartData" :options="chartOptions" />
</template>
