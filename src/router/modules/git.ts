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
        name: '概览',
        component: () => import('@/pages/git/github/index.vue'),
        meta: {title: 'Gitee'},
      },
      {
        path: 'repoList',
        name: '仓库列表',
        component: () => import('@/pages/git/github/index.vue'),
        meta: {title: 'Github'},
      },
      {
        path: 'other',
        name: '其他',
        component: () => import('@/pages/git/gitlab/index.vue'),
        meta: {title: 'Gitlab'},
      },
    ],
  },
]
