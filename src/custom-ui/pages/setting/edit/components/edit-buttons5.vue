<template>
  <el-drawer
    title="配置编辑"
    :visible.sync="showDrawer"
    :with-header="false"
    direction="ttb"
    size="50%"
  >
    <div class="edit-buttons">
      <div>
        <el-button size="small" style="float: right" @click="addOperate">添加</el-button>
      </div>
      <div class="configs">
        <el-table :data="config.buttons">
          <el-table-column prop="title" label="标题" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" size="mini" placeholder="请输入标题" />
            </template>
          </el-table-column>

          <el-table-column label="操作类型" width="130">
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
          <el-table-column label="刷新数据源?" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.updatePageKey" size="mini" placeholder="数据源key" />
            </template>
          </el-table-column>
          <el-table-column label="url" width="240">
            <template v-if="scope.row.operateType === operateTypes[0].value || scope.row.operateType === operateTypes[1].value" slot-scope="scope">
              <el-input v-model="scope.row.url" size="mini" placeholder="页面路径或者接口" />
            </template>
          </el-table-column>
          <el-table-column label="参数">
            <template v-if="scope.row.operateType === operateTypes[0].value || scope.row.operateType === operateTypes[1].value" slot-scope="scope">
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
                ref="addParamInput"
                v-model="scope.row.inputValue"
                style="width: 120px"
                size="mini"
                placeholder="请输入页面参数名"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 新参数</el-button>
            </template>
          </el-table-column>

          <el-table-column width="80" label="操作">
            <template slot-scope="scope">
              <el-button disabled type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
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
        buttons: []
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
        params: []
      })
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
      this.$nextTick(() => {
        this.$refs.addParamInput.focus()
      })
    },
    handleInputConfirm(row) {
      if (!row.inputValue) {
        row.inputVisible = false
        return
      }
      row.params.push(row.inputValue)
      row.inputVisible = false
    },
    show(config) {
      this.showDrawer = true
      this.config = config
      this.config.buttons.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.edit-buttons {
  padding: 16px 10px;
}
</style>
