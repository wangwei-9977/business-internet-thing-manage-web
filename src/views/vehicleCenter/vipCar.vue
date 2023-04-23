<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/vehicleCente/vipCar';

export default {
  name: "VipCar",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      dialogFormConfig: [
        {
          type: 'input',
          label: '车牌号码',
          model: 'name'
        },
        {
          type: 'inputNumber',
          label: '乘车人数',
          model: 'type'
        },
        {
          type: 'dateTime',
          label: '有效期',
          model: 'time'
        },
        {
          type: 'textarea',
          label: '放行理由',
          model: 'desc',
        }
      ],
      formRules: {
        name: [{ required: true, message: '请输入车牌号码' }],
        type: [{ required: true, message: '请输入乘车人数' }],
        time: [{ required: true, message: '请选择有效期' }]
      },
      searchConfig: [
        {
          type: 'date',
          label: '日期',
          model: 'number'
        },
        {
          type: 'input',
          label: '车牌号',
          model: 'name'
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
        },
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '车牌号'
        },
        {
          key: 'number',
          title: '乘坐人数'
        },
        {
          key: 'status',
          title: '放行日期'
        },
        {
          key: 'status',
          title: '可通行时间'
        },
        {
          key: 'status',
          title: '事由'
        },
        {
          key: 'status',
          title: '操作人'
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
  }
}
</script>

<style lang="scss" scoped>

</style>
