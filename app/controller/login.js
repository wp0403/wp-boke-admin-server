/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-08 23:05:36
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-20 16:07:04
 */
'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5-node');

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    const { login_code } = ctx.session; // 获取session保存的验证码
    const { username, password, code } = ctx.request.body;
    // 判断是否输入了用户名和密码
    if (!username || !password) {
      ctx.body = {
        code: 400,
        data: '请正确输入用户名和密码',
      };
      return;
    }
    // 判断是否输入了验证码
    if (!code) {
      ctx.body = {
        code: 400,
        data: '请输入验证码',
      };
      return;
    }
    // 判断验证码是否输入正确
    const isTrue = code.toLowerCase() === login_code;
    if (!isTrue) {
      ctx.body = {
        code: 400,
        data: '验证码输入有误，请重新输入',
      };
      return;
    }

    const { type, data, auth } = await this.service.login.getUser({
      username,
      password: md5(password),
    });

    if (type === 1) {
      const token = ctx.helper.loginToken(
        { username, password: md5(password) },
        3600
      );

      ctx.body = {
        code: 200,
        data,
        meta: { token, auth },
      };
    } else {
      ctx.body = {
        code: 301,
        msg: data,
      };
    }
  }
}

module.exports = LoginController;
