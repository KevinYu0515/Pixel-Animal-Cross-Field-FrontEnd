<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
// import ReaTimeLineChart from '@/components/RealTimeLineChart.vue';
import LineChart from '@/components/LineChart.vue';
import DraggableImage from '@/components/DraggableImage.vue'
import Animal1 from "@/assets/image/bird1.png";
import Animal2 from "@/assets/image/bird2.png";
import Picture1 from "@/assets/image/img1.png";
import Picture2 from "@/assets/image/img2.png";
import { loadData } from "@/api/data";
const appEnv = import.meta.env.VITE_APP_ENV || 'dev';

interface DraggableItem {
  image: string
  name: string
  showImage: boolean
}

function getFileName(path: string) {
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  return file.split('.')[0];
}

const showToolbar = ref(false);
const data = ref<ChartCoordiate[]>([]);

const draggableImage = reactive<DraggableItem[]>([{
  image: Animal1,
  name: getFileName(Animal1),
  showImage: true
},{
  image: Animal2,
  name: getFileName(Animal2),
  showImage: true
}])
let mouseNearTop = false
let mouseInToolbar = false

const onMouseMove = (e: MouseEvent) => {
  mouseNearTop = e.clientY < 50;
  updateToolbarVisibility()
}

const onToolbarEnter = () => {
  mouseInToolbar = true
  updateToolbarVisibility()
}

const onToolbarLeave = () => {
  mouseInToolbar = false
  updateToolbarVisibility()
}

const updateToolbarVisibility = () => {
  showToolbar.value = mouseNearTop || mouseInToolbar
}

const handleUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  Array.from(target.files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (event) => {
      draggableImage.push({
        image: event.target?.result as string,
        name: file.name,
        showImage: true
      })
    }
    reader.readAsDataURL(file)
  })
  target.value = ''
}

const removeImage = (index: number) => {
  draggableImage.splice(index, 1)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  loadData().then((result: ChartCoordiate[]) => {
    data.value = result;
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div class="page">
    <div v-if="appEnv !== 'dev'"
      class="toolbar"
      :class="{ visible: showToolbar }"
      @mouseenter="onToolbarEnter"
      @mouseleave="onToolbarLeave"
    >
      <div class="toolbar-items">
        <label 
          v-for="(item, index) in draggableImage" 
          :key="index" 
          class="toolbar-item"
        >
          <input type="checkbox" v-model="item.showImage" />
          <span>{{ item.name }} 圖片</span>
          <button class="remove-btn" @click="removeImage(index)">x</button>
        </label>
      </div>
      <div class="upload-container">
        <input type="file" multiple accept="image/*" @change="handleUpload" />
      </div>
    </div>
    <DraggableImage
      v-for="(item, index) in draggableImage"
      :key="index"
      :title="item.name"
      v-show="item.showImage"
      :src="item.image"
      :initial-x="100"
      :initial-y="100"
      :initial-scale="1"
      :initial-rotation="0"
      :min-scale="0.1"
      :max-scale="3"
    />
    <div class="main-container">
      <div class="left-container">
        <div class="slider-container">
          <div class="slider">
            <div class="slide"> <LineChart :data="data" title="專心率 比例/時間" label="Look Forward % (專心率)" /></div>
            <div class="slide"><img :src="Picture1" /></div>
            <div class="slide"><img :src="Picture2" /></div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-container">
      <div class="time-container">
        <p>10:30</p>
      </div>
      <div class="info-container">
        <ul>
          <li>課程：資料結構</li>
          <li>教室：資電 234</li>
          <li>教授：</li>
        </ul>
      </div>
    </div>
    <div class="bottom-container">
      <div class="title-container">
        <h1 id="title">學生上課專心程度</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/bg.png');
  background-size: auto;
  background-position: center;
  background-repeat: repeat;
}

.main-container {
  flex: 3;
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.bottom-container {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  position: relative;
  overflow: hidden;
}

/* 使用 ::before 來放背景 */
.bottom-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background-image: url('@/assets/fence.png');
  background-size: contain;
  background-position: bottom;
  background-repeat: repeat;
  z-index: 0;
}

.left-container {
  border-radius: 1.2rem;
  flex: 8;
  max-width: 70vw;
  padding: 1rem;
  background-color: #ecf2f3;
  overflow: visible;
}

.right-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  pointer-events: none;
  padding: 0 2rem;
}

.right-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/tree.png');
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  z-index: 0;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  pointer-events: none;
}

.time-container {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 20%;
}

.time-container p {
  z-index: 1;
  font-size: 5rem;
  padding: 1rem;
  font-weight: 900;
}

.time-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/cloud.png');
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
  z-index: 0;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  pointer-events: none;
}

.info-container {
  width: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%;
  margin-top: 1rem;
  float: right;
}

.info-container ul {
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 900;
  text-shadow:
    2px 2px 5px white,
    -2px 2px 5px white,
    2px -2px 5px white,
    -2px -2px 5px white;
}

.info-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/board2.png');
  background-size: contain;
  background-position: right;
  background-repeat: no-repeat;
  z-index: 0;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  pointer-events: none;
}

.card {
  width: 200px;
  height: 100px;
  background-color: #c5cae9;
  border-radius: 8px;
}

.bottom-container .title-container{
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.bottom-container .title-container h1#title {
  padding-left: 2rem;
  position: relative;
  z-index: 1;
  text-align: left;
  font-size: 4rem;
  font-weight: bolder;
  color: black;
  text-shadow:
    2px 2px 0px white,
    -2px 2px 0px white,
    2px -2px 0px white,
    -2px -2px 0px white;
}

.bottom-container .title-container::before{
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/board.png');
  background-size: contain;
  background-position: left;
  background-repeat: no-repeat;
  z-index: 0;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
  pointer-events: none;
}

.slider-container {
  width: 100%;
  height: 100%;
  overflow: hidden; /* 在這裡設定 overflow */
  border-radius: 0.8rem; /* 如果需要圓角 */
}

.slider {
  display: flex;
  width: 300%;
  height: 100%;
  animation: slide 300s infinite; /* 12 秒循環 */
}

.slide {
  z-index: 1;
  flex: 0 0 33.333%; /* 每個slide佔1/3寬度 */
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes slide {
  0%   { transform: translateX(0); }
  30%  { transform: translateX(0); }
  33%  { transform: translateX(-33.333%); }
  63%  { transform: translateX(-33.333%); }
  66%  { transform: translateX(-66.666%); }
  96%  { transform: translateX(-66.666%); }
  100% { transform: translateX(0); }
}

.toolbar {
  position: fixed;
  top: 1rem;
  left: 50%;
  min-width: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.toolbar.visible {
  opacity: 1;
}

.toolbar-items {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(230, 222, 222);
  color: rgb(24, 8, 8);
  padding: 4px 8px;
  border-radius: 6px;
}

.toolbar-item input[type="checkbox"] {
  accent-color: #00bfff;
}

.remove-btn {
  background: #ff4d4f;
  border: none;
  color: white;
  font-weight: bold;
  padding: 0 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #ff7875;
}

.upload-container input[type="file"] {
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 8px;
  background: rgba(230, 222, 222);
  color: rgb(24, 8, 8);
}
</style>
