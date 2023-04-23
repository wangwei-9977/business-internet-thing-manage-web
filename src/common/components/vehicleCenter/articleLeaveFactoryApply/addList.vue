<template>
  <div class="add-list">
    <el-button @click="add" class="button" type="primary" size="mini">新增</el-button>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'

export default {
  name: "AddList",
  mixins: [pageMixin],
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    list: {
      handler() {
        this.tableData = this.list
      },
      immediate: true
    }
  },
  data() {
    return {
      showToolbar: false,
      tableProps: {
        border: true,
        'max-height': 250
      },
      actionConfig: [
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'del'
        },
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '名称',
          props: {
            align: 'center',
          },
          customRender: (scope, row, index) => {
            return <el-input v-model={row.name} />
          }
        },
        {
          key: 'number',
          title: '规格',
          props: {
            align: 'center',
          },
          customRender: (scope, row, index) => {
            return <el-input v-model={row.master} />
          }
        },
        {
          key: 'status',
          title: '单位',
          props: {
            align: 'center',
          },
          customRender: (scope, row, index) => {
            return <el-input v-model={row.unit} />
          }
        },
        {
          key: 'status',
          title: '数量',
          props: {
            align: 'center',
          },
          customRender: (scope, row, index) => {
            return <el-input v-model={row.num} />
          }
        },
        {
          key: 'status',
          title: '备注',
          props: {
            align: 'center',
          },
          customRender: (scope, row, index) => {
            return <el-input v-model={row.desc} />
          }
        },
        {
          key: 'actions',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '120',
          },
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    add() {
      this.tableData.push({})
    },
    actionClick (item, row, index) {
      switch (item.action) {
        case 'del':
          this.tableData.splice(index, 1)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-list {
  position: relative;
  .button {
    position: absolute;
    right: 0;
    top: -35px;
  }
}
.app-container {
  padding: 0px;
  margin-top: 40px;
  margin-left: -70px;
  ::v-deep .el-table {
    .el-input--medium .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
