import {RelativityIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/repo',
    name: 'repo',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '仓库中心', icon: RelativityIcon},
    children: [
      {
        path: 'image',
        name: 'ImageBase',
        component: () => import('@/pages/repo/image/list/index.vue'),
        meta: {title: '镜像列表'},
      },
      {
        path: 'helm',
        name: 'HelmBase',
        component: () => import('@/pages/repo/helm/list/index.vue'),
        meta: {title: 'helm列表'},
      }
    ],
  }
]
