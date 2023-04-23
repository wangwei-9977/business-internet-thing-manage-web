<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/vehicleCente/dayInAndOutCar';

export default {
  name: "DayInAndOutCar",
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
          model: 'status',
          label: '车牌号'
        },
      ],
      toolbarConfig: [
        {
          label: '下载',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'download'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '日期'
        },
        {
          key: 'number',
          title: '车牌号'
        },
        {
          key: 'status',
          title: '车辆类型'
        },
        {
          key: 'status',
          title: '驾驶员姓名'
        },
        {
          key: 'status',
          title: '进场时间'
        },
        {
          key: 'status',
          title: '出差时间'
        },
        {
          key: 'status',
          title: '备注'
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
        case 'download':
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
