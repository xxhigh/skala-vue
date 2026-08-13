import { computed, ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { getAirQualityMeta, getWeatherMeta } from '@/utils/weather'

const OPENWEATHER_BASE = 'https://api.openweathermap.org'
const CURRENT_ENDPOINT = '/data/2.5/weather'
const FORECAST_ENDPOINT = '/data/2.5/forecast'
const AIR_ENDPOINT = '/data/2.5/air_pollution'
const DIRECT_GEOCODING_ENDPOINT = '/geo/1.0/direct'
const REVERSE_GEOCODING_ENDPOINT = '/geo/1.0/reverse'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const RECENT_KEY = 'skala-weather-recent-cities'
const FAVORITES_KEY = 'skala-weather-favorite-cities'

const weatherApi = axios.create({
  baseURL: OPENWEATHER_BASE,
  timeout: 10000,
})

const SEOUL = {
  id: 'seoul',
  name: '서울',
  region: '대한민국',
  latitude: 37.5665,
  longitude: 126.978,
  source: 'fallback',
}

const countryNames = new Intl.DisplayNames(['ko'], { type: 'region' })

function readStoredCities(key) {
  try {
    const cities = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(cities) ? cities : []
  } catch {
    return []
  }
}

function getLocationKey(location) {
  const latitude = Number(location?.latitude)
  const longitude = Number(location?.longitude)

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `${latitude.toFixed(4)}:${longitude.toFixed(4)}`
  }

  return String(location?.id || '')
}

function toStoredLocation(location) {
  return {
    id: location.id || getLocationKey(location),
    name: location.name,
    region: location.region,
    latitude: location.latitude,
    longitude: location.longitude,
    source: 'favorite',
  }
}

function requireApiKey() {
  if (API_KEY?.trim()) return
  const requestError = new Error('OpenWeather API 키가 설정되지 않았습니다.')
  requestError.status = 401
  requestError.isMissingKey = true
  throw requestError
}

async function getJson(endpoint, params) {
  try {
    const response = await weatherApi.get(endpoint, { params })
    return response.data
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error

    const requestError = new Error(
      error.response?.data?.message || error.message || '요청에 실패했습니다.',
    )
    requestError.status = error.response?.status
    throw requestError
  }
}

function createCoordinatesParams(location) {
  requireApiKey()
  return {
    lat: location.latitude,
    lon: location.longitude,
    appid: API_KEY.trim(),
  }
}

function createWeatherParams(location) {
  return {
    ...createCoordinatesParams(location),
    units: 'metric',
    lang: 'kr',
  }
}

function toLocationIso(unixTime, timezoneOffset) {
  return new Date((unixTime + timezoneOffset) * 1000).toISOString().slice(0, 19)
}

function toLocationDate(unixTime, timezoneOffset) {
  return toLocationIso(unixTime, timezoneOffset).slice(0, 10)
}

function aggregateDaily(currentData, forecastItems, timezoneOffset, nearestPop) {
  const currentRecord = {
    dt: currentData.dt,
    main: {
      temp_min: currentData.main.temp_min,
      temp_max: currentData.main.temp_max,
    },
    weather: currentData.weather,
    pop: nearestPop,
  }
  const groups = new Map()

  for (const item of [currentRecord, ...forecastItems]) {
    const date = toLocationDate(item.dt, timezoneOffset)
    const group = groups.get(date) || []
    group.push(item)
    groups.set(date, group)
  }

  return [...groups.entries()].slice(0, 5).map(([date, items], index) => {
    const representative = items.reduce((nearest, item) => {
      const hour = Number(toLocationIso(item.dt, timezoneOffset).slice(11, 13))
      const nearestHour = Number(toLocationIso(nearest.dt, timezoneOffset).slice(11, 13))
      return Math.abs(hour - 12) < Math.abs(nearestHour - 12) ? item : nearest
    })

    return {
      date,
      weatherCode: representative.weather[0].id,
      temperatureMax: Math.max(...items.map((item) => item.main.temp_max)),
      temperatureMin: Math.min(...items.map((item) => item.main.temp_min)),
      precipitationProbability: Math.round(Math.max(...items.map((item) => item.pop ?? 0)) * 100),
      sunrise: index === 0 ? toLocationIso(currentData.sys.sunrise, timezoneOffset) : null,
      sunset: index === 0 ? toLocationIso(currentData.sys.sunset, timezoneOffset) : null,
    }
  })
}

function getCountryName(countryCode) {
  try {
    return countryNames.of(countryCode) || countryCode
  } catch {
    return countryCode
  }
}

function mapGeocodingResult(result, source = 'search') {
  const name = result.local_names?.ko || result.name
  return {
    id: `${result.lat.toFixed(4)}-${result.lon.toFixed(4)}`,
    name,
    region: [result.state, getCountryName(result.country)].filter(Boolean).join(', '),
    latitude: result.lat,
    longitude: result.lon,
    source,
  }
}

function getRequestErrorMessage(requestError) {
  if (requestError.isMissingKey) {
    return 'OpenWeather API 키가 없습니다. .env.local에 VITE_OPENWEATHER_API_KEY를 설정해주세요.'
  }
  if (requestError.status === 401) {
    return 'OpenWeather API 키가 유효하지 않거나 아직 활성화되지 않았습니다. 키 상태를 확인해주세요.'
  }
  if (requestError.status === 429) {
    return 'OpenWeather 무료 API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
  }
  return '날씨 정보를 불러오지 못했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.'
}

export const useWeatherStore = defineStore('weather', () => {
  const location = ref(SEOUL)
  const current = ref(null)
  const hourly = ref([])
  const daily = ref([])
  const airQuality = ref(null)
  const searchResults = ref([])
  const recentCities = ref(readStoredCities(RECENT_KEY))
  const favoriteCities = ref(readStoredCities(FAVORITES_KEY))
  const loading = ref(false)
  const searching = ref(false)
  const initialized = ref(false)
  const locationFallback = ref(false)
  const error = ref('')

  const weatherLabel = computed(() => getWeatherMeta(current.value?.weatherCode ?? 800).label)

  async function fetchWeather(nextLocation) {
    loading.value = true
    error.value = ''

    try {
      const weatherParams = createWeatherParams(nextLocation)
      const airParams = createCoordinatesParams(nextLocation)
      const [currentResult, forecastResult, airResult] = await Promise.allSettled([
        getJson(CURRENT_ENDPOINT, weatherParams),
        getJson(FORECAST_ENDPOINT, weatherParams),
        getJson(AIR_ENDPOINT, airParams),
      ])

      if (currentResult.status === 'rejected') throw currentResult.reason
      if (forecastResult.status === 'rejected') throw forecastResult.reason

      const currentData = currentResult.value
      const forecastData = forecastResult.value
      const airData = airResult.status === 'fulfilled' ? airResult.value : null
      const timezoneOffset = forecastData.city.timezone ?? currentData.timezone ?? 0
      const nearestPop = forecastData.list[0]?.pop ?? 0

      current.value = {
        temperature: currentData.main.temp,
        apparentTemperature: currentData.main.feels_like,
        precipitationProbability: Math.round(nearestPop * 100),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6 * 10) / 10,
        weatherCode: currentData.weather[0].id,
        isDay: currentData.dt >= currentData.sys.sunrise && currentData.dt < currentData.sys.sunset,
        time: toLocationIso(currentData.dt, timezoneOffset),
      }
      hourly.value = forecastData.list.map((item) => ({
        time: toLocationIso(item.dt, timezoneOffset),
        temperature: item.main.temp,
        precipitationProbability: Math.round((item.pop ?? 0) * 100),
        weatherCode: item.weather[0].id,
      }))
      daily.value = aggregateDaily(currentData, forecastData.list, timezoneOffset, nearestPop)

      const airSample = airData?.list?.[0]
      const pm25 = airSample?.components?.pm2_5 ?? null
      airQuality.value = {
        pm25,
        pm10: airSample?.components?.pm10 ?? null,
        aqi: airSample?.main?.aqi ?? null,
        ...getAirQualityMeta(pm25),
      }
      location.value = { ...nextLocation, timezoneOffset }
      return true
    } catch (requestError) {
      error.value = getRequestErrorMessage(requestError)
      return false
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  function getBrowserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('위치 기능을 지원하지 않는 브라우저입니다.'))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      })
    })
  }

  async function reverseGeocode(latitude, longitude) {
    requireApiKey()
    const params = {
      lat: latitude,
      lon: longitude,
      limit: '1',
      appid: API_KEY.trim(),
    }
    const results = await getJson(REVERSE_GEOCODING_ENDPOINT, params)
    return results[0] ? mapGeocodingResult(results[0], 'geolocation') : null
  }

  async function initializeLocation() {
    if (initialized.value) return
    let nextLocation
    try {
      const position = await getBrowserLocation()
      locationFallback.value = false
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      nextLocation = (await reverseGeocode(latitude, longitude).catch(() => null)) || {
        id: 'current-location',
        name: '현재 위치',
        region: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        latitude,
        longitude,
        source: 'geolocation',
      }
    } catch {
      locationFallback.value = true
      nextLocation = SEOUL
    }
    await fetchWeather(nextLocation)
  }

  async function searchCities(query) {
    if (query.trim().length < 2) {
      searchResults.value = []
      return
    }
    searching.value = true
    try {
      requireApiKey()
      const params = {
        q: query.trim(),
        limit: '5',
        appid: API_KEY.trim(),
      }
      const data = await getJson(DIRECT_GEOCODING_ENDPOINT, params)
      searchResults.value = data.map((result) => mapGeocodingResult(result))
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }

  async function selectCity(city) {
    const succeeded = await fetchWeather(city)
    if (!succeeded) return false
    const withoutDuplicate = recentCities.value.filter((item) => item.id !== city.id)
    recentCities.value = [city, ...withoutDuplicate].slice(0, 5)
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentCities.value))
    searchResults.value = []
    locationFallback.value = false
    return true
  }

  function isSameLocation(firstLocation, secondLocation) {
    const firstKey = getLocationKey(firstLocation)
    return Boolean(firstKey) && firstKey === getLocationKey(secondLocation)
  }

  function isFavoriteLocation(nextLocation) {
    return favoriteCities.value.some((city) => isSameLocation(city, nextLocation))
  }

  function toggleFavorite(nextLocation) {
    const locationKey = getLocationKey(nextLocation)
    if (!locationKey) return false

    if (isFavoriteLocation(nextLocation)) {
      favoriteCities.value = favoriteCities.value.filter(
        (city) => !isSameLocation(city, nextLocation),
      )
    } else {
      favoriteCities.value = [
        toStoredLocation(nextLocation),
        ...favoriteCities.value.filter((city) => !isSameLocation(city, nextLocation)),
      ]
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteCities.value))
    return isFavoriteLocation(nextLocation)
  }

  async function selectFavorite(city) {
    const succeeded = await fetchWeather(city)
    if (succeeded) locationFallback.value = false
    return succeeded
  }

  async function retry() {
    await fetchWeather(location.value || SEOUL)
  }

  return {
    location,
    current,
    hourly,
    daily,
    airQuality,
    searchResults,
    recentCities,
    favoriteCities,
    loading,
    searching,
    initialized,
    locationFallback,
    error,
    weatherLabel,
    initializeLocation,
    searchCities,
    selectCity,
    selectFavorite,
    isSameLocation,
    isFavoriteLocation,
    toggleFavorite,
    retry,
  }
})
