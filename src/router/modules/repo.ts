import {AppIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/repo',
    name: 'repo',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '应用中心', icon: AppIcon},
    children: [
      {
        path: 'helmMarket',
        name: 'HelmMarketBase',
        component: () => import('@/pages/repo/helm/list/index.vue'),
        meta: {title: '应用市场'},
      },
      {
        path: 'helmMine',
        name: 'HelmMineBase',
        component: () => import('@/pages/repo/mine/list/index.vue'),
        meta: {title: '我的应用'},
      },
      {
        path: 'helmManager',
        name: 'HelmManagerBase',
        component: () => import('@/pages/repo/manager/list/index.vue'),
        meta: {title: '应用管理'},
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
