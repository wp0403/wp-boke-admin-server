/*
 * @Descripttion: 用户
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-06 11:39:35
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-19 21:38:52
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

    const isAuth = await this.service.auth.isAuth('read@user');

    if (!isAuth) {
      ctx.body = {
        code: 305,
        msg: '您暂无该权限，请联系管理员操作',
        // data: e,
      };
      return;
    }

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
      const isAuth = await this.service.auth.isAuth('toExamine@user');

      if (!isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

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
  // 修改用户角色
  async putUserState() {
    const { ctx } = this;

    const { uid, role_id } = ctx.request.body;

    if (!uid || !role_id) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失数据',
      });
    }

    try {
      const isAuth = await this.service.auth.isAuth('edit@user');

      if (!isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isEdit = await ctx.service.user._putUserState({
        uid,
        role_id,
      });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '用户角色修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '用户角色修改失败',
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
  // 根据id获取用户详情
  async getUserDetails() {
    const { ctx } = this;

    // 解构参数
    const { id } = ctx.request.query;

    if (!id) {
      ctx.body = {
        code: 304,
        msg: '缺少用户id',
      };
      return;
    }

    try {
      const obj = await this.service.user._getUserDetails(id);
      const isAuth = await this.service.auth.isAuth('read@user');
      const {
        data: { uid },
      } = this.ctx.session.userInfo;

      if (obj.uid !== uid && !isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      ctx.body = {
        code: 200,
        data: obj,
        msg: '查询用户详情成功',
      };
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '查询用户详情失败',
      };
    }
  }
  // 更新用户详情数据
  async putUserDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;

    if (!obj) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      });
    }
    try {
      const isAuth = await this.service.auth.isAuth('edit@user');
      const {
        data: { uid },
      } = this.ctx.session.userInfo;

      if (obj.uid !== uid && !isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isUpdate = await this.service.auth.isAuth('update@time');

      !isUpdate && delete obj.create_time;
      !isUpdate && (obj.last_edit_time = new Date());

      const isEdit = await ctx.service.user._putUserDetails(obj);

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '用户详情数据修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '用户详情数据修改失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '用户详情数据修改失败',
        // data: e,
      };
    }
  }
}

module.exports = UserController;
