<script setup>
import { useWeatherStore } from '@/stores/weatherStore'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])
const weatherStore = useWeatherStore()
</script>

<template>
  <section class="favorites-section" aria-labelledby="favorites-title">
    <header class="section-heading">
      <h2 id="favorites-title">즐겨찾기 지역</h2>
      <p>{{ items.length ? `${items.length}개 지역` : '별표로 지역을 추가해보세요' }}</p>
    </header>

    <div v-if="items.length" class="favorites-list">
      <button
        v-for="city in items"
        :key="`${city.latitude}-${city.longitude}`"
        type="button"
        class="favorite-city"
        :class="{ 'is-current': weatherStore.isSameLocation(city, weatherStore.location) }"
        :aria-current="weatherStore.isSameLocation(city, weatherStore.location) ? 'location' : undefined"
        :disabled="loading"
        @click="emit('select', city)"
      >
        {{ city.name }}
      </button>
    </div>

    <p v-else class="favorites-empty">
      제목 옆 별을 눌러 지역을 추가할 수 있어요.
    </p>
  </section>
</template>
