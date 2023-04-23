<script>
export default {
  name: "ToolbarButton",
  props: {
    config: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  render () {
    return (
      <el-row gutter={ 10 }>
        {
          this.config.map(item => {
            let disabled = item.disabled || false
            if (item.disabledHandle) {
              disabled = item.disabledHandle()
            }
            const props = {
              directives: []
            }
            if (item.permission && item.permission instanceof Array && item.permission.length > 0) {
              props.directives[0] = {
                name: 'hasPermi',
                value: item.permission
              }
            }
            return (
              <el-col span={ 1.5 }>
                <el-button
                  type={ item.type || 'primary' }
                  plain={ item.type === 'text' ? false : item.plain === undefined ? true : item.plain }
                  round={ item.round || false }
                  circle={ item.circle || false }
                  size="mini"
                  icon={ item.icon }
                  disabled={ disabled }
                  onClick={ (e) => {
                    item.click && item.click(e)
                    this.$emit('buttonClick', item)
                  } }
                  { ...props }
                >
                  { typeof item.label === 'function' ? item.label(item, this.data) : item.label }
                </el-button>
              </el-col>
            )
          })
        }
      </el-row>
    )
  }
}
</script>

<style lang="scss" scoped>

</style>
