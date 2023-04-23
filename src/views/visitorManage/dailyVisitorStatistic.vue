<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/visitorManage/dailyVisitorStatistic';

export default {
  name: "DailyVisitorStatistic",
  mixins: [pageMixin],
  data () {
    return {
      showIndex: true,
      searchConfig: [
        {
          type: 'input',
          model: 'title',
          label: '被访部门'
        },
        {
          type: 'dateTime',
          model: 'createTimeRange',
          label: '日期'
        }
      ],
      tableColumns: [
        {
          key: 'title',
          title: '日期'
        },
        {
          key: 'processName',
          title: '被访部门'
        },
        {
          key: 'currTaskName',
          title: '总访问人数'
        },
        {
          key: 'number',
          title: '较昨日'
          // customRender: (scope, row) => {
          //   return <span style={{ color: this.getStatus(row.status).color }}>{this.getStatus(row.status).text}</span>
          // }
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
            processName: '2022-02-02 10:10:10',
            currTaskName: '13255048788',
            number: '闽AXX905',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '生产管理部',
            status: '申请中'
          }
        ],
        total: 100
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
