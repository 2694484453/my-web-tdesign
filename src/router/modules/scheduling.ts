import {CaretUpIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/scheduling',
    name: 'scheduling',
    component: Layout,
    meta: {title: '调度中心', icon: CaretUpIcon},
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/scheduling/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "list",
        name: 'list',
        component: () => import("@/pages/scheduling/list/index.vue"),
        meta: {title: '任务列表'},
      },
      {
        path: "log",
        name: 'logList',
        component: () => import("@/pages/scheduling/log/index.vue"),
        meta: {title: '执行日志'},
      }
    ],
  }
]
