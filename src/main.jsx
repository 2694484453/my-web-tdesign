import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import TDesign from 'tdesign-vue';
import VueClipboard from 'vue-clipboard2';
import axiosInstance from '@/utils/request';
import App from './App.vue';
import router from './router';
import zhConfig from 'tdesign-vue/es/locale/zh_CN';
// import enConfig from 'tdesign-vue/es/locale/en_US'; // 英文多语言配置
import VueCookies from 'vue-cookies';
import 'tdesign-vue/es/style/index.css';
import '@/style/index.less';

import './permission';
import store from './store';
// op
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';


Vue.use(VueRouter);
Vue.use(TDesign);
Vue.use(VueClipboard);
Vue.use(VueCookies);
Vue.component('t-page-header');

Vue.prototype.$request = axiosInstance;

const originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch((err) => err);
};

const originReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originReplace.call(this, location).catch((err) => err);
};

//optl
const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
    url: 'http://124.221.2.29:4318/v1/traces', // 修改为你自己的collector地址
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
Vue.config.productionTip = false;
sync(store, router);
new Vue({
  router,
  store,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (h) => (
    <div>
      {/* 可以通过config-provider提供全局（多语言、全局属性）配置，如
      <t-config-provider globalConfig={enConfig}> */}
      <t-config-provider globalConfig={zhConfig}>
        <App />
      </t-config-provider>
    </div>
  ),
}).$mount('#app');
