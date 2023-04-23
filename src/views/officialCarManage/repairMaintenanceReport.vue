<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/officialCarManage/repairMaintenanceReport';

export default {
  name: "RepairMaintenanceReport",
  mixins: [pageMixin],
  data () {
    return {
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '车牌号'
        },
        {
          type: 'dateTime',
          model: 'type',
          label: '日期'
        }
      ],
      toolbarConfig: [
        {
          label: '生产台账报表',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '车牌号'
        },
        {
          key: 'number',
          title: '申报人'
        },
        {
          key: 'status',
          title: '维保项目'
        },
        {
          key: 'status',
          title: '预估费用'
        },
        {
          key: 'status',
          title: '实际费用'
        },
        {
          key: 'status',
          title: '审批人'
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
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
