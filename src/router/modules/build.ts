import { RelativityIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/build',
    component: Layout,
    redirect: '/build/base',
    name: 'build',
    meta: {
      title: '构建管理',
      icon: RelativityIcon,
    },
    children: [
      {
        path: 'image',
        name: 'image',
        component: () => import('@/pages/build/image/index.vue'),
        meta: { title: 'image构建' },
      },
      {
        path: 'helm',
        name: 'helm',
        component: () => import('@/pages/build/helm/index.vue'),
        meta: { title: 'chart构建' },
      },
    ],
  },
];
