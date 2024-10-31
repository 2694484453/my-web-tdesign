import {RollbackIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/backup',
    name: 'backup',
    component: Layout,
    meta: {title: '备份&恢复管理', icon: RollbackIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/backup/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "list",
        name: 'ListBase',
        component: () => import("@/pages/backup/list/index.vue"),
        meta: {title: '配置列表'},
      }
    ],
  }
]
