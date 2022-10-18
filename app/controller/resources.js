/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-09-06 09:48:52
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 12:30:30
 */
'use strict';

const Controller = require('egg').Controller;

class ResourcesController extends Controller {
  // 批量写入图片
  async insertImgs() {
    const { ctx } = this;
    // 解构参数
    const list = ctx.request.body;

    try {
      const isTrue = await ctx.service.resources._insertImgs(list);

      if (isTrue) {
        ctx.body = {
          code: 200,
          msg: '数据导入成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '数据导入失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '数据导入失败',
        // data: e,
      };
    }
  }
  // 获取图片列表
  async getImgList() {
    const { ctx } = this;
    // 解构参数
    const {
      name,
      page,
      author_id,
      page_size,
    } = ctx.request.query;

    const isAuth = await this.service.auth.isAuth('read@img');

    let authorId = author_id;

    if (!isAuth) {
      const { data: { uid } } = this.ctx.session.userInfo;
      authorId = uid;
    }

    await this.service.resources
      ._getImgList({
        name,
        page,
        author_id: authorId,
        page_size,
      })
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '图片列表数据获取成功',
          ...data,
        };
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '图片列表数据获取失败',
        };
      });
  }
  // 单个写入图片
  async insertImg() {
    const { ctx } = this;
    // 解构参数
    const obj = ctx.request.body;

    try {
      const { data } = this.ctx.session.userInfo;
      const isTrue = await ctx.service.resources._insertImg({
        ...obj,
        author: data.username,
        author_id: data.uid,
      });

      if (isTrue) {
        ctx.body = {
          code: 200,
          msg: '数据导入成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '数据导入失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '数据导入失败',
        // data: e,
      };
    }
  }
}

module.exports = ResourcesController;
