/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-24 10:56:08
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-24 13:36:28
 */
'use strict';

const Controller = require('egg').Controller;

class ItineraryController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { place, title, content, timeData, page, page_size } = ctx.request.query;

    await this.service.itinerary.getList({ place, title, content, timeData, page, page_size }).then(data => {
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
}

module.exports = ItineraryController;
