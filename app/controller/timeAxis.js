/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-09-05 14:43:42
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-18 18:47:44
 */
'use strict';

const Controller = require('egg').Controller;

class TimeAxisController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { type, content, author_id, page, page_size } = ctx.request.query;

    const isAuth = await this.service.auth.isAuth('read@classify');

    let authorId = author_id;

    if (!isAuth) {
      const { data: { uid } } = this.ctx.session.userInfo;
      authorId = uid;
    }

    await this.service.timeAxis.getList({ type, content, author_id: authorId, page, page_size }).then(data => {
      ctx.body = {
        code: 200,
        msg: '网站时间轴列表数据获取成功',
        ...data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '网站时间轴列表数据获取失败',
      };
    });
  }
  // 更新网站时间轴详情数据
  async putTimeAxisDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;

    if (!obj) {
      // eslint-disable-next-line no-return-assign
      return ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
    }

    const isAuth = await this.service.auth.isAuth('edit@classify');
    const { data: { uid } } = this.ctx.session.userInfo;
    if (obj.author_id !== uid && !isAuth) {
      ctx.body = {
        code: 305,
        msg: '您暂无该权限，请联系管理员操作',
        // data: e,
      };
      return;
    }

    try {
      const isUpdate = await this.service.auth.isAuth('update@time');

      !isUpdate && delete obj.create_time;
      !isUpdate && delete obj.update_time;
      const isEdit = await ctx.service.timeAxis._putTimeAxisDetails({ ...obj, type: 3 });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '网站时间轴详情数据修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '网站时间轴详情数据修改失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '网站时间轴详情数据修改失败',
        // data: e,
      };
    }
  }
  // 修改网站时间轴审核状态
  async putTimeAxisToExamine() {
    const { ctx } = this;

    const { id, type } = ctx.request.body;

    if (!id || !type) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失数据',
      });
    }

    try {
      const isAuth = await this.service.auth.isAuth('toExamine@timeAxis');

      if (!isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isEdit = await ctx.service.timeAxis._putTimeAxisToExamine({
        id,
        type,
      });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '网站时间轴修改审核成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '网站时间轴修改审核失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '网站时间轴详情数据修改失败',
        // data: e,
      };
    }
  }
  // 新增网站时间轴
  async createTimeAxisDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;

    const isAuth = await this.service.auth.isAuth('create@timeAxis');

    if (!isAuth) {
      ctx.body = {
        code: 305,
        msg: '您暂无该权限，请联系管理员操作',
        // data: e,
      };
      return;
    }

    if (!obj || !Object.keys(obj)) {
      // eslint-disable-next-line no-return-assign
      return ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
    }

    try {
      const isUpdate = await this.service.auth.isAuth('update@time');

      !isUpdate && delete obj.create_time;
      !isUpdate && delete obj.update_time;
      const data = await ctx.service.timeAxis._createTimeAxisDetails(obj);

      if (data) {
        ctx.body = {
          code: 200,
          data,
          msg: '新增成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '新增失败',
          // data: e,
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 305,
        msg: '新增失败',
        // data: e,
      };
    }
  }
  // 删除网站时间轴
  async deleteTimeAxisDetails() {
    const { ctx } = this;

    const { id } = ctx.request.body;

    try {
      const isAuth = await this.service.auth.isAuth('delete@timeAxis');

      if (!isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isEdit = await ctx.service.timeAxis._deleteTimeAxisDetails(id);

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '删除成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '删除失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '删除失败',
        // data: e,
      };
    }
  }
}

module.exports = TimeAxisController;
