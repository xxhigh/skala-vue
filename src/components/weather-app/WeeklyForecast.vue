<script setup>
import { useConfigStore } from '@/stores/configStore'
import { formatDay, formatTemperature, getWeatherMeta } from '@/utils/weather'
import WeatherGlyph from './WeatherGlyph.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()
</script>

<template>
  <section class="forecast-section weekly-section" aria-labelledby="weekly-title">
    <header class="section-heading">
      <h2 id="weekly-title">5일 예보</h2>
      <p>일별 최고·최저 기온</p>
    </header>
    <div class="weekly-list">
      <article v-for="(item, index) in items" :key="item.date" class="weekly-row">
        <time :datetime="item.date">{{ formatDay(item.date, index) }}</time>
        <span class="weekly-condition">
          <WeatherGlyph :code="item.weatherCode" :size="28" />
          {{ getWeatherMeta(item.weatherCode).label }}
        </span>
        <span class="weekly-rain">{{ item.precipitationProbability }}%</span>
        <span class="weekly-temperature">
          <strong>{{ formatTemperature(item.temperatureMax, configStore.unit) }}°</strong>
          <span>{{ formatTemperature(item.temperatureMin, configStore.unit) }}°</span>
        </span>
      </article>
    </div>
  </section>
</template>
