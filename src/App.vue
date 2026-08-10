<script setup>
import SampleOne from './components/practices/SampleOne.vue'
import SampleTwo from './components/practices/SampleTwo.vue'
import VueHtml from './components/practices/VueHtml.vue'
import VueHtmlXSS from './components/practices/VueHtmlXSS.vue'
import VueText from './components/practices/VueText.vue'
import VueBind from './components/practices/VueBind.vue'
import VueBindClass from './components/practices/VueBindClass.vue'
import VueBindStyle from './components/practices/VueBindStyle.vue'
import VueBindShort from './components/practices/VueBindShort.vue'
</script>

<template>
  <div style="padding: 20px">
    <SampleOne />
    <hr style="margin: 20px 0" />
    <SampleTwo />
    <hr style="margin: 20px 0" />
    <VueHtml />
    <hr style="margin: 20px 0" />
    <VueHtmlXSS />
    <hr style="margin: 20px 0" />
    <VueText />
    <hr style="margin: 20px 0" />
    <VueBind />
    <hr style="margin: 20px 0" />
    <VueBindClass />
    <hr style="margin: 20px 0" />
    <VueBindStyle />
    <hr style="margin: 20px 0" />
    <VueBindShort />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
