<script setup lang="ts">
import LineChart from './components/RealTimeLineChart.vue';
import DraggableImage from './components/DraggableImage.vue'
import Animal1 from "@/assets/image/bird1.png";
import Animal2 from "@/assets/image/bird2.png";
import Picture1 from "@/assets/image/img1.png";
import Picture2 from "@/assets/image/img2.png";

defineProps<{ msg: string }>()

</script>

<template>
  <div class="page">
    <DraggableImage
      :src="Animal1"
      :initial-x="100"
      :initial-y="100"
      :initial-scale="1"
      :initial-rotation="0"
      :min-scale="0.1"
      :max-scale="3"
    />
    <DraggableImage
      :src="Animal2"
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
            <div class="slide"> <LineChart /></div>
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
</style>
