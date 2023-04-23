<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/vehicleCente/carInAndOutManage';

export default {
  name: "CarInAndOutManage",
  mixins: [pageMixin],
  data () {
    return {
      searchConfig: [
        {
          type: 'dateTime',
          model: 'type',
          label: '时间'
        },
        {
          type: 'select',
          label: '车辆类型',
          model: 'status',
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '无效',
              value: 2
            }
          ]
        },
        {
          type: 'select',
          label: '进出方向',
          model: 'status',
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '无效',
              value: 2
            }
          ]
        },
        {
          type: 'input',
          model: 'status',
          label: '车牌号'
        },
        {
          type: 'select',
          label: '出入口名称',
          model: 'status',
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '无效',
              value: 2
            }
          ]
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
          title: '车牌号码'
        },
        {
          key: 'number',
          title: '车类型'
        },
        {
          key: 'status',
          title: '出入口名称'
        },
        {
          key: 'status',
          title: '进出方向'
        },
        {
          key: 'status',
          title: '过车时间'
        },
        {
          key: 'status',
          title: '实时照片'
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
