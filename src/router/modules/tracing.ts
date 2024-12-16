import {PreciseMonitorIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/tracing',
    name: 'tracing',
    component: Layout,
    //redirect: '/prometheus/base',
    meta: {title: '可观测链路', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/tracing/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'podMonitor',
        name: 'podMonitorBase',
        component: () => import('@/pages/prometheus-cloud/index.vue'),
        meta: {title: 'Pod监控'},
      },
      {
        path: 'serviceMonitor',
        name: 'serviceMonitorBase',
        component: () => import('@/pages/prometheus-cloud/index.vue'),
        meta: {title: 'Service监控'},
      }
    ],
  }
]
