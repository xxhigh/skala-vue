<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import WeatherComposition from './components/Weather/WeatherComposition.vue'
import WeatherMockup from './components/Weather/WeatherMockup.vue'
import WeatherParent from './components/Weather/WeatherParent.vue'
import UnitToggler from './components/Weather/UnitToggler.vue'
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

  <div class="app-container">
    <h1>과제 3: Weather Component</h1>
    <WeatherParent />
  </div>

  <div class="app-container">
    <h1>과제 4: Router</h1>
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>

  <div class="app-container">
    <h1>과제 5: Store</h1>
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        <UnitToggler />
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/style.css';
</style>
