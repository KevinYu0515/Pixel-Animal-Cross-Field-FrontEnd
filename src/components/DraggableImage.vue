<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  initialX?: number
  initialY?: number
  initialScale?: number
  initialRotation?: number
  minScale?: number
  maxScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialX: 100,
  initialY: 100,
  initialScale: 1,
  initialRotation: 0,
  minScale: 0.1,
  maxScale: 3
})

// 狀態管理
const imageRef = ref<HTMLElement>()
const isDragging = ref(false)
const isResizing = ref(false)
const isRotating = ref(false)

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

// 生命週期
onMounted(() => {
  updateTransform()
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

<style scoped>

.draggable-image img {
  pointer-events: none;
}

.draggable-image {
  position: absolute;
  cursor: move;
  user-select: none;
  transform-origin: center;
  transition: box-shadow 0.2s ease;
  z-index: 999;
  overflow: visible;
}

.draggable-image:hover {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}

.draggable-image.dragging {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.8);
  z-index: 1000;
}

.draggable-image.resizing {
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.8);
}

.draggable-image.rotating {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.8);
}

.draggable-image img {
  max-width: 200px;
  max-height: 200px;
  display: block;
  border-radius: 8px;
}

.draggable-image:hover img {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.controls {
  position: absolute;
  top: -15px;
  right: -15px;
  display: flex;
  gap: 5px;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
}

.draggable-image:hover .controls {
  opacity: 1;
  pointer-events: auto;
}

.control-handle {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  transition: all 0.2s ease;
  user-select: none;
}

.control-handle:hover {
  background: #007bff;
  color: white;
  transform: scale(1.1);
}

.scale-handle:hover {
  background: #ffc107;
  border-color: #ffc107;
}

.rotate-handle:hover {
  background: #dc3545;
  border-color: #dc3545;
}

.status-info {
  position: absolute;
  bottom: -40px;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.draggable-image:hover .status-info {
  opacity: 1;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .draggable-image {
    touch-action: none;
  }
  
  .control-handle {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .controls {
    top: -20px;
    right: -20px;
  }
}
</style>