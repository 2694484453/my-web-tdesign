import {ImageIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/wallpaper',
    name: 'wallpaper',
    component: Layout,
    meta: {
      title: '壁纸中心',
      icon: ImageIcon,
    },
    children: [
      // {
      //   path: 'overView',
      //   name: 'overView',
      //   component: () => import('@/pages/git/index.vue'),
      //   meta: {title: '概览'},
      // },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/pages/wallpaper/list/index.vue'),
        meta: {title: '壁纸列表'},
      },
      // {
      //   path: 'access',
      //   name: 'access',
      //   component: () => import('@/pages/git/access/list/index.vue'),
      //   meta: {title: '配置列表'},
      // },
    ],
  },
]
