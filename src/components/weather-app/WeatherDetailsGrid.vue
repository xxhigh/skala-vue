<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { formatClock, formatTemperature } from '@/utils/weather'
import UiIcon from './UiIcon.vue'

const props = defineProps({
  current: {
    type: Object,
    required: true,
  },
  today: {
    type: Object,
    required: true,
  },
})

const configStore = useConfigStore()
const apparentTemperature = computed(() =>
  formatTemperature(props.current.apparentTemperature, configStore.unit),
)
</script>

<template>
  <section class="details-section" aria-labelledby="details-title">
    <header class="section-heading">
      <h2 id="details-title">오늘의 상세 정보</h2>
      <p>생활에 필요한 관측값</p>
    </header>
    <dl class="details-grid">
      <div>
        <dt><UiIcon name="thermometer" /> 체감 온도</dt>
        <dd>{{ apparentTemperature }}°</dd>
      </div>
      <div>
        <dt><UiIcon name="drop" /> 습도</dt>
        <dd>{{ current.humidity }}%</dd>
      </div>
      <div>
        <dt><UiIcon name="wind" /> 풍속</dt>
        <dd>{{ current.windSpeed }} <small>km/h</small></dd>
      </div>
      <div>
        <dt><UiIcon name="sunrise" /> 일출</dt>
        <dd>{{ formatClock(today.sunrise) }}</dd>
      </div>
      <div>
        <dt><UiIcon name="sunset" /> 일몰</dt>
        <dd>{{ formatClock(today.sunset) }}</dd>
      </div>
    </dl>
  </section>
</template>
