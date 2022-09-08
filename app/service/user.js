/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-06 11:40:04
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-09-01 11:47:43
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async _searchUserList(keyword) {
    if (!keyword) {
      return await this.app.mysql.select('admin', {
        columns: [ 'id', 'name', 'username', 'email', 'phone', 'website' ],
      });
    }

    return await this.app.mysql.query(
      'select id,name,username,email,phone,website from admin where name like ?',
      [ `%${keyword}%` ]
    );
  }
  // 获取用户列表
  async _getUserList(obj) {
    // 解构参数
    const {
      username,
      email,
      state,
      sortKey,
      sortOrder,
      page = 1,
      page_size = 10,
    } = obj;

    let sql =
      'select id,name,username,email,phone,website,create_time,last_edit_time,state,role_id from admin';
    let num = 'select count(*) from admin';
    const content = []; // 参数
    let isMore = false; // 是否有多个查询参数
    /**
     * @模糊查询-量大的时候效率低
     * select * from user where name like ? % 内容 %
     * 在user表中全局查找name值 == 内容的
     * % 内容 % 全局查找内容
     *   内容 %  查找以 内容 开头的数据
     * */
    if (username) {
      sql += ' where username like ?';
      num += ' where username like ?';
      content.push('%' + username + '%');
      isMore = true;
    }
    if (email) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and email LIKE ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and email LIKE ?';
      } else {
        sql += ' WHERE email LIKE ?';
        num += ' WHERE email LIKE ?';
      }
      content.push('%' + email + '%');
      isMore = true;
    }
    if (state) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and state == ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and state == ?';
      } else {
        sql += ' WHERE state == ?';
        num += ' WHERE state == ?';
      }
      content.push(state);
      isMore = true;
    }

    // 开启排序
    if (sortKey && sortOrder) {
      sql += ` order by ${sortKey} ${sortOrder}`;
    }

    // 开启分页
    if (page || page_size) {
      const current = page; // 当前页码
      const pageSize = page_size; // 一页展示多少条数据
      sql += ' limit ?,?';
      content.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const userList = await this.app.mysql.query(sql, content);

    const userListNum = await this.app.mysql.query(num, content);

    return {
      data: userList,
      meta: {
        page,
        page_size,
        total: userListNum[0]['count(*)'],
      },
    };
  }
  // 修改用户审核状态
  async _putUserToExamine(obj) {
    const { id, state } = obj;
    // 查找对应的数据
    const result = await this.app.mysql.update('admin', { id, state: +state }); // 更新 admin 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 获取用户详情
  async _getUserDetails(id) {
    const arr = await this.app.mysql.select('admin', {
      where: { id },
      columns: [
        'id',
        'name',
        'username',
        'email',
        'phone',
        'website',
        'create_time',
        'last_edit_time',
        'state',
        'role_id',
        'qq',
        'weixin',
        'github',
        'title',
        'desc',
        'about',
        'aboutTags',
        'secret_guide',
        'about_page',
        'img',
      ],
    });

    return arr[0];
  }
  // 修改用户详情
  async _putUserDetails(obj) {
    const result = await this.app.mysql.update('admin', { id: obj.id, ...obj });

    // 判断更新成功
    return result.affectedRows === 1;
  }
}

module.exports = UserService;
