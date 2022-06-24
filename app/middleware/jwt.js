/* eslint-disable strict */
/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 张三
 * @Date: 2021-07-10 11:32:33
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-20 16:26:43
 */
const whiteList = [ '/vcode', '/login' ];
const jwt = require('jsonwebtoken');

module.exports = () => {
  return async (ctx, next) => {
    if (whiteList.some(item => ctx.request.url.includes(item))) {
      await next();
      return;
    }
    const token = ctx.request.header.authorization;

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: '请登陆后再进行操作',
      };
      return;
    }

    try {
      const userInfo = jwt.verify(token, 'wp0403');
      ctx.session.userInfo = userInfo;
      await next();
    } catch (e) {
      ctx.status = 402;
      ctx.body = {
        code: 402,
        msg: '登录状态已过期',
        error: e,
      };
      return;
    }
  };
};