/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-23 16:31:01
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-24 16:25:34
 */
'use strict';

const Controller = require('egg').Controller;

class SecretController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { author, type, content, time_str, page, page_size } = ctx.request.query;

    await this.service.secret.getList({ author, type, content, time_str, page, page_size }).then(data => {
      ctx.body = {
        code: 200,
        msg: '树洞列表数据获取成功',
        ...data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '树洞列表数据获取失败',
      };
    });
  }
  // 修改是否置顶
  async isTopFun() {
    const { ctx } = this;
    // 解构参数
    const { id, isTop } = ctx.request.body;

    await this.service.secret.isTopFun({ id, isTop }).then(data => {
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
}

module.exports = SecretController;
