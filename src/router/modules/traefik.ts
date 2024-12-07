import {RectangleIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/traefik',
    name: 'traefik',
    component: Layout,
    meta: {title: 'traefik管理(主机版)', icon: RectangleIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/traefik/index-dashboard.vue'),
        meta: {title: '服务面板'},
      },
      {
        path: "list",
        name: 'AddBase',
        component: () => import("@/pages/traefik/index.vue"),
        meta: {title: '配置列表'},
      },
      {
        path: "demo",
        name: 'AddBase',
        component: () => import("@/pages/traefik/demo.vue"),
        meta: {title: 'demo列表'},
      }
    ],
  },
  {
    path: '/traefik-cloud',
    name: 'traefik-cloud',
    component: Layout,
    meta: {title: 'traefik管理(云原生版)', icon: RectangleIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/traefik-cloud/index.vue'),
        meta: {title: '服务面板'},
      },
      {
        path: "list",
        name: 'AddBase',
        component: () => import("@/pages/traefik-cloud/list/index.vue"),
        meta: {title: '配置列表'},
      },
    ]
  }
]
