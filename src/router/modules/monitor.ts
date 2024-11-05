import {PreciseMonitorIcon,MirrorIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // 域名
  {
    path: '/monitor',
    name: 'monitor',
    component: Layout,
    //redirect: '/monitor/base',
    meta: {title: '监控中心(主机版)', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/monitor/dashboard.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: 'base',
        name: 'MonitorBase',
        component: () => import('@/pages/monitor/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
  {
    path: '/monitor-cloud',
    name: 'monitor-cloud',
    component: Layout,
    //redirect: '/monitor/base',
    meta: {title: '监控中心(云原生版)', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/monitor-cloud/dashboard.vue'),
        meta: {title: '监控视图'},
      },
      {
        path: 'base',
        name: 'MonitorBase',
        component: () => import('@/pages/monitor-cloud/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
  {
    path: '/grafana',
    name: 'grafana',
    component: Layout,
    meta: {title: 'grafana图表(主机版)', icon: MirrorIcon},
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
        component: () => import('@/pages/grafana/index.vue'),
        meta: {title: '监控列表'},
      }
    ],
  },
]
