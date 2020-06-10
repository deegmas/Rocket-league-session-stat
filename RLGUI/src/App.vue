<template>
  <div id="app">
    <SessionStat />
  </div>
</template>

<script>
import SessionStat from './components/sessionStat.vue'

export default {
  name: 'App',
  components: {
    SessionStat
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
