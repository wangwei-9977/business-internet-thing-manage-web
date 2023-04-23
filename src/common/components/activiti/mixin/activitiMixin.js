import HistoryDetail from '@/common/components/activiti/HistoryDetail'
import { find } from 'lodash'

export const activitiMixin = {
  computed:{
    // 所有的流程表单，组件化注册
    allFormComponent: () => {
      return [
        {
          text: '示例表单',
          routeName: '@/views/activiti/form/demoForm',
          component: () => import('@/common/components/activiti/form/demoForm'),
          businessTable: 'test_demo'
        },
        {
          text: '请假单',
          routeName: '@/views/activiti/form/leaveForm',
          component: () => import('@/common/components/activiti/form/leaveForm'),
          businessTable: 'leave_form'
        }
      ]
    },
    historyDetail: () => {
      return HistoryDetail
    }
  },
  methods: {
    getFormComponent (routeName) {
      return find(this.allFormComponent, { routeName }) || {}
    }
  }
}
