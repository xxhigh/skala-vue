<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import TipQuotes from './TipQuotes.vue'

const tips = ref([
  '더운 날씨에는 그늘에서 쉬어가는 것이 좋아요. 😄',
  '충분한 수분을 섭취해주세요. 🚰',
  '어지러움이 느껴진다면 즉시 시원한 곳으로 이동해주세요. 😵‍💫',
])

const tip = computed(() => {
  return selectedTipIndex.value === null
    ? '💡 상단의 오늘의 팁을 클릭해보세요 !'
    : tips.value[selectedTipIndex.value]
})
const selectedTipIndex = ref(null)

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

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCity, (newValue) => {
  console.log(`[Watch 감지] 상태 바 문구가 업데이트되었습니다. -> ${newValue}이 선택되었습니다.`)
})

watch(tip, (newValue) => {
  console.log(`[Watch 감지] 오늘의 팁이 갱신되었습니다. -> "${newValue}"`)
})

watchEffect(() => {
  console.log(
    `[Watch Effect 자동감지] 현재 검색어 ${searchQuery.value}에 매칭되는 API 데이터를 필터링했습니다.`,
  )
})
</script>

<template>
  <div class="dashboard-wrapper">
    <TipQuotes :quote="tip" @refresh-tip="(r) => (selectedTipIndex = r)" />

    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>☀️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCity = msg)"
        @click-detail="showDetail"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCity }}
    </div>
  </div>
</template>

<style scoped></style>
