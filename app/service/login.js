/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-09 16:18:28
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-08-29 10:48:08
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 判断用户名和密码是否正确
  async getUser({ username, password }) {
    const userItem = await this.app.mysql.get('admin', { username });

    if (!userItem) {
      return {
        type: 2,
        data: '该用户不存在',
      };
    }
    if (userItem.password !== password) {
      return {
        type: 3,
        data: '密码错误，请重新输入',
      };
    }
    if (userItem.state !== 1) {
      return {
        type: 3,
        data: '账号状态异常，请联系管理员恢复',
      };
    }
    const adminRoleItem = await this.app.mysql.get('admin_role', {
      aid: userItem.id,
    });
    const roleItem = await this.app.mysql.get('role', {
      id: adminRoleItem.rid,
    });
    const rolePermissionsItem = await this.app.mysql.get('role_permissions', {
      rid: roleItem.id,
    });
    const permissionsItem = rolePermissionsItem.pid
      ? await this.app.mysql.select('permissions', {
        where: {
          id: rolePermissionsItem.pid.split(','),
        },
      })
      : '';
    // 获取字典对象
    const dictList = await this.app.mysql.select('dictList');

    delete userItem.password;
    return {
      type: 1,
      data: userItem,
      auth: permissionsItem && permissionsItem[0] ? permissionsItem : [],
      dict: dictList,
    };
  }
  // 注册用户
  async createUser(obj) {
    const result = await this.app.mysql.insert('admin', obj);
    const result1 = await this.app.mysql.insert('userData', {});
    if (result.affectedRows === 1 && result1 === 1) {
      await this.app.mysql.insert('admin_role', {
        aid: result.insertId,
        rid: 1,
      });
    }
    // 判断更新成功
    return result.affectedRows === 1 ? result.insertId : false;
  }
}

module.exports = UserService;
