import {CloudIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  // {
  //   path: '/coredns',
  //   name: 'coredns',
  //   component: Layout,
  //   meta: {title: 'DNS管理(主机板)', icon: CloudIcon},
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'DashboardBase',
  //       component: () => import('@/pages/coredns/index.vue'),
  //       meta: {title: '监控面板'},
  //     },
  //     {
  //       path: "add",
  //       name: 'AddBase',
  //       component: () => import("@/pages/coredns/list/index.vue"),
  //       meta: {title: '配置列表'},
  //     }
  //   ],
  // },
  {
    path: '/coredns-cloud',
    name: 'coredns-cloud',
    component: Layout,
    meta: {title: 'DNS管理', icon: CloudIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/coredns-cloud/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "add",
        name: 'AddBase',
        component: () => import("@/pages/coredns-cloud/list/index.vue"),
        meta: {title: '配置列表'},
      }
    ],
  },
]
