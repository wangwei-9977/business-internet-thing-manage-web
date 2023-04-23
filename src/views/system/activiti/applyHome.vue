<template>
  <div class="app-container">
    <table-search :config="searchConfig" @handleQuery="handleQuery" @resetQuery="handleQuery" />
    <el-button @click="handleToApplyList" type="primary" size="mini" class="btn">前往我的申请列表</el-button>
    <process-choose v-model="activeKey" :data="activeKeyAll" @chooseProcess="chooseProcess" />
    <Dialog
      :visible="visible"
      :title="title"
      :footer="false"
      width="50%"
      @close="close"
    >
      <component
        :is="lcModa.formComponent"
        :disabled="lcModa.disabled"
        :processData="lcModa.processData"
        :isNew="lcModa.isNew"
        @afterSubmit="afterSub"
        @close="close"
      />
    </Dialog>
  </div>
</template>

<script>
import DialogForm from '@/components/DialogForm'
import TableSearch from '@/components/TableSearch'
import { groupBy, filter } from 'lodash'
import ProcessChoose from '@/common/components/activiti/ProcessChoose'
import { activitiMixin } from '@/common/components/activiti/mixin/activitiMixin'
import Dialog from '@/components/Dialog'
import { getProcessDataList } from '@/api/activiti/applyHome'

export default {
  name: "ApplyHome",
  mixins: [activitiMixin],
  components: {
    Dialog,
    ProcessChoose,
    TableSearch,
    DialogForm
  },
  data () {
    return {
      lcModa: {
        disabled: false,
        formComponent: null,
        isNew: false,
        processData: {}
      },
      visible: false,
      title: '发起流程',
      query: {},
      activeKey: [],
      activeKeyAll: [],
      searchConfig: [
        {
          type: 'input',
          model: 'searchProcessKey',
          placeholder: '输入流程名称'
        }
      ]
    }
  },
  mounted() {
    this.getProcessList()
  },
  methods: {
    filterDictText(dictOptions, text) {
      if (dictOptions instanceof Array) {
        for (let dictItem of dictOptions) {
          if (text === dictItem.value) {
            return dictItem.text
          }
        }
      }
      return text || text=='null' ? '' : text
    },
    handleQuery (query) {
      this.query = query
      this.getProcessList()
    },
    getProcessList () {
      getProcessDataList({
        status: 1,
        roles: false
      }).then(resp => {
        if (resp.code === 200) {
          let result = resp.data || []
          this.activeKeyAll = []
          if (this.query.searchProcessKey) {
            const searchProcessKey = this.query.searchProcessKey
            result = filter(result, o => o.name.indexOf(searchProcessKey) > -1) || []
          }
          if (result.length !== 0) {
            const processDataMap = groupBy(result,'categoryId')
            for (const categoryId in processDataMap) {
              this.activeKeyAll.push({
                categoryId,
                processList: processDataMap[categoryId]
              })
              this.activeKey.push(categoryId)
            }
          } else {
            this.activeKeyAll = []
            this.activeKey = []
          }
        }
      })
    },
    chooseProcess (item) {
      if (!item.routeName) {
        return this.$modal.msgWarning('该流程信息未配置表单，请联系开发人员！')
      }
      this.title = '发起流程：' + (item.name || '')
      this.lcModa.formComponent = this.getFormComponent(item.routeName).component
      this.lcModa.isNew = true
      this.lcModa.processData = item
      this.visible = true
    },
    handleToApplyList () {
      this.$router.push({
        path: '/activiti/applyList'
      })
    },
    afterSub () {
      this.visible = false
      this.$modal.msgSuccess("请前往我的申请列表提交审批！")
    },
    close () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  .btn {
    position: absolute;
    right: 20px;
    top: 22px;
  }
}
</style>
