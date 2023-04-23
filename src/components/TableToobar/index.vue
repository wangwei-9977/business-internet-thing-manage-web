<script>
import ToolbarButton from '@/components/ToolbarButton'
export default {
  name: "TableToolbar",
  components: {
    ToolbarButton
  },
  props: {
    config: {
      type: Array,
      default: () => ([])
    },
    columns: {
      type: Array,
      default: () => ([])
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showToolbar: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    buttonClick (item) {
      this.$emit('buttonClick', item)
    }
  },
  render () {
    return (
      <div class="toolbar mb8">
        <toolbar-button config={this.config} on-buttonClick={this.buttonClick} />
        {
          this.showToolbar && (
            <right-toolbar
              class="right-toolbar"
              showSearch={this.showSearch}
              columns={this.columns}
              {...{
                on: {
                  queryTable: () => {
                    this.$emit('queryTable')
                  },
                  'update:showSearch': (search) => {
                    this.$emit('searchShowHandle', search)
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
.toolbar {
  position: relative;
  height: 28px;
  .right-toolbar {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
