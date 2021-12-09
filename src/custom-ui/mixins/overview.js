import { createdMethods, dataSources } from '@/custom-ui/pages/utils/constants'

export default {
  /**
   * created
   * @returns {Promise<void>}
   */
  async created() {
    this.$options.pageId = window.atob(this.$route.query.id)
    const json = localStorage.getItem(this.$options.pageId)

    const page = JSON.parse(json) || {
      pageData: {},
      comps: []
    }

    const pageData = page.pageData

    // 将界面传参添加到当前页面数据源中，无法编辑
    for (const key in this.$route.query) {
      pageData[key] = {
        disabled: true,
        dataType: 'String',
        dataSource: dataSources[3].value,
        url: window.atob(this.$route.query[key]),
        data: window.atob(this.$route.query[key]),
        createdMethod: createdMethods[0].value,
        params: []
      }
    }
    // 将表单数据记录到页面数据源，无法编辑
    const comps = page.comps
    comps.forEach(item => {
      for (const key in item.configs) {
        const config = item.configs[key]
        // 页面表单
        if (config.type === 4) {
          for (const key in config.items) {
            pageData[key] = {
              disabled: true,
              dataType: 'String',
              dataSource: 'form',
              url: '',
              data: '',
              createdMethod: 'mounted',
              params: []
            }
          }
        }
      }
    })

    // 获取各页面数据源的值
    for (const key in pageData) {
      const dataConfig = pageData[key]
      if (dataConfig.createdMethod === 'created') {
        if (dataConfig.dataSource === 'InnerHttp') {
          const req = {}
          dataConfig.params.forEach(item => {
            req[item] = this.page.pageData[item] ?? ''
          })
          const res = await this.$http.post(dataConfig.url, req)
          dataConfig.data = res.data
        }
      }
    }
    // 为组件需要读取数据源的组件赋值
    comps.forEach((item, index) => {
      // 为绑定了数据源的组件进行赋值，并再数据源中记录组件的索引，用于刷新
      if (item.dataSourceKey) {
        item.data = pageData[item.dataSourceKey].data
        pageData[item.dataSourceKey].compIndex = index
      }
      for (const key in item.configs) {
        const config = item.configs[key]
        // 页面表单
        if (config.type === 4) {
          // 为表单中绑定了数据原的组件进行赋值
          for (const formKey in config.items) {
            const formItems = config.items[formKey]
            // 为下拉组件赋值
            if (formItems.component === 'el-select' && formItems.optionKey) {
              formItems.options = pageData[formItems.optionKey].data
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
    async updatePageData(key) {
      const dataConfig = this.page.pageData[key]
      if (dataConfig.createdMethod === 'created') {
        if (dataConfig.dataSource === 'InnerHttp') {
          const req = {}
          dataConfig.params.forEach(item => {
            req[item] = this.page.pageData[item].data ?? ''
          })
          const res = await this.$http.post(dataConfig.url, req)
          dataConfig.data = res.data
        }
      }
      const compIndex = dataConfig.compIndex
      if (compIndex) {
        const item = this.page.comps[compIndex]
        if (item.dataSourceKey) {
          item.data = dataConfig.data
        }
        this.$set(this.page.comps, compIndex, item)
        // this.$forceUpdate()
      }
    },
    onChange({ datas, from, key }) {
      if (from === 'CommonForm') {
        if (key === 'form') {
          for (const key in datas) {
            this.page.pageData[key] = {
              disabled: true,
              key: key,
              dataType: 'String',
              dataSource: 'form',
              createdMethod: 'mounted',
              url: datas[key],
              data: datas[key]
            }
          }
        }
      }
    },
    onActionClick({ dataSource, action }) {
      console.log('onActionClick---', dataSource, action)
      if (action.operateType === 'push') {
        this.$router.push({
          path: this.$route.path,
          query: {
            id: window.btoa(action.url)
          }
        })
      } else if (action.operateType === 'http') {
        const req = {}
        action.params.forEach(item => {
          req[item] = dataSource[item]
        })
        this.$http.post(action.url, req).then(res => {
          console.log('res---', res)
          this.$message.success(res.msg)
          if (action.updatePageKey) {
            this.updatePageData(action.updatePageKey)
          }
        }).catch(error => {
          console.log('error---', error)
        })
      } else if (action.operateType === 'refreshKey') {
        if (action.updatePageKey) {
          this.updatePageData(action.updatePageKey)
        }
      }
    }
  }
}
