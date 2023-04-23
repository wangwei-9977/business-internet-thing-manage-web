<template>
  <div class="form-main">
    <el-form
      ref="formRef"
      :label-width="labelWidth"
      :rules="formRules"
      :model="formModel"
    >
      <el-form-item label="请假类型" prop="name">
        <el-input v-model="formModel.name" :disabled="disabled" placeholder="请输入请假类型" />
      </el-form-item>
      <el-form-item label="请假事由" prop="descc">
        <el-input type="textarea" v-model="formModel.descc" :disabled="disabled" placeholder="请输入请假事由" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="formModel.age" :disabled="disabled" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="请假期间工作处理" prop="chegnshi">
        <el-input type="textarea" v-model="formModel.chegnshi" :disabled="disabled" placeholder="请输入工作处理" />
      </el-form-item>
      <div v-if="!disabled">
        <div class="center">
          <el-button type="primary" :loading="loading" :disabled="disabled" @click="handleSubmit">保存</el-button>
          <el-button style="margin-left: 8px" :disabled="disabled" @click="close">取消</el-button>
        </div>
      </div>
      <div v-if="task">
        <div class="center">
          <el-button type="primary"  @click="passTask">通过</el-button>
          <el-button style="margin-left: 8px"  @click="backTask">驳回</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: "DemoForm",
  props:{
    /*全局禁用，可表示查看*/
    disabled: {
      type: Boolean,
      default: false
    },
    /*流程数据*/
    processData: {
      type: Object,
      default: () => ({})
    },
    /*是否新增*/
    isNew: {
      type: Boolean,
      default: false
    },
    /*是否处理流程*/
    task: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  data () {
    return {
      url: {
        getForm: '/system/actBusiness/getForm',
        addApply: '/system/actBusiness/add',
        editForm: '/system/actBusiness/editForm'
      },
      loading: false,
      formModel: {},
      formRules: {
        name: [{ required: true, message: '请输入请假类型' }],
        descc: [{ required: true, message: '请输入请假事由' }],
        age: [{ required: true, message: '请输入您的年龄' }],
        chegnshi: [{ required: true, message: '请输入工作处理' }],
      },
      formData: {}
    }
  },
  watch: {
    processData: {
      handler () {
        this.resetFields()
        if (!this.isNew) {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    init () {
      // 表单数据回显
      const data = this.processData
      request({
        url: this.url.getForm,
        method: 'get',
        params: {
          tableId: data.tableId,
          tableName: data.tableName
        }
      }).then(resp => {
        const formData = resp.data
        formData.tableName = data.tableName
        this.formData = formData
        this.formModel = {
          name: formData.name,
          descc: formData.descc,
          age: formData.age,
          chegnshi: formData.chegnshi
        }
      })
    },
    handleSubmit () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.loading = true
          let formData = Object.assign(this.formData || {}, this.formModel)
          formData.filedNames = Object.keys(this.formModel).join(',')
          formData.procDefId = this.processData.id
          formData.procDeTitle = this.processData.name
          if (!formData.tableName) {
            formData.tableName = this.processData.businessTable
          }
          let url = this.url.addApply
          if (!this.isNew){
            url = this.url.editForm
          }
          request({
            url: url,
            method: 'post' ,
            data: formData
          }).then(resp => {
            this.loading = false
            this.$modal.msgSuccess('保存成功')
            this.$emit('afterSubmit', formData)
            this.$nextTick(() => {
              this.resetFields()
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetFields () {
      this.$refs.formRef && this.$refs.formRef.resetFields()
    },
    close() {
      this.resetFields()
      this.$emit('close')
    },
    passTask() {
      this.$emit('passTask')
    },
    backTask() {
      this.$emit('backTask')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-main {
  .center {
    display: flex;
    justify-content: center;
  }
}
</style>
