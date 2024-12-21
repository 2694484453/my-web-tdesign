import {RelativityIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/test',
    name: 'test',
    component: Layout,
    //redirect: '/repo/base',
    meta: {title: '测试页', icon: RelativityIcon},
    children: [
      {
        path: 'test',
        name: 'TestBase',
        component: () => import('@/pages/test/index.vue'),
        meta: {title: '测试1'},
      },
    ],
  }
]
