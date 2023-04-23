<template>
  <div>
    <Dialog
      title="新增"
      :visible="visible"
      width="1000px"
      @confirm="confirm"
      @close="closeDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="申请信息：">
          <div style="display: flex;">
            <el-input style="margin-right: 10px;" />
            <file-upload @input="fileSuccess" :limit="1" :auto-upload="false" :is-show-tip="false" />
          </div>
        </el-form-item>
        <el-form-item label="照片信息：">
          <el-upload
            ref="imageUploadRef"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">上传</el-button>
        </el-form-item>
      </el-form>
      <div>
        <div class="label">上传结果表：</div>
        <div class="desc">
          <span>总记录数：10条</span>
          <span>成功导入：9条</span>
          <span>失败条数：1条</span>
        </div>
        <normal-table-render />
      </div>
      <el-dialog append-to-body :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </Dialog>
  </div>
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
  },
  watch: {
    visible() {
      if (this.visible) {

      }
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      showToolbar: false,
      showIndex: true,
      tableData: [{}],
      imageList: [],
      tableProps: {
        border: true,
        'max-height': 250
      },
      actionConfig: [
        {
          label: '删除',
          icon: 'el-icon-delete',
          type: 'text',
          action: 'delete'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '申请日期',
          props: {
            align: 'center',
          }
        },
        {
          key: 'number',
          title: '时段',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '所属车队',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '车牌号',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '司机姓名',
          props: {
            align: 'center',
          }
        },
        {
          key: 'status',
          title: '成功导入照片数量',
          props: {
            align: 'center',
            minWidth: 100
          }
        },
        {
          key: 'actions',
          title: '操作',
          props: {
            align: 'center',
          },
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    fileSuccess() {
      console.log('123')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'delete':
          this.$modal.confirm('确定删除吗?').then(() => {

          })
          break
      }
    },
    closeDialog() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  padding-left: 20px;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.desc {
  display: block;
  padding-left: 20px;
  margin: 10px 0 -5px 0;
  span + span {
    margin-left: 20px;
  }
}
</style>
