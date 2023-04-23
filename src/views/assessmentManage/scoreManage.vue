<template>
  <div>
    <normal-table-render />
  </div>
</template>

<script>
import pageMixin from '@/common/mixin/pageMixin';
import { getTableDataList } from '@/api/assessmentManage/scoreManage';

export default {
  name: "ScoreManage",
  mixins: [pageMixin],
  data () {
    return {
      showIndex: true,
      dialogLabelWidth: '100px',
      dialogFormConfig: [
        {
          type: 'inputNumber',
          label: '考勤迟到',
          model: 'number'
        },
        {
          type: 'inputNumber',
          label: '考勤缺勤',
          model: 'number'
        },
        {
          type: 'inputNumber',
          label: '厂区车辆超速',
          model: 'number'
        },
        {
          type: 'inputNumber',
          label: '安全生产违规',
          model: 'number'
        },
        {
          type: 'inputNumber',
          label: '人员越界违规',
          model: 'number'
        }
      ],
      searchConfig: [
        {
          type: 'date',
          model: 'type',
          dateType: 'month',
          label: '月份'
        }
      ],
      toolbarConfig: [
        {
          label: '评分设置',
          icon: 'el-icon-plus',
          action: 'add'
        }
      ],
      tableColumns: [
        {
          key: 'processName',
          title: '外协单位平常'
        },
        {
          key: 'number',
          title: '月份'
        },
        {
          key: 'status',
          title: '当月评分'
        },
        {
          key: 'status',
          title: '厂内考核排名'
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
          this.dialogTitle = '评分设置'
          this.dialogVisible = true
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
