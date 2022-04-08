/* eslint-disable strict */
/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 张三
 * @Date: 2021-07-10 11:32:33
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-04-08 10:47:56
 */
const whiteList = [ '/login' ];
const jwt = require('jsonwebtoken');
module.exports = () => {
  return async (ctx, next) => {
    if (whiteList.some(item => ctx.request.url.includes(item))) {
      await next();
      return;
    }

    const token = ctx.request.header.authorization;

    if (!token) {
      ctx.body = {
        code: 401,
        msg: '没有访问权限',
      };
      ctx.status = 401;
      return;
    }

    try {
      const userInfo = jwt.verify(token, 'wp0403');
      ctx.userInfo = userInfo;
      await next();
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '校验失败',
        error: e,
      };
      return;
    }
  };
};
