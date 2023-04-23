<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/visitorManage/visitorAnomalyAlarm';

export default {
  name: "VisitorAnomalyAlarm",
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
          type: 'input',
          model: 'title',
          label: '姓名'
        },
        {
          type: 'input',
          model: 'title',
          label: '异常行为'
        },
        {
          type: 'dateTime',
          model: 'time',
          label: '日期'
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
      actionConfig: [
        {
          label: '加入黑名单',
          icon: 'el-icon-plus',
          type: 'text',
          action: 'add'
        },
        {
          label: '生成考核单',
          icon: 'el-icon-tickets',
          type: 'text',
          action: 'generate'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '姓名'
        },
        {
          key: 'number',
          title: '日期'
        },
        {
          key: 'number',
          title: '时间'
        },
        {
          key: 'status',
          title: '告警行为'
        },
        {
          key: 'status',
          title: '实时照片',
          customRender: (scope, row) => {
            const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            return <el-image src={url} preview-src-list={[url]} fit="cover" style="width: 30px; height: 30px" />
          }
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
    buttonClick (item) {
      switch (item.action) {
        case 'export':
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'add':
          this.dialogTitle = '加入黑名单'
          this.formModel = { ...row }
          this.dialogVisible = true
          break
        case 'generate':
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
