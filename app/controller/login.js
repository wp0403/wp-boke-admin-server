/*
 * @Descripttion: 登陆注册
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-08 23:05:36
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 10:21:09
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

    const { type, data, auth, dict } = await this.service.login.getUser({
      username,
      password: md5(password),
    });

    if (type === 1) {
      const token = ctx.helper.loginToken(
        { username: data.username, uid: data.uid },
        7200
      );
      const dictObj = {};
      if (dict) {
        dict.forEach(
          // eslint-disable-next-line
          (item) => (dictObj[item.key] = eval("(" + item.value + ")"))
        );
      }
      ctx.body = {
        code: 200,
        data,
        meta: { token, auth, dict: dictObj },
      };
    } else {
      ctx.body = {
        code: 301,
        msg: data,
      };
    }
  }

  async createUser() {
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

    try {
      const data = await this.service.login.createUser({
        name: username,
        username,
        password: md5(password),
        uid: md5(`${new Date()}${username}`),
      });

      if (data) {
        ctx.body = {
          code: 200,
          data,
          msg: '创建用户成功，请联系管理员审核通过后使用',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '创建用户失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '创建用户失败',
        // data: e,
      };
    }
  }
}

module.exports = LoginController;
