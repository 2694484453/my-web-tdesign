import {CodeIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';
export default [
{
  path: '/ide',
  name: 'ide',
  component: Layout,
  //redirect: '/prometheus/base',
  meta: {title: '云开发', icon: CodeIcon},
  children: [
    {
      path: 'dashboard',
      name: 'DashboardBase',
      component: () => import('@/pages/ide/index.vue'),
      meta: {title: '概览'},
    },
    {
      path: 'base',
      name: 'WorkSpaceBase',
      component: () => import('@/pages/ide/list/index.vue'),
      meta: {title: '工作空间'},
    }
  ],
},
]
