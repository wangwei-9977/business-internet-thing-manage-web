<template>
  <Dialog
    title="访客信息详情"
    :visible="visible"
    width="700px"
    @close="closeDialog"
  >
    <el-form label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
          <el-form-item label="手机号：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认证图片：">
            <el-image
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              style="width: 100px; height: 100px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来访单位：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被访人部门：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被访人姓名：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问时间：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问理由：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核原因：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="流程详情：">
            <span>{{ data.xxx || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="健康证明：">
            <el-image
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              style="width: 100px; height: 100px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行程码：">
            <el-image
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              style="width: 100px; height: 100px"
            />
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
