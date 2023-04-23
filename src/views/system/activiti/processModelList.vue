<template>
  <div class="content">
    <normal-table-render>
      <template #formtype="config, formModel">
        <a @click="viewForm" :style="{ color: styles.theme }">预览表单</a>
      </template>
    </normal-table-render>
    <Dialog
      title="流程图片预览"
      width="90%"
      :footer="false"
      :visible="imageVisible"
      @close="imageVisible = false"
    >
      <img :src="diagramUrl" />
    </Dialog>
    <Dialog
      title="流程表单预览"
      width="50%"
      :footer="false"
      :visible="formVisible"
      @close="formVisible = false"
    >
      <component :is="formComponent" :isNew="true" :disabled="true" />
    </Dialog>
    <Dialog
      :visible="showProcessNodeEdit"
      title="编辑流程节点"
      width="800px"
      @close="processClose"
    >
      <el-row>
        <el-col :span="4">
          <el-steps direction="vertical" :active="active" class="step">
            <el-step v-for="(item, index) in nodeList" :key="index" :title="item.title" :description="item.description" :data-id="index" />
          </el-steps>
        </el-col>
        <el-col :span="20">
          <div class="step-content">
            <el-alert
              title="温馨提示：若流程运行至未分配审批人员的审批节点时，流程将自动中断取消！"
              type="warning"
              show-icon
              :closable="false"
            />
            <el-form ref="formRef" :rules="processRules" :model="processModel" label-width="120px">
              <el-form-item label="节点名称">
                <span class="nodespan">{{ editNode.title }}</span>
              </el-form-item>
              <el-form-item label="节点类型">
                <span class="nodespan">{{ dictNodeType[editNode.type] }}</span>
              </el-form-item>
              <el-alert
                title="每个节点设置，如有修改都请保存一次，跳转节点后数据不会自动保存！"
                type="info"
                show-icon
                :closable="false"
              />
              <br/>
              <el-form-item prop="approve" label="审批人员" v-show="editNode.type === 1">
                <el-checkbox-group @change="checkChange" v-model="processModel.approve">
                  <el-checkbox label="0">根据角色选择</el-checkbox>
                  <el-checkbox label="1">直接选择人员</el-checkbox>
                  <el-checkbox label="2">部门</el-checkbox>
                  <el-checkbox label="5">部门负责人</el-checkbox>
                  <el-checkbox label="3">
                    发起人
                    <el-tooltip placement="top" content="自动获取发起人">
                      <i class="el-icon-warning-outline" />
                    </el-tooltip>
                  </el-checkbox>
                  <el-checkbox label="4">
                    发起人的部门负责人
                    <el-tooltip placement="top" content="自动获取发起人所在部门的负责人，即其上级领导。（如果其本身就是部门负责人，则指向发起人自己。）">
                      <i class="el-icon-warning-outline" />
                    </el-tooltip>
                  </el-checkbox>
                  <el-checkbox label="6">
                    表单变量
                    <el-tooltip placement="top" content="填写与表单中相对应的变量，role:角色，user:人员：dept:部门：deptManage:部门负责人; 例如：variable:role,variable2:user;">
                      <i class="el-icon-warning-outline" />
                    </el-tooltip>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="选择角色" v-if="processModel.approve.indexOf('0') > -1">
                <el-select v-model="processModel.roleIds" multiple clearable collapseTags>
                  <el-option v-for="(item, index) in roleOptions" :key="index" :value="item.value" :label="item.label" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择人员" v-if="processModel.approve.indexOf('1') > -1">
                <el-select v-model="processModel.userIds" multiple clearable collapseTags>
                  <el-option v-for="(item, index) in userOptions" :key="index" :value="item.value" :label="item.label" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择部门" v-if="processModel.approve.indexOf('2') > -1">
                <treeselect v-model="processModel.departmentIds" :options="deptOptions" :normalizer="normalizer" clearable multiple placeholder="选择部门" />
              </el-form-item>
              <el-form-item label="选择部门负责人" v-if="processModel.approve.indexOf('5') > -1">
                <treeselect v-model="processModel.departmentManageIds" :options="deptOptions" :normalizer="normalizer" clearable multiple placeholder="选择部门" />
              </el-form-item>
              <el-form-item label="输入表单变量" v-if="processModel.approve.indexOf('6') > -1">
                <el-input v-model="processModel.formVariables" />
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button :loading="confirmLoading" :disabled="disabled" @click="processConfirm" type="primary">
          确定
        </el-button>
        <el-button @click="processClose" type="gray">
          取消
        </el-button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import styles from '@/assets/styles/element-variables.scss'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'
import { getTableList, convertToModel, delData, editData, updateStatus, getProcessNode, editNodeUser } from '@/api/activiti/processModelList'
import { listRole } from '@/api/system/role'
import { listUser } from '@/api/system/user'
import { listDept } from '@/api/system/dept'

export default {
  name: "ProcessModelList",
  mixins: [pageMixin, activitiMixin],
  components: {
    Dialog,
    Treeselect
  },
  data () {
    return {
      styles,
      defaultUrl: process.env.VUE_APP_BASE_API,
      url: {
        img: "/system/activiti/models/export",
      },
      processModel: {
        approve: [],
        departmentManageIds: []
      },
      processRules: {
        approve: [{ required: true, message: '请选择' }]
      },
      formComponent: null,
      active: 1,
      nodeList: [],
      editNode: {},
      dictNodeType: {
        '0':'开始节点',
        '1':'审批节点',
        '2':'结束节点',
      },
      roleOptions: [],
      userOptions: [],
      deptOptions: [],
      confirmLoading: false,
      imageVisible: false,
      formVisible: false,
      showProcessNodeEdit: false,
      doms: [],
      diagramUrl: '',
      dictOptions: [
        {
          text: '测试流程',
          label: '测试流程',
          value: 'test'
        },
        {
          text: 'OA办公',
          label: 'OA办公',
          value: 'oa'
        },
        {
          text: '业务办理',
          label: '业务办理',
          value: 'business'
        }
      ],
      searchConfig: [
        {
          type: 'input',
          model: 'lcmc',
          label: '流程名称'
        },
        {
          type: 'input',
          model: 'lckey',
          label: '流程标识'
        },
        {
          type: 'switch',
          model: 'zx',
          label: '是否最新'
        }
      ],
      formRules: {
        categoryId: [{ required: true, message: '请选择' }],
        routeName: [{ required: true, message: '请选择' }]
      },
      dialogFormConfig: [
        {
          type: 'select',
          label: '流程分类',
          model: 'categoryId',
          options: [
            {
              label: '测试流程',
              value: 'test'
            },
            {
              label: 'OA办公',
              value: 'oa'
            },
            {
              label: '业务办理',
              value: 'business'
            }
          ]
        },
        {
          type: 'select',
          label: '关联表单',
          model: 'routeName',
          scopedSlots: 'formtype',
          options: [],
          change: (val, config) => {
            this.formChange(val)
          }
        },
        {
          type: 'select',
          label: '角色授权',
          model: 'roles',
          options: [
            {
              label: '业务办理',
              value: '1'
            }
          ]
        },
        {
          type: 'inputNumber',
          label: '排序',
          model: 'sort'
        },
        {
          type: 'textarea',
          label: '备注描述',
          model: 'description'
        }
      ],
      actionConfig: [
        {
          label: (item, row) => {
            return !row.status ? '启用' : '禁用'
          },
          type: 'text',
          icon: 'el-icon-lock',
          action: 'open'
        },
        {
          label: '节点设置',
          type: 'text',
          icon: 'el-icon-setting',
          action: 'setup'
        },
        {
          label: '复制为模型',
          type: 'text',
          icon: 'el-icon-document-copy',
          action: 'copy'
        },
        {
          label: '编辑',
          type: 'text',
          icon: 'el-icon-edit',
          action: 'edit'
        },
        {
          label: '删除',
          type: 'text',
          icon: 'el-icon-delete',
          action: 'del'
        }
      ],
      tableColumns: [
        {
          key: 'name',
          title: '流程名称',
          props: {
            width: '200',
            fixed: 'left'
          },
        },
        {
          key: 'processKey',
          title: '流程标识',
          props: {
            width: '200',
          },
        },
        {
          key: 'version',
          title: '版本',
          props: {
            width: '100',
          },
        },
        {
          key: 'categoryId',
          title: '所属分类',
          props: {
            width: '200',
          },
          customRender: (scope, row) => {
            return <span>{ this.filterDictText(this.dictOptions, row.categoryId) }</span>
          }
        },
        {
          key: 'diagramName',
          title: '流程图片',
          props: {
            width: '200',
          },
          customRender: (scope, row, index) => {
            return <a style={{ color: styles.theme}} on-click={() => this.showResource(row)}>{ row.diagramName }</a>
          }
        },
        {
          key: 'routeName',
          title: '表单路由',
          props: {
            width: '200',
          },
          customRender: (scope, row, index) => {
            return <a style={{ color: styles.theme}} on-click={() => this.viewForm(row)}>
              { this.getFormComponent(row.routeName).text }
            </a>
          }
        },
        {
          key: 'status',
          title: '状态',
          props: {
            width: '200',
          },
          customRender: (scope, row, index) => {
            return (
              <div>
                {
                  !row.status ? (
                    <span style="color: #999;">未启用</span>
                  ) : (
                    <span style="color: #00A0E9;">已启用</span>
                  )
                }
              </div>
            )
          }
        },
        {
          key: 'description',
          title: '备注说明',
          props: {
            width: '300',
          },
        },
        {
          key: 'createTime',
          title: '部署时间',
          props: {
            width: '160',
          },
        },
        {
          key: 'updateTime',
          title: '更新时间',
          props: {
            width: '160',
          },
        },
        {
          key: 'action',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '340',
            fixed: 'right'
          },
          scopedSlots: { customRender: 'actions' }
        },
      ]
    }
  },
  computed: {
    disabled () {
      return this.editNode.type == 0 || this.editNode.type == 2
    }
  },
  created () {
    listRole({
      pageNum: 1,
      pageSize: 10000
    }).then(res => {
      const data = res.rows || []
      const list = data.map(item => {
        return {
          label: item.roleName,
          value: item.roleId
        }
      })
      this.roleOptions = list
    })
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
      this.userOptions = list
    })
    listDept().then(res => {
      this.deptOptions = this.handleTree(res.data, 'deptId')
    })
    this.dialogFormConfig[1].options = this.allFormComponent.map(item => {
      return {
        label: item.text,
        value: item.routeName
      }
    })
  },
  methods: {
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
        isDefaultExpanded: true
      };
    },
    async request (query) {
      const response = await getTableList(query)
      return {
        list: response.data
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'open':
          this.$modal.confirm(`您确认要${!row.status ? '启用' : '禁用'}吗？`).then(() => {
            let params = {
              status: !row.status ? 1 : 0,
              id: row.id
            }
            updateStatus(params).then(resp => {
              this.reload()
              this.$modal.msgSuccess('操作成功')
            })
          })
          break
        case 'setup':
          getProcessNode({ id: row.id }).then(resp => {
            this.nodeList = resp.data || []
            this.editNode = this.nodeList[this.active - 1]
            this.active = 1
            this.processModel = {
              approve: []
            }
            this.showProcessNodeEdit = true
            this.$nextTick(() => {
              this.doms = document.querySelectorAll('.el-step')
              this.doms.forEach(dom => {
                dom.addEventListener('click', this.stepClick)
              })
            })
          })
          break
        case 'copy':
          this.$modal.confirm(`您确认要转化流程${row.name}为模型吗？`).then(() => {
            convertToModel({ id: row.id }).then(res => {
              this.reload()
              that.$modal.msgSuccess('转化成功')
            })
          })
          break
        case 'edit':
          this.dialogTitle = '编辑流程'
          this.formModel = { ...row }
          this.formChange(row.routeName)
          this.dialogVisible = true
          break
        case 'del':
          this.$modal.confirm(`您确认要删除流程吗？`).then(() => {
            delData({ ids: row.id }).then(res => {
              this.reload()
              this.$modal.msgSuccess('删除成功')
            })
          })
          break
      }
    },
    stepClick (e) {
      const index = e.currentTarget.getAttribute('data-id')
      this.active = Number(index) + 1
      this.editNode = this.nodeList[index]
      this.processModel = {
        approve: [],
        userIds: [],
        roleIds: [],
        departmentIds: [],
        departmentManageIds: [],
        formVariables: '',
        chooseSponsor: false,
        chooseDepHeader: false
      }
      this.$nextTick(() => {
        this.$refs.formRef.resetFields()
        this.change_steps(this.editNode)
      })
    },
    change_steps (node) {
      /* 0角色 1用户 2部门 3发起人 4发起人的部门负责人 5部门的部门负责人*/
      this.processModel.chooseDepHeader = node.chooseDepHeader || false
      if (this.processModel.chooseDepHeader) this.processModel.approve.push('4')
      this.processModel.chooseSponsor = node.chooseSponsor || false
      if (this.processModel.chooseSponsor) this.processModel.approve.push('3')
      var userIds = []
      for (const user of node.users || []) {
        userIds.push(user.userName)
      }
      this.processModel.userIds = userIds //.join(",")
      if (userIds.length > 0) this.processModel.approve.push('1')
      var roleIds = []
      for (const role of node.roles || []) {
        roleIds.push(role.roleKey)
      }
      this.processModel.roleIds = roleIds //.join(",")
      if (roleIds.length > 0) this.processModel.approve.push('0')
      var departmentIds = []
      for (const department of node.departments || []) {
        departmentIds.push(department.deptId)
      }
      this.processModel.departmentIds = departmentIds //.join(",")
      if (departmentIds.length > 0) this.processModel.approve.push('2') ;
      var departmentManageIds = []
      for (const departmentManage of node.departmentManages || []) {
        departmentManageIds.push(departmentManage.deptId)
      }
      this.processModel.departmentManageIds = departmentManageIds //.join(",")
      if (departmentManageIds.length > 0) this.processModel.approve.push('5')
      this.processModel.formVariables = node.formVariables || ''
      if (this.processModel.formVariables) this.processModel.approve.push('6')
    },
    checkChange (list) {
      /* 0角色 1用户 2部门 3发起人 4发起人的部门负责人 5部门负责人*/
      if (this.processModel.approve.indexOf('0') === -1) this.processModel.roleIds = []
      if (this.processModel.approve.indexOf('1') === -1) this.processModel.userIds = []
      if (this.processModel.approve.indexOf('2') === -1) this.processModel.departmentIds = []
      if (this.processModel.approve.indexOf('5') === -1) this.processModel.departmentManageIds = []
      if (this.processModel.approve.indexOf('6') === -1) this.processModel.formVariables = ''
      //是否选中发起人
      this.processModel.chooseSponsor = this.processModel.approve.indexOf('3') > -1
      //是否选中发起人的部门领导
      this.processModel.chooseDepHeader = this.processModel.approve.indexOf('4') > -1
    },
    confirm (formModel) {
      editData(formModel).then(resp => {
        this.$modal.msgSuccess('编辑成功')
        this.dialogVisible = false
        this.refresh()
      })
    },
    showResource (row) {
      this.diagramUrl = `${this.defaultUrl}${this.url.img}?id=${row.id}`
      this.imageVisible = true
    },
    formChange (val) {
      const route = this.getFormComponent(val)
      this.formModel.businessTable = route.businessTable
      // this.formModel.routeName = route.routeName
    },
    viewForm (row = {}) {
      let routeName = row.routeName
      if (!routeName) {
        routeName = this.formModel.routeName
      }
      if (!routeName) {
        return this.$modal.msgWarning('请先选择表单!')
      }
      this.formComponent = this.getFormComponent(routeName).component
      this.formVisible = true
    },
    processConfirm () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const query = {...this.processModel}
          this.confirmLoading = true
          query.nodeId = this.editNode.id
          query.procDefId = this.editNode.procDefId
          // if (query.roleIds.length !== 0) {
          //   query.roleIds = query.roleIds.join(',')
          // }
          // if (query.userIds.length !== 0) {
          //   query.userIds = query.userIds.join(',')
          // }
          // if (query.departmentIds.length !== 0) {
          //   query.departmentIds = query.departmentIds.join(',')
          // }
          // if (query.departmentManageIds.length !== 0) {
          //   query.departmentManageIds = query.departmentManageIds.join(',')
          // }
          editNodeUser(query).then(resp => {
            this.reload()
            this.$modal.msgSuccess('操作成功')
          })
          this.confirmLoading = false
          this.showProcessNodeEdit = true
        }
      })
    },
    processClose () {
      this.active = 1
      this.doms.forEach(dom => {
        dom.removeEventListener('click', this.stepClick)
      })
      this.$refs.formRef.resetFields()
      this.showProcessNodeEdit = false
      this.doms = []
      this.editNode = {}
      this.confirmLoading = false
    },
    filterDictText (dictOptions, text) {
      if (dictOptions instanceof Array) {
        for (let dictItem of dictOptions) {
          if (text === dictItem.value) {
            return dictItem.label
          }
        }
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .step {
    height: 183px;
    border-right: 2px solid #d2d2d2;
    ::v-deep .el-step {
      cursor: pointer;
    }
    ::v-deep .el-step__head.is-process {
      border-color: #C0C4CC;
      color: #C0C4CC
    }
    ::v-deep .el-step__title.is-process {
      color: #C0C4CC;
      font-weight: normal;
    }
  }
  .step-content {
    ::v-deep .el-select {
      width: 100%;
    }
    .nodespan{
      color: #999;
    }
  }
  ::v-deep .vue-treeselect {
    .vue-treeselect__multi-value {
      height: 30px;
      .vue-treeselect__multi-value-item-container {
        height: 100%;
        .vue-treeselect__multi-value-item {
          line-height: 20px;
        }
      }
    }
  }
}
</style>
