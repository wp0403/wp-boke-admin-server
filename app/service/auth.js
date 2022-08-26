/*
 * @Descripttion: 权限判断
 * @version:
 * @Author: WangPeng
 * @Date: 2022-08-26 10:42:46
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-08-26 11:27:02
 */
'use strict';

const Service = require('egg').Service;

class AuthService extends Service {
  async index(userId) {
    const admin_role = await this.app.mysql.get('admin_role', { aid: userId });
    const role = await this.app.mysql.get('role', { role_level: admin_role.rid });
    const role_permissions = await this.app.mysql.get('role_permissions', { rid: role.id });
    if (!role_permissions.pid) return [];
    const authList = role_permissions.pid
      ? role_permissions.pid.split(',')
      : [];
    const permissions = await this.app.mysql.select('permissions', {
      where: { id: authList },
    });

    return permissions.map(item => item.id);
  }
}

module.exports = AuthService;
