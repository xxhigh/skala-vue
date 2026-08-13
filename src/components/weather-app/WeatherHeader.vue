<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Popover from 'primevue/popover'
import ToggleSwitch from 'primevue/toggleswitch'
import { useRouter } from 'vue-router'
import UiIcon from './UiIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const isSearchOpen = ref(false)
const searchValue = ref('')
const searchButton = ref(null)
const searchPopover = ref(null)

const themeSwitchPt = {
  input: { class: 'theme-switch-input' },
  slider: { class: 'theme-switch-slider' },
  handle: { class: 'theme-switch-handle' },
}

async function openSearch(event) {
  const anchor = event?.currentTarget || searchButton.value
  if (!anchor) return
  searchPopover.value?.show({ currentTarget: anchor }, anchor)
  await nextTick()
}

function closeSearch() {
  searchPopover.value?.hide()
  searchValue.value = ''
  weatherStore.searchResults = []
}

function searchCities(event) {
  weatherStore.searchCities(event.query)
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
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="app-header">
    <nav class="nav-pill" aria-label="주요 메뉴">
      <RouterLink to="/" class="wordmark" aria-label="NUBI 날씨 홈">NUBI</RouterLink>

      <div class="search-control">
        <button
          ref="searchButton"
          class="icon-button"
          type="button"
          :aria-expanded="isSearchOpen"
          aria-haspopup="dialog"
          aria-label="도시 검색"
          @click="openSearch"
        >
          <UiIcon name="search" />
        </button>
      </div>

      <ToggleSwitch
        :model-value="configStore.isDark"
        class="theme-switch"
        :pt="themeSwitchPt"
        :aria-label="configStore.isDark ? '라이트 테마로 변경' : '다크 테마로 변경'"
        @update:model-value="configStore.toggleTheme"
      >
        <template #handle="{ checked }">
          <UiIcon :name="checked ? 'moon' : 'sun'" :size="16" />
        </template>
      </ToggleSwitch>
    </nav>

    <Popover
      ref="searchPopover"
      class="search-popover"
      :dismissable="true"
      :close-on-escape="true"
      @show="isSearchOpen = true"
      @hide="isSearchOpen = false"
    >
      <div class="search-surface">
        <div class="search-field-wrap">
          <UiIcon name="search" :size="18" />
          <label class="sr-only" for="city-search">도시 검색</label>
          <AutoComplete
            v-model="searchValue"
            input-id="city-search"
            class="city-autocomplete"
            input-class="search-input"
            panel-class="search-panel"
            :input-props="{ autofocus: true }"
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

        <section v-if="typeof searchValue === 'string' && searchValue.length < 2" class="recent-panel">
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
    </Popover>
  </header>
</template>
