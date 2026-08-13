import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const theme = ref('light')
  const videoPaused = ref(false)
  const videoAvailable = ref(true)
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°' : '°'))
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(nextTheme) {
    theme.value = nextTheme
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('skala-weather-theme', nextTheme)
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem('skala-weather-theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    applyTheme(savedTheme || systemTheme)
  }

  function toggleTheme() {
    applyTheme(isDark.value ? 'light' : 'dark')
  }

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  function toggleVideoPlayback() {
    if (!videoAvailable.value) return
    videoPaused.value = !videoPaused.value
  }

  function setVideoPaused(paused) {
    videoPaused.value = paused
  }

  function setVideoAvailable(available) {
    videoAvailable.value = available
  }

  return {
    unit,
    unitSymbol,
    theme,
    isDark,
    videoPaused,
    videoAvailable,
    initializeTheme,
    toggleTheme,
    toggleUnit,
    toggleVideoPlayback,
    setVideoPaused,
    setVideoAvailable,
  }
})
