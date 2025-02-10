import {LogoGithubIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/git',
    component: Layout,
    redirect: '/git/base',
    name: 'git',
    meta: {
      title: 'Git仓库管理',
      icon: LogoGithubIcon,
    },
    children: [
      {
        path: 'overView',
        name: 'overView',
        component: () => import('@/pages/git/github/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'repos',
        name: 'repos',
        component: () => import('@/pages/git/github/list/index.vue'),
        meta: {title: '仓库列表'},
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/pages/git/gitlab/index.vue'),
        meta: {title: '其他'},
      },
    ],
  },
]
