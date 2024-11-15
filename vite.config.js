import {loadEnv} from 'vite';
import {viteMockServe} from 'vite-plugin-mock';
import {createVuePlugin} from 'vite-plugin-vue2';
import {createSvgPlugin} from 'vite-plugin-vue2-svg';

import path from 'path';

const CWD = process.cwd();

export default ({mode}) => {
  const {VITE_BASE_URL} = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
        },
      },
    },
    plugins: [
      createVuePlugin({
        jsx: true,
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: true,
      }),
      createSvgPlugin(),
    ],

    build: {
      cssCodeSplit: false,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      //https: true,
      proxy: {
        '/dev-api': {
          // 用于开发环境下的转发请求
          // 更多请参考：https://vitejs.dev/config/#server-proxy
          target: 'http://ecs.gpg123.vip:9099',
          ws: true,        //如果要代理 websockets，配置这个参数
          rewrite: (path) => path.replace("^/dev-api", '/'),
          changeOrigin: true,
        },
        "/prod-api": {
          // 用于开发环境下的转发请求
          // 更多请参考：https://vitejs.dev/config/#server-proxy
          target: "http://ecs.gpg123.vip:9099",
          ws: true,        //如果要代理 websockets，配置这个参数
          rewrite: (path) => path.replace("^/prod-api", '/'),
          changeOrigin: true,
        },
        "/gitee-api": {
          target: "https://gitee.com/api/v5/",
          rewrite: (path) => path.replace("^/gitee-api", "/"),
          changeOrigin: true
        }
      },
    },
  };
};
