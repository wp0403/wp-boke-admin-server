/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-09-05 14:40:45
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 12:51:20
 */
'use strict';

const Service = require('egg').Service;

class TimeAxisService extends Service {
  // 获取时间轴列表
  async getList(obj) {
    // 解构参数
    const { sortKey, sortOrder, type, author_id, content, page = 1, page_size = 10 } = obj;

    let sql = 'select * from time_axis';
    let num = 'select count(*) from time_axis';
    const cont = [];// 参数
    let isMore = false;// 是否有多个查询参数
    /**
     * @模糊查询-量大的时候效率低
     * select * from user where name like ? % 内容 %
     * 在user表中全局查找name值 == 内容的
     * % 内容 % 全局查找内容
     *   内容 %  查找以 内容 开头的数据
     * */
    if (content) {
      sql += ' where content like ?';
      num += ' where content like ?';
      cont.push('%' + content + '%');
      isMore = true;
    }
    if (author_id) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and author_id IN (?)'; // and是两个条件都必须满足，or是或的关系
        num += 'and author_id IN (?)';
      } else {
        sql += ' WHERE author_id IN (?)';
        num += ' WHERE author_id IN (?)';
      }
      content.push(author_id);
      isMore = true;
    }
    if (type) {
      if (isMore) { // true代表有多个参数
        sql += 'and type IN ?';// and是两个条件都必须满足，or是或的关系
        num += 'and type IN ?';
      } else {
        sql += ' WHERE type IN ?';
        num += ' WHERE type IN ?';
      }
      cont.push(type);
      isMore = true;
    }

    // 开启排序
    if (!sortKey || !sortOrder) {
      sql += ' order by id desc';
    } else {
      sql += ` order by ${sortKey} ${sortOrder}`;
    }

    // 开启分页
    if (page || page_size) {
      const current = page;// 当前页码
      const pageSize = page_size;// 一页展示多少条数据
      sql += ' limit ?,?';
      cont.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const timeAxisList = await this.app.mysql.query(
      sql, cont
    );

    const timeAxisListNum = await this.app.mysql.query(
      num, cont
    );

    return {
      data: timeAxisList,
      meta: {
        page,
        page_size,
        total: timeAxisListNum[0]['count(*)'],
      },
    };
  }
  // 编辑网站时间轴详情
  async _putTimeAxisDetails(obj) {
    const result = await this.app.mysql.update('time_axis', obj);

    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 修改网站时间轴审核状态
  async _putTimeAxisToExamine(obj) {
    const { id, type } = obj;

    // 查找对应的数据
    const result = await this.app.mysql.update('time_axis', { id, type: +type }); // 更新 Bowen 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 新增网站时间轴
  async _createTimeAxisDetails(obj) {
    const result = await this.app.mysql.insert('time_axis', obj);
    // 判断更新成功
    return result.affectedRows === 1 ? result.insertId : false;
  }
  // 删除网站时间轴
  async _deleteTimeAxisDetails(id) {
    const result = await this.app.mysql.delete('time_axis', {
      id,
    });
      // 判断删除成功
    return result.affectedRows === 1;
  }
}

module.exports = TimeAxisService;
