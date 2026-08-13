<script setup>
import { onMounted } from 'vue'
import WeatherHeader from '@/components/weather-app/WeatherHeader.vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

onMounted(() => configStore.initializeTheme())
</script>

<template>
  <div class="weather-app">
    <WeatherHeader />
    <RouterView />
  </div>
</template>
