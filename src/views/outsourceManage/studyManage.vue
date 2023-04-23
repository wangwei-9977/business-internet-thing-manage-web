outsourceManage<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/outsourceManage/studyManage';

export default {
  name: "StudyManage",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      dialogLabelWidth: '120px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '课件名称',
          model: 'number',
          span: 12
        },
        {
          type: 'select',
          label: '课件类型',
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
          type: 'inputNumber',
          label: '课件秒数',
          model: 'type',
          span: 12
        },
        {
          type: 'radio',
          label: '是否考试',
          model: 'status',
          span: 12,
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 2
            }
          ]
        },
        {
          type: 'imageUpload',
          label: '封面图片',
          model: 'time',
          // render: (config, model) => {
          //   return <el-button type="primary">点击上传</el-button>
          // }
        },
        {
          type: 'fileUpload',
          label: '课件附件',
          model: 'status',
          // render: (config, model) => {
          //   return <el-button type="primary">上传附件</el-button>
          // }
        },
        {
          type: 'input',
          label: '视频路径',
          model: 'time'
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
          label: '课件名称'
        },
        {
          type: 'select',
          model: 'status',
          label: '课件类型',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'select',
          model: 'status',
          label: '审批状态',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'select',
          model: 'status',
          label: '视频分类',
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
          label: '审批通过',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'ok'
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
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '课件类型'
        },
        {
          key: 'number',
          title: '视频分类'
        },
        {
          key: 'status',
          title: '课件名称'
        },
        {
          key: 'status',
          title: '附加名称'
        },
        {
          key: 'status',
          title: '时长'
        },
        {
          key: 'status',
          title: '习题课'
        },
        {
          key: 'status',
          title: '是否考试'
        },
        {
          key: 'status',
          title: '所有者'
        },
        {
          key: 'status',
          title: '审核状态'
        },
        {
          key: 'actions',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '140',
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
          this.dialogTitle = '添加课程'
          this.dialogVisible = true
          this.formModel = {
            groups: [],
            group: []
          }
          break
        case 'del':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'ok':
          this.$modal.confirm('确定审核通过吗?').then(() => {

          })
          break
        case 'edit':
          this.dialogTitle = '编辑课程'
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
