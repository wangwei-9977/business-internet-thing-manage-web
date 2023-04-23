<template>
  <Dialog
    title="权限"
    :visible="visible"
    @confirm="confirm"
    @close="close"
    width="650px"
  >
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
      :titles="['未分配人员', '已分配人员']"
      filter-placeholder="请输入城市拼音"
    />
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog'
import TableSearch from '@/components/TableSearch'

export default {
  name: "GroupPermission",
  components: { Dialog, TableSearch },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '门禁组名称',
          style: {
            width: '150px'
          }
        },
        {
          type: 'select',
          model: 'type',
          label: '部门',
          style: {
            width: '150px'
          },
          options: []
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
