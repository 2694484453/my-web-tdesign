import axios from 'axios';
import proxy from '../config/host';
import {message} from 'tdesign-vue';
import Router from "@/router";
const env = import.meta.env.MODE || 'development';
const API_HOST = env === 'mock' ? '/' : proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
};

const instance = axios.create({
  baseURL: API_HOST+ proxy[env].PATH,
  timeout: 3000,
  withCredentials: false,
});

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3;

//请求发起之前拦截操作，判断发送的请求里面是否含有token
instance.interceptors.request.use(config => {
    if (localStorage.getItem("ACCESS_TOKEN")) {
      //如果token存在，则请求头上面携带token给后端传输
      config.headers['Authorization'] = 'Bearer ' + localStorage.getItem("ACCESS_TOKEN")
      //config.headers.token = this.$cookies.VueCookies.get("token")
    }
    return config
  },
  err => {  //没有token的时候就抛出错误
    return Promise.reject(err);
  }
)
//拦截响应
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response;
      if (data.code === CODE.REQUEST_SUCCESS) {
        return data;
      }
      return response;
    }
    if (response.data.code === 401) {
      message.error("无效的会话，或者会话已过期，请重新登录。").then(r => {
        setTimeout(()=>{
          Router.push("/login").then(r => {

          })
        },2000)
      })
    }
  },
  (err) => {
    const { config } = err;

    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.retryCount += 1;

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);

export default instance;
