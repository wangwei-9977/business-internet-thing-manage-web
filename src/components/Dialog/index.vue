<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="title"
    :width="width"
    :append-to-body="appendToBody"
    :before-close="closeDialog"
  >
    <div>
      <slot />
    </div>
    <slot v-if="footer" slot="footer" name="footer">
      <slot name="addFooter" />
      <el-button :loading="confirmLoading" @click="confirm" type="primary">
        确定
      </el-button>
      <el-button @click="closeDialog" type="gray">
        取消
      </el-button>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: () => {
        return '50%'
      }
    },
    title: {
      type: String,
      default: () => {
        return '提示'
      }
    },
    appendToBody: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    footer: {
      type: Boolean,
      default: true
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close', false)
    },
    confirm () {
      this.$emit('confirm')
    },
  }
}
</script>

<style scoped>

</style>
