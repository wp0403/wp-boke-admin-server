/*
 * @Descripttion: 用户
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-06 11:39:35
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-08-22 16:41:49
 */
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 根据关键字获取用户列表
  async searchUserList() {
    const { ctx } = this;
    // 解构参数
    const { keyword } = ctx.request.query;

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
  // 获取用户列表
  async getUserList() {
    const { ctx } = this;
    // 解构参数
    const { username, state, email } = ctx.request.query;

    await this.service.user
      ._getUserList({ username, state, email })
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '获取用户列表成功',
          ...data,
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
  // 修改用户状态
  async putUserToExamine() {
    const { ctx } = this;

    const { id, state } = ctx.request.body;

    if (!id || !state) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失数据',
      });
    }

    try {
      const isEdit = await ctx.service.user._putUserToExamine({
        id,
        state,
      });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '用户状态修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '用户状态修改失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '用户状态修改失败',
        // data: e,
      };
    }
  }
}

module.exports = UserController;
