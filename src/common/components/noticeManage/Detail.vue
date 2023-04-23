<template>
  <Dialog
    title="详情"
    :visible="visible"
    @confirm="confirm"
    @close="close"
    width="700px"
  >
    <normal-table-render />
    <template slot="footer">
      <el-button @click="close" type="gray">取消</el-button>
    </template>
  </Dialog>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Dialog from '@/components/Dialog'

export default {
  name: "Detail",
  mixins: [pageMixin],
  components: { Dialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showIndex: true,
      showToolbar: false,
      tableColumns: [
        {
          key: 'processName',
          title: '用户名称'
        },
        {
          key: 'processName',
          title: '阅读时间'
        },
        {
          key: 'processName',
          title: '回执时间'
        }
      ]
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      console.log('init')
    },
    confirm() {
      this.$emit('confirm')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
