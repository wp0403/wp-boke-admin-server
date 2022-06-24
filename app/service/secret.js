/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:10:33
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-24 16:49:30
 */
'use strict';

const Service = require('egg').Service;

class SecretService extends Service {
  // 获取列表数据
  async getList(obj) {
    // 解构参数time_str,
    const { author, type, content, sortKey = 'isTop', sortOrder = 'desc', page = 1, page_size = 10 } = obj;

    let sql = 'select * from secretList';
    let num = 'select count(*) from secretList';
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
    if (author) {
      if (isMore) { // true代表有多个参数
        sql += 'and author LIKE ?';// and是两个条件都必须满足，or是或的关系
        num += 'and author LIKE ?';
      } else {
        sql += ' WHERE author LIKE ?';
        num += ' WHERE author LIKE ?';
      }
      cont.push('%' + author + '%');
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

    if (isMore) { // true代表有多个参数
      sql += 'and isDelete != ?';// and是两个条件都必须满足，or是或的关系
      num += 'and isDelete != ?';
    } else {
      sql += ' WHERE isDelete != ?';
      num += ' WHERE isDelete != ?';
    }
    cont.push(1);

    // 开启排序
    if (sortKey && sortOrder) {
      sql += ` order by ${sortKey} ${sortOrder}`;
    }

    // 开启分页
    if (page || page_size) {
      const current = page;// 当前页码
      const pageSize = page_size;// 一页展示多少条数据
      sql += ' limit ?,?';
      cont.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const secretList = await this.app.mysql.query(
      sql, cont
    );

    const secretListNum = await this.app.mysql.query(
      num, cont
    );

    return {
      data: secretList,
      meta: {
        page,
        page_size,
        total: secretListNum[0]['count(*)'],
      },
    };
  }
  // 是否置顶事件
  async isTopFun(obj) {
    const { id, isTop } = obj;

    // 查找对应的数据
    const result = await this.app.mysql.update('secretList', { id, isTop: isTop ? 1 : 0 }); // 更新 secretList 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
}

module.exports = SecretService;