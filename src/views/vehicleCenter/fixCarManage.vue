<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/vehicleCente/fixCarManage';

export default {
  name: "FixCarManage",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      dialogFormConfig: [
        {
          type: 'input',
          label: '车牌号码',
          model: 'number'
        },
        {
          type: 'input',
          label: '车辆姓名',
          model: 'name'
        },
        {
          type: 'input',
          label: '车辆类型',
          model: 'type',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'dateTime',
          label: '有效期',
          model: 'time'
        },
        {
          type: 'radio',
          label: '车辆状态',
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
      formRules: {
        number: [{ required: true, message: '请输入车牌号码' }],
        name: [{ required: true, message: '请输入车辆姓名' }],
        type: [{ required: true, message: '请选择车辆类型' }],
        time: [{ required: true, message: '请选择有效期' }],
        status: [{ required: true, message: '请选择车辆状态' }]
      },
      searchConfig: [
        {
          type: 'select',
          model: 'type',
          label: '车辆类型',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'input',
          model: 'name',
          label: '车辆姓名'
        },
        {
          type: 'input',
          model: 'number',
          label: '车牌号'
        },
        {
          type: 'select',
          model: 'status',
          label: '车辆状态',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          action: 'add'
        },
        {
          label: '删除',
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
          title: '车牌号'
        },
        {
          key: 'number',
          title: '车主姓名'
        },
        {
          key: 'status',
          title: '有效期'
        },
        {
          key: 'status',
          title: '当前状态'
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
          this.dialogTitle = '新增'
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
          this.dialogTitle = '编辑'
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
