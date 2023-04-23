<template>
  <div class="search">
    <el-card style="margin-bottom:10px;">
      <p slot="header">
        <span>流程审批进度历史</span>
      </p>
      <el-row style="position:relative">
        <normal-table-render />
      </el-row>
    </el-card>
    <el-tabs v-model="activeName" type="card" @tab-click="callback">
      <el-tab-pane name="1" label="实时流程图">
        <el-card>
          <el-row style="position:relative">
            <img :src="imgUrl" />
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="lcModa" name="2" label="表单数据">
        <el-card>
          <!--流程表单-->
          <component
            :disabled="lcModa.disabled"
            :is="lcModa.formComponent"
            :processData="lcModa.processData"
            :isNew="lcModa.isNew"
            :task="lcModa.isTask"
            @afterSubmit="afterSub"
            @passTask="pass(lcModa.processData)"
            @backTask="back(lcModa.processData)"
            @close="lcModa.visible=false,lcModa.disabled = false"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin'
import request from '@/utils/request'
import { millsToTime } from '@/utils'

export default {
  name: "HistoryDetail",
  mixins: [pageMixin],
  props: {
    procInstId: {
      type: String,
      default: '',
      required: true
    },
    lcModa: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      activeName: '1',
      url:{
        historicFlow: '/system/actTask/historicFlow/',
        getHighlightImg: process.env.VUE_APP_BASE_API+'/system/activiti/models/getHighlightImg/'
      },
      type: 0,
      loading: false,
      loadingImg: false,
      id: "",
      imgUrl: "",
      backRoute: "",
      pagination: false,
      dialogVisible: false,
      showToolbar: false,
      tableColumns: [
        {
          key: 'name',
          title: '任务名称',
        },
        {
          key: 'assignees',
          title: '处理人',
          customRender: (scope, row) => {
            const list = row.assignees || []
            const names = list.map(item => item.username).join(',')
            return <span>{ names }</span>
          }
        },
        {
          key: 'deleteReason',
          title: '审批操作',
          customRender: (scope, row) => {
            return (
              <div>
                {
                  row.deleteReason.toString().indexOf('通过') > -1 ? (
                    <span style="color: #00DB00">
                      { row.deleteReason }
                    </span>
                  ) : row.deleteReason.toString().indexOf('驳回') > -1 ? (
                    <span style="color: red;">
                      { row.deleteReason }
                    </span>
                  ) : (
                    <span>
                      { row.deleteReason }
                    </span>
                  )
                }
              </div>
            )
          }
        },
        {
          key: 'comment',
          title: '审批意见',
        },
        {
          key: 'duration',
          title: '耗时',
          customRender: (scope, row) => {
            return <span>{ millsToTime(row.duration) }</span>
          }
        },
        {
          key: 'createTime',
          title: '创建时间',
          props: {
            width: 160
          }
        },
        {
          key: 'endTime',
          title: '完成时间',
          props: {
            width: 160
          }
        },
        {
          key: 'status',
          title: '状态',
          customRender: (scope, row) => {
            return (
              <div>
                {
                  row.endTime ? (
                    <span style="color: blue;">已办理</span>
                  ) : (
                    <span style="color: #999999">待处理</span>
                  )
                }
              </div>
            )
          }
        }
      ]
    };
  },
  created () {
    this.init()
  },
  watch: {
    procInstId (newval ,oldName) {
      this.init()
    }
  },
  methods: {
    loadData () {},
    init () {
      this.id = this.procInstId
      this.imgUrl = this.url.getHighlightImg + this.id + "?time=" + new Date()
      this.reload()
    },
    async request () {
      return request({
        url: this.url.historicFlow + this.id,
        method: 'get',
      }).then(resp => {
        if (resp.code === 200) {
          if (!resp.data || resp.data.length == 0) {
            this.$message.info( "未找到该记录审批历史数据,历史数据可能已被删除");
          }
        }else {
          this.$message.error(resp.msg);
        }
        return {
          list: resp.data || [],
          total: 0
        }
      })
    },
    callback (tab, event) {
      console.log(tab, event, this.activeName)
    },
    afterSub () {},
    pass (v) {
      this.$emit('passTask', v)
    },
    back (v) {
      this.$emit('backTask', v)
    }
  }
}
</script>
