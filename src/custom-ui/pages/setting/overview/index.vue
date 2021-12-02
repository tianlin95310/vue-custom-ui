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
export default {
  name: 'Edit',
  pageId: '',
  components: {},
  data() {
    return {
      editIndex: -1,
      page: {
        pageData: {},
        comps: []
      }
    }
  },
  async created() {
    this.$options.pageId = window.atob(this.$route.query.id)
    const json = localStorage.getItem(this.$options.pageId)
    const page = JSON.parse(json) || {
      pageData: {},
      comps: []
    }

    const pageData = page.pageData

    // 获取各数据项的值
    for (const key in pageData) {
      const dataConfig = pageData[key]
      if (dataConfig.createdMethod === 'created') {
        if (dataConfig.url) {
          const res = await this.$http.post(dataConfig.url)
          dataConfig.data = res.data
        }
      }
    }

    // 为组件们赋值
    const comps = page.comps
    comps.forEach(item => {
      if (item.dataSourceKey) {
        item.data[item.dataKey] = pageData[item.dataSourceKey].data
      }
    })
    console.log('this.pageData---', pageData)
    console.log('this.comps---', comps)

    this.page = page
  },
  methods: {
    onActionClick({ dataSource, action }) {
      console.log('onActionClick---', dataSource, action)
      if (action.operateType === 'push') {
        this.$router.push({
          path: '/setting/overview',
          query: {
            id: window.btoa(action.url)
          }
        })
      } else {
        const req = {}
        action.params.forEach(item => {
          req[item] = dataSource[item]
        })
        this.$http.post(action.url, req).then(res => {
        })
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
