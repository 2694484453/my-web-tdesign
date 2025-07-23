import {AppIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/repo',
    name: 'repo',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '镜像仓库管理', icon: AppIcon},
    children: [
      {
        path: 'imageMarket',
        name: 'imageMarketBase',
        component: () => import('@/pages/repo/market/list/index.vue'),
        meta: {title: '镜像市场'},
      },
      {
        path: 'helmImage',
        name: 'HelmImageBase',
        component: () => import('@/pages/repo/image/list/index.vue'),
        meta: {title: '我的镜像'},
      },
      {
        path: 'accessManager',
        name: 'accessManager',
        component: () => import('@/pages/repo/access/list/index.vue'),
        meta: {title: '认证管理'},
      },
      // {
      //   path: 'image',
      //   name: 'ImageBase',
      //   component: () => import('@/pages/repo/image/list/index.vue'),
      //   meta: {title: 'docker镜像'},
      // },
    ],
  }
]
