<template>
  <el-drawer
    title="配置编辑"
    :visible.sync="showDrawer"
    :with-header="false"
    direction="ttb"
    size="50%"
  >
    <div class="edit-operate">
      <div>
        <el-switch v-model="config.show" active-text="展示" inactive-text="不展示" />

        <el-button size="small" style="float: right" @click="addOperate">添加</el-button>
      </div>
      <div class="configs">
        <el-table :data="config.actions">
          <el-table-column prop="title" label="标题" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" size="mini" placeholder="请输入标题" />
            </template>
          </el-table-column>

          <el-table-column label="操作类型" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.operateType" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in operateTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="url" width="240">
            <template slot-scope="scope">
              <el-input v-model="scope.row.url" size="mini" :placeholder="getPlaceHolder(scope.row)" />
            </template>
          </el-table-column>

          <el-table-column label="刷新页面数据源" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.updatePageKey" size="mini" placeholder="页面数据源" />
            </template>
          </el-table-column>
          <el-table-column label="参数">
            <template slot-scope="scope">
              <el-tag
                v-for="tag in scope.row.params"
                :key="tag"
                closable
                style="margin-right: 8px"
                @close="handleClose(scope.row, tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                ref="saveTagInput"
                v-model="scope.row.inputValue"
                style="width: 120px"
                size="mini"
                placeholder="请输入标题"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 新属性</el-button>
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
import { operateTypes } from '@/custom-ui/pages/utils/constants'
export default {
  name: 'EditOperate',
  data() {
    return {
      showDrawer: false,
      config: {
        show: false,
        actions: []
      },
      operateTypes: operateTypes
    }
  },
  methods: {
    addOperate() {
      this.config.actions.push({
        title: '',
        operateType: operateTypes[0].value,
        url: '',
        params: [],
        updatePageKey: ''
      })
    },
    getPlaceHolder(row) {
      const find = operateTypes.find(item => {
        return item.value === row.operateType
      })
      if (find) {
        return find.placeHolder
      }
    },
    deleteItem(row) {
      this.config.actions.splice(this.config.actions.indexOf(row), 1)
    },
    handleClose(row, tag) {
      row.params.splice(row.params.indexOf(tag), 1)
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
      row.params.push(row.inputValue)
      row.inputVisible = false
      this.$set(this.config.actions, this.config.actions.indexOf(row), row)
    },
    show(config) {
      this.showDrawer = true
      this.config = config

      this.config.actions.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.edit-operate {
  padding: 16px 10px;
}
</style>
