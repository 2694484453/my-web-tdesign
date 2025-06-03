import {AppIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/app',
    name: 'app',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '应用中心', icon: AppIcon},
    children: [
      {
        path: 'market',
        name: 'HelmMarketBase',
        component: () => import('@/pages/app/market/list/index.vue'),
        meta: {title: '应用市场'},
      },
      {
        path: 'mine',
        name: 'HelmMineBase',
        component: () => import('@/pages/app/mine/list/index.vue'),
        meta: {title: '我的应用'},
      },
      {
        path: 'manager',
        name: 'HelmManagerBase',
        component: () => import('@/pages/app/manager/list/index.vue'),
        meta: {title: '全部应用'},
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
