<template>
  <div>
    <normal-table-render>
      <template #detail="config, model">
        <addList :list="model[config.model]" />
      </template>
    </normal-table-render>
    <detail
      :visible="visible"
      :data="detailData"
      @close="visible = false"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import addList from '@/common/components/vehicleCenter/articleLeaveFactoryApply/addList';
import Detail from '@/common/components/vehicleCenter/articleLeaveFactoryApply/Detail';
import { getTableDataList } from '@/api/vehicleCente/articleLeaveFactoryApply';

export default {
  name: "ArticleLeaveFactoryApply",
  mixins: [pageMixin],
  components: { Detail, addList },
  data () {
    return {
      visible: false,
      checkbox: true,
      dialogLabelWidth: '120px',
      dialogWidth: '850px',
      detailData: {},
      formModel: {
        detail: []
      },
      dialogFormConfig: [
        {
          type: 'input',
          label: '物资出厂单号',
          model: 'number',
          span: 12
        },
        {
          type: 'date',
          label: '申请日期',
          model: 'name',
          span: 12
        },
        {
          type: 'select',
          label: '申请部门',
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
          label: '经办人',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '主管部门',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '负责人',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '出厂车牌号',
          model: 'time',
          span: 12
        },
        {
          type: 'input',
          label: '货物明细',
          model: 'detail',
          render: () => {
            return <span></span>
          },
          scopedSlots: 'detail'
        },
        {
          type: 'textarea',
          label: '出厂理由',
          model: 'time'
        },
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
          model: 'status',
          label: '申请部门'
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
          label: '下载',
          icon: 'el-icon-download',
          type: 'text',
          action: 'download'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '物资出厂申请编号'
        },
        {
          key: 'number',
          title: '申请部门'
        },
        {
          key: 'status',
          title: '经办人'
        },
        {
          key: 'status',
          title: '主管部门'
        },
        {
          key: 'status',
          title: '负责人'
        },
        {
          key: 'status',
          title: '出厂车牌号'
        },
        {
          key: 'status',
          title: '货物种类'
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
    },
    confirm (query) {
      console.log(query)
      // this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
