<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const lens = ref(null)
const isVisible = ref(false)
let pointerQuery
let motionQuery
let animationFrame
let pointerX = 0
let pointerY = 0

function canShowLens() {
  return pointerQuery?.matches && !motionQuery?.matches
}

function renderPosition() {
  lens.value?.style.setProperty('--pointer-x', `${pointerX}px`)
  lens.value?.style.setProperty('--pointer-y', `${pointerY}px`)
  animationFrame = undefined
}

function handlePointerMove(event) {
  if (!canShowLens() || event.pointerType === 'touch') return

  pointerX = event.clientX
  pointerY = event.clientY
  isVisible.value = true

  if (!animationFrame) animationFrame = window.requestAnimationFrame(renderPosition)
}

function hideLens() {
  isVisible.value = false
}

function handlePointerOut(event) {
  if (!event.relatedTarget) hideLens()
}

function handlePreferenceChange() {
  if (!canShowLens()) hideLens()
}

onMounted(() => {
  pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerout', handlePointerOut)
  window.addEventListener('blur', hideLens)
  pointerQuery.addEventListener('change', handlePreferenceChange)
  motionQuery.addEventListener('change', handlePreferenceChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerout', handlePointerOut)
  window.removeEventListener('blur', hideLens)
  pointerQuery?.removeEventListener('change', handlePreferenceChange)
  motionQuery?.removeEventListener('change', handlePreferenceChange)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div
    ref="lens"
    class="pointer-blur"
    :class="{ 'is-visible': isVisible }"
    aria-hidden="true"
  ></div>
</template>
