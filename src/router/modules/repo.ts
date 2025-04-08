import {RelativityIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/repo',
    name: 'repo',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '制品仓库', icon: RelativityIcon},
    children: [
      {
        path: 'image',
        name: 'ImageBase',
        component: () => import('@/pages/repo/image/list/index.vue'),
        meta: {title: 'docker制品'},
      },
      {
        path: 'helm',
        name: 'HelmBase',
        component: () => import('@/pages/repo/helm/list/index.vue'),
        meta: {title: 'helm制品'},
      }
    ],
  }
]
