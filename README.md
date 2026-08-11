# Skala-vue
본 프로젝트는 Vue3 기반 날씨 어플리케이션입니다.

## 1. Weather Mockup & Weather Composition

![Screenshot1](./images/000_full.png)

![ScreenSho2](./images/001_mockup_tip.png)

![Screenshot3](./images/002_composition.png)

_실습 2일차까지 완성된 모습_

### 파일 경로

```js
// Weather Mockup
src/components/Weather/WeatherMockup.vue
```

```js
// Weather Composition
src/components/Weather/WeatherComposition.vue
```

### Weather Mockup

**요구사항**
- [x] 배열 렌더링 (v-for)
- [x] 조건부 렌더링 (v-if)
- [x] 양방향 바인딩 및 한글 처리
- [x] 이벤트 및 수식어
- [x] 본인만의 데이터 추가
  - `isTipVisible` 상태 변수 추가

#### 추가 사항 설명

**스냅샷**
![show](./images/003_mockup_show.png)
- 왼쪽 목업의 오늘의 팁 영역이 노출됩니다.

![hide](./images/001_mockup_tip.png)
- 오늘의 팁 버튼을 클릭시 토글이되면서 영역이 사라집니다.

```js
const isTipVisible = ref(true)
```
```html
<button @click="isTipVisible = !isTipVisible">오늘의 팁</button>
<div v-show="isTipVisible" class="tip-box">
  <p>더운 날씨에는 그늘에서 쉬어가는 것이 좋습니다. 😄</p>
</div>
```
- button 클릭시 `isTipVisible`의 상태가 토글됩니다.
- v-show를 이용해서 `isTipVisible`를 바인딩했습니다.

### Weather Composition

**요구사항**
- [x] 반응형 상태 관리
- [x] 검색 도시(Computed)
- [x] 반응형 변수 변화 감시
- [x] 검색 결과 표시
- [x] 본인만의 반응형 상태 변수, Computed, Watcher 추가
  - `오늘의 팁 추가`

#### 추가 사항 설명

**스냅샷**
![composition](./images/002_composition.png)

**코드**
```js
const tips = ref([
  '더운 날씨에는 그늘에서 쉬어가는 것이 좋아요. 😄',
  '충분한 수분을 섭취해주세요. 🚰',
  '어지러움이 느껴진다면 즉시 시원한 곳으로 이동해주세요. 😵‍💫',
])

const tip = computed(() => {
  return selectedTipIndex.value === null
    ? '💡 상단의 오늘의 팁을 클릭해보세요 !'
    : tips.value[selectedTipIndex.value]
})
const selectedTipIndex = ref(null)

const refreshTip = () => {
  const r = Math.random()
  selectedTipIndex.value = r >= 0.6 ? 0 : r >= 0.3 ? 1 : 2
}

watch(tip, (newValue) => {
  console.log(`[Watch 감지] 오늘의 팁이 갱신되었습니다. -> "${newValue}"`)
})
```
- `tips`배열에 날씨 상황에 맞는 안내 문구 3개를 저장했습니다.
- `tip`은 의존하는 반응형 데이터 `selectedTipIndex`가 변경되면 새로 계산됩니다.
- `selectedTipIndex`라는 반응형 변수를 선언하고 현재 선택된 팁의 인덱스를 반응형으로 관리합니다.
- `refreshTip()` 함수를 호출할 때마다 난수를 생성하고 `selectedTipIndex`를 갱신합니다.
- `watch`를 통해 오늘의 팁이 변경될 때마다 콘솔에 출력됩니다.