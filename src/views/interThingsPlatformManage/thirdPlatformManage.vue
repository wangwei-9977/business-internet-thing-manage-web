<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/interThingsPlatformManage/thirdPlatformManage';

export default {
  name: "ThirdPlatformManage",
  mixins: [pageMixin],
  data () {
    return {
      dialogLabelWidth: '100px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '平台名称',
          model: 'number',
          span: 12
        },
        {
          type: 'select',
          label: '所属供应商',
          model: 'name',
          span: 12,
          options: []
        },
        {
          type: 'select',
          label: '平台类型',
          model: 'select',
          options: []
        },
        {
          type: 'input',
          label: '平台地址',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '平台端口',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: 'appId',
          model: 'time',
        },
        {
          type: 'textarea',
          label: 'appKey',
          model: 'time',
        },
        {
          type: 'select',
          label: '状态',
          model: 'time',
          options: []
        },
        {
          type: 'checkboxGroup',
          label: '对接模块',
          model: 'group',
          options: [
            {
              label: '一卡通服务',
              value: 0
            },
            {
              label: '车辆管控',
              value: 1
            },
            {
              label: '事件服务',
              value: 2
            },
            {
              label: '视频监控',
              value: 3
            },
            {
              label: '报警检测',
              value: 4
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
          type: 'input',
          model: 'type',
          label: '平台名称'
        },
        {
          type: 'input',
          model: 'type',
          label: '平台地址'
        },
        {
          type: 'input',
          model: 'type',
          label: '平台端口'
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
          label: '修改',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'del'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '平台名称'
        },
        {
          key: 'number',
          title: '所属供应商'
        },
        {
          key: 'status',
          title: '平台类型'
        },
        {
          key: 'status',
          title: '平台地址'
        },
        {
          key: 'status',
          title: '平台端口'
        },
        {
          key: 'status',
          title: 'appId'
        },
        {
          key: 'status',
          title: 'appKey'
        },
        {
          key: 'status',
          title: '状态'
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
