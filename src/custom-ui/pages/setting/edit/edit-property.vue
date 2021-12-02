<template>
  <el-drawer
    title="属性编辑"
    :visible.sync="showDrawer"
    :with-header="false"
    size="300px"
    direction="ttb"
  >
    <div class="property-s">
      <div v-for="(group, index) in config.items" :key="index" class="property-group">
        <el-tag v-if="group.name">{{ group.name }}</el-tag>
        <div class="property-item">
          <div><el-tag closable @close="onItemClose(index)">{{ group.title }}</el-tag></div>
          <div><el-input v-model="group.prop" class="input-item-width" size="mini" placeholder="请输入key值" /></div>
          <div>
            <el-select v-model="group.type" placeholder="请选择" size="mini" class="input-item-width">
              <el-option v-for="(item, oindex) in properTypes" :key="oindex" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
      </div>
      <el-input
        v-if="inputVisible"
        ref="addInput"
        v-model="inputValue"
        class="input-item-width"
        size="mini"
        placeholder="请输入标题"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加列</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { properTypes } from '@/custom-ui/pages/utils/constants'
export default {
  name: 'EditProperty',
  data() {
    return {
      showDrawer: false,
      config: {},
      inputVisible: false,
      inputValue: '',
      properTypes: properTypes
    }
  },
  created() {

  },
  methods: {
    showInput() {
      this.inputVisible = true
      this.inputValue = ''
      this.$nextTick(() => {
        this.$refs.addInput.focus()
      })
    },
    onItemClose(index) {
      this.config.items.splice(index, 1)
    },
    handleInputConfirm() {
      if (!this.inputValue) {
        this.inputVisible = false
        return
      }
      this.config.items.push({
        title: this.inputValue,
        prop: '',
        type: properTypes[0]
      })
      this.inputVisible = false
    },
    show(config) {
      this.config = config
      this.showDrawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.property-s {
  padding: 16px 10px;

  .input-item-width {
    width: 100px;
    vertical-align: top;
  }

  .property-group {
    display: inline-block;
    vertical-align: top;

    .property-item {
      padding: 5px;
      border: 1px solid gainsboro;
      margin-right: 5px;
      border-radius: 8px;

      > div {
        margin-bottom: 10px;
      }
    }

  }
}
</style>
