<script setup>
import WeatherComposition from './components/Weather/WeatherComposition.vue'
import WeatherMockup from './components/Weather/WeatherMockup.vue'
</script>

<template>
  <div class="app-container">
    <h1>Weather Mockup</h1>
    <WeatherMockup />
  </div>

  <div class="app-container">
    <h1>Weather Composition</h1>
    <WeatherComposition />
  </div>
</template>

<style>
@import '@/assets/style.css';
</style>
