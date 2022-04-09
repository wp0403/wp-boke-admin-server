/*
 * @Descripttion: 
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-08 23:05:36
 * @LastEditors: 王鹏
 * @LastEditTime: 2022-04-09 17:50:50
 */
'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5-node');

class LoginController extends Controller {
  async index() {
    const {
      ctx
    } = this;

    const {
      username,
      password
    } = ctx.request.body;

    if (username && password) {
      const { type, data } = await this.service.login.getUser({
        username,
        password: md5(password)
      });

      if (type === 1) {
        const token = ctx.helper.loginToken({username,password:md5(password)},3600);

        ctx.status = 200;
        ctx.body = {
          code: 200,
          data,
          meta: {token}
        };
      } else {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          data,
        };
      }


    } else {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        data: '请正确输入用户名和密码'
      };
    }
  }
}

module.exports = LoginController;