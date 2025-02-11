import { BulletpointIcon } from 'tdesign-icons-vue';
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
        name: 'chartBase',
        component: () => import('@/pages/build/helm/index.vue'),
        meta: { title: 'chart制作' },
      },
      {
        path: 'chartRepo',
        name: 'chartRepoBase',
        component: () => import('@/pages/repo/helm/index.vue'),
        meta: { title: '本地制品' },
      },
    ],
  }
];
