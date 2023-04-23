<template>
  <div>
    <normal-table-render />
    <Dialog
      width="90%"
      title="设计模型"
      :footer="false"
      :visible="visible"
      @close="close"
    >
      <i-frame :src="iframUrl" height="800px" />
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import iFrame from '@/components/iFrame'
import { listMenu } from '@/api/system/menu'
import { getTableList, addDeployment, delData } from '@/api/activiti/modelList'

export default {
  name: "ModelList",
  mixins: [pageMixin],
  components: {
    Dialog,
    iFrame
  },
  data () {
    return {
      iframUrl: '',
      defaultUrl: process.env.VUE_APP_BASE_API+'/system',
      url: {
        create: "/activiti/models/create",
        update: "/activiti/modeler.html?modelId=",
      },
      // showIndex: true,
      visible: false,
      dialogFormConfig: [
        {
          type: 'input',
          label: '模型名称',
          model: 'name',
        },
        {
          type: 'input',
          label: '模型Key',
          model: 'key',
        },
        {
          type: 'input',
          label: '模型描述',
          model: 'description',
        },
      ],
      formRules: {
        name: [{ required: true, message: '请输入模型名称' }],
        key: [{ required: true, message: '请输入模型Key' }],
      },
      actionConfig: [
        {
          label: '发布',
          icon: 'el-icon-plus',
          type: 'text',
          action: 'add'
        },
        {
          label: '流程设计',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'del'
        }
      ],
      toolbarConfig: [
        {
          label: '创建流程模型',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      searchConfig: [
        {
          type: 'input',
          model: 'keyWord',
          label: '模型名称'
        },
      ],
      tableColumns: [
        {
          key: 'id',
          title: '模型id',
          props: {
            width: '150',
          }
        },
        {
          key: 'name',
          title: '模型名称',
          props: {
            width: '150',
            showOverflowTooltip: true
          }
        },
        {
          key: 'key',
          title: '模型key',
          props: {
            width: '150',
          }
        },
        {
          key: 'revision',
          title: '版本',
          props: {
            width: '100',
          }
        },
        {
          key: 'metaInfo',
          title: '备注描述',
          props: {
            minWidth: '250',
            showOverflowTooltip: true
          }
        },
        {
          key: 'createTime',
          title: '创建时间',
          props: {
            align: 'center',
            width: '200'
          },
          customRender: (scope, row, index) => {
            return <span>{ this.parseTime(scope.row.createTime) }</span>
          }
        },
        {
          key: 'lastUpdateTime',
          title: '更新时间',
          props: {
            align: 'center',
            width: '200'
          },
          customRender: (scope, row, index) => {
            return <span>{ this.parseTime(scope.row.createTime) }</span>
          }
        },
        {
          key: 'options',
          title: '操作',
          props: {
            align: 'center',
            width: '250',
            // fixed: 'right'
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
    buttonClick (item) {
      switch (item.action) {
        case 'add':
          this.formModel = {}
          this.dialogVisible = true
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'add':
          this.$modal.confirm('确认部署流程：' + row.name + '？').then(() => {
            addDeployment(row.id).then(resp => {
              this.$modal.msgSuccess('发布成功')
              this.reload()
            })
          })
          break
        case 'del':
          this.$modal.confirm('是否确认删除名称为' + row.name + '的数据项？').then(() => {
            delData(row.id).then(resp => {
              this.$modal.msgSuccess('删除成功')
              this.reload()
            })
          }).catch(() => {})
          break
        case 'edit':
          this.iframUrl = `${this.defaultUrl}${this.url.update}${row.id}`
          this.visible = true
          break
      }
    },
    confirm (formModel) {
      this.dialogVisible = false
      this.iframUrl = `${this.defaultUrl}${this.url.create}?name=${formModel.name||""}&key=${formModel.key||""}&description=${formModel.description||""}`
      this.visible = true
    },
    close () {
      this.$modal.confirm('关闭后未保存的修改将丢失！').then(() => {
        this.visible = false
        this.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
