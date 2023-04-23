import Vue from 'vue'
import Router from 'vue-router'
import ParentView from '@/components/ParentView'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
    {
      path: '/carSiteMonitor',
      component: Layout,
      name: 'CarSiteMonitor',
      redirect: 'noRedirect',
      meta: { title: '车场监控', icon: 'system' },
      children: [
        {
          path: '',
          component: () => import('@/views/carSiteMonitor'),
          name: 'CarSiteMonitor',
          meta: { title: '车场监控', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/attendance',
      component: Layout,
      name: 'Attendance',
      redirect: 'noRedirect',
      meta: { title: '考勤管理', icon: 'system' },
      children: [
        {
          path: 'classes',
          component: () => import('@/views/attendance/classes'),
          name: 'Classes',
          meta: { title: '第三方平台管理', icon: 'user', noCache: false }
        },
        {
          path: 'clock',
          component: () => import('@/views/attendance/clock'),
          name: 'Clock',
          meta: { title: '门禁点管理', icon: 'user', noCache: false }
        },
        {
          path: 'day',
          component: () => import('@/views/attendance/day'),
          name: 'Day',
          meta: { title: '门禁组管理', icon: 'user', noCache: false }
        },
        {
          path: 'exceptionDuty',
          component: () => import('@/views/attendance/exceptionDuty'),
          name: 'ExceptionDuty',
          meta: { title: '人员权限管理', icon: 'user', noCache: false }
        },
        {
          path: 'month',
          component: () => import('@/views/attendance/month'),
          name: 'Month',
          meta: { title: '人员权限管理', icon: 'user', noCache: false }
        },
        {
          path: 'query_log',
          component: () => import('@/views/attendance/query_log'),
          name: 'Query_log',
          meta: { title: '人员权限管理', icon: 'user', noCache: false }
        },
        {
          path: 'schedule',
          component: () => import('@/views/attendance/schedule'),
          name: 'Schedule',
          meta: { title: '人员权限管理', icon: 'user', noCache: false }
        },
        {
          path: 'schedule_mgr',
          component: () => import('@/views/attendance/schedule_mgr'),
          name: 'Schedule_mgr',
          meta: { title: '人员权限管理', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/noticeManage',
      component: Layout,
      redirect: 'noRedirect',
      name: 'NoticeManage',
      meta: { title: '通知管理', icon: 'system' },
      children: [
        {
          path: '',
          component: () => import('@/views/noticeManage'),
          name: 'NoticeManage',
          meta: { title: '通知管理', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/interThingsPlatformManage',
      component: Layout,
      name: 'InterThingsPlatformManage',
      redirect: 'noRedirect',
      meta: { title: '物联平台管理', icon: 'system' },
      children: [
        {
          path: 'thirdPlatformManage',
          component: () => import('@/views/interThingsPlatformManage/thirdPlatformManage'),
          name: 'ThirdPlatformManage',
          meta: { title: '第三方平台管理', icon: 'user', noCache: false }
        },
        {
          path: 'doorForbiddenManage',
          name: 'DoorForbiddenManage',
          component: ParentView,
          redirect: 'noRedirect',
          meta: { title: '门禁管理', icon: 'system' },
          children: [
            {
              path: 'pointManage',
              component: () => import('@/views/interThingsPlatformManage/doorForbiddenManage/pointManage'),
              name: 'PointManage',
              meta: { title: '门禁点管理', icon: 'user', noCache: false }
            },
            {
              path: 'groupManage',
              component: () => import('@/views/interThingsPlatformManage/doorForbiddenManage/groupManage'),
              name: 'GroupManage',
              meta: { title: '门禁组管理', icon: 'user', noCache: false }
            },
            {
              path: 'perAuthorityManage',
              component: () => import('@/views/interThingsPlatformManage/doorForbiddenManage/perAuthorityManage'),
              name: 'PerAuthorityManage',
              meta: { title: '人员权限管理', icon: 'user', noCache: false }
            }
          ]
        }
      ]
    },
    {
      path: '/officialCarManage',
      component: Layout,
      name: 'OfficialCarManage',
      redirect: 'noRedirect',
      meta: { title: '公务车管理', icon: 'system' },
      children: [
        {
          path: '',
          component: () => import('@/views/officialCarManage/index'),
          name: 'AlarmManage',
          meta: { title: '公务车管理', icon: 'user', noCache: false }
        },
        {
          path: 'carApplyManage',
          component: () => import('@/views/officialCarManage/carApplyManage'),
          name: 'CarApplyManage',
          meta: { title: '派车/用车申请管理', icon: 'user', noCache: false }
        },
        {
          path: 'repairMaintenanceManage',
          component: () => import('@/views/officialCarManage/repairMaintenanceManage'),
          name: 'RepairMaintenanceManage',
          meta: { title: '公务车维修保养管理', icon: 'user', noCache: false }
        },
        {
          path: 'repairMaintenanceReport',
          component: () => import('@/views/officialCarManage/repairMaintenanceReport'),
          name: 'RepairMaintenanceReport',
          meta: { title: '公务车维修保养台账', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/assessmentmanage',
      component: Layout,
      name: 'Assessmentmanage',
      redirect: 'noRedirect',
      meta: { title: '考核管理', icon: 'system' },
      children: [
        {
          path: 'alarmManage',
          component: () => import('@/views/assessmentManage/alarmManage'),
          name: 'AlarmManage',
          meta: { title: '报警管理', icon: 'user', noCache: false }
        },
        {
          path: 'carOverspeed',
          component: () => import('@/views/assessmentManage/carOverspeed'),
          name: 'CarOverspeed',
          meta: { title: '车辆超速考核', icon: 'user', noCache: false }
        },
        {
          path: 'safeProduction',
          component: () => import('@/views/assessmentManage/safeProduction'),
          name: 'SafeProduction',
          meta: { title: '安全生产考核', icon: 'user', noCache: false }
        },
        {
          path: 'anomalyBehavior',
          component: () => import('@/views/assessmentManage/anomalyBehavior'),
          name: 'AnomalyBehavior',
          meta: { title: '异常行为考核', icon: 'user', noCache: false }
        },
        {
          path: 'scoreManage',
          component: () => import('@/views/assessmentManage/scoreManage'),
          name: 'ScoreManage',
          meta: { title: '外协评分管理', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/outsourceManage',
      component: Layout,
      name: 'OutsourceManage',
      redirect: 'noRedirect',
      meta: { title: '外协管理', icon: 'system' },
      children: [
        {
          path: 'unitManage',
          component: () => import('@/views/outsourceManage/unitManage'),
          name: 'UnitManage',
          meta: { title: '外协单位管理', icon: 'user', noCache: false }
        },
        {
          path: 'personnelManage',
          component: () => import('@/views/outsourceManage/personnelManage'),
          name: 'PersonnelManage',
          meta: { title: '外协人员管理', icon: 'user', noCache: false }
        },
        {
          path: 'studyManage',
          component: () => import('@/views/outsourceManage/studyManage'),
          name: 'StudyManage',
          meta: { title: '安全学习课件管理', icon: 'user', noCache: false }
        },
        {
          path: 'attendanceDay',
          component: () => import('@/views/outsourceManage/attendanceDay'),
          name: 'AttendanceDay',
          meta: { title: '考勤日报', icon: 'user', noCache: false }
        },
        {
          path: 'attendanceManage',
          component: () => import('@/views/outsourceManage/attendanceManage'),
          name: 'AttendanceManage',
          meta: { title: '考勤管理', icon: 'user', noCache: false }
        }
      ]
    },
    {
      path: '/vehicleCenter',
      component: Layout,
      name: 'VehicleCenter',
      redirect: 'noRedirect',
      meta: { title: '车辆中心', icon: 'system' },
      children: [
        {
          path: 'fixCarManage',
          component: () => import('@/views/vehicleCenter/fixCarManage'),
          name: 'FixCarManage',
          meta: { title: '固定车管理', icon: 'user', noCache: false }
        },
        {
          path: 'transportConvoyManage',
          component: () => import('@/views/vehicleCenter/transportConvoyManage'),
          name: 'TransportConvoyManage',
          meta: { title: '运输车队管理', icon: 'user', noCache: false }
        },
        {
          path: 'transportCarManage',
          component: () => import('@/views/vehicleCenter/transportCarManage'),
          name: 'TransportCarManage',
          meta: { title: '运输车管理', icon: 'user', noCache: false }
        },
        {
          path: 'vipCar',
          component: () => import('@/views/vehicleCenter/vipCar'),
          name: 'VipCar',
          meta: { title: '贵宾车临时放行', icon: 'user', noCache: false }
        },
        {
          path: 'truckCarManage',
          component: () => import('@/views/vehicleCenter/truckCarManage'),
          name: 'TruckCarManage',
          meta: { title: '送货车管理', icon: 'user', noCache: false }
        },
        {
          path: 'dangerCarManage',
          component: () => import('@/views/vehicleCenter/dangerCarManage'),
          name: 'DangerCarManage',
          meta: { title: '危化品车管理', icon: 'user', noCache: false }
        },
        {
          path: 'articleLeaveFactoryApply',
          component: () => import('@/views/vehicleCenter/articleLeaveFactoryApply'),
          name: 'ArticleLeaveFactoryApply',
          meta: { title: '物资出厂申请', icon: 'user', noCache: false }
        },
        {
          path: 'carInAndOutManage',
          component: () => import('@/views/vehicleCenter/carInAndOutManage'),
          name: 'CarInAndOutManage',
          meta: { title: '车辆进出管理', icon: 'user', noCache: false }
        },
        {
          path: 'blackCarManage',
          component: () => import('@/views/vehicleCenter/blackCarManage'),
          name: 'BlackCarManage',
          meta: { title: '黑名单车辆管理', icon: 'user', noCache: false }
        },
        {
          path: 'dayInAndOutCar',
          component: () => import('@/views/vehicleCenter/dayInAndOutCar'),
          name: 'DayInAndOutCar',
          meta: { title: '每日出入厂车辆台账', icon: 'user', noCache: false }
        },
      ]
    },
    {
      path: '/visitor',
      component: Layout,
      name: 'Visitor',
      redirect: 'noRedirect',
      meta: { title: '访客管理', icon: 'system' },
      children: [
        {
          path: 'visitorApprove',
          component: () => import('@/views/visitorManage/visitorApprove'),
          name: 'VisitorApprove',
          meta: { title: '访客预约审批', icon: 'user', noCache: false }
        },
        {
          path: 'dailyVisitorStatistic',
          component: () => import('@/views/visitorManage/dailyVisitorStatistic'),
          name: 'DailyVisitorStatistic',
          meta: { title: '每日访客统计', icon: 'user', noCache: false }
        },
        {
          path: 'visitorPassDetail',
          component: () => import('@/views/visitorManage/visitorPassDetail'),
          name: 'VisitorPassDetail',
          meta: { title: '访客通行明细', icon: 'user', noCache: false }
        },
        {
          path: 'blackListManage',
          component: () => import('@/views/visitorManage/blackListManage'),
          name: 'BlackListManage',
          meta: { title: '人员黑名单管理', icon: 'user', noCache: false }
        },
        {
          path: 'visitorAnomalyAlarm',
          component: () => import('@/views/visitorManage/visitorAnomalyAlarm'),
          name: 'VisitorAnomalyAlarm',
          meta: { title: '访客异常行为告警', icon: 'user', noCache: false }
        },
        {
          path: 'visitorLedger',
          component: () => import('@/views/visitorManage/visitorLedger'),
          name: 'VisitorLedger',
          meta: { title: '访客台账', icon: 'user', noCache: false }
        },
      ]
    },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
