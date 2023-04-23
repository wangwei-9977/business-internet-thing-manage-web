<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/visitorManage/visitorLedger';

export default {
  name: "VisitorLedger",
  mixins: [pageMixin],
  data () {
    return {
      showIndex: true,
      dialogFormConfig: [
        {
          type: 'input',
          label: '姓名',
          model: 'name'
        },
        {
          type: 'input',
          label: '身份证号',
          model: 'idNumber'
        },
        {
          type: 'dateTime',
          label: '有效时间',
          model: 'time'
        }
      ],
      formRules: {
        name: [{ required: true, message: '请输入姓名' }],
        idNumber: [{ required: true, message: '请输入身份证号' }],
      },
      searchConfig: [
        {
          type: 'dateTime',
          model: 'time',
          label: '日期'
        }
      ],
      toolbarConfig: [
        {
          label: '期间台账下载',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'download'
        }
      ],
      actionConfig: [
        {
          label: '台账下载',
          icon: 'el-icon-download',
          type: 'text',
          action: 'download'
        },
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '日期'
        },
        {
          key: 'number',
          title: '总访客申请'
        },
        {
          key: 'number',
          title: '审批通过数'
        },
        {
          key: 'status',
          title: '总访客人数'
        },
        {
          key: 'status',
          title: '访客车辆数'
        },
        {
          key: 'status',
          title: '实际进场人数'
        },
        {
          key: 'status',
          title: '实际进场车辆'
        },
        {
          key: 'actions',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '100',
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
    buttonClick (item) {
      switch (item.action) {
        case 'download':
          break
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
