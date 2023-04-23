<template>
  <Dialog
    title="权限"
    :visible="visible"
    @confirm="confirm"
    @close="close"
    width="650px"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="门禁点配置" name="point">
        <table-search
          ref="searchRef"
          :search-model="{}"
          :config="searchConfig"
          @handleQuery="queryHandle"
          @resetQuery="resetQuery"
        />
        <el-transfer
          v-model="value"
          filterable
          :filter-method="filterMethod"
          :data="data"
          :titles="['未分配门禁点', '已分配门禁点']"
          filter-placeholder="请输入城市拼音"
        />
      </el-tab-pane>
      <el-tab-pane label="门禁组配置" name="group">
        <table-search
          ref="searchRef"
          :search-model="{}"
          :config="searchConfig"
          @handleQuery="queryHandle"
          @resetQuery="resetQuery"
        />
        <el-transfer
          v-model="value"
          filterable
          :filter-method="filterMethod"
          :data="data"
          :titles="['未分配门禁组', '已分配门禁组']"
          filter-placeholder="请输入城市拼音"
        />
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog'
import TableSearch from '@/components/TableSearch'

export default {
  name: "DoorPointPermission",
  components: { Dialog, TableSearch },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'point',
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '门禁点名称'
        }
      ],
      value: [],
      data: [
        {
          label: 'xxx',
          key: 1
        }
      ]
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      console.log('init')
    },
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1
    },
    queryHandle (query) {
    },
    resetQuery (query) {
    },
    handleClick() {
      this.value = []
      if (this.activeName === 'point') {
        this.searchConfig = [
          {
            type: 'input',
            model: 'type',
            label: '门禁点名称'
          }
        ]
      } else {
        this.searchConfig = [
          {
            type: 'input',
            model: 'type',
            label: '门禁组名称'
          }
        ]
      }
    },
    confirm() {
      this.$emit('confirm', this.value)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
