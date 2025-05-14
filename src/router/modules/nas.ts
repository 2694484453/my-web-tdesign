import {SearchIcon, ServerIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/nas',
    name: 'nas',
    component: Layout,
    meta: {title: 'Nas服务管理', icon: ServerIcon},
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/pages/nas/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: "frpc",
        name: 'frpcListBase',
        component: () => import("@/pages/nas/frp/list/index.vue"),
        meta: {title: 'Frpc管理'},
      },
      {
        path: "use",
        name: 'UseBase',
        component: () => import("@/pages/ai/use/index.vue"),
        meta: {title: '模型调用'},
      }
    ],
  }
]
