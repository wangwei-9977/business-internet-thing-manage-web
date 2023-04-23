<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/assessmentManage/carOverspeed';

export default {
  name: "CarOverspeed",
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
          model: 'name',
          label: '统计时间'
        }
      ],
      actionConfig: [
        {
          label: '考核单下载',
          icon: 'el-icon-download',
          type: 'text',
          action: 'download'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '车牌'
        },
        {
          key: 'number',
          title: '时间'
        },
        {
          key: 'status',
          title: '类型'
        },
        {
          key: 'status',
          title: '超速详情'
        },
        {
          key: 'status',
          title: '现场图片'
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
    actionClick (item, row) {
      switch (item.action) {
        case 'download':
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
