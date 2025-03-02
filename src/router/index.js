import VueRouter from 'vue-router';
import baseRouters from './modules/base';
// 个人
import componentsRouters from './modules/components';
// 其他
import othersRouters from './modules/others';
// 构建
import buildRouters from './modules/build';
// 域名
import domainRouters from './modules/domain';
// 监控
import monitorRouters from "@/router/modules/monitor";
// 仓库
import repoRouters from "@/router/modules/repo";
// traefik
import traefikRouters from "@/router/modules/traefik";
// 集群
import clusterRouters from "@/router/modules/cluster";
// coredns
import corednsRouters from "@/router/modules/coredns";
// caddy
import caddyRouters from "@/router/modules/caddy";
// backup
import backupRouters from "@/router/modules/backup";
// tracing
import tracingRouters from "@/router/modules/tracing";
// ide
import IdeRouters from "@/router/modules/ide";
// git
import gitRouters from "@/router/modules/git";
// devops
import devopsRouters from "@/router/modules/devops";
// ai
import AiRouters from "@/router/modules/ai";
// test
import testRouters from "@/router/modules/test";
// userInfo
import userInfoRouters from "@/router/modules/userinfo";
// discovery
import discoveryRouters from "@/router/modules/discovery";

const env = import.meta.env.MODE || 'development';
import proxy from '@/config/host';
// 开发模式
const devRouterList = [...baseRouters, ...componentsRouters, ...othersRouters, ...domainRouters, ...buildRouters, ...monitorRouters, ...repoRouters, ...traefikRouters, ...clusterRouters, ...caddyRouters, ...corednsRouters, ...backupRouters]
// 生产模式
const prodRouterList = [...baseRouters, ...gitRouters, ...IdeRouters, ...devopsRouters, ...buildRouters, ...discoveryRouters, ...monitorRouters, ...tracingRouters, ...repoRouters, ...traefikRouters, ...clusterRouters, ...caddyRouters, ...corednsRouters, ...AiRouters, ...backupRouters, ...testRouters, ...userInfoRouters]
// 存放动态路由
export const asyncRouterList = (proxy[env].NAME === "development" ? devRouterList : prodRouterList)
//[...baseRouters, ...componentsRouters, ...othersRouters];

// 存放固定的路由
const defaultRouterList = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '*',
    redirect: '/dashboard/base',
  },
  ...asyncRouterList,
];

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    base: env === 'site' ? '/starter/vue/' : null,
    routes: defaultRouterList,
    scrollBehavior() {
      return {x: 0, y: 0};
    },
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
