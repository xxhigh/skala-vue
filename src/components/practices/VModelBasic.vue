<script setup>
import { ref } from 'vue'
const text1 = ref('')
const text2 = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>v-model 양방향 데이터 바인딩</h2>
    <h3>1) v-model 축약 문법 (양방향)</h3>
    <input type="text" v-model="text1" placeholder="v-model 축약 문법" />
    <p>입력한 값: {{ text1 }}</p>
    <h3>2) v-model 내부 작동 원리 (단방향 + 이벤트)</h3>
    <input
      type="text"
      :value="text2"
      @input="text2 = $event.target.value"
      placeholder="v-model 내부 작동 원리"
    />
    <p>입력한 값: {{ text2 }}</p>
  </div>
</template>
