<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCity = ref('카드를 클릭하거나 검색해 보세요.')

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const isTipVisible = ref(true)
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="container">
      <button @click="isTipVisible = !isTipVisible">오늘의 팁</button>
      <div v-show="isTipVisible" class="tip-box">
        <p>더운 날씨에는 그늘에서 쉬어가는 것이 좋습니다. 😄</p>
      </div>
    </div>

    <section class="search-box">
      <h3>🔎 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시를 입력하세요."
      />
      <p>검색중인 도시: {{ searchQuery }}</p>
    </section>

    <div class="container">
      <h3>☀️ 지역별 날씨 현황</h3>
      <div
        class="weather-card"
        v-for="item in weatherList"
        :key="item.id"
        @click="selectedCity = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }} °C</p>
        <span class="badge hot" v-if="item.temp >= 25">더움 (25도 이상)</span>
        <span class="badge cool" v-else>신선함 (25도 미만)</span>
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </div>
    <div class="status-bar">{{ selectedCity }}</div>
  </div>
</template>
