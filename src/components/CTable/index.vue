<script>
export default {
  name: "CTable",
  props: {
    columns: {
      type: [Object, Array],
      default: () => ({})
    },
    hideColumns: {
      type: Array,
      default: () => ([])
    },
    tableData: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    tableProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      refreshTable: true
    }
  },
  methods: {
    handleSelectionChange (selection) {
      this.$emit('handleSelectionChange', selection)
    },
    updateColumns (cols) {
      return Array.isArray(cols) ? this.arrayColumns(cols) : this.objectColumns(cols)
    },
    objectColumns (cols) {
      let columns = null
      if (cols) {
        const keys = Object.keys(cols)
        columns = keys.map(key => {
          const obj = {}
          obj.key = key
          obj.title = cols[key]
          return obj
        })
      }
      return columns
    },
    arrayColumns (cols) {
      const columns = []
      const { $slots, $scopedSlots } = this
      cols.forEach(col => {
        const { slots = {}, scopedSlots = {}, ...restProps } = col
        const column = {
          ...restProps
        }
        Object.keys(slots).forEach(key => {
          const name = slots[key]
          if (column[key] === undefined && $slots[name]) {
            column[key] = $slots[name].length === 1 ? $slots[name][0] : $slots[name]
          }
        })
        Object.keys(scopedSlots).forEach(key => {
          const name = scopedSlots[key]
          if (column[key] === undefined && $scopedSlots[name]) {
            column[key] = $scopedSlots[name]
          }
        })
        columns.push(column)
      })
      return columns
    },
    action () {
      if (!Array.isArray(this.columns) && this.$scopedSlots.action) {
        const scopedSlots = {
          default: scope => {
            return this.$scopedSlots.action(scope, scope.row)
          }
        }
        return (
          <el-table-column
            label="操作"
            scopedSlots={scopedSlots}
          />
        )
      }
    },
    children () {
      let columns = this.columns ? this.updateColumns(this.columns) : []
      const columnsList = []
      if (this.showIndex) {
        columnsList.push(<el-table-column type="index" />)
      }
      if (this.checkbox) {
        columnsList.push(<el-table-column type="selection" width="55" align="center" />)
      }
      columns.forEach(({ key, title, customRender, props: tableProp }, index) => {
        const obj = this.hideColumns.find(item => item.key === key) || {}
        if (obj.visible) {
          const scopedSlots = {
            default: scope => {
              let comp = undefined
              if (customRender) {
                if (typeof customRender === 'function') {
                  comp = {
                    render: () => {
                      return customRender(scope, scope.row, index)
                    }
                  }
                } else {
                  comp = customRender(scope, scope.row, index)
                }
              }
              return customRender ? <div class="col">{ <comp /> }</div> : scope.row[key]
            }
          }
          const props = {
            props: {
              prop: key,
              ...tableProp
            },
            scopedSlots
          }
          if (typeof title === 'object') {
            props.props.renderHeader = () => {
              return title
            }
          } else {
            props.props.label = title
          }
          columnsList.push(<el-table-column {...props} />)
        }
      })
      return columnsList
    }
  },
  render () {
    return (
      this.refreshTable && (
        <el-table
          ref="tableRef"
          v-loading={this.loading}
          data={this.tableData}
          on-selection-change={this.handleSelectionChange}
          props={this.tableProps}
        >
          { this.children() }
          { this.action() }
        </el-table>
      )
    )
  }
}
</script>

<style lang="scss" scoped>
.col {
  display: flex;
  align-items: center;
}
</style>
