import {NotificationIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // 域名
  {
    path: '/alert',
    name: 'alert',
    component: Layout,
    meta: {title: '告警中心(主机版)', icon: NotificationIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/alert/index.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: "list",
        name: 'listBase',
        component: () => import("@/pages/alert/list/index.vue"),
        meta: {title: '告警列表'},
      }
    ],
  },
  {
    path: '/alert-cloud',
    name: 'alert-cloud',
    component: Layout,
    meta: {title: '告警中心(云原生版)', icon: NotificationIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/alert-cloud/index.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: "list",
        name: 'listBase',
        component: () => import("@/pages/alert-cloud/list/index.vue"),
        meta: {title: '告警列表'},
      }
    ],
  }
]
