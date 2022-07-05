/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:09:45
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-07-05 18:04:13
 */
'use strict';

const Controller = require('egg').Controller;

class ClassifyController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { title, classify_id, classify_sub_id, desc, isDelete, author, page, page_size } = ctx.request.query;

    await this.service.classify.getList({ title, classify_id, classify_sub_id, desc, isDelete, author, page, page_size }).then(data => {
      ctx.body = {
        code: 200,
        msg: '博文列表数据获取成功',
        ...data,
      };
    }).catch(e => {
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

    await this.service.classify.isSelectedFun({ id, selected }).then(data => {
      ctx.body = {
        code: 200,
        msg: '设置成功',
        data,
      };
    }).catch(e => {
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

    await this.service.classify.delBowenList({ id, isDelete }).then(data => {
      ctx.body = {
        code: 200,
        msg: '操作成功',
        data,
      };
    }).catch(e => {
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
      return ctx.body = {
        code: 304,
        msg: '缺失详情id',
      };
    }

    try {
      const classifyList = await ctx.service.classify._getClassifyDetails(id);

      ctx.body = {
        code: 200,
        msg: '博文详情数据获取成功',
        data: classifyList,
      };
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
      return ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
    }

    try {
      const isEdit = await ctx.service.classify._putClassifyDetails(obj);

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
}

module.exports = ClassifyController;
