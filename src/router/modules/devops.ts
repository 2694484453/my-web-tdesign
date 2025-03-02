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
        path: 'job',
        name: 'JobBase',
        component: () => import('@/pages/devops/list/index.vue'),
        meta: { title: '普通任务' },
      },
      {
        path: 'cronJob',
        name: 'CronJob',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: '定时任务' },
      },
      // {
      //   path: 'podList',
      //   name: 'podList',
      //   component: () => import('@/pages/devops/pod/index.vue'),
      //   meta: { title: 'pod列表' },
      // },
    ],
  },
]
