<script setup>
import { ref } from 'vue'

const msg = ref('느린 네트워크에서도 안전하게 출력되는 메세지!')
</script>

<template>
  <div class="practice-section">
    <h2>v-cloak 디렉티브 학습</h2>
    <p>{{ msg }}</p>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none !important;
}
</style>
