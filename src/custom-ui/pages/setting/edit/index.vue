<template>
  <div class="app-container edit">
    <el-button type="primary" @click="savePage">保存</el-button>

    <el-button type="primary" @click="editPageDataSource">页面数据源</el-button>

    <div v-if="page.comps.length === 0" class="add-component"><el-button @click="addComponent(0)">添加</el-button></div>

    <div v-for="(comp, index) in page.comps" :key="index" class="component-item">
      <div v-if="!(index > 0 && index <= page.comps.length - 1)" class="add-component">
        <el-button @click="addComponent(index)">添加</el-button>
      </div>
      <div :class="[index === 0 ? 'item-operate' : 'item-operate-other']">
        <el-button type="text" @click="deleteComponent(index)">删除</el-button>

        <el-button v-for="(config, key, i) in comp.configs" :key="i" type="text" @click="editConfigs(index, comp, key, config)">
          {{ config.title }}
        </el-button>
      </div>
      <component :is="comp.component" :data="comp.data" :configs="comp.configs" @onActionClick="onActionClick" @change="onChange" />
      <div class="add-component"><el-button @click="addComponent(index + 1)">添加</el-button></div>
    </div>
    <choose-template ref="chooseDrawer" @choose="onTemplateSelect" />
    <edit-page-data ref="editPageData" @save="savePageData" />
    <edit-property1 ref="editProperty" @save="saveProperty" />
    <edit-css-config2 ref="editConfig" @save="saveConfig" />
    <edit-operate3 ref="editOperate" @save="saveOperate" />
    <edit-form-type4 ref="editForm" @save="saveForm" />
    <edit-buttons5 ref="editButtons" />
  </div>
</template>

<script>
import ChooseTemplate from './choose-template'
import EditPageData from './components/edit-page-data'
import EditProperty1 from './components/edit-property1'
import EditCssConfig2 from './components/edit-css-config2'
import EditOperate3 from './components/edit-operate3'
import overview from '@/custom-ui/mixins/overview'
import EditFormType4 from './components/edit-form-type4'
import EditButtons5 from './components/edit-buttons5'

export default {
  name: 'Edit',
  pageId: '',
  components: {
    ChooseTemplate,
    EditPageData,
    EditProperty1,
    EditCssConfig2,
    EditOperate3,
    EditFormType4,
    EditButtons5
  },
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
  },
  methods: {
    savePageData(pageData) {
      this.page.pageData = pageData
    },
    editPageDataSource() {
      this.$refs.editPageData.show(this.page.pageData)
    },
    editConfigs(index, comp, key, config) {
      console.log(index, comp, key, config)
      if (config.type === 1) {
        this.$refs.editProperty.show(config)
      } else if (config.type === 2) {
        this.$refs.editConfig.show(config, key, index)
      } else if (config.type === 3) {
        this.$refs.editOperate.show(config)
      } else if (config.type === 4) {
        this.$refs.editForm.show(config, key, index)
      } else if (config.type === 5) {
        this.$refs.editButtons.show(config)
      }
    },
    saveConfig({ config, index, key }) {},
    saveProperty() {},
    saveOperate() {},
    saveForm({ config, key, index }) {},
    addComponent(index) {
      console.log('addComponent---', index)
      this.editIndex = index
      this.$refs.chooseDrawer.show()
    },
    savePage() {
      const data = JSON.parse(JSON.stringify(this.page))
      // 只保留内部外部接口的配置
      const pageData = {}
      for (const key in data.pageData) {
        const pageDataItem = data.pageData[key]
        if (pageDataItem.dataSource === 'InnerHttp') {
          pageDataItem.data = {}
          pageData[key] = pageDataItem
        }
      }
      data.pageData = pageData
      data.comps.forEach(item => {
        if (item.dataSourceKey) {
          // 取接口数据的不保存
          item.data = []
        }
        if (item.configs) {
          for (const key in item.configs) {
            const config = item.configs[key]
            // 页面组件清理网络数据来减少数据量
            if (config.type === 4) {
              for (const formKey in config.items) {
                const formItems = config.items[formKey]
                // 来自于接口调用的选项赋值不保存
                if (formItems.component === 'el-select' && formItems.optionKey) {
                  formItems.options = []
                }
              }
            }
          }
        }
      })
      localStorage.setItem(this.$options.pageId, JSON.stringify(data))
      this.$message.success('保存网页成功')
    },
    deleteComponent(index) {
      this.page.comps.splice(index, 1)
    },
    onTemplateSelect(template) {
      if (this.editIndex !== -1) {
        this.page.comps.splice(this.editIndex, 0, template)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.edit {
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
