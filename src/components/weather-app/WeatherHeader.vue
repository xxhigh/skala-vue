<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UiIcon from './UiIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
let searchTimer

watch(searchQuery, (query) => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => weatherStore.searchCities(query), 250)
})

async function openSearch() {
  isSearchOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}

function closeSearch() {
  isSearchOpen.value = false
  searchQuery.value = ''
  weatherStore.searchResults = []
}

async function chooseCity(city) {
  const succeeded = await weatherStore.selectCity(city)
  if (!succeeded) return
  closeSearch()
  await router.push('/')
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isSearchOpen.value) closeSearch()
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

window.addEventListener('keydown', handleKeydown)
onBeforeUnmount(() => {
  window.clearTimeout(searchTimer)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="app-header">
    <nav class="nav-pill" aria-label="주요 메뉴">
      <RouterLink to="/" class="wordmark" aria-label="NUBI 날씨 홈">NUBI</RouterLink>

      <div class="search-control" :class="{ 'is-open': isSearchOpen }">
        <button
          v-if="!isSearchOpen"
          class="icon-button"
          type="button"
          aria-label="도시 검색 열기"
          @click="openSearch"
        >
          <UiIcon name="search" />
        </button>

        <div v-else class="search-field-wrap">
          <UiIcon name="search" :size="18" />
          <label class="sr-only" for="city-search">도시 검색</label>
          <input
            id="city-search"
            ref="searchInput"
            v-model="searchQuery"
            class="search-input"
            type="search"
            placeholder="도시 이름"
            autocomplete="off"
            role="combobox"
            aria-controls="city-search-results"
            :aria-expanded="Boolean(searchQuery.length >= 2)"
          />
          <button
            class="search-close"
            type="button"
            aria-label="도시 검색 닫기"
            @click="closeSearch"
          >
            <UiIcon name="close" :size="18" />
          </button>

          <div id="city-search-results" class="search-panel" role="listbox">
            <template v-if="searchQuery.length < 2">
              <p class="search-panel-title">최근 검색</p>
              <div v-if="weatherStore.recentCities.length" class="recent-list">
                <button
                  v-for="city in weatherStore.recentCities"
                  :key="city.id"
                  type="button"
                  class="recent-chip"
                  @click="chooseCity(city)"
                >
                  {{ city.name }}
                </button>
              </div>
              <p v-else class="search-empty">최근 검색한 도시가 없습니다.</p>
            </template>

            <p v-else-if="weatherStore.searching" class="search-empty" aria-live="polite">
              도시를 찾는 중…
            </p>
            <template v-else-if="weatherStore.searchResults.length">
              <button
                v-for="city in weatherStore.searchResults"
                :key="city.id"
                type="button"
                class="search-result"
                role="option"
                @click="chooseCity(city)"
              >
                <span>{{ city.name }}</span>
                <small>{{ city.region }}</small>
              </button>
            </template>
            <p v-else class="search-empty" aria-live="polite">
              일치하는 도시가 없습니다. 다른 이름으로 검색해주세요.
            </p>
          </div>
        </div>
      </div>

      <button
        class="icon-button"
        type="button"
        :aria-label="configStore.isDark ? '라이트 테마로 변경' : '다크 테마로 변경'"
        @click="configStore.toggleTheme"
      >
        <UiIcon :name="configStore.isDark ? 'sun' : 'moon'" />
      </button>
    </nav>
  </header>
</template>
