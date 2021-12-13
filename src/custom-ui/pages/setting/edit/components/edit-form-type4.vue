<template>
  <el-drawer
    title="配置表单"
    :visible.sync="showDrawer"
    :with-header="false"
    direction="ltr"
    size="50%"
  >
    <div class="edit-form">
      <div>
        <el-button size="small" style="float: right" @click="addOperate">添加</el-button>
      </div>
      <div class="configs">
        <el-table :data="params">
          <el-table-column prop="title" label="标题" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.key" size="mini" placeholder="请输入标题" />
            </template>
          </el-table-column>

          <el-table-column label="操作类型" width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.component" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in formItems"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="100" label="是否必填">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.required" active-text="必填" size="mini" />
            </template>
          </el-table-column>

          <el-table-column width="130" label="提示语">
            <template slot-scope="scope">
              <el-input v-model="scope.row.placeHolder" size="mini" placeholder="请输入" />
            </template>
          </el-table-column>

          <el-table-column label="选项值来源" width="120">
            <template slot-scope="scope">
              <el-select v-if="scope.row.component === 'el-select'" v-model="scope.row.optionFrom" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in optionFroms"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="选项或数据源key" width="180">
            <template slot-scope="scope">
              <template v-if="scope.row.component === 'el-select'">
                <div v-if="scope.row.optionFrom === optionFroms[0].value" class="options">
                  <div v-for="(item, index) in scope.row.options" :key="index" class="option-item">
                    <div><input v-model="item.label" size="mini" placeholder="请输入标题"></div>
                    <div><input v-model="item.value" size="mini" placeholder="请输入值"></div>

                    <i class="el-icon-delete icon" @click="scope.row.options.splice(index, 1)" />
                  </div>
                  <el-button type="text" size="mini" @click="addOption(scope.row)">新选项</el-button>
                </div>
                <el-input v-else v-model="scope.row.optionKey" size="mini" placeholder="页面数据源" />
              </template>
            </template>
          </el-table-column>

          <el-table-column width="80" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-drawer>
</template>

<script>
import { formItems, optionFroms } from '@/custom-ui/pages/utils/constants'
export default {
  name: 'EditOperate',
  data() {
    return {
      showDrawer: false,
      config: {
        items: {},
        rules: {}
      },
      params: [],
      formItems: formItems,
      optionFroms: optionFroms,
      editKey: '',
      editIndex: -1
    }
  },
  watch: {
    params: {
      handler(newV, oldV) {
        this.config.items = {}
        this.params.forEach(item => {
          this.config.items[item.key] = { ...item }
        })
      },
      deep: true
    }
  },
  methods: {
    addOption(row) {
      row.options.push({
        label: '',
        value: ''
      })
    },
    addOperate() {
      this.params.push({
        key: '',
        component: formItems[0].value,
        placeHolder: '',
        optionFrom: optionFroms[0].value,
        options: [],
        optionKey: '',
        required: false
      })
    },
    deleteItem(row) {
      this.params.splice(this.params.indexOf(row), 1)
    },
    handleClose(row, tag) {
      row.options.splice(row.options.indexOf(tag), 1)
    },
    showInput(row) {
      row.inputValue = ''
      row.inputVisible = true
      this.$set(this.config.actions, this.config.actions.indexOf(row), row)
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm(row) {
      if (!row.inputValue) {
        row.inputVisible = false
        this.$set(this.config.actions, this.config.actions.indexOf(row), row)
        return
      }
      row.params.push(this.inputValue)
      row.inputVisible = false
      this.$set(this.config.actions, this.config.actions.indexOf(row), row)
    },
    show(config, key, index) {
      this.showDrawer = true
      this.config = config
      this.editKey = key
      this.editIndex = index
      const params = []
      for (const key in config.items) {
        params.push({
          key: key,
          component: config.items[key].component,
          placeHolder: config.items[key].placeHolder,
          optionFrom: config.items[key].optionFrom,
          options: config.items[key].options,
          optionKey: config.items[key].optionKey,
          required: config.items[key].required
        })
      }
      this.params = params
    }
  }
}
</script>

<style lang="scss" scoped>

.edit-form {
  padding: 16px 10px;

  .options {
    .el-button {
      margin-left: 8px!important;
    }
    .option-item:hover {
      div {
        opacity: 0.3;
      }
      .icon {
        top: 0;
        left: 0;
        opacity: 1;
        color: darkred;
        display: inline-block;
        cursor: pointer;
        font-size: 18px;
      }
    }
    .option-item {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      padding-left: 8px;
      padding-top: 8px;
      div {
        opacity: 1;
        transition: opacity 0.3s ease-in;
      }
      .icon {
        opacity: 0;
        color: grey;
        top: 0;
        left: 0;
        transition: all 0.2s ease-in;
        position: absolute;
        //display: none;
        font-size: 0px;
      }
      input {
        width: 70px;
      }
    }
  }
}
</style>
