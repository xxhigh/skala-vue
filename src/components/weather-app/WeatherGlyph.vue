<script setup>
import { computed } from 'vue'
import { getWeatherType } from '@/utils/weather'

const props = defineProps({
  code: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: 32,
  },
})

const type = computed(() => getWeatherType(props.code))
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="type === 'clear'">
      <circle cx="24" cy="24" r="8" />
      <path
        d="M24 4v5M24 39v5M4 24h5M39 24h5M9.9 9.9l3.5 3.5M34.6 34.6l3.5 3.5M9.9 38.1l3.5-3.5M34.6 13.4l3.5-3.5"
      />
    </template>
    <template v-else>
      <path d="M13 31h23a8 8 0 0 0 0-16 12 12 0 0 0-22-3 9.5 9.5 0 0 0-1 19Z" />
      <template v-if="['rain', 'drizzle'].includes(type)">
        <path d="m17 36-2 5M26 36l-2 5M35 36l-2 5" />
      </template>
      <template v-else-if="type === 'snow'">
        <path
          d="M17 37v5M14.8 38.3l4.4 2.4M19.2 38.3l-4.4 2.4M31 37v5M28.8 38.3l4.4 2.4M33.2 38.3l-4.4 2.4"
        />
      </template>
      <template v-else-if="type === 'storm'">
        <path d="m26 33-5 8h5l-2 5 8-10h-5l2-3" />
      </template>
      <template v-else-if="type === 'fog'">
        <path d="M10 36h28M14 41h20" />
      </template>
    </template>
  </svg>
</template>
