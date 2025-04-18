export default {
  development: {
    // 开发环境接口请求
    NAME: "development",
    API: 'http://localhost:9099',
    PATH: "", //"/dev-api/",
    // 开发环境 cdn 路径
    CDN: '',
    changeOrigin: true
  },
  prod: {
    // 生产环境接口请求
    NAME: "prod",
    API: 'https://my-server.gpg123.vip',
    PATH: "", //"/prod-api/",
    // 开发环境 cdn 路径
    CDN: '',
    changeOrigin: true
  },
  k8s: {
    // 生产环境接口请求
    NAME: "k8s",
    API: 'https://cloud-server-k8s.gpg123.vip',
    PATH: "", //"/prod-api/",
    // 开发环境 cdn 路径
    CDN: '',
    changeOrigin: true
  },
  test: {
    // 测试环境接口地址
    API: 'http://ecs.gpg123.vip:9099',
    // 测试环境 cdn 路径
    PATH: "",
    CDN: '',
    changeOrigin: true
  },
  release: {
    NAME: "test",
    // 正式环境接口地址
    API: 'http://ecs.gpg123.vip:9099',
    // 正式环境 cdn 路径
    PATH: "",
    CDN: '',
    changeOrigin: true
  },
  site: {
    NAME: "site",
    // 正式环境接口地址
    API: 'http://ecs.gpg123.vip:9099',
    // 正式环境 cdn 路径
    PATH: "",
    CDN: '',
    changeOrigin: true
  },
};
