<script setup>
import { computed, onMounted } from 'vue'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import { useRouter } from 'vue-router'
import FavoriteLocations from '@/components/weather-app/FavoriteLocations.vue'
import HourlyForecast from '@/components/weather-app/HourlyForecast.vue'
import PointerBlur from '@/components/weather-app/PointerBlur.vue'
import WeeklyForecast from '@/components/weather-app/WeeklyForecast.vue'
import WeatherDetailsGrid from '@/components/weather-app/WeatherDetailsGrid.vue'
import WeatherGlyph from '@/components/weather-app/WeatherGlyph.vue'
import UiIcon from '@/components/weather-app/UiIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { formatTemperature } from '@/utils/weather'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const temperature = computed(() =>
  formatTemperature(weatherStore.current?.temperature, configStore.unit),
)
const unit = computed(() => (configStore.unit === 'celsius' ? 'C' : 'F'))
const isCurrentFavorite = computed(() => weatherStore.isFavoriteLocation(weatherStore.location))

function toggleCurrentFavorite() {
  weatherStore.toggleFavorite(weatherStore.location)
}

async function selectFavorite(city) {
  const succeeded = await weatherStore.selectFavorite(city)
  if (!succeeded) return
  await router.replace({ name: 'detail', params: { cityId: city.id } })
}

onMounted(() => {
  if (!weatherStore.current && !weatherStore.loading) weatherStore.initializeLocation()
})
</script>

<template>
  <main class="weather-detail-page">
    <div class="detail-backdrop" aria-hidden="true"></div>
    <div class="detail-scrim" aria-hidden="true"></div>
    <PointerBlur />

    <div class="detail-shell">
      <button type="button" class="back-link" @click="router.push('/')">
        <UiIcon name="arrow-left" :size="18" />
        현재 날씨
      </button>

      <section
        v-if="weatherStore.loading && !weatherStore.current"
        class="detail-loading"
        aria-live="polite"
      >
        <span class="sr-only">상세 예보를 불러오는 중입니다.</span>
        <Skeleton class="detail-skeleton-line" />
        <Skeleton class="detail-skeleton-card" />
      </section>

      <Message
        v-else-if="weatherStore.error && !weatherStore.current"
        class="weather-error"
        severity="error"
        :closable="false"
      >
        <template #container>
          <div class="weather-error-content">
            <p>{{ weatherStore.error }}</p>
            <button type="button" class="retry-button" @click="weatherStore.retry">
              <UiIcon name="refresh" :size="18" />
              다시 불러오기
            </button>
          </div>
        </template>
      </Message>

      <template v-else-if="weatherStore.current">
        <header class="detail-hero">
          <div>
            <p class="detail-location">
              <UiIcon name="location" :size="18" />
              {{ weatherStore.location.name }}
            </p>
            <div class="detail-title-row">
              <h1>{{ weatherStore.weatherLabel }}</h1>
              <button
                type="button"
                class="favorite-toggle"
                :class="{ 'is-active': isCurrentFavorite }"
                :aria-label="isCurrentFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'"
                :aria-pressed="isCurrentFavorite"
                :title="isCurrentFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'"
                @click="toggleCurrentFavorite"
              >
                <UiIcon name="star" :size="26" :filled="isCurrentFavorite" />
              </button>
            </div>
            <p>{{ weatherStore.location.region }}</p>
          </div>
          <div class="detail-temperature">
            <WeatherGlyph :code="weatherStore.current.weatherCode" :size="48" />
            <strong
              >{{ temperature }}<sup>°{{ unit }}</sup></strong
            >
          </div>
        </header>

        <div class="detail-grid-layout">
          <div class="detail-primary-column">
            <FavoriteLocations
              :items="weatherStore.favoriteCities"
              :loading="weatherStore.loading"
              @select="selectFavorite"
            />
            <HourlyForecast :items="weatherStore.hourly" />
            <WeeklyForecast :items="weatherStore.daily" />
          </div>
          <aside class="detail-side-column">
            <WeatherDetailsGrid
              v-if="weatherStore.daily[0]"
              :current="weatherStore.current"
              :today="weatherStore.daily[0]"
            />
            <section class="air-detail" aria-labelledby="air-title">
              <header class="section-heading">
                <h2 id="air-title">대기질</h2>
                <p>현재 관측값</p>
              </header>
              <dl>
                <div>
                  <dt>상태</dt>
                  <dd class="aqi-value" :data-tone="weatherStore.airQuality?.tone">
                    <span class="aqi-dot" aria-hidden="true"></span>
                    {{ weatherStore.airQuality?.label || '정보 없음' }}
                  </dd>
                </div>
                <div>
                  <dt>PM2.5</dt>
                  <dd>{{ weatherStore.airQuality?.pm25 ?? '—' }} <small>μg/m³</small></dd>
                </div>
                <div>
                  <dt>PM10</dt>
                  <dd>{{ weatherStore.airQuality?.pm10 ?? '—' }} <small>μg/m³</small></dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </template>

      <footer class="detail-footer">
        <span>예보 및 대기질 데이터 OpenWeather</span>
        <RouterLink to="/">홈으로 이동</RouterLink>
      </footer>
    </div>
  </main>
</template>
