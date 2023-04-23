<template>
  <div>
    <normal-table-render />
    <Dialog
      :visible="visible"
      @confirm="okHandle"
      @close="close"
      title="维修保养申请"
      width="800px"
    >
      <div class="add">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>默认</span>
          </div>
          <el-form
            ref="defaultFormRef"
            :rules="rules"
            :model="model"
            label-width="110px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item prop="name" label="申报人">
                  <el-input v-model="model.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="车牌号">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="车辆已行驶里程">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最近一次维保信息</span>
            <el-button class="openEdit" type="primary" size="mini" @click="openEdit">{{ isEdit ? '开启' : '关闭' }}编辑</el-button>
          </div>
          <el-form
            ref="lastFormRef"
            :rules="rules"
            :model="model"
            label-width="130px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item prop="" label="上次维修保养里程">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" :disabled="isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="上次维修保养时间">
                  <el-date-picker
                    type="date"
                    v-model="formModel.xxx"
                    align="right"
                    clearable
                    value-format="yyyy-MM-dd"
                    placeholder="请选择日期"
                    :disabled="isEdit"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="上次维保项目">
                  <el-input :disabled="isEdit" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="本年累计保养次数">
                  <el-input-number controls-position="right" :min="0" :disabled="isEdit" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="维修厂家">
                  <el-input :disabled="isEdit" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本次保养维修信息</span>
          </div>
          <el-form
            ref="infoFormRef"
            :rules="rules"
            :model="model"
            label-width="110px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item prop="" label="维修间隔公里数">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="维修厂家">
                  <el-input />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>申请维修保养项目</span>
            <el-button type="primary" size="mini" @click="addItem" style="float: right;">新增</el-button>
          </div>
          <el-form
            ref="projectFormRef"
            :rules="rules"
            :model="model"
            label-width="110px"
            class="project"
          >
            <el-row v-for="(item, index) in list" :key="index" :gutter="5">
              <el-col :span="11">
                <el-form-item prop="" label="项目名称">
                  <el-input v-model="item.project" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="" label="预计费用">
                  <el-input-number controls-position="right" :min="0" v-model="item.money" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="2" style="line-height: 40px;">
                <i class="el-icon-remove" @click="delItem(index)" />
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>维保售后</span>
          </div>
          <el-form
            ref="formRef"
            :rules="rules"
            :model="model"
            label-width="110px"
          >
            <el-form-item prop="" label="维保完成时间">
              <el-date-picker
                type="date"
                v-model="formModel.xxx"
                align="right"
                clearable
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item prop="" label="维保凭证">
              <image-upload v-model="formModel.image" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </Dialog>
    <Dialog
      :visible="detailVisible"
      @close="detailVisible = false"
      title="维修保养详情"
      width="600px"
    >
      <div class="detail">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>默认</span>
          </div>
          <el-form
            label-width="110px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="申报人">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车牌号">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆已行驶里程">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最近一次维保信息</span>
          </div>
          <el-form
            label-width="130px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="上次维修保养里程">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上次维修保养时间">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上次维保项目">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="本年累计保养次数">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维修厂家">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本次保养维修信息</span>
          </div>
          <el-form
            ref="formRef"
            :rules="rules"
            :model="model"
            label-width="110px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="维修间隔公里数">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="维修厂家">
                  <span>{{ detailModel.xxx }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>申请维修保养项目</span>
          </div>
          <el-form
            label-width="110px"
            class="project"
          >
            <el-row v-for="(item, index) in list" :key="index" :gutter="5">
              <el-col :span="12">
                <el-form-item label="项目名称">
                  <span>{{ item.xxx }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计费用">
                  <span>{{ item.xxx }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>维保售后</span>
          </div>
          <el-form
            ref="formRef"
            :rules="rules"
            :model="model"
            label-width="110px"
          >
            <el-form-item label="维保完成时间">
              <span>{{ detailModel.xxx }}</span>
            </el-form-item>
            <el-form-item label="维保凭证">
              <span>{{ detailModel.xxx }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <template slot="footer">
        <el-button @click="detailVisible = false" type="gray">取消</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import { getTableDataList } from '@/api/officialCarManage/repairMaintenanceManage'

export default {
  name: "RepairMaintenanceManage",
  mixins: [pageMixin],
  components: { Dialog },
  data () {
    return {
      visible: false,
      detailVisible: false,
      isEdit: true,
      rules: {
        name: [{ required: true, message: '请输入' }]
      },
      model: {},
      list: [{}],
      detailModel: {},
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '车牌号'
        },
        {
          type: 'date',
          model: 'type',
          label: '日期'
        }
      ],
      toolbarConfig: [
        {
          label: '新增',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      actionConfig: [
        {
          label: '详情',
          icon: 'el-icon-view',
          type: 'text',
          action: 'detail'
        },
        {
          label: '修改',
          icon: 'el-icon-edit',
          type: 'text',
          action: 'edit'
        },
        {
          label: '下载',
          icon: 'el-icon-download',
          type: 'text',
          action: 'download'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '车牌号'
        },
        {
          key: 'number',
          title: '申请日期'
        },
        {
          key: 'status',
          title: '申请人'
        },
        {
          key: 'status',
          title: '预计维修费用'
        },
        {
          key: 'status',
          title: '实际维修费用'
        },
        {
          key: 'status',
          title: '状态'
        },
        {
          key: 'actions',
          title: '操作',
          props: {
            align: 'center',
            minWidth: '120',
          },
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    async request (query) {
      // return getTableDataList(query)
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
        ],
        total: 100
      }
    },
    buttonClick (item) {
      switch (item.action) {
        case 'add':
          this.model = {}
          this.visible = true
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'detail':
          this.detailVisible = true
          break
        case 'edit':
          this.model = {
            ...row
          }
          this.visible = true
          break
        case 'download':
          break
      }
    },
    openEdit() {
      this.isEdit = !this.isEdit
    },
    addItem() {
      this.list.push({})
    },
    delItem(index) {
      this.list.splice(index, 1)
    },
    okHandle() {
      const isTrue = []
      this.$refs.defaultFormRef.validate(valid => {
        isTrue.push(valid)
      })
      !this.isEdit && this.$refs.lastFormRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.projectFormRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.infoFormRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.formRef.validate(valid => {
        isTrue.push(valid)
      })
      if (isTrue.every(item => item)) {
        this.visible = false
      }
    },
    close() {
      this.$refs.defaultFormRef && this.$refs.defaultFormRef.resetFields()
      this.$refs.projectFormRef && this.$refs.projectFormRef.resetFields()
      this.$refs.infoFormRef && this.$refs.infoFormRef.resetFields()
      this.$refs.formRef && this.$refs.formRef.resetFields()
      this.$refs.lastFormRef && this.$refs.lastFormRef.resetFields()
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.add {
  max-height: 650px;
  overflow: auto;
}
.el-card + .el-card {
  margin-top: 10px;
}
.project {
  max-height: 300px;
  overflow: hidden auto;
  .el-icon-remove {
    cursor: pointer;
    color: #1890ff;
    margin-left: 5px;
    font-size: 20px;
  }
}
.openEdit {
  margin-left: 5px;
}
</style>
