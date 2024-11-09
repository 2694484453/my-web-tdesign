import {PreciseMonitorIcon,MirrorIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // 域名
  {
    path: '/prometheus',
    name: 'prometheus',
    component: Layout,
    //redirect: '/prometheus/base',
    meta: {title: '监控中心(主机版)', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/prometheus/dashboard.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: 'base',
        name: 'MonitorBase',
        component: () => import('@/pages/prometheus/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
  {
    path: '/prometheus-cloud',
    name: 'prometheus-cloud',
    component: Layout,
    //redirect: '/prometheus/base',
    meta: {title: '监控中心(云原生版)', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/prometheus-cloud/dashboard.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: 'base',
        name: 'MonitorBase',
        component: () => import('@/pages/prometheus-cloud/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
  {
    path: '/grafana',
    name: 'grafana',
    component: Layout,
    meta: {title: 'grafana图表', icon: MirrorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/grafana/dashboard.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: 'base',
        name: 'MonitorBase',
        component: () => import('@/pages/grafana/list/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
]
