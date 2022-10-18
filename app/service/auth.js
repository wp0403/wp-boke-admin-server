/*
 * @Descripttion: 权限判断
 * @version:
 * @Author: WangPeng
 * @Date: 2022-08-26 10:42:46
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 10:42:16
 */
'use strict';

const Service = require('egg').Service;

class AuthService extends Service {
  async isAuth(authName) {
    const { data: { uid } } = this.ctx.session.userInfo;
    const admin_role = await this.app.mysql.get('admin_role', { aid: uid });
    const role = await this.app.mysql.get('role', { role_level: admin_role.rid });
    const role_permissions = await this.app.mysql.get('role_permissions', { rid: role.id });
    if (!role_permissions.pid) return false;
    const authList = role_permissions.pid
      ? role_permissions.pid.split(',')
      : [];
    const permissions = await this.app.mysql.select('permissions', {
      where: { id: authList },
    });

    return permissions.some(item => item.authName === authName);
  }
}

module.exports = AuthService;
