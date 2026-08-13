<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
  filled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"
      />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" />
    </template>
    <template v-else-if="name === 'location'">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </template>
    <template v-else-if="name === 'drop'">
      <path d="M12 2s6 6.3 6 12a6 6 0 0 1-12 0c0-5.7 6-12 6-12Z" />
    </template>
    <template v-else-if="name === 'wind'">
      <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />
    </template>
    <template v-else-if="name === 'sunrise'">
      <path d="M4 18h16M6 14a6 6 0 0 1 12 0M12 2v3M4.93 6.93l2.12 2.12M19.07 6.93l-2.12 2.12" />
    </template>
    <template v-else-if="name === 'sunset'">
      <path d="M4 18h16M6 14a6 6 0 0 1 12 0M12 7V4M9 7l3 3 3-3" />
    </template>
    <template v-else-if="name === 'thermometer'">
      <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z" />
    </template>
    <template v-else-if="name === 'refresh'">
      <path d="M20 6v5h-5M4 18v-5h5M6.1 9A7 7 0 0 1 18 6l2 5M4 13l2 5a7 7 0 0 0 11.9-3" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 2.8 2.83 5.73 6.32.92-4.57 4.45 1.08 6.29L12 17.22l-5.66 2.97 1.08-6.29-4.57-4.45 6.32-.92L12 2.8Z" />
    </template>
    <template v-else-if="name === 'play'">
      <path d="m8 5 11 7-11 7V5Z" />
    </template>
    <template v-else-if="name === 'pause'">
      <path d="M9 5v14M15 5v14" />
    </template>
  </svg>
</template>
