/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:09:45
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-23 17:28:14
 */
'use strict';

const Controller = require('egg').Controller;

class ClassifyController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { title, classify_id, classify_sub_id, desc, author, page, page_size } = ctx.request.query;

    await this.service.classify.getList({ title, classify_id, classify_sub_id, desc, author, page, page_size }).then(data => {
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
}

module.exports = ClassifyController;
