<template>
  <div>
    <normal-table-render />
    <dialog-form
      title="报废回收"
      width="500px"
      label-width="100px"
      :configs="configs"
      :dialogVisible="visible"
      :form-model="model"
      :form-rules="rules"
      @close="visible = false"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/officialCarManage';

export default {
  name: "OfficialCarManage",
  mixins: [pageMixin],
  data () {
    return {
      visible: false,
      model: {},
      rules: {},
      configs: [
        {
          type: 'date',
          label: '回收日期',
          model: 'number'
        },
        {
          type: 'textarea',
          label: '报废回收理由',
          model: 'number'
        },
        {
          type: 'inputNumber',
          label: '当前公里数',
          model: 'number'
        }
      ],
      dialogFormConfig: [
        {
          type: 'input',
          label: '车牌号',
          model: 'number',
          span: 12
        },
        {
          type: 'input',
          label: '品牌',
          model: 'name',
          span: 12
        },
        {
          type: 'date',
          label: '购置日期',
          model: 'time',
          span: 12
        },
        {
          type: 'inputNumber',
          label: '里程数',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '管理部门',
          model: 'time',
          span: 12
        },
        {
          type: 'inputNumber',
          label: '管理人数',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '发动机号',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '车架号',
          model: 'time',
          span: 12
        },
        {
          type: 'imageUpload',
          label: '行驶本',
          model: 'time',
          span: 12
        },
        {
          type: 'imageUpload',
          label: '车辆蓝本',
          model: 'time',
          span: 12
        }
      ],
      formRules: {
        number: [{ required: true, message: '请输入承包商名称' }],
        name: [{ required: true, message: '请输入管理部门名称' }],
      },
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '车牌号'
        },
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
        },
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
        },
        {
          label: '报废回收',
          icon: 'el-icon-takeaway-box',
          type: 'text',
          action: 'recycle'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '车牌号'
        },
        {
          key: 'number',
          title: '车类型'
        },
        {
          key: 'status',
          title: '品牌'
        },
        {
          key: 'status',
          title: '购买日期'
        },
        {
          key: 'status',
          title: '当前行驶里程'
        },
        {
          key: 'status',
          title: '管理人员'
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
        case 'export':
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
        case 'recycle':
          this.model = {}
          this.visible = true
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
