<template>
  <Dialog
    :visible="visible"
    @close="close"
    @confirm="confirm"
    title="列表"
  >
    <normal-table-render />
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog';
import pageMixin from '@/common/mixin/pageMixin';

export default {
  components: { Dialog },
  mixins: [pageMixin],
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
  watch: {
    visible () {
      if (this.visible) {
        this.reload()
      }
    }
  },
  data() {
    return {
      showToolbar: false,
      checkbox: true,
      tableProps: {
        border: true
      },
      tableColumns: [
        {
          key: 'processName',
          title: '车位相机名称'
        },
        {
          key: 'number',
          title: '岗亭'
        },
        {
          key: 'number',
          title: '进出方向'
        },
        {
          key: 'number',
          title: '岗亭'
        }
      ]
    }
  },
  methods: {
    async request (query) {
      return {
        list: [
          {
            title: '我问问',
            processName: '我问问',
            currTaskName: '13255048788',
            number: '闽AXX905',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '生产管理部',
            status: '13255044444'
          }
        ]
      }
    },
    close () {
      this.$emit('close')
    },
    confirm () {
      this.$emit('confirm', this.selectionList)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
