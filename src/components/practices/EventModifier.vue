<script setup>
const handleLink = () => {
  alert('수식어 덕분에 네이버로 이동하지 않습니다!')
}

const handleBox = () => {
  alert('부모 박스 클릭!')
}

const handleChild1 = () => {
  alert('자식 박스 1 클릭!')
}

const handleChild2 = () => {
  alert('자식 박스 2 클릭!')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어 학습</h2>
    <h3>1) .prevent (기본 동작 막기)</h3>
    <a href="https://www.naver.com" @click.prevent="handleLink">네이버로 이동</a>
    <br />

    <h3>2) .stop 이벤트 버블링 막기</h3>
    <div @click="handleBox" style="padding: 20px; border: 1px solid #42b883; margin-top: 10px">
      <p>부모 영역 (클릭 시 alert 띄우기)</p>
      <button @click="handleChild1">자식 박스 1</button>
      <button @click.stop="handleChild2">자식 박스 2</button>
    </div>
  </div>
</template>
