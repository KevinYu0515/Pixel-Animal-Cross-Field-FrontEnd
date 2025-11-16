<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import ResizeAbleLayout from '@/components/ResizeAbleLayout.vue';
import DraggableImage from '@/components/DraggableImage.vue'
import {
    draggableImage,
    showToolbar,
    onMouseMove,
    onToolbarEnter,
    onToolbarLeave,
    handleUpload,
    removeImage
} from '@/utils/draggableImage';
import BasicElement from '@/components/BasicElement.vue';

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
        <ResizeAbleLayout />
        <div class="toolbar" :class="{ visible: showToolbar }" @mouseenter="onToolbarEnter"
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
            :src="item.image" :initial-x="100" :initial-y="100" :initial-scale="1" :initial-rotation="0"
            :min-scale="0.1" :max-scale="3" />
    </div>
</template>

<style lang="css" scoped src="@/assets/css/controlPage.css"></style>
<style lang="css" scoped src="@/assets/css/toolbar.css"></style>
