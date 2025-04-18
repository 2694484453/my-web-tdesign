import {AppIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/repo',
    name: 'repo',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '应用市场', icon: AppIcon},
    children: [
      {
        path: 'helm',
        name: 'HelmBase',
        component: () => import('@/pages/repo/helm/list/index.vue'),
        meta: {title: 'helm应用'},
      },
      {
        path: 'image',
        name: 'ImageBase',
        component: () => import('@/pages/repo/image/list/index.vue'),
        meta: {title: 'docker镜像'},
      },
    ],
  }
]
