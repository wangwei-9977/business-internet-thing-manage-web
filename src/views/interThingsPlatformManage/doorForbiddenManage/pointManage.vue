<template>
  <div>
    <normal-table-render />
    <permission :visible="visible" @close="visible = false" @confirm="okHandle" />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Permission from '@/common/components/interThingsPlatformManage/doorForbiddenManage/PointPermission'
import { getTableDataList } from '@/api/interThingsPlatformManage/doorForbiddenManage/pointManage';

export default {
  name: "PointManage",
  mixins: [pageMixin],
  components: { Permission },
  data () {
    return {
      visible: false,
      showIndex: true,
      dialogLabelWidth: '100px',
      dialogFormConfig: [
        {
          type: 'input',
          label: '门禁点名称',
          model: 'number',
        },
        {
          type: 'select',
          label: '设备类型',
          model: 'name',
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
          type: 'input',
          label: '设备名称',
          model: 'time',
        },
        {
          type: 'select',
          label: '通道方向',
          model: 'time',
          options: []
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
          label: '门禁点名称'
        },
        {
          type: 'select',
          model: 'type',
          label: '门禁类型',
          options: []
        },
        {
          type: 'input',
          model: 'type',
          label: 'IP地址'
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
          label: '编辑',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '初始化',
          icon: 'el-icon-refresh',
          type: 'text',
          action: 'init'
        },
        {
          label: '权限管理',
          icon: 'el-icon-view',
          type: 'text',
          action: 'permission'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '门禁点名称'
        },
        {
          key: 'number',
          title: '设备类型'
        },
        {
          key: 'status',
          title: '设备名称'
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
          this.formModel = {}
          this.dialogTitle = '新增'
          this.dialogVisible = true
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'permission':
          this.visible = true
          break
        case 'edit':
          this.formModel = {
            ...row
          }
          this.dialogTitle = '修改'
          this.dialogVisible = true
          break
        case 'init':
          this.$modal.confirm(`您确认要初始化吗?`).then(() => {
            console.log(123456)
          })
          break
      }
    },
    okHandle(value) {
      console.log(value);
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
