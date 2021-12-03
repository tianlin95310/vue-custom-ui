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
      <component :is="comp.component" :data="comp.data" :configs="comp.configs" @onActionClick="onActionClick" />
      <div class="add-component"><el-button @click="addComponent(index + 1)">添加</el-button></div>
    </div>
    <choose-template ref="chooseDrawer" @choose="onTemplateSelect" />

    <edit-property ref="editProperty" @save="saveProperty" />

    <edit-css-config2 ref="editConfig" @save="saveConfig" />

    <edit-page-data ref="editPageData" @save="savePageData" />

    <edit-operate ref="editOperate" @save="saveOperate" />

    <edit-form-type4 ref="editForm" @save="saveForm" />
  </div>
</template>

<script>
import ChooseTemplate from './choose-template'
import EditPageData from './components/edit-page-data'
import EditProperty from './components/edit-property'
import EditCssConfig2 from './components/edit-css-config2'
import EditOperate from './components/edit-operate'
import overview from '@/custom-ui/mixins/overview'
import EditFormType4 from './components/edit-form-type4'
export default {
  name: 'Edit',
  pageId: '',
  components: {
    EditCssConfig2,
    ChooseTemplate,
    EditPageData,
    EditProperty,
    EditOperate,
    EditFormType4
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
        this.$refs.editForm.show(config)
      }
    },
    saveConfig({ config, index, key }) {},
    saveProperty() {},
    saveOperate() {},
    saveForm() {},
    addComponent(index) {
      console.log('addComponent---', index)
      this.editIndex = index
      this.$refs.chooseDrawer.show()
    },
    savePage() {
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
