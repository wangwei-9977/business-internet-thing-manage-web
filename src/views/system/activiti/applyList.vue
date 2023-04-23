<template>
  <div class="content">
    <normal-table-render>
      <template #actions="scope, r">
        <div>
          <template v-if="r.status == 0">
            <el-button @click="apply(r)" type="text" size="mini" icon="el-icon-plus">提交申请</el-button>
            <el-button @click="edit(r)" type="text" size="mini" icon="el-icon-edit">编辑提交数据</el-button>
            <el-button @click="remove(r)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
          <template v-else-if="r.status == 1">
            <el-button @click="cancel(r)" type="text" size="mini" icon="el-icon-mouse" v-if="r.procInstStatus == 1">撤回</el-button>
            <el-button @click="history(r)" type="text" size="mini" icon="el-icon-aim">查看进度</el-button>
            <el-button @click="detail(r)" type="text" size="mini" icon="el-icon-pie-chart">表单数据</el-button>
          </template>
          <template v-else-if="(r.status == 2 && r.result == 3) || r.status == 3">
            <el-button @click="apply(r)" type="text" size="mini" icon="el-icon-coin">重新申请</el-button>
            <el-button @click="edit(r)" type="text" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button @click="history(r)" type="text" size="mini" icon="el-icon-time">审批历史</el-button>
          </template>
          <template v-else>
            <el-button @click="detail(r)" type="text" size="mini" icon="el-icon-pie-chart">表单数据</el-button>
            <el-button @click="history(r)" type="text" size="mini" icon="el-icon-time">审批历史</el-button>
          </template>
        </div>
      </template>
    </normal-table-render>
    <el-drawer
      title="选择流程"
      size="33%"
      :visible.sync="processModalVisible"
    >
      <div style="padding: 10px;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <el-input style="width: 200px" placeholder="输入流程名称" v-model="searchProcessKey" clearable />
          <el-button type="primary" @click="onSearchProcess" style="margin-left: 10px;">搜索</el-button>
        </div>
        <process-choose v-model="activeKey" :data="activeKeyAll" @chooseProcess="chooseProcess" :span="12" />
      </div>
    </el-drawer>
    <Dialog
      :visible="visible"
      :title="title"
      :footer="false"
      width="50%"
      @close="close"
    >
      <component
        :is="lcModa.formComponent"
        :disabled="lcModa.disabled"
        :processData="lcModa.processData"
        :isNew="lcModa.isNew"
        @afterSubmit="afterSub"
        @close="close"
      />
    </Dialog>
    <Dialog
      :visible="modalCancelVisible"
      @close="cancelClose"
      @confirm="cancelConfirm"
      title="确认撤回"
      width="500px"
    >
      <el-form ref="delForm" :model="cancelForm" :rules="cancelRules" :label-width="70">
        <el-form-item label="撤回原因" prop="reason">
          <el-input type="textarea" v-model="cancelForm.reason" :rows="4" />
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog
      title="审批历史"
      width="80%"
      :footer="false"
      :visible="modalLsVisible"
      @close="modalLsVisible = false"
    >
      <history-detail :procInstId="procInstId" />
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import Panel from '@/components/Panel'
import HistoryDetail from '@/common/components/activiti/HistoryDetail'
import ProcessChoose from '@/common/components/activiti/ProcessChoose'
import { filter, groupBy } from 'lodash'
import { getProcessDataList } from '@/api/activiti/applyHome'
import { apply, cancel, delData, getFirstNode, getTableList } from '@/api/activiti/applyList'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'

export default {
  name: "ApplyList",
  mixins: [pageMixin, activitiMixin],
  components: {
    Dialog,
    Panel,
    HistoryDetail,
    ProcessChoose
  },
  data () {
    return {
      lcModa: {
        disabled: false,
        formComponent: null,
        isNew: false,
        processData: {}
      },
      procInstId: '',
      searchProcessKey: '',
      activeKey: [],
      activeKeyAll: [],
      cancelForm: {},
      cancelRules: {
        reason: [{ required: true, message: '请输入' }]
      },
      title: '',
      visible: false,
      processModalVisible: false,
      modalCancelVisible: false,
      modalLsVisible: false,
      modalVisible: false,
      showAssign: false,
      isGateway: false,
      dialogLabelWidth: '100px',
      dialogWidth: '650px',
      formRules: {
        assignees: [{ required: true, message: '请选择' }]
      },
      searchConfig: [
        {
          type: 'input',
          model: 'title',
          label: '标题'
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
          type: 'select',
          model: 'result',
          label: '结果',
          options: [
            {
              label: '未提交',
              value: '0'
            },
            {
              label: '处理中',
              value: '1'
            },
            {
              label: '通过',
              value: '2'
            },
            {
              label: '驳回',
              value: '3'
            }
          ]
        },
        {
          type: 'dateTime',
          model: 'createTimeRange',
          label: '创建时间'
        }
      ],
      toolbarConfig: [
        {
          label: '发起申请',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      dialogFormConfig: [
        {
          type: 'select',
          label: '选择审批人',
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
              <el-alert
                style="height: 32px;"
                title="分支网关处不支持自定义选择下一审批人，将发送给下一节点所有人。"
                type="info"
                closable={false}
              />
            )
          }
        },
        {
          type: 'select',
          label: '优先级',
          model: 'priority',
          options: [
            {
              label: '普通',
              value: 0
            },
            {
              label: '重要',
              value: 1
            },
            {
              label: '紧急',
              value: 2
            }
          ]
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
          key: 'title',
          title: '标题',
          props: {
            width: '200',
          },
        },
        {
          key: 'processName',
          title: '所属流程',
          props: {
            width: '200',
          },
        },
        {
          key: 'currTaskName',
          title: '当前审批环节',
          props: {
            width: '150',
          },
        },
        {
          key: 'status',
          title: '状态',
          props: {
            width: '150',
          },
          customRender: (scope, row) => {
            return <span style={{ color: this.getStatus(row.status).color }}>{this.getStatus(row.status).text}</span>
          }
        },
        {
          key: 'result',
          title: '结果',
          props: {
            width: '150',
          },
          customRender: (scope, row) => {
            return <span style={{ color: this.getResult(row.status).color }}>{this.getResult(row.status).text}</span>
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
          key: 'applyTime',
          title: '申请时间',
          props: {
            width: '160',
          },
        },
        {
          key: 'actions',
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
      const { createTimeRange = [] } = query
      query.createTime_begin = createTimeRange[0]
      query.createTime_end = createTimeRange[1]
      const response = await getTableList(query)
      return {
        list: response.data
      }
    },
    buttonClick (item) {
      switch (item.action) {
        case 'add':
          this.getProcessList()
          break
      }
    },
    getProcessList () {
      getProcessDataList({
        status: 1,
        roles: false
      }).then(resp => {
        console.log(resp)
        if (resp.code === 200) {
          let result = resp.data || []
          this.activeKeyAll = []
          if (this.searchProcessKey) {
            result = filter(result, o => o.name.indexOf(this.searchProcessKey) > -1) || []
          }
          if (result.length !== 0) {
            const processDataMap = groupBy(result,'categoryId')
            for (const categoryId in processDataMap) {
              this.activeKeyAll.push({
                categoryId,
                processList: processDataMap[categoryId]
              })
              this.activeKey.push(categoryId)
            }
          } else {
            this.activeKeyAll = []
            this.activeKey = []
          }
          this.processModalVisible = true
        }
      })
      // let result = [
      //   {
      //     categoryId: 'business',
      //     name: '访客申请',
      //     version: 1,
      //     description: '访客申请',
      //     routeName: '@/common/components/activiti/form/leaveForm'
      //   },
      //   {
      //     categoryId: 'business',
      //     name: '访客申请2',
      //     version: 1,
      //     description: '访客申请2',
      //     routeName: '@/common/components/activiti/form/demoForm'
      //   },
      //   {
      //     categoryId: 'oa',
      //     name: '办公申请',
      //     version: 1,
      //     description: '办公申请',
      //     routeName: '@/common/components/activiti/form/leaveForm'
      //   }
      // ]
    },
    onSearchProcess () {
      this.getProcessList()
    },
    chooseProcess (item) {
      if (!item.routeName) {
        return this.$modal.msgWarning('该流程信息未配置表单，请联系开发人员！')
      }
      this.title = '发起流程：' + (item.name || '')
      this.lcModa.formComponent = this.getFormComponent(item.routeName).component
      this.lcModa.isNew = true
      this.lcModa.processData = item
      this.lcModa.disabled = false
      this.visible = true
    },
    apply (v) {
      if (!v.procDefId) {
        return this.$modal.msgError('流程定义为空')
      }
      this.$modal.confirm('确定提交申请吗?').then(() => {
        getFirstNode({
          procDefId: v.procDefId,
          tableId: v.tableId,
          tableName: v.tableName
        }).then(resp => {
            //todo 显示下一审批人姓名
          const formModel = {
            priority: 0,
            sendMessage: true,
            id: v.id,
            procDefId: v.procDefId,
            title: v.title
          }
          let error = ''
          const res = {
            data: {
              type: 3
            },
            users: resp.data.users
          }
          if (res.data.type == 3 || res.data.type == 4) {
            this.isGateway = true
            this.formModel = {
              ...formModel,
              firstGateway: true
            }
            this.showAssign = false;
            this.dialogTitle = '提交申请'
            this.dialogVisible = true
            return
          }
          this.formModel = {
            ...formModel,
            firstGateway: false
          }
          this.isGateway = false;
          if (res.data.users && res.data.users.length > 0) {
            this.error = ''
            this.assigneeList = res.data.users
            // 默认勾选
            let ids = []
            res.data.users.forEach(e => {
              ids.push(e.username)
            })
            this.formModel = {
              ...this.formModel,
              assignees: ids
            }
            this.showAssign = true
          } else {
            this.formModel = {
              ...this.formModel,
              assignees: []
            }
            this.showAssign = true
            error = '审批节点未分配候选审批人员，请联系管理员！'
          }
          this.dialogTitle = '提交申请'
          this.dialogVisible = true
          this.$nextTick(() => {
            if (error) {
              this.$modal.msgError(error)
            }
          })
        })
      })
    },
    confirm (formModel) {
      if (this.showAssign) {
        if (this.formModel.assignees.length < 1) {
          return this.$modal.msgError('请至少选择一个审批人')
        } else {
          this.formModel.assignees = this.formModel.assignees.join(",")
        }
      }
      apply(this.formModel).then(resp => {
        this.dialogVisible = false;
        this.$modal.msgSuccess('操作成功')
        this.reload()
      })
    },
    closeDialog () {
      this.dialogVisible = false
    },
    edit (r, isDetail = false) {
      if (!r.routeName) {
        return this.$modal.msgWarning('该流程信息未配置表单，请联系开发人员！')
      }
      this.title = `${isDetail ? '查看' : '修改'}流程业务信息：${r.title}`
      this.lcModa.disabled = isDetail
      this.lcModa.formComponent = this.getFormComponent(r.routeName).component
      this.lcModa.processData = r
      this.lcModa.isNew = false;
      this.visible = true
    },
    remove (row) {
      this.$modal.confirm('确定删除吗').then(() => {
        delData({ ids: row.id }).then(resp => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    cancel (v) {
      this.cancelForm.id = v.id
      this.cancelForm.procInstId = v.procInstId
      this.modalCancelVisible = true
    },
    history (v) {
      if (!v.procInstId) {
        return this.$modal.msgError('流程实例ID不存在')
      }
      this.procInstId = v.procInstId
      this.modalLsVisible = true
    },
    detail (item) {
      this.edit(item, true)
    },
    cancelConfirm () {
      this.$refs.delForm.validate(valid => {
        if (valid) {
          cancel(this.cancelForm).then(resp => {
            this.$modal.msgSuccess('操作成功')
            this.reload()
          })
          this.modalCancelVisible = false
        }
      })
    },
    cancelClose () {
      this.modalCancelVisible = false
    },
    close () {
      this.visible = false
    },
    afterSub (formData) {
      this.visible = false
      this.reload()
    },
    getStatus(status) {
      let text = '未知', color = ''
      if (status == 0) {
        text = '草稿'
        color = 'default'
      } else if (status == 1) {
        text = '处理中'
        color = 'orange'
      } else if (status == 2) {
        text = '已结束'
        color = 'blue'
      } else if (status == 3) {
        text = '已撤回'
        color = 'magenta'
      }
      return {text, color}
    },
    getResult(result) {
      let text = '未知', color = ''
      if (result == 0) {
        text = '未提交'
        color = 'default'
      } else if (result == 1) {
        text = '处理中'
        color = 'orange'
      } else if (result == 2) {
        text = '已通过'
        color = 'green'
      } else if (result == 3) {
        text = '已驳回'
        color = 'red'
      }
      return {text, color}
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  .panel {
    margin-top: -10px;
    .box-card {
      margin-top: 10px;
      &:hover {
        box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.3);
      }
    }
  }
  ::v-deep .el-empty {
    border: 1px solid #e6ebf5;
  }
  ::v-deep .el-collapse-item__header {
    background: #FAFAFA;
    border: 1px solid #e6ebf5;
    border-top: 0px;
    padding-left: 10px;
  }
  ::v-deep .el-collapse-item__content {
    padding: 10px;
    border-left: 1px solid #e6ebf5;
    border-right: 1px solid #e6ebf5;
  }
}
</style>
