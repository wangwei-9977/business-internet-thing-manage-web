<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/visitorManage/visitorPassDetail';

export default {
  name: "VisitorPassDetail",
  mixins: [pageMixin],
  data () {
    return {
      checkbox: true,
      searchConfig: [
        {
          type: 'input',
          model: 'title',
          label: '姓名'
        },
        {
          type: 'dateTime',
          model: 'createTimeRange',
          label: '进出时间'
        },
        {
          type: 'input',
          model: 'title',
          label: '部门名称'
        }
      ],
      toolbarConfig: [
        {
          label: '导出',
          type: 'warning',
          icon: 'el-icon-download',
          action: 'export'
        }
      ],
      tableColumns: [
        {
          key: 'title',
          title: '人员类型',
          props: {
            minWidth: '120',
          }
        },
        {
          key: 'processName',
          title: '姓名',
          props: {
            minWidth: '120',
          }
        },
        {
          key: 'currTaskName',
          title: '部门（公司）名称',
          props: {
            minWidth: '180',
          }
        },
        {
          key: 'number',
          title: '身份证号',
          props: {
            minWidth: '180',
          }
        },
        {
          key: 'result',
          title: '工号',
          props: {
            minWidth: '120',
          }
        },
        {
          key: 'createTime',
          title: '进出类型',
          props: {
            minWidth: '120',
          }
        },
        {
          key: 'applyTime',
          title: '进出日期',
          props: {
            minWidth: '160',
          }
        },
        {
          key: 'status',
          title: '手机号码',
          props: {
            minWidth: '130',
          }
        },
        {
          key: 'status',
          title: '认证图片',
          props: {
            minWidth: '100',
          },
          customRender: (scope, row) => {
            const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            return <el-image src={url} preview-src-list={[url]} fit="cover" style="width: 30px; height: 30px" />
          }
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
            number: '350104199410294411',
            result: '辅导费',
            createTime: '辅导费',
            applyTime: '1999-10-10 10:10:10',
            status: '13255044444',
          }
        ],
        total: 100
      }
    },
    buttonClick (item) {
      switch (item.action) {
        case 'export':
          console.log('导出')
          break
      }
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
