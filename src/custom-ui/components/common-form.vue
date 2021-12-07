<template>
  <el-form ref="formData" :model="datas" :rules="rules" label-position="top" class="common-form">
    <el-row :gutter="32">
      <el-col v-for="(item, key, index) in configs.formEditKeys.items" :key="index" :xs="12" :sm="8" :md="6" :lg="6" :xl="4" :span="24">
        <el-form-item :prop="key" :label="item.placeHolder">
          <component
            :is="item.component"
            v-model="datas[key]"
            :placeholder="item.placeHolder"
            :clearable="true"
          >
            <template v-if="item.options && item.options.length">
              <component :is="childComponent(item.component)" v-for="(option, ci) in item.options" :key="ci" :label="option.label" :value="option.value" style="width: 100%" />
            </template>
          </component>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-form-item class="search-area-btn">
        <el-button round size="small" @click="resetData('formData')">重置</el-button>
        <el-button
          v-for="(button, index) in configs.confirmButton.buttons"
          :key="index"
          type="primary"
          size="small"
          round
          @click="handleSearch('formData', button)"
        >
          {{ button.title }}
        </el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    data: {
      type: Object,
      default() {
        return {
        }
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
    const datas = {}
    const rules = {}
    for (const key in this.configs.formEditKeys.items) {
      const item = this.configs.formEditKeys.items[key]
      datas[key] = ''
      if (item.required) {
        rules[item.key] = [
          { required: true, trigger: item.component === 'el-select' ? 'change' : 'blur', message: `${item.placeHolder}` }
        ]
      }
    }
    return {
      rules: { ...rules },
      datas: { ...datas } // 界面实际数据
    }
  },
  watch: {
    datas: {
      handler() {
        console.log('this.datas', this.datas)
        this.$emit('change', { datas: this.datas, from: this.$options.name, key: 'form' })
      },
      deep: true
    }
  },
  created() {
    // 初始化
    console.log('common-form-', this.configs)
  },
  methods: {
    childComponent(parent) {
      if (parent === 'el-select') {
        return 'el-option'
      }
    },
    handleSearch(formName, button) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {}
          button.params.forEach(item => {
            params[item] = this.datas[item]
          })
          console.log(params)
          if (button.operateType === 'http') {
            this.$http.post(button.url, params).then(res => {
              this.$emit('change', { datas: res.data, from: this.$options.name, key: 'tableData' })
            })
          }
        } else {
          return false
        }
      })
    },
    resetData(formName) {
      this.$refs[formName].resetFields()
      for (const key in this.configs.formEditKeys.items) {
        this.datas[key] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.common-form {
  min-height: 80px;
  height: auto;
  .el-select {
    width: 100% !important;
  }
}
</style>
