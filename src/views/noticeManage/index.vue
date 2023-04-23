<template>
  <div>
    <normal-table-render />
    <detail :visible="visible" @close="visible = false" />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Detail from '@/common/components/noticeManage/Detail'
import { getTableDataList } from '@/api/noticeManage';

export default {
  name: "NoticeManage",
  mixins: [pageMixin],
  components: { Detail },
  data () {
    return {
      visible: false,
      dialogLabelWidth: '100px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '标题',
          model: 'number',
        },
        {
          type: 'imageUpload',
          label: '封面',
          model: 'name'
        },
        {
          type: 'radio',
          label: '状态',
          model: 'select',
          options: [
            {
              label: '正常',
              value: 0
            },
            {
              label: '下架',
              value: 1
            }
          ]
        },
        {
          type: 'editor',
          label: '内容',
          model: 'time',
        },
        {
          type: 'select',
          label: '通知范围',
          model: 'time',
          options: []
        },
        {
          type: 'radio',
          label: '回执',
          model: 'time',
          options: [
            {
              label: '是',
              value: 0
            },
            {
              label: '否',
              value: 1
            }
          ]
        }
      ],
      formRules: {
        number: [{ required: true, message: '请输入承包商名称' }],
        name: [{ required: true, message: '请输入管理部门名称' }],
      },
      searchConfig: [
        {
          type: 'date',
          model: 'type',
          label: '发布日期'
        },
        {
          type: 'input',
          model: 'type',
          label: '主题'
        }
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      actionConfig: [
        {
          label: '详情',
          icon: 'el-icon-view',
          type: 'text',
          action: 'detail'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '日期'
        },
        {
          key: 'number',
          title: '发布人'
        },
        {
          key: 'status',
          title: '主题'
        },
        {
          key: 'status',
          title: '阅读量'
        },
        {
          key: 'status',
          title: '回执量'
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
        case 'add':
          this.formModel = {
            group: []
          }
          this.dialogTitle = '新增配置'
          this.dialogVisible = true
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'detail':
          this.visible = true
          break
        case 'edit':
          this.formModel = {
            ...row
          }
          this.dialogTitle = '修改配置'
          this.dialogVisible = true
          break
        case 'download':
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
