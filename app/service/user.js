/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-06 11:40:04
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-07-06 12:01:17
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async _searchUserList(keyword) {
    return await this.app.mysql.query(
      'select id,name,username,email,phone,website from admin where name like ?', [ `%${keyword}%` ]
    );
  }
}

module.exports = UserService;
