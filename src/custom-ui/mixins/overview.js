import { createdMethods } from '@/custom-ui/pages/utils/constants'

export default {
  /**
   * created
   * @returns {Promise<void>}
   */
  async created() {
    console.log('minix created')
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
        dataSource: 'query',
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

    // 获取数据源的值
    for (const key in pageData) {
      const dataConfig = pageData[key]
      if (dataConfig.createdMethod === 'created') {
        if (dataConfig.dataSource === 'InnerHttp') {
          // 初始化索引
          dataConfig.compIndexs = []
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
        const dataItem = pageData[item.dataSourceKey]
        if (dataItem) {
          item.data = dataItem.data
          dataItem.compIndexs.push(index)
        }
      }
      for (const key in item.configs) {
        const config = item.configs[key]
        // 页面表单
        if (config.type === 4) {
          // 为表单中绑定了数据原的组件进行赋值
          for (const formKey in config.items) {
            const formItem = config.items[formKey]
            // 为下拉组件赋值
            if (formItem.component === 'el-select' && formItem.optionKey) {
              const dataItem = pageData[formItem.optionKey]
              if (dataItem) {
                formItem.options = dataItem.data
                dataItem.compIndexs.push(index)
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
    async updatePageData(key) {
      const dataConfig = this.page.pageData[key]
      if (dataConfig.dataSource === 'InnerHttp') {
        const req = {}
        dataConfig.params.forEach(item => {
          req[item] = this.page.pageData[item].data ?? ''
        })
        const res = await this.$http.post(dataConfig.url, req)
        // 更新数据源的值
        // eslint-disable-next-line require-atomic-updates
        dataConfig.data = res.data
        // 刷新绑定了该数据的组件
        if (dataConfig.compIndexs) {
          dataConfig.compIndexs.forEach(compIndex => {
            const item = this.page.comps[compIndex]
            if (item.dataSourceKey) {
              item.data = dataConfig.data
              this.$set(this.page.comps, compIndex, item)
            }
          })
        }
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
