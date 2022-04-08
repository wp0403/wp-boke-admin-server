/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649383511859_2091';

  // add your middleware config here
  config.middleware = [ 'notfoundHandler', 'jwt', 'gzip' ];

  // 配置 gzip 中间件的配置
  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: 'bj-cynosdbmysql-grp-rs4qkbui.sql.tencentcdb.com',
        // 端口号
        port: '22520',
        // 用户名
        user: 'readOnly',
        // 密码
        password: 'Wp201314',
        // 数据库名
        database: 'myboke',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    onerror: {
      all(err, ctx) {
        // 在此处定义针对所有响应类型的错误处理方法
        // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
        ctx.body = 'error';
        ctx.status = 500;
      },
      html(err, ctx) {
        // html hander
        ctx.body = '<h3>error</h3>';
        ctx.status = 500;
      },
      json(err, ctx) {
        // json hander
        ctx.body = { message: 'error' };
        ctx.status = 500;
      },
      jsonp(err, ctx) {
        console.log(err, ctx);
        // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
      },
    },
    notfound: {
      pageUrl: '/404.html',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
