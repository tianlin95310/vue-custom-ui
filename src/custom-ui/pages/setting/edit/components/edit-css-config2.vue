<template>
  <el-drawer
    title="配置编辑"
    :visible.sync="showDrawer"
    :with-header="false"
    direction="ltr"
  >
    <div class="configs">
      <div v-for="(item, index) in configs" :key="index" class="config-item">
        <el-tag>{{ item.key }}:</el-tag>
        <el-input v-model="item.value" size="mini" class="input-item-width" />
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'EditCssConfig2',
  data() {
    return {
      showDrawer: false,
      config: {},
      configs: [],
      inputVisible: false,
      inputValue: '',
      compIndex: -1
    }
  },
  watch: {
    configs: {
      handler(newV, oldV) {
        this.configs.forEach(item => {
          this.config.config[item.key] = item.value
        })
      },
      deep: true
    }
  },
  methods: {
    saveConfig() {
      this.showDrawer = false
      this.$emit('save', { config: this.config, index: this.compIndex, key: this.key })
    },
    show(config, key, index) {
      this.config = config ?? {
        config: {}
      }
      this.compIndex = index
      this.key = key
      const configs = []
      for (const key in config.config) {
        configs.push({
          key: key,
          value: config.config[key]
        })
      }
      this.configs = configs
      this.showDrawer = true
    }
  }
}
</script>

<style lang="scss" scoped>
.configs {
  padding: 16px 10px;

  .buttons {
    margin-top: 10px;
    text-align: right;
  }
  .config-item {
    display: inline-block;
    vertical-align: top;
    width: 30%;

    .input-item-width {
      width: 80px;
      margin-left: 8px;
    }
  }
}
</style>
