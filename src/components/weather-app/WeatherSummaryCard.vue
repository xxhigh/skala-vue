<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { formatTemperature } from '@/utils/weather'
import UiIcon from './UiIcon.vue'
import WeatherGlyph from './WeatherGlyph.vue'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const temperature = computed(() =>
  formatTemperature(weatherStore.current?.temperature, configStore.unit),
)
const temperatureUnit = computed(() => (configStore.unit === 'celsius' ? 'C' : 'F'))

function openDetail() {
  router.push({ name: 'detail', params: { cityId: weatherStore.location.id || 'current' } })
}
</script>

<template>
  <article class="summary-glass">
    <div class="summary-primary">
      <div class="condition-line">
        <WeatherGlyph :code="weatherStore.current?.weatherCode" :size="34" />
        <span>{{ weatherStore.weatherLabel }}</span>
      </div>
      <p class="temperature" aria-live="polite">
        {{ temperature }}<sup>°{{ temperatureUnit }}</sup>
      </p>
    </div>

    <dl class="summary-metrics">
      <div>
        <dt>강수 확률</dt>
        <dd>{{ weatherStore.current?.precipitationProbability ?? '—' }}<small>%</small></dd>
      </div>
      <div>
        <dt>미세먼지</dt>
        <dd class="aqi-value" :data-tone="weatherStore.airQuality?.tone">
          <span class="aqi-dot" aria-hidden="true"></span>
          {{ weatherStore.airQuality?.label || '정보 없음' }}
        </dd>
      </div>
    </dl>

    <div class="summary-actions">
      <button class="unit-button" type="button" @click="configStore.toggleUnit">°C / °F</button>
      <button class="detail-button" type="button" @click="openDetail">
        자세히 보기
        <UiIcon name="arrow-right" :size="18" />
      </button>
    </div>
  </article>
</template>
