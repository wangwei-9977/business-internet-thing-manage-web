<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/outsourceManage/attendanceManage';

export default {
  name: "AttendanceManage",
  mixins: [pageMixin],
  data () {
    return {
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '人员姓名'
        },
        {
          type: 'input',
          model: 'name',
          label: '月份'
        },
        {
          type: 'input',
          model: 'name',
          label: '外协单位'
        }
      ],
      toolbarConfig: [
        {
          label: '导出',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'export'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '人员姓名'
        },
        {
          key: 'number',
          title: '月份'
        },
        {
          key: 'status',
          title: '所属承包商'
        },
        {
          key: 'status',
          title: '出勤总天数'
        },
        {
          key: 'status',
          title: '缺勤总天数'
        },
        {
          key: 'status',
          title: '迟到总次数'
        },
        {
          key: 'status',
          title: '迟到考核次数'
        },
        {
          key: 'status',
          title: '缺钱考核次数'
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
        case 'export':
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
