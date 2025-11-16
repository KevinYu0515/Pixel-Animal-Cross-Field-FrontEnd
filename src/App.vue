<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
.vdr {
  border: none !important;
}

@font-face {
  font-family: 'Cubic11';
  src: url('@/assets/fonts/Cubic_11.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'BoutiqueBitmap9x9';
  src: url('@/assets/fonts/BoutiqueBitmap9x9_1.5.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
</style>
