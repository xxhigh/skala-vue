const WEATHER_META = {
  clear: { label: '맑음', video: 'sunny' },
  cloudy: { label: '구름 많음', video: 'cloudy' },
  fog: { label: '안개', video: 'cloudy' },
  drizzle: { label: '이슬비', video: 'rain' },
  rain: { label: '비', video: 'rain' },
  snow: { label: '눈', video: 'snowfall' },
  storm: { label: '천둥번개', video: 'storm' },
}

export function getWeatherType(code) {
  if (code >= 200 && code < 300) return 'storm'
  if (code >= 300 && code < 400) return 'drizzle'
  if (code >= 500 && code < 600) return 'rain'
  if (code >= 600 && code < 700) return 'snow'
  if (code >= 700 && code < 800) return 'fog'
  if (code > 800 && code < 900) return 'cloudy'
  return 'clear' // code: 800
}

export function getWeatherMeta(code) {
  return WEATHER_META[getWeatherType(code)]
}

export function getWeatherVideo(code, isDay = true) {
  const type = getWeatherType(code)
  const resource = WEATHER_META[type]?.video

  // TODO: 전용 리소스가 없는 새로운 날씨 유형은 sunny 영상으로 대체한다.
  if (!resource) return '/resources/sunny_0.mp4'

  const variant = isDay ? 0 : 1
  return `/resources/${resource}_${variant}.mp4`
}

export function getAirQualityMeta(pm25) {
  if (pm25 == null) return { label: '정보 없음', tone: 'unknown' }
  if (pm25 <= 15) return { label: '좋음', tone: 'good' }
  if (pm25 <= 35) return { label: '보통', tone: 'fair' }
  if (pm25 <= 75) return { label: '나쁨', tone: 'poor' }
  return { label: '매우 나쁨', tone: 'bad' }
}

export function formatTemperature(value, unit) {
  if (value == null) return '—'
  return unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : Math.round(value)
}

export function formatHour(dateString) {
  return new Intl.DateTimeFormat('ko-KR', { hour: 'numeric' }).format(new Date(dateString))
}

export function formatDay(dateString, index) {
  if (index === 0) return '오늘'
  return new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(new Date(dateString))
}

export function formatClock(dateString) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString))
}
