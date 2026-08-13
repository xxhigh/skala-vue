<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import { useRoute, useRouter } from 'vue-router'
import UiIcon from './UiIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const isSearchOpen = ref(false)
const searchValue = ref('')
const searchButton = ref(null)
const searchDock = ref(null)
const searchAutocomplete = ref(null)
const isLandingPage = computed(() => route.name === 'home')
const isDetailPage = computed(() => route.name === 'detail')
const isHeaderScrolled = ref(false)
const videoControlLabel = computed(() => {
  if (!configStore.videoAvailable) return '배경 동영상 재생을 사용할 수 없습니다'
  return configStore.videoPaused ? '배경 동영상 재생' : '배경 동영상 일시정지'
})

async function openSearch() {
  isSearchOpen.value = true
  await nextTick()
  searchAutocomplete.value?.$el?.querySelector('input')?.focus()
}

async function closeSearch({ restoreFocus = true } = {}) {
  isSearchOpen.value = false
  searchValue.value = ''
  weatherStore.searchResults = []
  if (!restoreFocus) return
  await nextTick()
  searchButton.value?.focus()
}

function searchCities(event) {
  weatherStore.searchCities(event.query)
}

async function chooseCity(city) {
  const succeeded = await weatherStore.selectCity(city)
  if (!succeeded) return
  await closeSearch({ restoreFocus: false })
  await router.push('/')
}

function handlePointerDown(event) {
  if (isSearchOpen.value && !searchDock.value?.contains(event.target)) {
    closeSearch({ restoreFocus: false })
  }
}

function handleScroll() {
  isHeaderScrolled.value = window.scrollY > 8
}

function handleKeydown(event) {
  if (event.key === 'Escape' && isSearchOpen.value) closeSearch()
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => {
  handleScroll()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('pointerdown', handlePointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<template>
  <header
    class="app-header"
    :class="{
      'is-detail-page': isDetailPage,
      'is-scrolled': isDetailPage && isHeaderScrolled,
    }"
  >
    <Transition name="header-fade">
      <RouterLink v-if="!isSearchOpen" to="/" class="wordmark" aria-label="NUBI 날씨 홈">
        NUBI
      </RouterLink>
    </Transition>

    <div ref="searchDock" class="search-dock" :class="{ 'is-open': isSearchOpen }">
      <button
        ref="searchButton"
        class="search-trigger"
        type="button"
        :aria-expanded="isSearchOpen"
        :aria-hidden="isSearchOpen"
        aria-controls="city-search-surface"
        aria-label="도시 검색"
        :tabindex="isSearchOpen ? -1 : 0"
        @click="openSearch"
      >
        <UiIcon name="search" />
      </button>

      <div v-if="isSearchOpen" id="city-search-surface" class="search-surface" role="search">
        <div class="search-field-wrap">
          <UiIcon name="search" :size="18" />
          <label class="sr-only" for="city-search">도시 검색</label>
          <AutoComplete
            ref="searchAutocomplete"
            v-model="searchValue"
            input-id="city-search"
            class="city-autocomplete"
            input-class="search-input"
            panel-class="search-panel"
            :suggestions="weatherStore.searchResults"
            option-label="name"
            data-key="id"
            placeholder="도시 이름"
            :min-length="2"
            :delay="250"
            :loading="weatherStore.searching"
            :show-empty-message="true"
            empty-search-message="일치하는 도시가 없습니다."
            append-to="self"
            @complete="searchCities"
            @option-select="chooseCity($event.value)"
          >
            <template #option="{ option }">
              <span class="search-result">
                <span>{{ option.name }}</span>
                <small>{{ option.region }}</small>
              </span>
            </template>
            <template #loader>
              <span class="search-loader" aria-hidden="true"></span>
            </template>
          </AutoComplete>
          <button
            class="search-close"
            type="button"
            aria-label="도시 검색 닫기"
            @click="closeSearch"
          >
            <UiIcon name="close" :size="18" />
          </button>
        </div>

        <section
          v-if="typeof searchValue === 'string' && searchValue.length < 2"
          class="recent-panel"
        >
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
        </section>
      </div>
    </div>

    <Transition name="header-fade">
      <div
        v-if="!isSearchOpen"
        class="header-actions"
        aria-label="화면 설정"
      >
        <button
          v-if="isLandingPage"
          class="media-toggle"
          type="button"
          :disabled="!configStore.videoAvailable"
          :aria-pressed="configStore.videoPaused"
          :aria-label="videoControlLabel"
          :title="videoControlLabel"
          @click="configStore.toggleVideoPlayback"
        >
          <UiIcon :name="configStore.videoPaused ? 'play' : 'pause'" :size="18" />
        </button>

        <span v-if="isLandingPage" class="header-actions-divider" aria-hidden="true"></span>

        <button
          class="theme-button"
          type="button"
          :aria-pressed="configStore.isDark"
          :aria-label="configStore.isDark ? '라이트 테마로 변경' : '다크 테마로 변경'"
          @click="configStore.toggleTheme"
        >
          <UiIcon :name="configStore.isDark ? 'moon' : 'sun'" :size="18" />
        </button>
      </div>
    </Transition>
  </header>
</template>
