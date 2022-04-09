/*
 * @Descripttion: 
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-09 16:18:28
 * @LastEditors: 王鹏
 * @LastEditTime: 2022-04-09 17:10:28
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async getUser({ username, password }) {
        const userItem = await this.app.mysql.get('admin', { username });

        if (!userItem) {
            return {
                type: 2,
                data: '该用户不存在'
            };
        }
        if (userItem.password === password) {
            delete userItem.password;
            return {
                type: 1,
                data: userItem
            };
        } else {
            return {
                type: 3,
                data: '密码错误，请重新输入'
            };
        }
    }
}

module.exports = UserService;