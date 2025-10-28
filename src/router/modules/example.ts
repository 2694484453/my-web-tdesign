import {ImageIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/base',
    name: 'tools',
    meta: {
      title: '工具管理',
      icon: ImageIcon,
    },
    children: [
      {
        path: 'overView',
        name: 'overView',
        component: () => import('@/pages/git/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'pages',
        name: 'pages',
        component: () => import('@/pages/tools/card/index.vue'),
        meta: {title: '小工具列表'},
      },
      {
        path: 'access',
        name: 'access',
        component: () => import('@/pages/git/access/list/index.vue'),
        meta: {title: '配置列表'},
      },
    ],
  },
]
