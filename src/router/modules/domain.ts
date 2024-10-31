import {HeartIcon,InternetIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // 域名
  {
    path: '/domain',
    name: 'domain',
    component: Layout,
    redirect: '/domain/base',
    meta: {title: '域名管理', icon: InternetIcon},
    children: [
      {
        path: 'base',
        name: 'DomainBase',
        component: () => import('@/pages/domain/index.vue'),
        meta: {title: '域名列表'},
      },
    ],
  }
]
