import ProTable from '@/components/ProTable'
import DialogForm from '@/components/DialogForm'
import ToobarButton from '@/components/ToolbarButton'
import { debounceFn } from '@/utils'

export default {
  components: {
    normalTableRender: {
      functional: true,
      name: 'normal-table-render',
      render: (h, ctx) => ctx.parent.tableRender(ctx)
    },
    ProTable,
    DialogForm,
    ToobarButton
  },
  data () {
    return {
      // 表格复选框
      selectionList: [],
      // 表格搜索默认值
      searchModel: {},
      // 表格搜索配置
      searchConfig: [],
      // 表格上方按钮
      toolbarConfig: [],
      // 表格操作列按钮配置
      actionConfig: [],
      // 表格字段配置
      tableColumns: [],
      // 表格属性
      tableProps: {},
      // 是否开启表格复选框
      checkbox: false,
      showIndex: false,
      showToolbar: true,
      pagination: true,
      // 模态框标题
      dialogTitle: '新增',
      // 模态框宽度
      dialogWidth: '600px',
      // 模态框表单名称宽度
      dialogLabelWidth: '80px',
      // 是否显示模态框
      dialogVisible: false,
      // 模态框表单内容配置
      dialogFormConfig: [],
      // 模态框表单值
      formModel: {},
      // 表单校验
      formRules: {},
      tableData: null,
      dictHandle: debounceFn(this.dictWithData, 1000)
    }
  },
  watch: {
    'dict.type': {
      handler () {
        this.dictHandle()
      },
      deep: true
    }
  },
  methods: {
    tableRender (ctx) {
      const slots = ctx.slots()
      return (
        <div>
          <pro-table
            ref="tableRef"
            data={this.tableData}
            search-model={this.searchModel}
            search-config={this.searchConfig}
            toolbar-config={this.toolbarConfig}
            table-props={this.tableProps}
            table-columns={this.tableColumns}
            checkbox={this.checkbox}
            request={this.request}
            showIndex={this.showIndex}
            showToolbar={this.showToolbar}
            pagination={this.pagination}
            resetHandle={this.resetHandle}
            searchHandle={this.searchHandle}
            on-buttonClick={this.buttonClick}
            on-handleSelectionChange={this.handleSelectionChange}
            {...{
              scopedSlots: {
                actions: (scope, row) => {
                  return (
                    <div style={{ display: 'flex', 'justify-content': 'center', width: '100%' }}>
                      <toobar-button config={this.actionConfig} data={row} on-buttonClick={item => { this.actionClick(item, row, scope.$index) }} />
                    </div>
                  )
                },
                ...ctx.scopedSlots
              }
            }}
          >
            {Object.keys(slots).map(key => {
              return (
                <template slot={key}>
                  {slots[key]}
                </template>
              )
            })}
          </pro-table>
          <dialog-form
            title={this.dialogTitle}
            width={this.dialogWidth}
            label-width={this.dialogLabelWidth}
            configs={this.dialogFormConfig}
            dialogVisible={this.dialogVisible}
            form-model={this.formModel}
            form-rules={this.formRules}
            on-close={this.closeDialog}
            on-confirm={this.confirm}
            {...{scopedSlots: ctx.scopedSlots}}
          />
        </div>
      )
    },
    getDictValue (dictName, value) {
      if (this.dict?.type[dictName]) {
        return this.dict?.label[dictName][value]
      }
      return ''
    },
    setDictValue (dictName, labelField = 'label', valueField = 'value') {
      if (this.dict?.type[dictName]) {
        return this.dict?.type[dictName].map(item => {
          return {
            label: item[labelField],
            value: item[valueField]
          }
        })
      }
      return []
    },
    getOptionsByDict (field, dictName) {
      const index = this.searchConfig.findIndex(item => item.model === field)
      if (index !== -1) {
        this.searchConfig[index].options = this.setDictValue(dictName)
      }
    },
    // 模态框关闭事件
    closeDialog () {
      this.dialogVisible = false
    },
    // 模态框确认事件
    confirm (query) {
      this.dialogVisible = false
    },
    reload () {
      this.selectionList = []
      this.$refs.tableRef && this.$refs.tableRef.reload()
    },
    // 表格数据请求
    async request () {
      return {
        list: [],
        total: 0
      }
    },
    // 表格按钮点击触发事件
    buttonClick () {},
    handleSelectionChange (list) {
      this.selectionList = list
    },
    dictWithData () {},
    actionClick () {},
    resetHandle () {},
    searchHandle () {}
  }
}
