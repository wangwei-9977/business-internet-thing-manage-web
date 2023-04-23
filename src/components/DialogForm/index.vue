<script>
import Dialog from '@/components/Dialog'
import FormItemRender from '@/components/FormItemRender'

export default {
  name: "DialogForm",
  components: {
    Dialog,
    FormItemRender
  },
  props: {
    configs: {
      type: Array,
      default: () => ([])
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    formRules: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: String,
      default: '500px'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  watch: {
    dialogVisible () {
      if (!this.dialogVisible) {
        this.$nextTick(() => {
          this.resetFields()
        })
      }
    }
  },
  methods: {
    resetFields () {
      this.$refs.formRef && this.$refs.formRef.resetFields()
    },
    close () {
      this.$emit('close')
      this.resetFields()
    },
    confirm () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$emit('confirm', this.formModel)
        }
      })
    },
    children (config) {
      const render = []
      if (!this.isDetail) {
        if (config.render && typeof config.render === 'function') {
          render.push(config.render(config, this.formModel))
        } else {
          render.push(
            <form-item-render
              style={config.style}
              config={config}
              on-change={val => config.change && config.change(val, config)}
              v-model={this.formModel[config.model]}
            />
          )
        }
      } else {
        render.push(<span>{this.formModel[config.model]}</span>)
      }
      if (config.scopedSlots && this.$scopedSlots[config.scopedSlots]) {
        render.push(
          <div class="col">
            { this.$scopedSlots[config.scopedSlots](config, this.formModel) }
          </div>
        )
      }
      return render
    },
    configRender () {
      return this.configs.map(config => {
        let { isShow = true } = config
        if (typeof isShow === 'function') {
          isShow = isShow(config, this.formModel)
        }
        return isShow ? (
          <el-col span={config.span || 24}>
            <el-form-item prop={config.model}>
              <span slot="label">
                {
                  config.tooltip && (
                    <el-tooltip content={config.tooltip} placement="top">
                      <i class="el-icon-question" />
                    </el-tooltip>
                  )
                }
                { config.labelRender ? config.labelRender() : config.label }
              </span>
              { this.children(config) }
            </el-form-item>
          </el-col>
        ) : undefined
      })
    }
  },
  render () {
    return (
      <Dialog
        visible={this.dialogVisible}
        on-confirm={this.confirm}
        on-close={this.close}
        title={this.title}
        width={this.width}
        appendToBody={this.appendToBody}
      >
        <el-form
          ref="formRef"
          rules={this.formRules}
          props={{ model: this.formModel }}
          on-input={() => {}}
          label-width={this.labelWidth}
        >
          <el-row gutter={5}>
            { this.configRender() }
          </el-row>
        </el-form>
      </Dialog>
    )
  }
}
</script>

<style lang="scss" scoped>
</style>
