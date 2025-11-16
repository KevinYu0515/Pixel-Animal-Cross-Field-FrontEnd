<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useStickerStore } from '@/stores/stickerStore';

const stickerStore = useStickerStore();

interface Props {
  lock?: boolean
  src: string
  title?: string
  initialX?: number
  initialY?: number
  initialScale?: number
  initialRotation?: number
  minScale?: number
  maxScale?: number
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lock: false,
  title: "",
  initialX: 100,
  initialY: 100,
  initialScale: 1,
  initialRotation: 0,
  minScale: 0.1,
  maxScale: 3,
  show: true
})

// 狀態管理
const imageRef = ref<HTMLElement>()
const isDragging = ref(false)
const isResizing = ref(false)
const isRotating = ref(false)

const show = ref(props.show);
const position = ref({ x: props.initialX, y: props.initialY })
const scale = ref(props.initialScale)
const rotation = ref(props.initialRotation)

// 拖拽相關
let dragStartPos = { x: 0, y: 0 }
let elementStartPos = { x: 0, y: 0 }

// 縮放相關
let scaleStartValue = 1
let scaleStartDistance = 0

// 旋轉相關
let rotationStartValue = 0
let rotationStartAngle = 0

// 計算變換樣式
const transformStyle = ref('')
const updateTransform = () => {
  transformStyle.value = `translate(${position.value.x}px, ${position.value.y}px) scale(${scale.value}) rotate(${rotation.value}deg)`
  saveToStore();
}

// 拖拽功能
const startDrag = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('control-handle')) return
  
  isDragging.value = true
  dragStartPos = { x: e.clientX, y: e.clientY }
  elementStartPos = { ...position.value }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - dragStartPos.x
  const deltaY = e.clientY - dragStartPos.y
  
  position.value = {
    x: elementStartPos.x + deltaX,
    y: elementStartPos.y + deltaY
  }
  updateTransform()
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 縮放功能
const startScale = (e: MouseEvent) => {
  isResizing.value = true
  scaleStartValue = scale.value
  
  const rect = imageRef.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  scaleStartDistance = Math.sqrt(
    Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
  )
  
  document.addEventListener('mousemove', onScale)
  document.addEventListener('mouseup', stopScale)
  e.preventDefault()
  e.stopPropagation()
}

const onScale = (e: MouseEvent) => {
  if (!isResizing.value) return
  
  const rect = imageRef.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const currentDistance = Math.sqrt(
    Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
  )
  
  const scaleRatio = currentDistance / scaleStartDistance
  const newScale = Math.max(props.minScale, Math.min(props.maxScale, scaleStartValue * scaleRatio))
  
  scale.value = newScale
  updateTransform()
}

const stopScale = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onScale)
  document.removeEventListener('mouseup', stopScale)
}

// 旋轉功能
const startRotate = (e: MouseEvent) => {
  isRotating.value = true
  rotationStartValue = rotation.value
  
  const rect = imageRef.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  rotationStartAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
  
  document.addEventListener('mousemove', onRotate)
  document.addEventListener('mouseup', stopRotate)
  e.preventDefault()
  e.stopPropagation()
  saveToStore();
}

const onRotate = (e: MouseEvent) => {
  if (!isRotating.value) return
  
  const rect = imageRef.value!.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
  
  const deltaAngle = currentAngle - rotationStartAngle
  rotation.value = rotationStartValue + deltaAngle
  updateTransform()
}

const stopRotate = () => {
  isRotating.value = false
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
}

// 雙擊重置
const resetTransform = () => {
  position.value = { x: props.initialX, y: props.initialY }
  scale.value = props.initialScale
  rotation.value = props.initialRotation
  updateTransform()
}

// 滾輪縮放
const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(props.minScale, Math.min(props.maxScale, scale.value * delta))
  scale.value = newScale
  updateTransform()
}

const saveToStore = () => {
  if (props.lock) return;
  stickerStore.setSticker(props.title, {
    x: position.value.x,
    y: position.value.y,
    scale: scale.value,
    rotation: rotation.value,
    showImage: show.value
  })
}

// 生命週期
onMounted(() => {
  updateTransform();
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onScale)
  document.removeEventListener('mouseup', stopScale)
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
})
</script>

<template>
  <template v-if="lock">
    <div class="static-image" :style="{ transform: transformStyle }">
      <img :src="props.src" alt="Draggable Image" draggable="false">
    </div>
  </template>
  <template v-else>
    <div ref="imageRef" class="draggable-image" :class="{
      dragging: isDragging,
      resizing: isResizing,
      rotating: isRotating
    }" :style="{ transform: transformStyle }" @mousedown="startDrag" @dblclick="resetTransform" @wheel="onWheel">
      <!-- 圖片 -->
      <img :src="props.src" alt="Draggable Image" draggable="false">

      <!-- 控制手柄 -->
      <div class="controls">
        <!-- 縮放手柄 -->
        <div class="control-handle scale-handle" @mousedown="startScale" title="拖拽縮放">
          <img src="@/assets/image/scale.png" alt="縮放" />
        </div>

        <!-- 旋轉手柄 -->
        <div class="control-handle rotate-handle" @mousedown="startRotate" title="拖拽旋轉">
          <img src="@/assets/image/rotate.png" alt="旋轉" />
        </div>
      </div>

      <!-- 狀態顯示 -->
      <div class="status-info">
        <div>縮放: {{ scale.toFixed(2) }}</div>
        <div>旋轉: {{ Math.round(rotation) }}°</div>
      </div>
    </div>
  </template>

</template>

<style scoped src="@/assets/css/draggableImage.css"></style>