<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import WeatherSummaryCard from '@/components/weather-app/WeatherSummaryCard.vue'
import UiIcon from '@/components/weather-app/UiIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { getWeatherVideo } from '@/utils/weather'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const weatherVideo = ref(null)
const videoFailed = ref(false)
const reduceMotion = ref(false)
let motionQuery

const videoSource = computed(() =>
  getWeatherVideo(weatherStore.current?.weatherCode ?? 0, weatherStore.current?.isDay ?? true),
)
const posterSource = computed(() =>
  configStore.isDark ? '/resources/bg_dark.jpg' : '/resources/bg_white.jpg',
)
const showVideo = computed(() => !reduceMotion.value && !videoFailed.value)

async function syncVideoPlayback() {
  await nextTick()
  if (!weatherVideo.value || !showVideo.value) return

  if (configStore.videoPaused) {
    weatherVideo.value.pause()
    return
  }

  try {
    await weatherVideo.value.play()
  } catch {
    configStore.setVideoPaused(true)
  }
}

function handleVideoError() {
  videoFailed.value = true
}

function updateMotionPreference(event) {
  reduceMotion.value = event.matches || Boolean(navigator.connection?.saveData)
}

watch(showVideo, (available) => configStore.setVideoAvailable(available), { immediate: true })
watch(
  [() => configStore.videoPaused, videoSource, showVideo],
  () => syncVideoPlayback(),
  { flush: 'post' },
)

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference(motionQuery)
  motionQuery.addEventListener('change', updateMotionPreference)
  weatherStore.initializeLocation()
})

onBeforeUnmount(() => motionQuery?.removeEventListener('change', updateMotionPreference))
</script>

<template>
  <main class="weather-landing">
    <div
      class="media-backdrop"
      :style="{ backgroundImage: `url(${posterSource})` }"
      aria-hidden="true"
    >
      <video
        v-if="showVideo"
        ref="weatherVideo"
        :key="videoSource"
        class="weather-video"
        :autoplay="!configStore.videoPaused"
        muted
        loop
        playsinline
        preload="metadata"
        fetchpriority="high"
        :poster="posterSource"
        @canplay="syncVideoPlayback"
        @error="handleVideoError"
      >
        <source :src="videoSource" type="video/mp4" />
      </video>
    </div>
    <div class="weather-scrim" aria-hidden="true"></div>

    <div class="landing-content">
      <section
        v-if="weatherStore.loading && !weatherStore.current"
        class="weather-skeleton"
        aria-live="polite"
      >
        <span class="sr-only">현재 위치의 날씨를 불러오는 중입니다.</span>
        <Skeleton class="skeleton-line skeleton-location" />
        <Skeleton class="skeleton-line skeleton-temp" />
        <Skeleton class="skeleton-card" />
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

      <template v-else>
        <header class="location-copy">
          <p class="location-line">
            <UiIcon name="location" :size="18" />
            {{ weatherStore.location.name }}
          </p>
          <p class="region-line">{{ weatherStore.location.region }}</p>
          <p v-if="weatherStore.locationFallback" class="fallback-note">
            위치를 확인할 수 없어 서울 날씨를 보여드려요.
          </p>
        </header>

        <WeatherSummaryCard v-if="weatherStore.current" />
      </template>
    </div>

    <footer class="landing-footer">
      <span>날씨·대기질 데이터 OpenWeather</span>
      <span aria-hidden="true">·</span>
      <time v-if="weatherStore.current" :datetime="weatherStore.current.time">방금 업데이트</time>
    </footer>
  </main>
</template>
