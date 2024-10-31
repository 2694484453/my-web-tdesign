export default {
  development: {
    // 开发环境接口请求
    NAME: "development",
    API: 'http://ecs.gpg123.vip:9099',
    PATH: "", //"/dev-api/",
    // 开发环境 cdn 路径
    CDN: '',
  },
  prod: {
    // 生产环境接口请求
    NAME: "prod",
    //API: 'http://ecs.gpg123.vip:9099',
    API: 'https://my-server.gpg123.vip',
    PATH: "", //"/prod-api/",
    // 开发环境 cdn 路径
    CDN: '',
  },
  test: {
    // 测试环境接口地址
    API: 'https://service-exndqyuk-1257786608.gz.apigw.tencentcs.com',
    // 测试环境 cdn 路径
    PATH: "",
    CDN: '',
  },
  release: {
    NAME: "test",
    // 正式环境接口地址
    API: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com',
    // 正式环境 cdn 路径
    PATH: "",
    CDN: '',
  },
  site: {
    NAME: "site",
    // 正式环境接口地址
    API: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com',
    // 正式环境 cdn 路径
    PATH: "",
    CDN: '',
  },
};
