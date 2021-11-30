<template>
  <div class="app-container edit">
    <el-button type="primary" @click="savePageData">保存</el-button>

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
      <component :is="comp.component" :data="comp.data" :configs="comp.configs" />
      <div class="add-component"><el-button @click="addComponent(index + 1)">添加</el-button></div>
    </div>
    <choose-template ref="chooseDrawer" @choose="onTemplateSelect" />

    <edit-property ref="editProperty" @save="saveProperty" />

    <edit-config ref="editConfig" @save="saveConfig" />

    <edit-page-data ref="editPageData" @updateData="updateData" />
  </div>
</template>

<script>
import ChooseTemplate from './choose-template'
import EditProperty from './edit-property'
import EditConfig from './edit-config'
import EditPageData from './edit-page-data'
export default {
  name: 'Edit',
  pageId: '',
  components: {
    EditProperty,
    ChooseTemplate,
    EditConfig,
    EditPageData
  },
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
        console.log('item', item)
      }
    })
    console.log('this.pageData---', pageData)
    console.log('this.comps---', comps)

    this.page = page
  },
  methods: {
    updateData(pageData) {
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
      }
    },
    saveConfig({ config, index, key }) {},
    saveProperty() {},
    addComponent(index) {
      console.log('addComponent---', index)
      this.editIndex = index
      this.$refs.chooseDrawer.show()
    },
    savePageData() {
      localStorage.setItem(this.$options.pageId, JSON.stringify(this.page))
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
