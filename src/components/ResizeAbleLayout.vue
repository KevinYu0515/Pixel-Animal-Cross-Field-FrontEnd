<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()
const { leftWidth, leftSectionHeight, topHeight } = storeToRefs(layoutStore)

const STORAGE_KEY = 'layout-store-v1';

const MIN_LEFT_WIDTH = 200
const MAX_LEFT_WIDTH = 800

const MIN_LEFT_SECTION = 120
const MAX_LEFT_SECTION = 600

const MIN_TOP_HEIGHT = 120
const MAX_TOP_HEIGHT = 600

type DragKind = 'leftWidth' | 'leftSection' | 'rightTop' | null

let dragging: DragKind = null
let startX = 0
let startY = 0
let startLeftWidth = 0
let startLeftSectionHeight = 0
let startTopHeight = 0

const props = withDefaults(defineProps<{
    showDivider?: boolean
    showBoardBased?: {
        left?: boolean
        rightTop1?: boolean
        rightTop2?: boolean
        rightBottom?: boolean
    }
}>(), {
    showDivider: true,
    showBoardBased: () => ({
        left: true,
        rightTop1: true,
        rightTop2: true,
        rightBottom: true,
    }),
})

watch(
    () => layoutStore.$state,
    (state) => {
        if (typeof window === 'undefined') return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true }
)


const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return

    if (dragging === 'leftWidth') {
        const deltaX = e.clientX - startX
        let next = startLeftWidth + deltaX
        next = Math.max(MIN_LEFT_WIDTH, Math.min(MAX_LEFT_WIDTH, next))
        leftWidth.value = next
    }

    if (dragging === 'leftSection') {
        const deltaY = e.clientY - startY
        let next = startLeftSectionHeight + deltaY
        next = Math.max(MIN_LEFT_SECTION, Math.min(MAX_LEFT_SECTION, next))
        leftSectionHeight.value = next
    }

    if (dragging === 'rightTop') {
        const deltaY = e.clientY - startY
        let next = startTopHeight + deltaY
        next = Math.max(MIN_TOP_HEIGHT, Math.min(MAX_TOP_HEIGHT, next))
        topHeight.value = next
    }
}

const stopDrag = () => {
    dragging = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', stopDrag)
}

const startVerticalDrag = (e: MouseEvent) => {
    dragging = 'leftWidth'
    startX = e.clientX
    startLeftWidth = leftWidth.value
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDrag)
}

const startLeftHeightDrag = (e: MouseEvent) => {
    dragging = 'leftSection'
    startY = e.clientY
    startLeftSectionHeight = leftSectionHeight.value
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDrag)
}

const startHorizontalDrag = (e: MouseEvent) => {
    dragging = 'rightTop'
    startY = e.clientY
    startTopHeight = topHeight.value
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDrag)
}

onBeforeUnmount(() => {
    stopDrag()
})
</script>

<template>
    <div class="main-container">
        <div class="left-container" :style="{ width: leftWidth + 'px' }">
            <div class="section" :class="{ 'container-bg': showBoardBased.left }"
                :style="{ height: leftSectionHeight + 'px' }">
                <slot name="left">
                    左側內容
                </slot>
            </div>

            <div v-if="props.showDivider" class="left-resize-handle" @mousedown="startLeftHeightDrag"></div>
        </div>

        <div v-if="props.showDivider" class="divider-vertical" @mousedown="startVerticalDrag"></div>

        <div class="right-container">
            <div class="top-group" :style="{ height: topHeight + 'px' }">
                <div class="top-section-1" :class="{ 'container-bg': showBoardBased.rightTop1 }">
                    <slot name="top1">
                        上區塊 1
                    </slot>
                </div>
                <div class="top-section-2" :class="{ 'container-bg': showBoardBased.rightTop2 }">
                    <slot name="top2">
                        上區塊 2
                    </slot>
                </div>
            </div>

            <div v-if="props.showDivider" class="divider-horizontal" @mousedown="startHorizontalDrag"></div>

            <div class="bottom-section" :class="{ 'container-bg': showBoardBased.rightBottom }">
                <slot name="bottom">
                    下區塊
                </slot>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped src="@/assets/css/layout.css"></style>