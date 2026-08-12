<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore'

import BaseDashboardCard from '@/components/Weather/BaseDashboardCard.vue'
import SearchBar from '@/components/Weather/SearchBar.vue'
import WeatherCard from '@/components/Weather/WeatherCard.vue'
import TipQuotes from '@/components/Weather/TipQuotes.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

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

const searchQuery = ref('')

const selectedCityMessage = computed(() => {
  return weatherStore.selectedCity
    ? `${weatherStore.selectedCity.name}이 선택되었습니다.`
    : '카드를 클릭하거나 검색해 보세요.'
})

const handleSelectCard = (cityName) => {
  const city = weatherStore.cities.find((item) => item.name === cityName)
  console.log(city.id)
  if (city) {
    weatherStore.selectCity(city.id)
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편 (현재 큰 의미없음)
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  return query
    ? weatherStore.cities.filter((item) => item.name.includes(query))
    : weatherStore.cities
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
        @select-card="handleSelectCard"
        @click-detail="handleDetailJump(item.id)"
      />

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityMessage }}
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
