/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-05 13:53:41
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-07-05 14:30:08
 */
'use strict';

const Service = require('egg').Service;

class CosService extends Service {
  // 获取腾讯云对象存储的key和value
  async getCosKey() {
    return await this.app.mysql.select('data_base', {
      where: { key: [ 'SecretId', 'SecretKey' ] }, // WHERE 条件
    });
  }
}

module.exports = CosService;
