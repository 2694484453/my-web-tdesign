import {SettingIcon, ServerIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/cluster',
    name: 'cluster',
    component: Layout,
    meta: {title: '边缘云集群', icon: SettingIcon},
    children: [
      {
        path: 'overView',
        name: 'overViewBase',
        component: () => import('@/pages/vps/dashboard.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/cluster/dashboard.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "add",
        name: 'AddBase',
        component: () => import("@/pages/cluster/list/index.vue"),
        meta: {title: '集群列表'},
      }
    ],
  },
  {
    path: '/vps',
    name: 'vps',
    component: Layout,
    meta: {title: 'vps主机', icon: ServerIcon},
    children: [
      {
        path: 'overView',
        name: 'overViewBase',
        component: () => import('@/pages/vps/dashboard.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/vps/dashboard.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "add",
        name: 'AddBase',
        component: () => import("@/pages/vps/list/index.vue"),
        meta: {title: '主机列表'},
      }
    ],
  }
]
