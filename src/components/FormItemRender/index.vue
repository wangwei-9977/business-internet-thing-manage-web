<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "FormItemRender",
  components: {
    Treeselect
  },
  props: {
    config: {
      type: Object,
      default: null
    }
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler (_new) {
        this.config = _new
      }
    }
  },
  render () {
    const inherit = {
      props: { ...this.$attrs, ...(this.config.props || {}) },
      on: { ...this.$listeners }
    }
    let disabled = false
    if (this.config.disabledHandle) {
      disabled = this.config.disabledHandle(this.config, inherit)
    }
    const formElement = {
      input: (
        <el-input
          disabled={disabled || this.config.disabled || false}
          placeholder={this.config.placeholder || '请输入'}
          clearable={this.config.clearable || true}
          {...inherit}
        />
      ),
      inputNumber: (
        <el-input-number
          controls-position="right"
          min={0}
          style="width: 100%"
          {...inherit}
        />
      ),
      textarea: (
        <el-input
          type="textarea"
          autosize={this.config.autosize || { minRows: 3 }}
          disabled={disabled || this.config.disabled || false}
          clearable={this.config.clearable || true}
          placeholder={this.config.placeholder}
          {...inherit}
        />
      ),
      password: (
        <el-input
          type="password"
          placeholder={this.config.placeholder || '请输入'}
          clearable={this.config.clearable || true}
          disabled={disabled || this.config.disabled || false}
          show-password
          {...inherit}
        />
      ),
      switch: (
        <el-switch
          {...inherit}
          disabled={disabled || this.config.disabled || false}
        />
      ),
      select: (
        <el-select
          disabled={disabled || this.config.disabled || false}
          filterable={this.config.filterable || false}
          multiple={this.config.multiple || false}
          clearable={this.config.clearable || true}
          allow-create={this.config.allowCreate || false}
          collapseTags={this.config.collapseTags}
          {...inherit}
          placeholder={this.config.placeholder || '请选择'}
          style="width: 100%"
        >
          {
            this.config.options ? (
              this.config.options.map(item => {
                return <el-option label={item.label} value={item.value} disabled={this.config?.optionDisabled?.(item)}></el-option>
              })
            ) : []
          }
        </el-select>
      ),
      date: (
        <el-date-picker
          type={this.config.dateType || 'date'}
          align="right"
          disabled={disabled || this.config.disabled || false}
          clearable={this.config.clearable || true}
          value-format={this.config.valueFormat || 'yyyy-MM-dd'}
          {...inherit}
          placeholder={this.config.placeholder || '请选择日期'}
          style="width: 100%"
        />
      ),
      dateTime: (
        <el-date-picker
          type="daterange"
          disabled={disabled || this.config.disabled || false}
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format={this.config.valueFormat || 'yyyy-MM-dd'}
          format={this.config.format || 'yyyy-MM-dd'}
          clearable={this.config.clearable || true}
          style="width: 100%"
          {...inherit}
        />
      ),
      treeSelect: (
        <treeselect
          disabled={disabled || this.config.disabled || false}
          multiple={this.config.multiple || false}
          clearable={this.config.clearable || false}
          options={this.config.options}
          search-nested={this.config.search || false}
          show-count={this.config.showCount || false}
          normalizer={node => this.config.normalizer ? this.config.normalizer(node) : node}
          {...inherit}
          placeholder={this.config.placeholder || "请选择"}
        />
      ),
      radio: (
        <el-radio-group
          {...inherit}
          disabled={disabled || this.config.disabled || false}
        >
          {
            this.config.options ? (
              this.config.options.map(item => {
                return <el-radio label={item.value}>{item.label}</el-radio>
              })
            ) : undefined
          }
        </el-radio-group>
      ),
      checkbox: (
        <el-checkbox {...inherit}>{this.config.name}</el-checkbox>
      ),
      checkboxGroup: (
        <el-checkbox-group {...inherit}>
          {
            this.config.options ? (
              this.config.options.map(item => {
                return <el-checkbox label={item.value}>{item.label}</el-checkbox>
              })
            ) : undefined
          }
        </el-checkbox-group>
      ),
      editor: (
        <editor
          min-height={this.config.minHeight || 192}
          readOnly={this.config.readOnly || false}
          height={this.config.height}
          {...inherit}
        />
      ),
      imageUpload: (
        <image-upload
          limit={this.config.limit || 5}
          fileSize={this.config.fileSize || 5}
          isShowTip={this.config.isShowTip}
          fileType={this.config.fileType}
          {...inherit}
        />
      ),
      fileUpload: (
        <file-upload
          limit={this.config.limit || 5}
          fileSize={this.config.fileSize || 5}
          isShowTip={this.config.isShowTip}
          fileType={this.config.fileType}
          {...inherit}
        />
      )
    }
    return this.config ? formElement[this.config.type] : null
  }
}
</script>

<style lang="scss" scoped>
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
</style>
