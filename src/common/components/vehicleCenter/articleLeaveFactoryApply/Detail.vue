<template>
  <Dialog
    title="详情"
    :visible="visible"
    width="700px"
    @close="closeDialog"
  >
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="物资出厂单号：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请部门：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主管部门：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂车牌号：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货物明细：">
            <normal-table-render />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="入厂事由：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="closeDialog" type="gray">
        取消
      </el-button>
    </template>
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog';
import pageMixin from '@/common/mixin/pageMixin'

export default {
  name: 'VisitorApproveDetail',
  components: { Dialog },
  mixins: [pageMixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showToolbar: false,
      tableProps: {
        border: true,
        'max-height': 250
      },
      tableData: [],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      tableColumns: [
        {
          key: 'processName',
          title: '名称',
          props: {
            align: 'center',
          }
        },
        {
          key: 'number',
          title: '规格',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '单位',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '数量',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '备注',
          props: {
            align: 'center',
          }
        },
      ]
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.app-container {
  padding: 0px;
  margin-top: 40px;
  margin-left: -70px;
  ::v-deep .el-table {
    .el-input--medium .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
