import {SettingIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/cluster',
    name: 'cluster',
    component: Layout,
    meta: {title: '边缘云集群', icon: SettingIcon},
    children: [
      // {
      //   path: 'dashboard',
      //   name: 'DashboardBase',
      //   component: () => import('@/pages/cluster/list/index-dashboard.vue'),
      //   meta: {title: '监控面板'},
      // },
      {
        path: "add",
        name: 'AddBase',
        component: () => import("@/pages/cluster/list/index.vue"),
        meta: {title: '集群列表'},
      }
    ],
  }
]
