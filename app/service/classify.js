/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:10:33
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-23 17:05:11
 */
'use strict';

const Service = require('egg').Service;

class ClassifyService extends Service {
  async getList(obj) {
    // 解构参数
    const { title, classify_id, classify_sub_id, desc, author, page = 1, page_size = 10 } = obj;

    let sql = 'select * from Bowen';
    let num = 'select count(*) from Bowen';
    const content = [];// 参数
    let isMore = false;// 是否有多个查询参数
    /**
     * @模糊查询-量大的时候效率低
     * select * from user where name like ? % 内容 %
     * 在user表中全局查找name值 == 内容的
     * % 内容 % 全局查找内容
     *   内容 %  查找以 内容 开头的数据
     * */
    if (title) {
      sql += ' where title like ?';
      num += ' where title like ?';
      content.push('%' + title + '%');
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
      content.push('%' + author + '%');
      isMore = true;
    }
    if (classify_id) {
      if (isMore) { // true代表有多个参数
        sql += 'and classify_id IN ?';// and是两个条件都必须满足，or是或的关系
        num += 'and classify_id IN ?';
      } else {
        sql += ' WHERE classify_id IN ?';
        num += ' WHERE classify_id IN ?';
      }
      content.push(classify_id);
      isMore = true;
    }
    if (classify_sub_id) {
      if (isMore) { // true代表有多个参数
        sql += 'and classify_sub_id IN ?';// and是两个条件都必须满足，or是或的关系
        num += 'and classify_sub_id IN ?';
      } else {
        sql += ' WHERE classify_sub_id IN ?';
        num += ' WHERE classify_sub_id IN ?';
      }
      content.push(classify_sub_id);
      isMore = true;
    }
    if (desc) {
      if (isMore) { // true代表有多个参数
        sql += 'and desc LIKE ?';// and是两个条件都必须满足，or是或的关系
        num += 'and desc LIKE ?';
      } else {
        sql += ' WHERE desc LIKE ?';
        num += ' WHERE desc LIKE ?';
      }
      content.push('%' + desc + '%');
      isMore = true;
    }

    if (isMore) { // true代表有多个参数
      sql += 'and isDelete != ?';// and是两个条件都必须满足，or是或的关系
      num += 'and isDelete != ?';
    } else {
      sql += ' WHERE isDelete != ?';
      num += ' WHERE isDelete != ?';
    }
    content.push(1);

    // 开启分页
    if (page || page_size) {
      const current = page;// 当前页码
      const pageSize = page_size;// 一页展示多少条数据
      sql += ' limit ?,?';
      content.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const bowenList = await this.app.mysql.query(
      sql, content
    );

    const bowenListNum = await this.app.mysql.query(
      num, content
    );

    return {
      data: bowenList,
      meta: {
        page,
        page_size,
        total: bowenListNum[0]['count(*)'],
      },
    };
  }
}

module.exports = ClassifyService;
