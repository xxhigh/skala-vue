<script setup>
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const handleSelectCard = (cityName) => {
  emit('select-card', cityName)
}

const handleClickDetail = (cityName, status) => {
  emit('click-detail', cityName, status)
}

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="weather-card" @click="handleSelectCard(cityItem.name)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }} {{ configStore.unitSymbol }}</p>

    <span class="badge hot" v-if="cityItem.temp >= 25">더움 (25도 이상)</span>
    <span class="badge cool" v-else>신선함 (25도 미만)</span>
    <button class="btn-detail" @click.stop="handleClickDetail(cityItem.name, cityItem.status)">
      상세보기
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}

.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
