import {TimeIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/notice',
    name: 'notice',
    component: Layout,
    meta: {title: '消息管理', icon: TimeIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/notice/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "list",
        name: 'list',
        component: () => import("@/pages/notice/list/index.vue"),
        meta: {title: '消息列表'},
      }
    ],
  }
]
