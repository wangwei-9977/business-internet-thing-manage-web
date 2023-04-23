<template>
  <div>
    <normal-table-render />
    <detail
      :visible="visible"
      :data="detailData"
      @close="visible = false"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Detail from '@/common/components/vehicleCenter/truckCarManage/Detail';
import { getTableDataList } from '@/api/vehicleCente/truckCarManage';

export default {
  name: "TruckCarManage",
  mixins: [pageMixin],
  components: { Detail },
  data () {
    return {
      dialogLabelWidth: '120px',
      dialogWidth: '800px',
      visible: false,
      checkbox: true,
      detailData: {},
      dialogFormConfig: [
        {
          type: 'input',
          label: '车牌号码',
          model: 'number',
          span: 12
        },
        {
          type: 'date',
          label: '申请进场日期',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '司机姓名',
          model: 'name',
          span: 12
        },
        {
          type: 'input',
          label: '司机身份证号码',
          model: 'number',
          span: 12
        },
        {
          type: 'input',
          label: '车辆类型',
          model: 'type',
          span: 12,
          options: [
            {
              label: 'xxx',
              value: 1
            }
          ]
        },
        {
          type: 'input',
          label: '手机号码',
          model: 'time',
          span: 12
        },
        {
          type: 'imageUpload',
          label: '个人头像',
          model: 'number',
        },
        {
          type: 'select',
          label: '货物类型',
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
        },
        {
          type: 'input',
          label: '货物接收人',
          model: 'name'
        },
        {
          type: 'textarea',
          label: '审批信息',
          model: 'name'
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
          type: 'date',
          model: 'type',
          label: '日期'
        },
        {
          type: 'input',
          model: 'number',
          label: '车牌号'
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
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '日期'
        },
        {
          key: 'number',
          title: '车牌号'
        },
        {
          key: 'status',
          title: '驾驶员姓名'
        },
        {
          key: 'status',
          title: '身份证号'
        },
        {
          key: 'status',
          title: '货物签收人'
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
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'detail':
          this.detailData = { ...row }
          this.visible = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
