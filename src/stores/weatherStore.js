import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', () => {
  const cities = ref([
    { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
    { id: 'city_02', name: '수원', temp: 24, status: '비' },
    { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  ])
  const selectedCityId = ref(null)

  const selectedCity = computed(() => cities.value.find((city) => city.id === selectedCityId.value))

  function selectCity(id) {
    selectedCityId.value = id
  }

  return {
    cities,
    selectedCityId,
    selectedCity,
    selectCity,
  }
})
