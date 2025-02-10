import {LogoGithubIcon, RelativityIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/devops',
    component: Layout,
    redirect: '/devops/base',
    name: 'devops',
    meta: {
      title: 'DevOps流水线',
      icon: RelativityIcon,
    },
    children: [
      {
        path: 'overView',
        name: 'OverViewBase',
        component: () => import('@/pages/devops/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'maven',
        name: 'maven',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'maven制品任务' },
      },
      {
        path: 'maven',
        name: 'maven',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: '自定义任务' },
      },
      {
        path: 'podList',
        name: 'podList',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'pod列表' },
      },
    ],
  },
]
