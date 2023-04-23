<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/assessmentManage/safeProduction';

export default {
  name: "SafeProduction",
  mixins: [pageMixin],
  data () {
    return {
      searchConfig: [
        {
          type: 'date',
          model: 'type',
          label: '日期'
        },
        {
          type: 'input',
          model: 'name',
          label: '被考核人'
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
          title: '被考核时间'
        },
        {
          key: 'number',
          title: '被考核人'
        },
        {
          key: 'status',
          title: '所属单位'
        },
        {
          key: 'status',
          title: '考核区域'
        },
        {
          key: 'status',
          title: '考核结果'
        },
        {
          key: 'status',
          title: '实时照片'
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
