import {PreciseMonitorIcon, MirrorIcon, NotificationIcon} from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  // {
  //   path: '/prometheus',
  //   name: 'prometheus',
  //   component: Layout,
  //   //redirect: '/prometheus/base',
  //   meta: {title: '监控中心(主机版)', icon: PreciseMonitorIcon},
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'DashboardBase',
  //       component: () => import('@/pages/prometheus/dashboard.vue'),
  //       meta: {title: '监控视图'},
  //     },
  //     {
  //       path: 'base',
  //       name: 'MonitorBase',
  //       component: () => import('@/pages/prometheus/index.vue'),
  //       meta: {title: '监控列表'},
  //     }
  //   ],
  // },
  {
    path: '/prometheus-cloud',
    name: 'prometheus-cloud',
    component: Layout,
    //redirect: '/prometheus/base',
    meta: {title: '监控中心', icon: PreciseMonitorIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/prometheus-cloud/dashboard.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: 'podMonitor',
        name: 'podMonitorBase',
        component: () => import('@/pages/prometheus-cloud/index.vue'),
        meta: {title: 'PodMonitor配置'},
      },
      {
        path: 'serviceMonitor',
        name: 'serviceMonitorBase',
        component: () => import('@/pages/prometheus-cloud/index.vue'),
        meta: {title: 'ServiceMonitor配置'},
      },
      {
        path: 'targetsMonitor',
        name: 'targetsMonitorBase',
        component: () => import('@/pages/prometheus-targets/list/index.vue'),
        meta: {title: '端点查询'},
      },
    ],
  },
  // {
  //   path: '/alert',
  //   name: 'alert',
  //   component: Layout,
  //   meta: {title: '告警中心(主机版)', icon: NotificationIcon},
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'DashboardBase',
  //       component: () => import('@/pages/alert/index.vue'),
  //       meta: {title: '监控视图'},
  //     },
  //     {
  //       path: "list",
  //       name: 'listBase',
  //       component: () => import("@/pages/alert/list/index.vue"),
  //       meta: {title: '告警列表'},
  //     }
  //   ],
  // },
  {
    path: '/alert-cloud',
    name: 'alert-cloud',
    component: Layout,
    meta: {title: '告警中心', icon: NotificationIcon},
    children: [
      {
        path: 'dashboard',
        name: 'DashboardBase',
        component: () => import('@/pages/alert-cloud/index.vue'),
        meta: {title: '监控面板'},
      },
      {
        path: "ruleConfigList",
        name: 'ruleConfigListBase',
        component: () => import("@/pages/alert-config/list/index.vue"),
        meta: {title: '规则配置'},
      },
      {
        path: "ruleList",
        name: 'ruleListBase',
        component: () => import("@/pages/alert-rules/list/index.vue"),
        meta: {title: '告警规则'},
      },
      {
        path: "alertList",
        name: 'alertListBase',
        component: () => import("@/pages/alert-message/list/index.vue"),
        meta: {title: '告警消息'},
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
        meta: {title: '配置面板'},
      }
    ],
  },
]
