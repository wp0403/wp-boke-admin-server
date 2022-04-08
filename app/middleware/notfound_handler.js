/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-04-08 10:19:23
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-04-08 10:19:24
 */
// eslint-disable-next-line strict
module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      if (ctx.acceptJSON) {
        ctx.body = { error: 'Not Found' };
      } else {
        ctx.body = '<h1>Page Not Found</h1>';
      }
    }
  };
};
