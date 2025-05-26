import {WifiIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
  {
    path: '/discovery',
    name: 'discovery',
    component: Layout,
    meta: {title: '服务发现', icon: WifiIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/discovery/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: "nameSpaceList",
        name: 'nameSpaceList',
        component: () => import("@/pages/discovery/nameSpaceList/index.vue"),
        meta: {title: '命名空间'},
      },
      {
        path: "serviceList",
        name: 'serviceList',
        component: () => import("@/pages/discovery/serviceList/index.vue"),
        meta: {title: '服务列表'},
      },
      {
        path: "configList",
        name: 'configList',
        component: () => import("@/pages/discovery/configList/index.vue"),
        meta: {title: '配置列表'},
      },
      // {
      //   path: "frame",
      //   name: 'FrameBase',
      //   component: () => import("@/pages/discovery/frame/index.vue"),
      //   meta: {title: '服务面板'},
      // }
    ],
  }
]
