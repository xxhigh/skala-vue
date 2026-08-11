<script setup>
import { ref } from 'vue'

const position = ref('')
const tagName = ref('')
const getOnlyEvent = (e) => {
  position.value = `pos: x=${e.clientX}, y=${e.clientY}`
}
const getWidthParam = (name, e) => {
  tagName.value = `대상: ${name} / 클릭된 태그: ${e.target.tagName}`
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 객체 학습</h2>
    <p>좌표: {{ position }}</p>
    <p>태그: {{ tagName }}</p>
    <button @click="getOnlyEvent">클릭 좌표 알아내기</button>
    <button @click="(e) => getWidthParam('회원A', e)">회원 정보와 태그 확인</button>
  </div>
</template>
