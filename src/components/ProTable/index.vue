<script>
import TableSearch from '@/components/TableSearch'
import TableToolbar from '@/components/TableToobar'
import CTable from '@/components/CTable'

export default {
  name: "ProTable",
  components: {
    TableSearch,
    TableToolbar,
    CTable
  },
  props: {
    searchModel: {
      type: Object,
      default: () => ({})
    },
    searchConfig: {
      type: Array,
      default: () => ([])
    },
    toolbarConfig: {
      type: Array,
      default: () => ([])
    },
    request: {
      type: Function,
      default: undefined
    },
    resetHandle: {
      type: Function,
      default: undefined
    },
    searchHandle: {
      type: Function,
      default: undefined
    },
    tableProps: {
      type: Object,
      default: () => ({})
    },
    tableColumns: {
      type: [Object, Array],
      default: () => ([])
    },
    pagination: {
      type: Boolean,
      default: true
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showSearch: true,
      loading: false,
      tableData: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      query: {},
      columns: [],
    }
  },
  created () {
    if (this.tableColumns) {
      Array.isArray(this.tableColumns) ? this.arrayColumns() : this.objectColumns()
    }
  },
  mounted () {
    this.queryTable()
  },
  methods: {
    arrayColumns () {
      const columns = []
      this.tableColumns.forEach((key, index) => {
        const obj = {}
        obj.key = key.key
        obj.label = key.title || key.alias
        obj.visible = true
        columns.push(obj)
      })
      this.columns = columns
    },
    objectColumns () {
      const keys = Object.keys(this.tableColumns)
      this.columns = keys.map((key, index) => {
        const obj = {}
        obj.key = key
        obj.label = this.tableColumns[key]
        obj.visible = true
        return obj
      })
    },
    async requestHandle () {
      const query = {...this.query}
      if (this.pagination) {
        query.pageNum = this.pageIndex
        query.pageSize = this.pageSize
      }
      if (this.request) {
        this.loading = true
        this.request(query).then(resp => {
          this.loading = false
          this.total = resp.total || 0
          this.tableData = resp.list || []
        }).catch(() => {
          this.loading = false
        })
      }
    },
    searchShowHandle (show) {
      this.showSearch = show
    },
    queryTable () {
      this.query = this.$refs.searchRef.cloneSearchModel
      this.requestHandle()
    },
    reload () {
      this.pageIndex = 1
      this.queryTable()
    },
    handleQuery (query) {
      this.pageIndex = 1
      this.query = {...query}
      this.requestHandle()
    },
    buttonClick (item) {
      this.$emit('buttonClick', item)
    },
    queryHandle (query) {
      this.searchHandle && this.searchHandle(query)
      this.handleQuery(query)
    },
    resetQuery (query) {
      this.resetHandle && this.resetHandle()
      this.handleQuery(query)
    },
    refresh () {
      if (this.$refs.tableRef) {
        const table = this.$refs.tableRef
        table.refreshTable = false
        this.$nextTick(() => {
          table.refreshTable = true;
        });
      }
    }
  },
  render () {
    const { $slots, $scopedSlots } = this
    return (
      <div class="pro-table app-container">
        <div class={[ this.showSearch ? '' : 'hide' ]}>
          <table-search
            ref="searchRef"
            search-model={this.searchModel}
            config={this.searchConfig}
            on-handleQuery={this.queryHandle}
            on-resetQuery={this.resetQuery}
          />
        </div>
        {
          this.showToolbar && (
            <table-toolbar
              showSearch={this.showSearch}
              config={this.toolbarConfig}
              columns={this.columns}
              on-searchShowHandle={this.searchShowHandle}
              on-queryTable={this.queryTable}
              on-buttonClick={this.buttonClick}
            />
          )
        }
        <c-table
          ref="tableRef"
          hide-columns={this.columns}
          columns={this.tableColumns}
          table-data={this.$attrs.data ? this.$attrs.data : this.tableData}
          loading={this.loading}
          checkbox={this.checkbox}
          show-index={this.showIndex}
          scopedSlots={$scopedSlots}
          table-props={this.tableProps}
          {...{on: this.$listeners}}
        >
          {Object.keys($slots).map(key => {
            return (
              <template slot={key}>
                {$slots[key]}
              </template>
            )
          })}
        </c-table>
        {
          this.pagination && this.total > 0 && (
            <pagination
              total={this.total}
              page={this.pageIndex}
              limit={this.pageSize}
              {...{
                on: {
                  pagination: ({ page: pageIndex, limit: pageSize }) => {
                    this.queryTable()
                  },
                  'update:page': (index) => {
                    this.pageIndex = index
                  },
                  'update:limit': (index) => {
                    this.pageSize = index
                  }
                }
              }}
            />
          )
        }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.pro-table {
  .hide {
    display: none;
  }
}
</style>
