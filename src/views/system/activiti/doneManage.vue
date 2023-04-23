<template>
  <div>
    <normal-table-render />
    <Dialog
      title="审批历史"
      :visible="modalLsVisible"
      :footer="false"
      width="80%"
      @close="modalLsVisible = false"
    >
      <component is="historyDetail" :procInstId="procInstId" />
    </Dialog>
    <Dialog
      :title="title"
      :visible="visible"
      width="50%"
      @close="visible = false"
      :footer="false"
    >
      <component
        :is="lcModa.formComponent"
        :disabled="lcModa.disabled"
        :processData="lcModa.processData"
        :isNew="lcModa.isNew"
        @close="visible = false"
      />
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import HistoryDetail from '@/common/components/activiti/HistoryDetail'
import Dialog from '@/components/Dialog'
import { millsToTime } from '@/utils'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'
import { getTableList, delData } from '@/api/activiti/doneManage'

export default {
  name: "DoneManage",
  mixins: [pageMixin, activitiMixin],
  components: {
    HistoryDetail,
    Dialog
  },
  data () {
    return {
      modalLsVisible: false,
      visible: false,
      procInstId: '',
      title: '',
      lcModa: {
        disabled: false,
        formComponent: null,
        isNew: false
      },
      searchConfig: [
        {
          type: 'input',
          model: 'name',
          label: '任务名称'
        }
      ],
      actionConfig: [
        {
          label: '表单数据',
          icon: 'el-icon-s-data',
          type: 'text',
          action: 'form'
        },
        {
          label: '审批历史',
          icon: 'el-icon-time',
          type: 'text',
          action: 'history'
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
          key: 'name',
          title: '任务名称',
          props: {
            width: '150',
            fixed: 'left'
          },
        },
        {
          key: 'processName',
          title: '所属流程',
          props: {
            width: '150',
          },
        },
        {
          key: 'owner',
          title: '委托人',
          props: {
            width: '150',
          },
        },
        {
          key: 'applyer',
          title: '流程发起人',
          props: {
            width: '150',
          },
        },
        {
          key: 'priority',
          title: '优先级',
          props: {
            width: '110',
          },
          customRender: (scope, row) => {
            return (
              <div>
                {
                  row.priority === 0 ? (
                    <span style="color: green;"> 普通 </span>
                  ) : row.priority === 1 ? (
                    <span style="color: orange;"> 重要 </span>
                  ) : row.priority === 2 ? (
                    <span style="color: red;"> 紧急 </span>
                  ) : (
                    <span style="color: #999;"> 无 </span>
                  )
                }
              </div>
            )
          }
        },
        {
          key: 'deleteReason',
          title: '审批操作',
          props: {
            width: '150',
          },
        },{
          key: 'comment',
          title: '审批意见',
          props: {
            width: '150',
          },
        },
        {
          key: 'duration',
          title: '耗时',
          props: {
            width: '100',
          },
          customRender: (scope, row) => {
            return <span>{millsToTime(row.duration)}</span>
          }
        },
        {
          key: 'createTime',
          title: '创建时间',
          props: {
            width: '160',
          },
        },
        {
          key: 'action',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '250',
            fixed: 'right'
          },
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    async request (query) {
      const request = await getTableList(query)
      return {
        list: request.data
      }
    },
    actionClick (item, r) {
      switch (item.action) {
        case 'del':
          this.$modal.confirm('确定删除吗?').then(resp => {
            delData(r.id).then(resp => {
              this.reload()
              this.$modal.msgSuccess('删除成功')
            })
          }).catch(() => {})
          break
        case 'history':
          if (!r.procInstId) {
            return this.$modal.msgError('流程实例ID不存在')
          }
          this.procInstId = r.procInstId
          this.modalLsVisible = true
          break
        case 'form':
          if (!r.routeName) {
            return this.$modal.msgError('该流程信息未配置表单，请联系开发人员！')
          }
          this.lcModa.disabled = true
          this.lcModa.formComponent = this.getFormComponent(r.routeName).component
          this.lcModa.processData = r
          this.lcModa.isNew = false
          this.lcModa.isTask = true
          this.title = '查看流程业务信息：' + r.processName
          this.visible = true
          break
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
