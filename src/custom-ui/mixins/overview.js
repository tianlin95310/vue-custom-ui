import { createdMethods, dataSources } from '@/custom-ui/pages/utils/constants'

export default {
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
        if (dataConfig.dataSource === 'InnerHttp') {
          const res = await this.$http.post(dataConfig.url)
          dataConfig.data = res.data
        }
      }
    }
    for (const key in this.$route.query) {
      pageData[key] = {
        disabled: true,
        dataType: 'String',
        dataSource: dataSources[3].value,
        url: window.atob(this.$route.query[key]),
        createdMethod: createdMethods[0].value
      }
    }
    // 为组件们赋值
    const comps = page.comps
    comps.forEach(item => {
      if (item.dataSourceKey) {
        item.data[item.dataKey] = pageData[item.dataSourceKey].data
      }
      if (item.configs) {
        for (const key in item.configs) {
          const config = item.configs[key]
          // 页面表单
          if (config.type === 4) {
            for (const key in config.items) {
              pageData[key] = {
                disabled: true,
                key: key,
                dataType: 'String',
                dataSource: 'form',
                createdMethod: 'mounted',
                url: ''
              }
            }
            for (const formKey in config.items) {
              const formItems = config.items[formKey]
              // 为下拉组件赋值
              if (formItems.component === 'el-select' && formItems.optionKey) {
                formItems.options = pageData[formItems.optionKey].data
              }
            }
          }
        }
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
          path: this.$route.path,
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
          console.log('res---', res)
        }).catch(error => {
          console.log('error---', error)
        })
      }
    }
  }
}
