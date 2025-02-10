import {AppIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/test',
    name: 'test',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '云测试', icon: AppIcon},
    children: [
      {
        path: 'test',
        name: 'TestBase',
        component: () => import('@/pages/test/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'test',
        name: 'TestBase',
        component: () => import('@/pages/test/frame/index.vue'),
        meta: {title: '调试工具'},
      },
      {
        path: 'test',
        name: 'TestBase',
        component: () => import('@/pages/test/index.vue'),
        meta: {title: '测试页'},
      },
    ],
  }
]
