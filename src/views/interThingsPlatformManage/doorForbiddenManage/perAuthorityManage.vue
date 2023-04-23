<template>
  <div>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="tree-org">
          <div class="head-container">
            <el-input
              v-model="orgName"
              placeholder="请输入机构名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <normal-table-render />
      </el-col>
    </el-row>
    <permission :visible="visible" @close="visible = false" @confirm="okHandle" />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import Permission from '@/common/components/interThingsPlatformManage/doorForbiddenManage/DoorPointPermission'
import { getTableDataList } from '@/api/interThingsPlatformManage/doorForbiddenManage/perAuthorityManage';

export default {
  name: "PerAuthorityManage",
  mixins: [pageMixin],
  components: { Permission },
  data () {
    return {
      orgName: '',
      visible: false,
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      showIndex: true,
      searchConfig: [
        {
          type: 'input',
          model: 'type',
          label: '人员姓名'
        }
      ],
      actionConfig: [
        {
          label: '门禁权限管理',
          icon: 'el-icon-view',
          type: 'text',
          action: 'permission'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '人员姓名'
        },
        {
          key: 'number',
          title: '所属机构'
        },
        {
          key: 'number',
          title: '手机号码'
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
  watch: {
    orgName(val) {
      this.$refs.tree.filter(val);
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
    actionClick (item, row) {
      switch (item.action) {
        case 'permission':
          this.visible = true
          break
      }
    },
    okHandle(value) {
      console.log(value);
      this.visible = false
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.reload()
    },
  }
}
</script>

<style lang="scss" scoped>
.tree-org {
  padding: 20px 0 20px 20px;
}
</style>
