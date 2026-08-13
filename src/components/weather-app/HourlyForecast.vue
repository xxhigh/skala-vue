<script setup>
import { useConfigStore } from '@/stores/configStore'
import { formatHour, formatTemperature } from '@/utils/weather'
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
  <section class="forecast-section" aria-labelledby="three-hourly-title">
    <header class="section-heading">
      <h2 id="three-hourly-title">3시간별 예보</h2>
      <p>앞으로 5일</p>
    </header>
    <div class="hourly-scroll">
      <article v-for="item in items" :key="item.time" class="hourly-item">
        <time :datetime="item.time">{{ formatHour(item.time) }}</time>
        <WeatherGlyph :code="item.weatherCode" :size="30" />
        <strong>{{ formatTemperature(item.temperature, configStore.unit) }}°</strong>
        <span>{{ item.precipitationProbability }}%</span>
      </article>
    </div>
  </section>
</template>
