<template>
  <div>
    <normal-table-render />
    <Dialog
      :visible="visible"
      @confirm="okHandle"
      @close="close"
      title="新增"
      width="920px"
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
            label-width="100px"
          >
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item prop="name" label="申请部门">
                  <el-input v-model="model.name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="申请人">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="申请用车时间">
                  <el-date-picker
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="申请车种类">
                  <el-select filterable clearable style="width: 100%;">
                    <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="目的地">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="用车理由">
                  <el-input type="textarea" :autosize="{ minRows: 3 }" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="乘车人">
                  <el-input type="textarea" :autosize="{ minRows: 3 }" placeholder="多人以逗号隔开" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>审核部门审核信息填写</span>
          </div>
          <el-form
            ref="infoFormRef"
            :rules="rules"
            :model="model"
            label-width="80px"
          >
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item prop="name" label="审核结果">
                  <el-select filterable clearable style="width: 100%;">
                    <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="派车种类">
                  <el-select filterable clearable style="width: 100%;">
                    <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="" label="车牌号码">
                  <el-input />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="驾驶员">
                  <el-select filterable clearable style="width: 100%;">
                    <el-option v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="用车时限">
                  <el-date-picker
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>驾驶员还车时填写</span>
          </div>
          <el-form
            ref="carFormRef"
            :rules="rules"
            :model="model"
            label-width="130px"
          >
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item prop="name" label="出车前总里程数">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="剩余油量">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="本次出车行车里程">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="备注">
                  <el-input type="textarea" :autosize="{ minRows: 3 }" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="" label="收车后总里程数">
                  <el-input-number controls-position="right" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item prop="" label="收车时间">
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
            </el-col>
            <el-col :span="24">
              <el-form-item prop="" label="剩余油量">
                <el-input-number controls-position="right" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="" label="加油费用">
                <el-input-number controls-position="right" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="" label="其他费用">
                <el-input-number controls-position="right" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="出车前总里程数截图">
                <image-upload v-model="formModel.image" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="剩余油量截图">
                <image-upload v-model="formModel.image" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="收车后总里程数截图">
                <image-upload v-model="formModel.image" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="加油费用截图">
                <image-upload v-model="formModel.image" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="" label="其他费用截图">
                <image-upload v-model="formModel.image" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>行政部门还车确认</span>
          </div>
          <el-form
            ref="formRef"
            :rules="rules"
            :model="model"
            label-width="130px"
          >
            <el-form-item prop="" label="还车成功与否">
              <el-radio-group>
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </Dialog>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import Dialog from '@/components/Dialog'
import { getTableDataList } from '@/api/officialCarManage/carApplyManage'

export default {
  name: "CarApplyManage",
  mixins: [pageMixin],
  components: { Dialog },
  data () {
    return {
      visible: false,
      list: [],
      model: {},
      rules: {
        name: [{ required: true, message: '请输入' }]
      },
      searchConfig: [
        {
          type: 'date',
          model: 'type',
          label: '日期'
        },
        {
          type: 'select',
          model: 'type',
          label: '申请部门',
          options: [
            {
              label: 'xxx',
              value: 0
            }
          ]
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
          title: '日期'
        },
        {
          key: 'number',
          title: '申请部门'
        },
        {
          key: 'status',
          title: '申请人'
        },
        {
          key: 'status',
          title: '归还日期'
        },
        {
          key: 'status',
          title: '驾驶员姓名'
        },
        {
          key: 'status',
          title: '审批结果'
        },
        {
          key: 'status',
          title: '当前状态'
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
          this.formModel = {}
          this.visible = true
          break
      }
    },
    actionClick (item, row) {
      switch (item.action) {
        case 'detail':
          break
        case 'edit':
          break
        case 'download':
          break
      }
    },
    okHandle() {
      const isTrue = []
      this.$refs.defaultFormRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.infoFormRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.formRef.validate(valid => {
        isTrue.push(valid)
      })
      this.$refs.carFormRef.validate(valid => {
        isTrue.push(valid)
      })
      if (isTrue.every(item => item)) {
        this.visible = false
      }
    },
    close() {
      this.$refs.defaultFormRef && this.$refs.defaultFormRef.resetFields()
      this.$refs.infoFormRef && this.$refs.infoFormRef.resetFields()
      this.$refs.formRef && this.$refs.formRef.resetFields()
      this.$refs.carFormRef && this.$refs.carFormRef.resetFields()
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card + .el-card {
  margin-top: 10px;
}
.add {
  max-height: 650px;
  overflow: auto;
}
</style>
