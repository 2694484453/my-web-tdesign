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
        component: () => import('@/pages/git/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'repos',
        name: 'repos',
        component: () => import('@/pages/git/github/list/index.vue'),
        meta: {title: '仓库列表'},
        children: [
          {
            path: 'gitee',
            name: 'gitee',
            component: () => import('@/pages/git/gitee/list/index.vue'),
            meta: {title: 'gitee仓库'},
          },
          {
            path: 'github',
            name: 'github',
            component: () => import('@/pages/git/github/list/index.vue'),
            meta: {title: 'github仓库'},
          },
          {
            path: 'gitlab',
            name: 'gitlab',
            component: () => import('@/pages/git/gitlab/list/index.vue'),
            meta: {title: 'gitlab仓库'},
          },
          {
            path: 'gitCode',
            name: 'gitCode',
            component: () => import('@/pages/git/gitCode/list/index.vue'),
            meta: {title: 'gitCode仓库'},
          },
        ],
      },
      {
        path: 'access',
        name: 'access',
        component: () => import('@/pages/git/access/list/index.vue'),
        meta: {title: '配置列表'},
      },
    ],
  },
]
