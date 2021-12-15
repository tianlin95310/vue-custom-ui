<template>
  <el-drawer
    title="页面数据"
    :visible.sync="showDrawer"
    :with-header="false"
    :before-close="handleClose"
    size="70%"
  >
    <div class="edit-page-data">
      <div>
        <el-input
          v-if="inputVisible"
          ref="addDataInput"
          v-model="inputValue"
          class="input-item-width"
          size="small"
          placeholder="请输入数据的key"
          style="width: 200px"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else size="small" @click="showInput">+ 添加数据项</el-button>
      </div>

      <el-table :data="datas">
        <el-table-column prop="key" label="key" width="140">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key" :disabled="scope.row.disabled" size="mini" placeholder="请输入数据的key" />
          </template>
        </el-table-column>
        <el-table-column label="数据类型" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dataType" :disabled="scope.row.disabled" size="mini" placeholder="请选择">
              <el-option
                v-for="item in dataTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="数据来源" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dataSource" :disabled="scope.row.disabled" size="mini" placeholder="请选择">
              <el-option
                v-for="item in dataSources"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="url或者值" width="240">
          <template slot-scope="scope">
            <el-input v-model="scope.row.url" :disabled="scope.row.disabled" size="mini" />
          </template>
        </el-table-column>

        <el-table-column label="产生时机" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.createdMethod" :disabled="scope.row.disabled" size="mini" placeholder="请选择">
              <el-option
                v-for="item in createdMethods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="参数">
          <template v-if="scope.row.dataSource === dataSources[0].value" slot-scope="scope">
            <el-tag
              v-for="tag in scope.row.params"
              :key="tag"
              closable
              style="margin-right: 8px"
              @close="handleParamClose(scope.row, tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="scope.row.inputVisible"
              ref="addParam"
              v-model="scope.row.inputValue"
              style="width: 120px"
              size="mini"
              placeholder="请输入标题"
              @keyup.enter.native="handleAddConfirm(scope.row)"
              @blur="handleAddConfirm(scope.row)"
            />
            <el-button v-else size="small" style="margin-top: 8px" @click="showAddInput(scope.row)">+ 新参数</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.disabled" type="text" size="small" @click="deleteDataItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { dataTypes, dataSources, createdMethods } from '@/custom-ui/pages/utils/constants'
export default {
  name: 'EditPageData',
  data() {
    return {
      showDrawer: false,
      inputVisible: false,
      inputValue: '',
      pageData: {},
      datas: [],
      dataTypes: dataTypes,
      dataSources: dataSources,
      createdMethods: createdMethods
    }
  },
  watch: {
    datas: {
      handler(newV, oldV) {
        this.pageData = {}
        this.datas.forEach(item => {
          this.pageData[item.key] = { ...item }
        })
      },
      deep: true
    }
  },
  methods: {
    handleParamClose(row, tag) {
      row.params.splice(row.params.indexOf(tag), 1)
    },
    handleAddConfirm(row) {
      if (!row.inputValue) {
        row.inputVisible = false
        return
      }
      row.params.push(row.inputValue)
      row.inputVisible = false
    },
    showAddInput(row) {
      row.inputValue = ''
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.addParam.focus()
      })
    },
    handleClose() {
      this.$emit('save', this.pageData)
      this.showDrawer = false
    },
    deleteDataItem(row) {
      const index = this.datas.indexOf(row)
      this.datas.splice(index, 1)
    },
    handleInputConfirm() {
      if (!this.inputValue) {
        this.inputVisible = false
        return
      }
      this.datas.push({
        key: this.inputValue,
        dataType: dataTypes[0].value,
        dataSource: dataSources[0].value,
        url: '',
        createdMethod: createdMethods[0].value,
        disabled: false,
        params: [],
        inputVisible: false,
        inputValue: ''
      })
      this.inputVisible = false
    },
    showInput() {
      this.inputValue = ''
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.addDataInput.focus()
      })
    },
    show(pageData) {
      this.pageData = pageData ?? {}
      const datas = []
      for (const key in this.pageData) {
        datas.push({
          key: key,
          url: pageData[key].url,
          dataType: pageData[key].dataType,
          dataSource: pageData[key].dataSource,
          createdMethod: pageData[key].createdMethod,
          disabled: pageData[key].disabled,
          params: pageData[key].params ?? [],
          inputVisible: false,
          inputValue: ''
        })
      }
      this.datas = datas
      console.log('init datas', this.datas)
      this.showDrawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-page-data {
  padding: 16px 10px;
}
</style>
