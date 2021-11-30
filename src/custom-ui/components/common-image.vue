<template>
  <div class="common-image">
    <el-image :src="src">
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'CommonImage',
  props: {
    data: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      src: ''
    }
  },
  created() {
    this.src = this.data.src || ''
  }
}
</script>

<style scoped>
.common-image {
  text-align: center;
}
</style>
