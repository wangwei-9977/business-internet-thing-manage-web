<template>
  <Dialog
    title="详情"
    :visible="visible"
    width="700px"
    @close="closeDialog"
  >
    <el-form label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="车牌号码：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属车队：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行驶证：">
            <el-image
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              style="width: 100px; height: 100px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机姓名：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机照片：">
            <el-image
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              style="width: 100px; height: 100px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时段：">
            <span>{{ data.xxx || '-' }}</span>
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

export default {
  name: 'VisitorApproveDetail',
  components: { Dialog },
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
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
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
</style>
