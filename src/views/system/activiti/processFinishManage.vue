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
import { delData, getTableList } from '@/api/activiti/processFinishManage'

export default {
  name: "ProcessFinishManage",
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
        isNew: false,
        processData: {}
      },
      searchConfig: [
        {
          type: 'input',
          model: 'name',
          label: '流程名称'
        },
        {
          type: 'input',
          model: 'key',
          label: '标识Key'
        },
        {
          type: 'dateTime',
          model: 'selectDate',
          label: '结束时间',
          change: val => {
            this.formModel.startDate = val[0]
            this.formModel.endDate = val[1]
          }
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
          key: 'id',
          title: '流程实例ID',
          props: {
            width: '150',
            fixed: 'left'
          }
        },
        {
          key: 'name',
          title: '流程名称',
          props: {
            width: '150',
            fixed: 'left'
          }
        },
        {
          key: 'applyer',
          title: '申请人',
          props: {
            width: '150',
          }
        },
        {
          key: 'key',
          title: '标识Key',
          props: {
            width: '150',
          }
        },
        {
          key: 'version',
          title: '版本',
          props: {
            width: '80',
          }
        },
        {
          key: 'result',
          title: '审批结果',
          props: {
            width: '150',
          },
          customRender: (sccope, row) => {
            return (
              <div>
                {
                  row.priority === 4 ? (
                    <span style="color: #999999;"> 发起人撤回 </span>
                  ) : row.resultresult === 5 ? (
                    <span style="color: orange;"> 已删除 </span>
                  ) : row.result === 2 ? (
                    <span style="color: green;"> 已通过 </span>
                  ) : row.result === 3 ? (
                    <span style="color: red;"> 已驳回 </span>
                  ) : (
                    <span> 未知 </span>
                  )
                }
              </div>
            )
          }
        },
        {
          key: 'deleteReason',
          title: '原因详情',
          props: {
            width: '150',
          }
        },
        {
          key: 'duration',
          title: '总耗时',
          props: {
            width: '100',
          },
          customRender: (sccope, row) => {
            return <span >{millsToTime(row.duration)}</span>
          }
        },
        {
          key: 'startTime',
          title: '开始时间',
          props: {
            width: '160',
          }
        },
        {
          key: 'endTime',
          title: '结束时间',
          props: {
            width: '160',
          }
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
      const response = await getTableList(query)
      return {
        list: response.data
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'del':
          this.$modal.confirm('确定删除吗?').then(resp => {
            delData(row.id).then(resp => {
              this.$modal.msgSuccess('删除成功')
              this.reload()
            })
          }).catch(() => {})
          break
        case 'history':
          if (!row.id) {
            return this.$modal.msgError('流程实例ID不存在')
          }
          this.procInstId = row.id
          this.modalLsVisible = true
          break
        case 'form':
          if (!row.routeName) {
            return this.$modal.msgError('该流程信息未配置表单，请联系开发人员！')
          }
          this.lcModa.disabled = true
          this.lcModa.formComponent = this.getFormComponent(row.routeName).component
          this.lcModa.processData = row
          this.lcModa.isNew = false
          this.title = '查看流程业务信息：' + row.name
          this.visible = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
