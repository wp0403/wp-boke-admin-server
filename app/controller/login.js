'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx } = this;

    const { username, password } = ctx.request.body;

    if (username && password) {
      ctx.status = 200;
      ctx.body = '登陆成功';
    } else {
      ctx.status = 400;
      ctx.body = '请正确输入用户名和密码';
    }
  }
}

module.exports = LoginController;
