<template>
  <div>
    <normal-table-render>
      <template #status="scope, row">
        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
      </template>
    </normal-table-render>
    <panel>
      <div>
        123456
      </div>
    </panel>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import { listMenu } from '@/api/system/menu'
import Panel from '@/components/Panel'

export default {
  name: "User",
  mixins: [pageMixin],
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: {
    Panel
  },
  data () {
    return {
      pagination: false,
      isExpandAll: false,
      tableProps: {
        rowKey: 'menuId',
        defaultExpandAll: false,
        treeProps: {children: 'children', hasChildren: 'hasChildren'}
      },
      actionConfig: [
        {
          label: '修改',
          icon: 'el-icon-edit',
          type: 'text',
          permission: ['system:menu:edit'],
          action: 'edit'
        },
        {
          label: '新增',
          icon: 'el-icon-plus',
          type: 'text',
          permission: ['system:menu:add'],
          action: 'add'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          permission: ['system:menu:remove'],
          action: 'add'
        }
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          permission: ['system:menu:add'],
          action: 'add'
        },
        {
          type: 'info',
          label: '展开/折叠',
          icon: 'el-icon-sort',
          action: 'open'
        }
      ],
      searchConfig: [
        {
          type: 'input',
          model: 'menuName',
          label: '菜单名称'
        },
        {
          type: 'select',
          model: 'status',
          label: '状态',
          options: []
        }
      ],
      tableColumns: [
        {
          key: 'menuName',
          value: '菜单名称',
          props: {
            width: '150',
          }
        },
        {
          key: 'icon',
          value: '图标',
          props: {
            width: '100',
          },
          customRender: (scope, row, index) => {
            return <svg-icon icon-class={scope.row.icon} />
          }
        },
        {
          key: 'orderNum',
          value: '排序',
          props: {
            width: '60'
          }
        },
        {
          key: 'perms',
          value: '权限标识',
          props: {
            showOverflowTooltip: true
          }
        },
        {
          key: 'component',
          value: '组件路径',
          props: {
            showOverflowTooltip: true
          }
        },
        {
          key: 'status',
          value: '状态',
          props: {
            width: '80'
          },
          scopedSlots: { customRender: 'status' }
        },
        {
          key: 'createTime',
          value: '创建时间',
          props: {
            align: 'center'
          },
          customRender: (scope, row, index) => {
            return <span>{ this.parseTime(scope.row.createTime) }</span>
          }
        },
        {
          key: 'options',
          value: '操作',
          props: {
            align: 'center',
          },
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    buttonClick (item) {
      switch (item.action) {
        case 'add':
          this.formModel = {}
          this.dialogVisible = true
          break
        case 'open':
          this.isExpandAll = !this.isExpandAll;
          this.$set(this.tableProps, 'defaultExpandAll', this.isExpandAll)
          this.$refs.tableRef.refresh()
          break
      }
    },
    actionClick (item, row) {
      console.log(item, row)
    },
    async request (query) {
      const response = await listMenu(query)
      this.menuList = this.handleTree(response.data, "menuId");
      return {
        list: this.menuList
      }
    },
    confirm () {
      this.$refs.tableRef.reload()
      this.dialogVisible = false
    },
    dictWithData () {
      this.getOptionsByDict('status', 'sys_normal_disable')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
