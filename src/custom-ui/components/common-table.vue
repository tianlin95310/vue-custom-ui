<template>
  <el-table
    class="common-table"
    :data="tableData"
    :span-method="arraySpanMethod"
    border
    style="width: 98%;margin: 16px 1%;"
  >
    <el-table-column v-for="(col, index) in dataKeys" :key="index" :prop="col.prop" :label="col.title">
      <template slot-scope="scope">
        <span v-if="col.type === 'text'">{{ scope.row[col.prop] }}</span>
        <el-input v-else-if="col.type == 'input'" v-model="scope.row[col.prop]" />
        <div v-else-if="col.type === 'operate'">
          <el-button
            v-for="(action, aIndex) in col.actions"
            :key="aIndex"
            type="text"
            size="mini"
            @click="onActionClick(aIndex, scope.row)"
          >
            {{ action }}
          </el-button>
        </div>
        <slot v-else name="custom" :data="{row: scope.row, col: col}" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    configs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      spanArray: [],
      spanKey: {
        type: String,
        default: ''
      },
      tableData: {
        type: Array,
        default() {
          return []
        }
      },
      dataKeys: {
        type: Array,
        default() {
          return []
        }
      }
    }
  },
  created() {
    console.log('this.configs', this.configs)
    this.spanKey = this.data.spanKey
    this.tableData = this.data.list
    this.dataKeys = this.configs.dataColKeys.items
    console.log(this.dataKeys, this.tableData)
    if (this.spanKey) {
      this.spanArray = this.getSpanArray()
    }
  },
  methods: {
    getSpanArray() {
      const array = []
      let pos = 0
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        if (i === 0) {
          array.push(1)
        } else {
          const preIndex = i - 1
          const preRow = this.tableData[preIndex]
          if (item[this.spanKey] === preRow[this.spanKey]) {
            array[pos] += 1
            array.push(0)
          } else {
            array.push(1)
            pos = i
          }
        }
      }
      return array
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.spanKey) {
        if (columnIndex === 0) {
          const rowSpan = this.spanArray[rowIndex]
          const colSpan = rowSpan > 0 ? 1 : 0
          return [rowSpan, colSpan]
        }
      }
    },
    onActionClick(index, row) {
      this.$emit('onActionClick', { index: index, row: row })
    }
  }
}
</script>

<style lang="scss" scoped>
.common-table {
  ///deep/ .el-table__body-wrapper .el-table__row:hover {
  //  > td {
  //    background-color: #ffffff
  //  }
  //}
  .el-button--text {
    color: #409EFF;
    background: 0 0;
    padding-left: 7px;
    padding-right: 8px;
  }
}
</style>
