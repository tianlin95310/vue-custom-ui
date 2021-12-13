<template>
  <el-drawer
    title="组件列表"
    :visible.sync="showDrawer"
    :with-header="false"
  >
    <div class="templates">
      <el-tabs tab-position="left">
        <el-tab-pane v-for="(group, index) in templates" :key="index" :label="group.groupName" class="group">
          <el-card v-for="(template, j) in group.items" :key="j" class="component">
            <div class="operate">
              <el-tag type="primary" effect="dark">{{ template.name }}</el-tag>
              <el-button type="text" size="small" @click="onTemplateSelect(template)">我选这个</el-button>
            </div>
            <component :is="template.component" :data="template.data" :configs="template.configs" />
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'ChooseTemplate',
  data() {
    return {
      showDrawer: false,
      templates: [
        {
          groupName: '数据展示',
          items: [
            {
              id: '0x20001',
              component: 'CommonTable',
              name: 'Element风格表格',
              dataSourceKey: 'tableData',
              data: [
                {
                  col1: '100',
                  col2: '200',
                  more: '...'
                }
              ],
              configs: {
                dataColKeys: {
                  title: '列属性设置',
                  type: 1,
                  items: [
                    {
                      type: 'text',
                      prop: 'col1',
                      title: '列1'
                    },
                    {
                      type: 'text',
                      prop: 'col2',
                      title: '列2'
                    },
                    {
                      type: 'text',
                      prop: 'more',
                      title: '...'
                    }
                  ]
                },
                operateKeys: {
                  title: '操作栏属性设置',
                  show: false,
                  type: 3,
                  actions: [
                    {
                      title: '删除',
                      url: '',
                      params: [],
                      pageParams: []
                    }
                  ]
                },
                cssKeys: {
                  title: 'css属性设置',
                  type: 2,
                  config: {

                  }
                }
              }
            },
            {
              id: '0x20002',
              component: 'CommonImage',
              name: '图片展示',
              data: {
                src: 'https://img0.baidu.com/it/u=1371113496,4161662645&fm=26&fmt=auto'
              },
              configs: {}
            },
            {
              id: '0x20003',
              component: 'CommonCarousel',
              name: '图片轮滑展示',
              data: {
                dataItems: [{
                  src: 'https://img0.baidu.com/it/u=1371113496,4161662645&fm=26&fmt=auto'
                }, {
                  src: 'https://img0.baidu.com/it/u=1371113496,4161662645&fm=26&fmt=auto'
                }]
              },
              configs: {
                cssKeys: {
                  title: 'css属性设置',
                  type: 2,
                  config: {
                    height: 320
                  }
                }
              }
            }
          ]
        },
        {
          groupName: '表单元素',
          items: [
            {
              id: '0x30001',
              component: 'CommonForm',
              name: '表单',
              data: {},
              configs: {
                formEditKeys: {
                  title: '表单编辑',
                  type: 4,
                  items: {
                  }
                },
                confirmButton: {
                  title: '编辑按钮',
                  type: 5,
                  buttons: [
                    {
                      title: '查询',
                      operateType: '',
                      updatePageKey: '',
                      url: '',
                      params: []
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    show() {
      this.showDrawer = true
    },
    onTemplateSelect(template) {
      this.$emit('choose', template)
      this.showDrawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto !important;
}

::v-deep .el-tabs__content {
  overflow: auto;
}

.templates {
  padding: 16px 10px;
  overflow-y: scroll;
  overflow-x: hidden;

  .group {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .el-tag {
      font-size: 16px;
    }

    .component {
      margin-bottom: 20px;
      overflow-y: auto;
      .operate {
        margin-bottom: 10px;
      }

      .el-button {
        margin-left: 16px;
      }

      .el-tag {
        font-size: 14px;
      }
    }
  }

}
</style>
