<template>
  <div class="process-choose">
    <el-empty v-if="data.length == 0" description="无流程可供选择" />
    <div v-else>
      <el-collapse :value="value" @change="change">
        <el-collapse-item v-for="(item, index) in data" :title="filterDictText(dictOptions, item.categoryId) || '未分类'" :name="item.categoryId" :key="item.categoryId">
          <el-row :gutter="10" class="panel">
            <el-col v-for="(val, i) in item.processList" :key="i" :span="span">
              <panel title="卡片名称">
                <template slot="toolbar">
                  <el-button @click="chooseProcess(val)" type="text">发起申请</el-button>
                </template>
                <div>
                  <b>版本：</b>v.{{val.version}}
                  <br/>
                  <b>说明：</b>{{val.description}}
                </div>
              </panel>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Panel from '@/components/Panel'

export default {
  name: "ProcessChoose",
  components: {
    Panel
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Array,
      default: () => ([])
    },
    span: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      dictOptions: []
    }
  },
  mounted () {
    this.initDictConfig()
  },
  methods: {
    initDictConfig() {
      // bpm_process_type
      this.dictOptions = [
        {
          text: '测试流程',
          title: '测试流程',
          value: 'test'
        },
        {
          text: 'OA办公',
          title: 'OA办公',
          value: 'oa'
        },
        {
          text: '业务办理',
          title: '业务办理',
          value: 'business'
        }
      ]
    },
    filterDictText (dictOptions, text) {
      if (dictOptions instanceof Array) {
        for (let dictItem of dictOptions) {
          if (text === dictItem.value) {
            return dictItem.text
          }
        }
      }
      return text || text == 'null' ? '' : text
    },
    change (value) {
      this.$emit('change', value)
    },
    chooseProcess (item) {
      this.$emit('chooseProcess', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.process-choose {
  .panel {
    margin-top: -10px;
    .box-card {
      margin-top: 10px;
    }
  }
  ::v-deep .el-empty {
    border: 1px solid #e6ebf5;
  }
  ::v-deep .el-collapse-item__header {
    background: #FAFAFA;
    border: 1px solid #e6ebf5;
    border-top: 0px;
    padding-left: 10px;
  }
  ::v-deep .el-collapse-item__content {
    padding: 10px;
    border-left: 1px solid #e6ebf5;
    border-right: 1px solid #e6ebf5;
  }
}
</style>
