import { RelativityIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/git',
    component: Layout,
    redirect: '/git/base',
    name: 'git',
    meta: {
      title: 'Git仓库管理',
      icon: RelativityIcon,
    },
    children: [
      {
        path: 'gitee',
        name: 'gitee',
        component: () => import('@/pages/git/gitee/index.vue'),
        meta: { title: 'Gitee' },
      },
      {
        path: 'github',
        name: 'github',
        component: () => import('@/pages/git/github/index.vue'),
        meta: { title: 'Github' },
      },
      {
        path: 'gitlab',
        name: 'gitlab',
        component: () => import('@/pages/git/gitlab/index.vue'),
        meta: { title: 'Gitlab' },
      },
    ],
  },
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
        path: 'docker',
        name: 'docker',
        component: () => import('@/pages/devops/index.vue'),
        meta: { title: '镜像制品任务' },
      },
      {
        path: 'maven',
        name: 'maven',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'maven制品任务' },
      },
      {
        path: 'podList',
        name: 'podList',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'pod列表' },
      },
    ],
  },
  {
    path: '/build',
    component: Layout,
    redirect: '/build/base',
    name: 'build',
    meta: {
      title: 'Helm&Chart编排',
      icon: RelativityIcon,
    },
    children: [
      {
        path: 'chart',
        name: 'chart',
        component: () => import('@/pages/build/helm/index.vue'),
        meta: { title: 'chart制作' },
      },
      {
        path: 'podList',
        name: 'podList',
        component: () => import('@/pages/devops/pod/index.vue'),
        meta: { title: 'chart仓库' },
      },
    ],
  }
];
