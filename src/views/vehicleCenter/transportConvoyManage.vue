<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/vehicleCente/transportConvoyManage';

export default {
  name: "TransportConvoyManage",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      dialogLabelWidth: '100px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '车队名称',
          model: 'number'
        },
        {
          type: 'input',
          label: '车队管理人',
          model: 'name'
        },
        {
          type: 'radio',
          label: '管理车类型',
          model: 'status',
          options: [
            {
              label: '粉煤灰车',
              value: 1
            },
            {
              label: '石灰车',
              value: 2
            },
            {
              label: '垃圾车',
              value: 3
            }
          ]
        }
      ],
      formRules: {
        number: [{ required: true, message: '请输入车队名称' }],
        name: [{ required: true, message: '请输入车队管理人' }],
        status: [{ required: true, message: '请选择管理车类型' }]
      },
      searchConfig: [
        {
          type: 'input',
          model: 'name',
          label: '车队名称'
        },
        {
          type: 'input',
          model: 'number',
          label: '车队管理人'
        }
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
          title: '车队名称'
        },
        {
          key: 'number',
          title: '车队管理人'
        },
        {
          key: 'status',
          title: '管理车类型'
        },
        {
          key: 'status',
          title: '创建时间'
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
