<template>
  <div>
    <normal-table-render />
    <permission :visible="visible" @close="visible = false" @confirm="okHandle" />
    <dialog-form
      title="门禁点配置"
      width="600px"
      label-width="80px"
      :configs="configs"
      :dialogVisible="show"
      :form-model="{}"
      :form-rules="rules"
      @close="close"
      @confirm="setupConfirm"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Permission from '@/common/components/interThingsPlatformManage/doorForbiddenManage/GroupPermission'
import { getTableDataList } from '@/api/interThingsPlatformManage/doorForbiddenManage/groupManage';

export default {
  name: "GroupManage",
  mixins: [pageMixin],
  components: { Permission },
  data () {
    return {
      show: false,
      visible: false,
      showIndex: true,
      dialogLabelWidth: '100px',
      configs: [
        {
          type: 'input',
          label: '门禁组',
          model: 'number'
        },
        ,
        {
          type: 'select',
          label: '门禁点',
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
        }
      ],
      rules: {
        number: [{ required: true, message: '请输入承包商名称' }],
        name: [{ required: true, message: '请输入管理部门名称' }]
      },
      dialogFormConfig: [
        {
          type: 'input',
          label: '门禁组名称',
          model: 'number'
        },
        {
          type: 'select',
          label: '状态',
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
          label: '门禁组名称'
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
          label: '门禁点配置',
          icon: 'el-icon-setup',
          type: 'text',
          action: 'setup'
        },
        {
          label: '人员权限管理',
          icon: 'el-icon-view',
          type: 'text',
          action: 'permission'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '门禁组名称'
        },
        {
          key: 'number',
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
        case 'setup':
          this.show = true
          break
      }
    },
    close() {
      this.show = false
    },
    setupConfirm() {
      this.show = false
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
