/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-09 16:18:28
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-30 17:59:00
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUser({ username, password }) {
    const userItem = await this.app.mysql.get('admin', { username });

    if (!userItem) {
      return {
        type: 2,
        data: '该用户不存在',
      };
    }
    const adminRoleItem = await this.app.mysql.get('admin_role', { aid: userItem.id });
    const roleItem = await this.app.mysql.get('role', { id: adminRoleItem.rid });
    const rolePermissionsItem = await this.app.mysql.get('role_permissions', { rid: roleItem.id });
    const permissionsItem = await this.app.mysql.select('permissions', { where: { id: rolePermissionsItem.pid.split(',') } });
    // 获取字典对象
    const dictList = await this.app.mysql.get('dict_table', { id: 1 });
    if (userItem.password === password) {
      delete userItem.password;
      return {
        type: 1,
        data: userItem,
        auth: permissionsItem[0],
        dict: dictList,
      };
    }
    return {
      type: 3,
      data: '密码错误，请重新输入',
    };

  }
}

module.exports = UserService;
