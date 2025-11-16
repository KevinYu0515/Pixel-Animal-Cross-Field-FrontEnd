<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LineChart from '@/components/LineChart.vue';
import DraggableImage from '@/components/DraggableImage.vue'
import Picture1 from "@/assets/image/img1.png";
import Picture2 from "@/assets/image/img2.png";
import { loadData } from "@/api/data";
import { lineChartInfo } from '@/data/mainPage';
import { currentTime, updateTime, clearTime, timerId } from '@/utils/time';
import { groupPointsByHour } from '@/utils/dataHandler';
import { draggableImage, showToolbar, onMouseMove, onToolbarEnter, onToolbarLeave, handleUpload, removeImage } from '@/utils/draggableImage';
import ResizeAbleLayout from '@/components/ResizeAbleLayout.vue';
import BasicElement from '@/components/BasicElement.vue';

const appEnv = import.meta.env.VITE_APP_ENV || 'dev';
const showBoardBased = {
  left: true,
  rightTop1: false,
  rightTop2: false,
  rightBottom: true
}

const grouped = ref <{
  hourStart: number;
  points: ChartCoordiate[];
}[]>([]);
const displayIdx = ref(0);
const displayData = ref<ChartCoordiate[]>([]);
const data = ref<ChartCoordiate[]>([]);
const basicInfo = ref<BasicInfo>({
  courseName: '',
  classroom: '',
  instructor: ''
});

let chartTimerId: number | null = null
const updateDisplay = () => {
  if (!grouped.value.length) return
  if (grouped.value.length === 1) {
    displayIdx.value = 0
  } else {
    displayIdx.value = (displayIdx.value + 1) % grouped.value.length
  }
  displayData.value = grouped.value[displayIdx.value].points
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  loadData().then((result) => {
    data.value = result.chartData;
    basicInfo.value = result.basicInfo;
    grouped.value = groupPointsByHour(data.value);
    displayIdx.value = 0;
    displayData.value = grouped.value[0]?.points ?? [];
    chartTimerId = window.setInterval(updateDisplay, 10000);
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  if (chartTimerId) clearInterval(chartTimerId);
  if (timerId) clearTime();
})

onMounted(() => {
  updateTime()
})
</script>

<template>
  <div class="page">
    <div v-if="appEnv !== 'dev'" class="toolbar" :class="{ visible: showToolbar }" @mouseenter="onToolbarEnter"
      @mouseleave="onToolbarLeave">
      <div class="toolbar-items">
        <label v-for="(item, index) in draggableImage" :key="index" class="toolbar-item">
          <input type="checkbox" v-model="item.showImage" />
          <span>{{ item.name }} 圖片</span>
          <button class="remove-btn" @click="removeImage(index)">x</button>
        </label>
      </div>
      <div class="upload-container">
        <input type="file" multiple accept="image/*" @change="handleUpload" />
      </div>
    </div>
    <DraggableImage v-for="(item, index) in draggableImage" :key="index" :title="item.name" v-show="item.showImage"
      :src="item.image" :initial-x="100" :initial-y="100" :initial-scale="1" :initial-rotation="0" :min-scale="0.1"
      :max-scale="3" />
    <BasicElement />
    <ResizeAbleLayout :show-divider="false" :show-board-based="showBoardBased">
      <template #left>
        <div class="slider-container">
          <div class="slider">
            <div class="slide"><img :src="Picture1" /></div>
            <div class="slide"><img :src="Picture2" /></div>
          </div>
        </div>
      </template>
      <template #top1>
        <div class="time-box">
          <p>{{ currentTime }}</p>
        </div>
      </template>
      <template #top2>
        <div class="list-box">
          <ul>
            <li>課程：{{ basicInfo.courseName }}</li>
            <li>教室：{{ basicInfo.classroom }}</li>
            <li>教授：{{ basicInfo.instructor }}</li>
          </ul>
        </div>
      </template>
      <template #bottom>
        <LineChart :data="displayData" :info="lineChartInfo" />
      </template>
    </ResizeAbleLayout>
  </div>
</template>

<style scoped src="@/assets/css/mainPage.css"></style>
<style lang="css" scoped src="@/assets/css/toolbar.css"></style>
