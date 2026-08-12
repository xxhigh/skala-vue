<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const handleUpdateQuery = (query) => {
  emit('update-query', query)
}
</script>

<template>
  <div>
    <h3>🔎 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="(e) => handleUpdateQuery(e.target.value)"
      placeholder="검색할 도시를 입력하세요."
    />
    <p>검색중인 도시: {{ currentQuery }}</p>
  </div>
</template>

<style scoped>
input {
  padding: 8px;
  width: 90%;
  font-size: 14px;
}
</style>
