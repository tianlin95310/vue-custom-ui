<template>
  <div class="app-container">
    <el-row justify="end" align="end">
      <el-button type="primary">新建</el-button>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column prop="pageId" label="页面id" />

      <el-table-column prop="pageName" label="页面名称" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
          <el-link type="primary" target="_blank" style="margin: 0 8px" @click="previewRow(scope.row)">预览</el-link>
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
          pageId: '0x1001'
        },
        {
          pageName: '要跳转的页面',
          pageId: '0x1002'
        }
      ]
    }
  },
  methods: {
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
