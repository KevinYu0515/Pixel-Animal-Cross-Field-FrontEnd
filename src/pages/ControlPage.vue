<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
import ResizeAbleLayout from '@/components/ResizeAbleLayout.vue';
import DraggableImage from '@/components/DraggableImage.vue'
import {
    showToolbar,
    onMouseMove,
    onToolbarEnter,
    onToolbarLeave,
    handleUpload,
    removeImage
} from '@/utils/draggableImage';
import BasicElement from '@/components/BasicElement.vue';
import { useStickerStore } from '@/stores/stickerStore';

const stickerStore = useStickerStore()
const draggableImage = computed(() => stickerStore.draggableImage);
const onToggleSticker = (item: DraggableItemWithTransform) => {
    stickerStore.setStickerVisible(item.name, !item.showImage)
}

onMounted(() => {
    window.addEventListener('mousemove', onMouseMove);
})

onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
})
</script>

<template>
    <div class="page">
        <BasicElement />
        <div class="toolbar" :class="{ visible: showToolbar }" @mouseenter="onToolbarEnter"
            @mouseleave="onToolbarLeave">
            <RouterLink to="/">
                完成設定
            </RouterLink>
            <div class="toolbar-items">
                <label v-for="(item, index) in draggableImage" :key="index" class="toolbar-item">
                    <input type="checkbox" :checked="item.showImage" @change="onToggleSticker(item)" />
                    <span>{{ item.name }} 圖片</span>
                    <button class="remove-btn" @click="removeImage(index)">x</button>
                </label>
            </div>
            <div class="upload-container">
                <input type="file" multiple accept="image/*" @change="handleUpload" />
            </div>
        </div>
        <DraggableImage v-for="(item, index) in draggableImage" :key="index" :title="item.name" :show="item.showImage"
            v-show="item.showImage" :src="item.image" :initial-x="item.x" :initial-y="item.y"
            :initial-scale="item.scale" :initial-rotation="item.rotation" :min-scale="0.1" :max-scale="3" />
        <ResizeAbleLayout>
            <template #top1>
                <div class="time-box">
                    <p>12:00</p>
                </div>
            </template>
            <template #top2>
                <div class="list-box">
                    <ul>
                        <li>課程：xx 課程</li>
                        <li>教室：xx 教室</li>
                        <li>教授：xx 教授</li>
                    </ul>
                </div>
            </template>
        </ResizeAbleLayout>
    </div>
</template>

<style lang="css" scoped src="@/assets/css/controlPage.css"></style>
<style lang="css" scoped src="@/assets/css/toolbar.css"></style>
