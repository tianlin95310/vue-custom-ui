<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    console.log('navigator.language', navigator.language)
  }
}
</script>
