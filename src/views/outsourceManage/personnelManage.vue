<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/outsourceManage/personnelManage';

export default {
  name: "PersonnelManage",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      dialogLabelWidth: '120px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '证件号',
          model: 'number',
          span: 12
        },
        {
          type: 'input',
          label: '人员姓名',
          model: 'name',
          span: 12
        },
        {
          type: 'input',
          label: '手机号',
          model: 'type',
          span: 12
        },
        {
          type: 'select',
          label: '证件类型',
          model: 'status',
          span: 12,
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
          label: '工号',
          model: 'time',
          span: 12
        },
        {
          type: 'select',
          label: '性别',
          model: 'status',
          span: 12,
          options: [
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 2
            }
          ]
        },
        {
          type: 'dateTime',
          label: '有效时间',
          model: 'time'
        },
        {
          type: 'select',
          label: '请选择班组',
          model: 'status',
          options: [
            {
              label: '门禁点',
              value: 1
            },
            {
              label: '门禁组',
              value: 2
            }
          ]
        },
        {
          type: 'imageUpload',
          label: '头像',
          model: 'status',
          props: {
            isShowTip: false
          }
        },
        {
          type: 'radio',
          label: '通行权限授权',
          model: 'status',
          options: [
            {
              label: '门禁点',
              value: 1
            },
            {
              label: '门禁组',
              value: 2
            }
          ]
        },
        {
          type: 'checkbox',
          label: '门禁点权限',
          model: 'groups',
          name: '所有门禁点'
          // options: [
          //   {
          //     label: '所有门禁点',
          //     value: 1
          //   }
          // ]
        },
        {
          type: 'checkbox',
          label: '门禁组权限',
          model: 'groups',
          name: '所有门禁组'
          // options: [
          //   {
          //     label: '所有门禁组',
          //     value: 1
          //   }
          // ]
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
          type: 'input',
          model: 'name',
          label: '手机号'
        },
        {
          type: 'input',
          model: 'number',
          label: '所属班组'
        },
        {
          type: 'input',
          model: 'name',
          label: '所承包商'
        },
        {
          type: 'select',
          model: 'status',
          label: '职位状态',
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
          label: '批量延期',
          type: 'success',
          icon: 'el-icon-edit',
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
        // {
        //   label: '删除',
        //   icon: 'el-icon-delete',
        //   type: 'text',
        //   action: 'delete'
        // }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '主键'
        },
        {
          key: 'number',
          title: '人员姓名'
        },
        {
          key: 'status',
          title: '证件类型'
        },
        {
          key: 'status',
          title: '所属承包商'
        },
        {
          key: 'status',
          title: '所属班组'
        },
        {
          key: 'status',
          title: '证件号'
        },
        {
          key: 'status',
          title: '工号'
        },
        {
          key: 'status',
          title: '性别'
        },
        {
          key: 'status',
          title: '手机号'
        },
        {
          key: 'status',
          title: '当前审批人'
        },
        {
          key: 'status',
          title: '职位状态'
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
          this.formModel = {
            groups: [],
            group: []
          }
          break
        case 'del':
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
