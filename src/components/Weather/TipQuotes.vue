<script setup>
defineProps({
  quote: {
    type: String,
    default: '💡 상단의 오늘의 팁을 클릭해보세요 !',
  },
})

const emit = defineEmits(['refresh-tip'])

const handleRefreshTip = () => {
  const r = Math.random()
  emit('refresh-tip', r >= 0.6 ? 0 : r >= 0.3 ? 1 : 2)
}
</script>

<template>
  <div class="container">
    <button @click="handleRefreshTip()">오늘의 팁</button>
    <div class="tip-box">
      <p>{{ quote }}</p>
    </div>
  </div>
</template>

<style scoped>
.tip-box {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #4ba5ff;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  color: #e9ecef;
  font-weight: bold;
}
</style>
