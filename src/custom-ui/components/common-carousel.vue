<template>
  <el-carousel :height="configs.cssKeys.config.height + 'px'" class="common-carousel">
    <el-carousel-item v-for="(item, index) in dataItems" :key="index">
      <div :style="{'background': 'url('+item.src+') no-repeat center/cover'}" class="img-item" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: 'CommonCarousel',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    configs: {
      type: Object,
      default() {
        return {
          cssKeys: {
            title: 'css属性设置',
            type: 2,
            config: {
              height: 320
            }
          }
        }
      }
    }
  },
  data() {
    return {
      dataItems: []
    }
  },
  created() {
    this.dataItems = this.data.dataItems || []
  }
}
</script>

<style lang="scss" scoped>

.common-carousel {
  background: #0a76a4;
  .img-item {
    width: 100%;
    height: 100%;
  }
  .small {
    text-align: center;
    color: white;
  }
}
</style>
