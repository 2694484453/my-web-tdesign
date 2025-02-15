import {SearchIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/ai',
    name: 'ai',
    component: Layout,
    meta: {title: '大模型管理', icon: SearchIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/ai/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "list",
        name: 'ListBase',
        component: () => import("@/pages/ai/list/index.vue"),
        meta: {title: '配置列表'},
      }
    ],
  }
]
