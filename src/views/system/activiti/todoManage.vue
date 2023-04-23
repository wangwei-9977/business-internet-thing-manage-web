<template>
  <div>
    <normal-table-render>
      <template #actions="scope, r">
        <div>
          <span v-if="!r.isSuspended" style="margin-right: 10px;">
            <el-button @click="detail(r)" type="text" size="mini" icon="el-icon-coin">查看并处理</el-button>
            <el-button @click="delegateTask(r)" type="text" size="mini" icon="el-icon-plus">委托他人代办</el-button>
          </span>
          <el-button @click="history(r)" type="text" size="mini" icon="el-icon-time">历史</el-button>
        </div>
      </template>
    </normal-table-render>
    <Dialog
      title="审批历史"
      :visible="modalLsVisible"
      :footer="false"
      width="80%"
      @close="modalLsVisible = false"
    >
      <component :is="historyDetail" :procInstId="procInstId" />
    </Dialog>
    <Dialog
      :title="title"
      :visible="visible"
      :footer="false"
      @close="close"
      width="600px"
    >
      <component
        :is="lcModa.formComponent"
        :disabled="lcModa.disabled"
        :processData="lcModa.processData"
        :isNew="lcModa.isNew"
        :task="true"
        @passTask="passTask"
        @backTask="backTask"
        @close="close"
      />
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'
import { getTableList, pass, back, backToTask, delegate, getBackList, getNodeList, getNode } from '@/api/activiti/todoManage'
import { listUser } from '@/api/system/user'

export default {
  name: "TodoManage",
  components: { Dialog },
  mixins: [pageMixin, activitiMixin],
  data () {
    const _self = this
    return {
      visible: false,
      title: '',
      modalLsVisible: false,
      procInstId: '',
      dialogLabelWidth: '100px',
      showAssign: false,
      backTaskKey: 0,
      isGateway: false,
      lcModa: {
        disabled: false,
        formComponent : null,
        isNew: false,
        processData: {}
      },
      searchConfig: [
        {
          type: 'input',
          model: 'name',
          label: '任务名称'
        }
      ],
      dialogFormConfig: [
        {
          type: 'textarea',
          label: '审批意见',
          model: 'comment',
        },
        {
          type: 'select',
          label: '下一审批人',
          model: 'assignees',
          multiple: true,
          isShow: () => {
            return this.showAssign
          },
          options: []
        },
        {
          type: 'input',
          label: '下一审批人',
          model: 'xxx',
          isShow: () => {
            return this.isGateway
          },
          render: () => {
            return (
              <el-tooltip
                title="分支网关处不支持自定义选择下一审批人，将发送给下一节点所有人。"
                type="info"
                closable={false}
              />
            )
          }
        },
        {
          type: 'select',
          label: '驳回至',
          model: 'backTaskKey',
          isShow: () => {
            return this.formModel.type === 1
          },
          change: val => {
            _self.changeBackTask(val)
          },
          options: []
        },
        {
          type: 'select',
          label: '指定原节点审批人',
          model: 'assignees',
          multiple: true,
          isShow: () => {
            let b = this.formModel.type === 1 && this.backTaskKey !== '-1'
            return b
          },
          options: []
        },
        {
          type: 'select',
          label: '选择委托人',
          model: 'userId',
          isShow: () => {
            return this.formModel.type === 2
          },
          options: []
        },
        {
          type: 'checkbox',
          label: '消息通知',
          name: '站内消息通知',
          model: 'sendMessage'
        }
      ],
      tableColumns: [
        {
          key: 'name',
          title: '任务名称',
          props: {
            width: '150',
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
          key: 'isSuspended',
          title: '状态',
          props: {
            width: '100',
          },
          customRender: (scope, row) => {
            return (
              <div>
                {
                  !!row.isSuspended ? <span style="color: orange;"> 已挂起 </span> : <span style="color: green;"> 已激活 </span>
                }
              </div>
            )
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
  created () {
    listUser({
      pageNum: 1,
      pageSize: 10000
    }).then(res => {
      const data = res.rows || []
      const list = data.map(item => {
        return {
          label: item.userName,
          value: item.userId
        }
      })
      this.dialogFormConfig[5].options = list
    })
  },
  methods: {
    async request (query) {
      const response = await getTableList(query)
      return {
        list: response.data
      }
    },
    history (row) {
      if (!row.procInstId) {
        return this.$modal.msgError('流程实例ID不存在')
      }
      this.procInstId = row.procInstId
      this.modalLsVisible = true
    },
    detail (r) {
      if (!r.routeName) {
        return this.$modal.msgWarning('该流程信息未配置表单，请联系开发人员！')
      }
      this.lcModa.disabled = true
      this.lcModa.formComponent = this.getFormComponent(r.routeName).component
      this.lcModa.processData = r
      this.lcModa.isNew = false
      this.title = '查看流程业务信息：' + r.processName
      this.visible = true
    },
    passTask () {
      const v = this.lcModa.processData
      this.dialogTitle = '审批通过'
      this.formModel = {
        id: v.id,
        procInstId: v.procInstId,
        procDefId: v.procDefId,
        type: 0,
        backTaskKey: -1
      }
      this.dialogVisible = true
      getNodeList({
        procDefId: v.procDefId,
        currActId: v.key,
        procInstId: v.procInstId
      }).then(res => {
        if (res.data.type === 4) {
          this.isGateway = true
          this.showAssign = false
          return
        }
        this.isGateway = false
        if (res.data.users && res.data.users.length > 0) {
          const ids = []
          const list = resp.result.map(item => {
            ids.push(item.id)
            return {
              label: item.realname,
              value: item.username
            }
          })
          this.dialogFormConfig[1].options = list
          this.dialogFormConfig[4].options = list
          this.showAssign = true
          this.$set(this.formModel, 'assignees', ids)
        } else {
          this.showAssign = false
        }
      })
    },
    backTask () {
      const v = this.lcModa.processData
      console.log(v,'驳回')
      this.dialogTitle = "审批驳回"
      this.formModel = {
        id: v.id,
        procInstId: v.procInstId,
        procDefId: v.procDefId,
        priority: v.priority,
        type: 1,
        backTaskKey: '-1'
      }
      this.backTaskKey='-1'
      this.showAssign = false
      this.dialogFormConfig[3].options = [
        {
          label: "发起人",
          value: "-1"
        },
      ]
      // 获取可驳回节点
      getBackList(v.procInstId).then(res => {
        res.data.forEach(item => {
          this.dialogFormConfig[3].options.push({
            label: item.name,
            value: item.key
          })
        })
      })
      this.dialogVisible = true
    },
    changeBackTask (val) {
      this.backTaskKey = val
      if (val === '-1') {
        return
      }
      let v =this.lcModa.processData
      v.nodeId=val
      console.log(v)
      getNode(v).then(resp => {
        const ids = []
        const list = resp.data.users.map(item => {
          // ids.push(item.userId)
          return {
            label: item.userName,
            value: item.userId
          }
        })
        this.dialogFormConfig[1].options = list
        this.dialogFormConfig[4].options = list
        // console.log(ids)
        this.$set(this.formModel, 'assignees', ids)
        // console.log(this.formModel)
      })
    },
    delegateTask (v) {
      this.formModel = {
        sendMessage: true,
        id: v.id,
        procInstId: v.procInstId,
        type: 2,
        backTaskKey: -1
      }
      this.showAssign = false
      this.dialogTitle = "委托他人代办"
      this.dialogVisible = true;
    },
    confirm (formModel) {
      console.log(formModel)
      if (formModel.assignees && formModel.assignees.length !== 0) {
        formModel.assignees = formModel.assignees.join(",")
      }
      if (formModel.type == 0) {
        if (this.showAssign && formModel.assignees.length < 1) {
          return this.$modal.msgError('请至少选择一个审批人')
        }
        pass(formModel).then(resp => {
          this.$modal.msgSuccess('操作成功')
          this.visible = false
          this.dialogVisible = false
          this.reload()
        })
      } else if (formModel.type == 1) {
        if (formModel.backTaskKey == -1) {
          back(formModel).then(resp => {
            this.$modal.msgSuccess('操作成功')
            this.visible = false
            this.dialogVisible = false
            this.reload()
          })
        } else {
          if (formModel.backTaskKey !== -1 && formModel.assignees.length < 1) {
            return this.$modal.msgError('请至少选择一个审批人')
          }
          backToTask(formModel).then(resp => {
            this.$modal.msgSuccess('操作成功')
            this.visible = false
            this.dialogVisible = false
            this.reload()
          })
        }
      } else if (formModel.type == 2) {
        if (!formModel.userId) {
          return this.$modal.msgError('请选择一委托人')
        }
        delegate(formModel).then(resp => {
          this.$modal.msgSuccess('操作成功')
          this.dialogVisible = false
          this.reload()
        })
      }
    },
    close () {
      this.visible = false
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
