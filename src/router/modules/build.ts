import { RelativityIcon, BulletpointIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/build',
    component: Layout,
    redirect: '/build/base',
    name: 'build',
    meta: {
      title: 'Helm&Chart编排',
      icon: BulletpointIcon,
    },
    children: [
      {
        path: 'chart',
        name: 'chart',
        component: () => import('@/pages/build/helm/index.vue'),
        meta: { title: 'chart制作' },
      },
      {
        path: 'podList',
        name: 'podList',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'chart仓库' },
      },
    ],
  }
];
