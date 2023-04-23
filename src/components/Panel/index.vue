<script>
export default {
  name: "Panel",
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  methods: {},
  render () {
    return (
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="title">
          <div>{ this.title }</div>
          <div>
            { this.$slots.toolbar }
          </div>
        </div>
        { this.$slots.default }
      </el-card>
    )
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ::v-deep .el-button--medium {
      padding: 3px 0px;
    }
  }
}
</style>
