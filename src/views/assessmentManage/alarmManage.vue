<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/assessmentManage/alarmManage';

export default {
  name: "AlarmManage",
  mixins: [pageMixin],
  data () {
    return {
      searchConfig: [
        {
          type: 'date',
          model: 'type',
          label: '报警日期'
        },
        {
          type: 'select',
          model: 'name',
          label: '报警类型',
          options: [
            {
              label: '2',
              value: 0
            }
          ]
        }
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          action: 'add'
        },
        {
          label: '导出',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'export'
        }
      ],
      actionConfig: [
        {
          label: '修改',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'delete'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '事件类型'
        },
        {
          key: 'number',
          title: '事件时间'
        },
        {
          key: 'status',
          title: '事件级别'
        },
        {
          key: 'status',
          title: '状态'
        },
        {
          key: 'status',
          title: '事件照片'
        }
      ]
    }
  },
  methods: {
    async request (query) {
      // return getTableDataList(query)
      return {
        list: [
          {
            title: '我问问',
            processName: '我问问',
            currTaskName: '13255048788',
            number: '闽AXX905',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '生产管理部',
            status: '13255044444'
          }
        ],
        total: 100
      }
    },
    buttonClick (item) {
      switch (item.action) {
        case 'add':
          this.dialogTitle = '新增'
          this.dialogVisible = true
          break
        case 'export':
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'edit':
          this.dialogTitle = '编辑'
          this.formModel = { ...row }
          this.dialogVisible = true
          break
        case 'delete':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
