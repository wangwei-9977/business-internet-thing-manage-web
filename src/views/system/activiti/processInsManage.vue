<template>
  <div>
    <normal-table-render>
      <template #actions="scope, r">
        <div>
          <template v-if="r.isSuspended">
            <el-button @click="editStatus(r)" type="text" size="mini" icon="el-icon-unlock">激活</el-button>
          </template>
          <template v-else>
            <el-button @click="editStatus(r)" type="text" size="mini" icon="el-icon-lock">挂起</el-button>
          </template>
          <el-button @click="history(r)" type="text" size="mini" icon="el-icon-view">审批详情</el-button>
          <el-button @click="detail(r)" type="text" size="mini" icon="el-icon-s-data">表单数据</el-button>
          <el-button @click="remove(r)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
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
import Dialog from '@/components/Dialog'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'
import { delData, getTableList, updateInsStatus } from '@/api/activiti/processInsManage'

export default {
  name: "ProcessInsManage",
  mixins: [pageMixin, activitiMixin],
  components: {
    Dialog
  },
  data () {
    return {
      modalLsVisible: false,
      visible: false,
      modalVisible: false,
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
        }
      ],
      formRules: {
        reason: [{ required: true, message: '请输入' }]
      },
      dialogFormConfig: [
        {
          type: 'textarea',
          model: 'reason',
          label: '删除原因'
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
          key: 'currTaskName',
          title: '当前环节',
          props: {
            width: '150',
          }
        },
        {
          key: 'isSuspended',
          title: '状态',
          props: {
            width: '110',
          },
          customRender: (scope, row) => {
            return (
              <div>
                {
                  row.isSuspended ? (
                    <span style="color: red">已挂起</span>
                  ) : (
                    <span style="color: #2f54eb">已激活</span>
                  )
                }
              </div>
            )
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
    editStatus ({ status, name, id }) {
      const operation = status == 0 ? '暂停挂起' : '激活运行'
      this.$modal.confirm(`您确认要${operation}流程实例${name}?`).then(() => {
        let params = {
          status: status,
          id
        }
        updateInsStatus(params).then(resp => {
          this.$modal.msgSuccess('操作成功')
          this.reload()
        })
      }).catch(() => {})
    },
    history (row) {
      if (!row.procInstId) {
        return this.$modal.msgError('流程实例ID不存在')
      }
      this.procInstId = row.procInstId
      this.modalLsVisible = true
    },
    detail (row) {
      if (!row.routeName) {
        return this.$modal.msgError('该流程信息未配置表单，请联系开发人员！')
      }
      this.lcModa.disabled = true
      this.lcModa.formComponent = this.getFormComponent(row.routeName).component
      this.lcModa.processData = row
      this.lcModa.isNew = false
      this.title = '查看流程业务信息：' + row.name
      this.visible = true
    },
    remove (v) {
      this.$modal.confirm(`您确认要删除吗?`).then(() => {
        this.formModel = {
          reason: '',
          id: v.id
        }
        this.dialogTitle = `确认删除流程 ${v.name}`
        this.dialogVisible = true
      })
    },
    confirm (row) {
      delData(row.id).then(resp => {
        this.reload()
        this.$modal.msgSuccess('删除成功')
      })
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
