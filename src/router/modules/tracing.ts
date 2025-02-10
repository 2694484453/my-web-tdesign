import {RelativityIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/tracing',
    name: 'tracing',
    component: Layout,
    //redirect: '/prometheus/base',
    meta: {title: 'OpenTelemetry链路', icon: RelativityIcon},
    children: [
      {
        path: 'overview',
        name: 'overviewBase',
        component: () => import('@/pages/tracing/index.vue'),
        meta: {title: '概览'},
      },
      {
        path: 'integrations',
        name: 'integrationsBase',
        component: () => import('@/pages/tracing/inner/index.vue'),
        meta: {title: '接入中心'},
      },
      {
        path: 'list',
        name: 'listBase',
        component: () => import('@/pages/tracing/list/index.vue'),
        meta: {title: '应用列表'},
      },
      {
        path: 'tracing',
        name: 'tracingBase',
        component: () => import('@/pages/tracing/list/traces.vue'),
        meta: {title: '调用链分析'},
      }
    ],
  }
]
