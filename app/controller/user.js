/*
 * @Descripttion: 用户
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-06 11:39:35
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-07-06 11:53:52
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 根据关键字获取用户列表
  async searchUserList() {
    const { ctx } = this;
    // 解构参数
    const { keyword } = ctx.request.query;

    if (!keyword) {
      ctx.body = {
        code: 304,
        msg: '请输入关键字搜索',
      };
      return;
    }
    await this.service.user
      ._searchUserList(keyword)
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '获取用户列表成功',
          data,
        };
      })
      .catch(e => {
        ctx.body = {
          code: 300,
          msg: '获取用户列表失败',
        };
        console.log(e);
      });
  }
}

module.exports = UserController;
