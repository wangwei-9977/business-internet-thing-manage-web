<template>
  <div>
    <normal-table-render />
    <detail
      :visible="visible"
      :data="detailData"
      @close="visible = false"
    />
    <Add
      :visible="addVisible"
      @close="addVisible = false"
      @confirm="addConfirm"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Detail from '@/common/components/vehicleCenter/transportCarManage/Detail';
import Add from '@/common/components/vehicleCenter/transportCarManage/add';
import { getTableDataList } from '@/api/vehicleCente/transportCarManage';

export default {
  name: "TransportCarManage",
  mixins: [pageMixin],
  components: { Detail, Add },
  data () {
    return {
      checkbox: true,
      visible: false,
      addVisible: false,
      detailData: {},
      searchConfig: [
        {
          type: 'date',
          model: 'name',
          label: '日期'
        },
        {
          type: 'select',
          model: 'type',
          label: '所属车队',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'input',
          model: 'number',
          label: '车牌号'
        },
        {
          type: 'select',
          model: 'type',
          label: '车辆状态',
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
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
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '申请日期'
        },
        {
          key: 'number',
          title: '申请时间'
        },
        {
          key: 'status',
          title: '所属车队'
        },
        {
          key: 'status',
          title: '司机名称'
        },
        {
          key: 'status',
          title: '车牌号'
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
          this.addVisible = true
          break
        case 'del':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'detail':
          this.detailData = { ...row }
          this.visible = true
          break
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
    },
    addConfirm() {
      this.addVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
