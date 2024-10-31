import {ChartPieIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/caddy',
    name: 'caddy',
    component: Layout,
    meta: {title: 'Caddy管理', icon: ChartPieIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/caddy/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "add",
        name: 'AddBase',
        component: () => import("@/pages/caddy/list/index.vue"),
        meta: {title: '配置列表'},
      }
    ],
  },
]
