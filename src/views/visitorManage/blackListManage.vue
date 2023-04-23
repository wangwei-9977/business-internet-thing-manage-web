<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/visitorManage/blackListManage';

export default {
  name: "BlackListManage",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
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
          label: '身份证号'
        },
        {
          type: 'input',
          model: 'title',
          label: '工号'
        }
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          action: 'add'
        },
        {
          label: '删除黑名单',
          type: 'danger',
          icon: 'el-icon-delete',
          disabledHandle: () => {
            return this.selectionList.length === 0
          },
          action: 'del'
        }
      ],
      actionConfig: [
        {
          label: '修改',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'delete'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '姓名'
        },
        {
          key: 'number',
          title: '身份证号'
        },
        {
          key: 'status',
          title: '手机号码'
        },
        {
          key: 'result',
          title: '工号'
        },
        {
          key: 'status',
          title: '认证图片',
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
        case 'add':
          this.dialogTitle = '新增黑名单'
          this.dialogVisible = true
          break
        case 'del':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'edit':
          this.dialogTitle = '编辑黑名单'
          this.formModel = { ...row }
          this.dialogVisible = true
          break
        case 'delete':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
