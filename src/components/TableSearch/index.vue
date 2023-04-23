<script>
import FormItemRender from '@/components/FormItemRender'

export default {
  name: "TableSearch",
  components: {
    FormItemRender
  },
  props: {
    labelWidth: {
      type: String,
      default: '68px'
    },
    searchModel: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      cloneSearchModel: {}
    }
  },
  watch: {
    searchModel: {
      deep: true,
      immediate: true,
      handler (val) {
        this.cloneSearchModel = { ...val }
      }
    }
  },
  methods: {
    clearQuery (query) {
      const q = {}
      const keys = Object.keys(query)
      keys.forEach(key => {
        if (Array.isArray(query[key])) {
          query[key].some(i => !!i) && (q[key] = query[key])
        } else if (![undefined, '', null].includes(query[key])) {
          q[key] = query[key]
        }
      })
      return q
    },
    handleQuery () {
      this.$emit('handleQuery', this.clearQuery(this.cloneSearchModel))
    },
    resetQuery () {
      this.$refs.searchRef && this.$refs.searchRef.resetFields()
      this.cloneSearchModel = { ...this.searchModel }
      this.$emit('resetQuery', this.clearQuery(this.cloneSearchModel))
    }
  },
  render () {
    return (
      <el-form
        ref="searchRef"
        size="small"
        props={{ model: this.cloneSearchModel }}
        on-input={() => {}}
        inline={true}
        // label-width={this.labelWidth}
      >
        {
          this.config.map(item => {
            return (
              <el-form-item label={item.label} prop={item.model}>
                <form-item-render
                  style={{ width: '240px', ...item.style }}
                  config={item}
                  v-model={this.cloneSearchModel[item.model]}
                  on-change={val => item.change && item.change(val)}
                />
              </el-form-item>
            )
          })
        }
        {
          this.config.length !== 0 && (
            <el-form-item class="search-btn">
              <el-button type="primary" icon="el-icon-search" size="mini" onClick={ this.handleQuery }>搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" onClick={ this.resetQuery }>重置</el-button>
            </el-form-item>
          )
        }
      </el-form>
    )
  }
}
</script>

<style lang="scss" scoped>
.search-btn {
}
</style>
