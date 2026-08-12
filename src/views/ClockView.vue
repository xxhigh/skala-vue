<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const currentTime = ref(new Date())

const router = useRouter()

const timer = setInterval(() => {
  currentTime.value = new Date()
}, 1000)

onUnmounted(() => {
  clearInterval(timer)
  console.log('Timer가 종료되었습니다.')
})

const formatZero = (num) => String(num).padStart(2, '0')
</script>

<template>
  <div class="clock-box">
    <p class="time-text">
      현재 시간은 {{ formatZero(currentTime.getHours()) }}:{{
        formatZero(currentTime.getMinutes())
      }}:{{ formatZero(currentTime.getSeconds()) }} 입니다
    </p>
    <button class="btn-home" @click="router.push('/')">Home</button>
  </div>
</template>

<style scoped>
.clock-box {
  max-width: 420px;
  margin: 48px auto;
  padding: 36px 28px;
  text-align: center;
  background: linear-gradient(135deg, #f4fbff, #e8f5ff);
  border: 1px solid #cfe8f7;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(44, 119, 159, 0.14);
}

.time-text {
  margin: 0 0 24px;
  color: #1f3b4d;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.btn-home {
  padding: 10px 20px;
  color: #ffffff;
  background-color: #278ac0;
  border: 0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}
</style>
