<template>
  <div>
    <normal-table-render />
    <visirot-approve-detail
      :visible="visible"
      :data="detailData"
      @close="visible = false"
    />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import VisirotApproveDetail from '@/common/components/visitorManage/visitorApprove/Detail';
import { getTableDataList } from '@/api/visitorManage/visitorApprove';

export default {
  name: "VisitorApprove",
  mixins: [pageMixin],
  components: { VisirotApproveDetail },
  data () {
    return {
      detailData: {},
      visible: false,
      checkbox: true,
      searchConfig: [
        {
          type: 'input',
          model: 'title',
          label: '访客姓名'
        },
        {
          type: 'dateTime',
          model: 'createTimeRange',
          label: '预约时间'
        },
        {
          type: 'select',
          model: 'status',
          label: '状态',
          options: [
            {
              label: '草稿',
              value: '0'
            },
            {
              label: '处理中',
              value: '1'
            },
            {
              label: '已结束',
              value: '2'
            },
            {
              label: '已撤回',
              value: '3'
            }
          ]
        },
        {
          type: 'input',
          model: 'title',
          label: '被访人'
        },
        {
          type: 'input',
          model: 'title',
          label: '部门名称'
        }
      ],
      toolbarConfig: [
        {
          label: '导出',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'export'
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
          key: 'title',
          title: '访客姓名',
          props: {
            minWidth: '120'
          }
        },
        {
          key: 'processName',
          title: '预约日期',
          props: {
            minWidth: '160'
          }
        },
        {
          key: 'currTaskName',
          title: '手机号码',
          props: {
            minWidth: '150'
          },
        },
        {
          key: 'number',
          title: '车牌号',
          props: {
            minWidth: '120'
          }
          // customRender: (scope, row) => {
          //   return <span style={{ color: this.getStatus(row.status).color }}>{this.getStatus(row.status).text}</span>
          // }
        },
        {
          key: 'result',
          title: '随行人员',
          props: {
            minWidth: '120'
          }
        },
        {
          key: 'createTime',
          title: '被访人姓名',
          props: {
            minWidth: '120'
          }
        },
        {
          key: 'applyTime',
          title: '被访人部门',
          props: {
            minWidth: '150'
          }
        },
        {
          key: 'status',
          title: '状态',
          props: {
            minWidth: '120',
          }
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
            processName: '2022-02-02 10:10:10',
            currTaskName: '13255048788',
            number: '闽AXX905',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '生产管理部',
            status: '申请中'
          }
        ],
        total: 100
      }
    },
    buttonClick (item) {
      switch (item.action) {
        case 'export':
          console.log('导出')
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
