/*
 * @Descripttion: 旅行日记
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-24 10:56:08
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 12:28:08
 */
'use strict';

const Controller = require('egg').Controller;

class ItineraryController extends Controller {
  // 获取旅行日记列表
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { place, title, content, timeData, author_id, page, page_size } = ctx.request.query;

    const isAuth = await this.service.auth.isAuth('read@play');

    let authorId = author_id;

    if (!isAuth) {
      const { data: { uid } } = this.ctx.session.userInfo;
      authorId = uid;
    }

    await this.service.itinerary.getList({ place, title, content, timeData, author_id: authorId, page, page_size }).then(data => {
      ctx.body = {
        code: 200,
        msg: '旅行日记列表数据获取成功',
        ...data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '旅行日记列表数据获取失败',
      };
    });
  }

  // 获取详情数据
  async getItineraryDetails() {
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
      const itineraryDetails = await ctx.service.itinerary._getItinerary(id);
      const isAuth = await this.service.auth.isAuth('read@play');
      const { data: { uid } } = this.ctx.session.userInfo;

      if (itineraryDetails.author_id !== uid && !isAuth) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }
      if (itineraryDetails) {
        // eslint-disable-next-line no-eval
        itineraryDetails.imgs = eval('(' + itineraryDetails.imgs + ')');
        ctx.body = {
          code: 200,
          msg: '详情数据获取成功',
          data: itineraryDetails,
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
        msg: '详情数据获取失败',
        // data: e,
      };
    }
  }
}

module.exports = ItineraryController;
