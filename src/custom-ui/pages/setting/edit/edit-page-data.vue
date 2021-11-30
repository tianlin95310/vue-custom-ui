<template>
  <el-drawer
    title="页面数据"
    :visible.sync="showDrawer"
    :with-header="false"
    :before-close="handleClose"
    size="50%"
  >
    <div class="edit-page-data">
      <div>
        <el-input
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-item-width"
          size="small"
          placeholder="请输入数据的key"
          style="width: 200px"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加数据项</el-button>
      </div>

      <el-table :data="datas">
        <el-table-column prop="key" label="key" width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key" size="mini" placeholder="请输入数据的key" />
          </template>
        </el-table-column>
        <el-table-column label="数据类型" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dataType" size="mini" placeholder="请选择">
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
            <el-select v-model="scope.row.dataSource" size="mini" placeholder="请选择">
              <el-option
                v-for="item in dataSources"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="接口名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.dataSource === 'InnerHttp'" v-model="scope.row.url" size="mini" />
          </template>
        </el-table-column>

        <el-table-column label="产生时机" width="100">
          <template slot-scope="scope">
            <el-select v-model="scope.row.createdMethod" size="mini" placeholder="请选择">
              <el-option
                v-for="item in createdMethods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteDataItem(scope.row)">删除</el-button>
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
          this.pageData[item.key] = {
            dataType: item.dataType,
            dataSource: item.dataSource,
            url: item.url,
            createdMethod: item.createdMethod
          }
        })
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('updateData', this.pageData)
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
        createdMethod: createdMethods[0].value
      })
      this.inputVisible = false
    },
    showInput() {
      this.inputValue = ''
      this.inputVisible = true
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
          createdMethod: pageData[key].createdMethod
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
