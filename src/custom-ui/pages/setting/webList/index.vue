<template>
  <div class="app-container">
    <el-row justify="end" align="end" style="margin-bottom: 16px">
      <el-button type="primary" @click="addPage">新建</el-button>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column prop="pageId" label="页面id">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pageId" :disabled="scope.row.disabled" />
        </template>
      </el-table-column>

      <el-table-column prop="pageName" label="页面名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pageName" :disabled="scope.row.disabled" />
        </template>
      </el-table-column>

      <el-table-column prop="desc" label="页面描述">
        <template slot-scope="scope">
          <el-input v-model="scope.row.desc" :disabled="scope.row.disabled" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="previewRow(scope.row)">预览</el-button>
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'WebList',
  data() {
    return {
      tableData: [
        {
          pageName: '首页',
          pageId: '0x1001',
          desc: '',
          disabled: true
        },
        {
          pageName: '要跳转的页面',
          pageId: '0x1002',
          desc: '',
          disabled: true
        }
      ]
    }
  },
  methods: {
    addPage() {
      this.tableData.push({
        pageName: '',
        pageId: '0x100',
        desc: '',
        disabled: false
      })
    },
    previewRow(row) {
      // this.$router.push({
      //   path: '/setting/overview',
      //   query: {
      //     id: window.btoa(row.pageId)
      //   }
      // })
      const routeUrl = this.$router.resolve({
        path: '/setting/overview',
        query: {
          id: window.btoa(row.pageId)
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    deleteRow(row) {
    },
    editRow(row) {
      this.$router.push({
        path: '/setting/edit',
        query: {
          id: window.btoa(row.pageId)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
