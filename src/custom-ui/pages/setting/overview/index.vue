<template>
  <div class="app-container overview">
    <component
      :is="comp.component"
      v-for="(comp, index) in page.comps"
      :key="index"
      :data="comp.data"
      :configs="comp.configs"
      @onActionClick="onActionClick"
    />
  </div>
</template>

<script>
import overview from '@/custom-ui/mixins/overview'
export default {
  name: 'Edit',
  pageId: '',
  components: {},
  mixins: [
    overview
  ],
  data() {
    return {
      editIndex: -1,
      page: {
        pageData: {},
        comps: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.overview {
  .component-item {
    position: relative;

    .item-operate {
      position: absolute;
      z-index: 50;
      top: 0px;
      left: -16px;
    }

    .item-operate-other {
      position: absolute;
      z-index: 50;
      top: -36px;
      left: -16px;
    }
  }

  .add-component {
    text-align: center;
  }
}
</style>
