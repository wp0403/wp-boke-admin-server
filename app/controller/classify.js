/*
 * @Descripttion: 博文
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:09:45
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-09-05 16:15:41
 */
'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class ClassifyController extends Controller {
  // 获取博文列表
  async getList() {
    const { ctx } = this;
    // 解构参数
    const {
      title,
      classify_id,
      classify_sub_id,
      desc,
      type,
      isDelete,
      author,
      page,
      page_size,
    } = ctx.request.query;

    await this.service.classify
      .getList({
        title,
        classify_id,
        classify_sub_id,
        desc,
        type,
        isDelete,
        author,
        page,
        page_size,
      })
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '博文列表数据获取成功',
          ...data,
        };
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '博文列表数据获取失败',
        };
      });
  }
  // 修改是否精选
  async isSelectedFun() {
    const { ctx } = this;
    // 解构参数
    const { id, selected } = ctx.request.body;

    await this.service.classify
      .isSelectedFun({ id, selected })
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '设置成功',
          data,
        };
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '设置失败',
        };
      });
  }
  // 是否放入回收站
  async delBowenList() {
    const { ctx } = this;
    // 解构参数
    const { id, isDelete } = ctx.request.body;

    await this.service.classify
      .delBowenList({ id, isDelete })
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data,
        };
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '操作失败',
        };
      });
  }
  // 获取博文详情数据
  async getClassifyDetails() {
    const { ctx } = this;

    const { id } = ctx.request.query;

    if (!id) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失详情id',
      });
    }

    try {
      const classifyList = await ctx.service.classify._getClassifyDetails(id);
      if (classifyList) {
        ctx.body = {
          code: 200,
          msg: '博文详情数据获取成功',
          data: classifyList,
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '该数据已过期',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '博文详情数据获取失败',
        // data: e,
      };
    }
  }
  // 更新博文详情数据
  async putClassifyDetails() {
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
      const isEdit = await ctx.service.classify._putClassifyDetails({ ...obj, type: 3 });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '博文详情数据修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '博文详情数据修改失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '博文详情数据修改失败',
        // data: e,
      };
    }
  }
  // 修改博文审核状态
  async putClassifyToExamine() {
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
      const isEdit = await ctx.service.classify._putClassifyToExamine({
        id,
        type,
      });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '博文修改审核成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '博文修改审核失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '博文详情数据修改失败',
        // data: e,
      };
    }
  }
  // 新增博文
  async createClassifyDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;
    if (!obj || !Object.keys(obj)) {
      ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
      return;
    }

    try {
      const data = await ctx.service.classify._createClassifyDetails(obj);
      if (data) {
        ctx.body = {
          code: 200,
          data,
          msg: '新增博文成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '新增博文失败',
          // data: e,
        };
      }
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 305,
        msg: '新增博文失败',
        // data: e,
      };
    }
  }
  // 删除博文
  async deleteClassifyDetails() {
    const { ctx } = this;

    const { id } = ctx.request.body;

    try {
      const token = ctx.request.header.authorization;
      const userInfo = jwt.verify(token, 'wp0403');
      const arr = await ctx.service.auth.index(userInfo.data.userId);

      if (!arr.includes(3)) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isEdit = await ctx.service.classify._deleteClassifyDetails(id);

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '博文删除成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '博文删除失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '博文删除失败',
        // data: e,
      };
    }
  }
}

module.exports = ClassifyController;
