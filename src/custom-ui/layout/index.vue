<template>
  <div class="custom-ui-layout">
    <div class="layout-header">Vue Customer UI Header</div>
    <keep-alive :include="[]">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'UiLayout',
  data() {
    return {
    }
  },
  computed: {
    key() {
      return this.$route.path + this.$route.query.id
    }
  }
}
</script>

<style lang="scss">
.custom-ui-layout {
  .layout-header {
    padding: 0px 16px;
    height: 40px;
    line-height: 40px;
  }
}

</style>
