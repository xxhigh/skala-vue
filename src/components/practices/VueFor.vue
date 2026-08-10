<script setup>
import { ref } from 'vue'

const fruits = ref(['사과', '바나나', '포도', '딸기'])
const user = ref({ name: '홍길동', age: 30, role: 'admin' })
const items = ref([
  { id: 1, name: '아이템 1', price: 1000 },
  { id: 2, name: '아이템 2', price: 2000 },
  { id: 3, name: '아이템 3', price: 3000 },
])
</script>

<template>
  <div class="practice-section">
    <h2>v-for 디렉티브 학습</h2>
    <h3>1) 배열 렌더링</h3>
    <ul>
      <li v-for="(fruit, index) in fruits" :key="index">{{ index + 1 }}번 과일: {{ fruit }}</li>
    </ul>
    <h3>2) 객체 렌더링</h3>
    <ul>
      <li v-for="(value, key, index) in user" :key="key">
        [{{ index + 1 }}] {{ key }}: {{ value }}
      </li>
    </ul>
    <h3>3) 배열 객체 렌더링</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.id }}번 아이템: {{ item.name }} - 가격: {{ item.price }}원
      </li>
    </ul>
  </div>
</template>
