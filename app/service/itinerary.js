/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-24 10:56:32
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-17 12:00:22
 */
'use strict';

const Service = require('egg').Service;

class ItineraryService extends Service {
  async getList(obj) {
    // 解构参数 timeData,
    const { place, title, author_id, content, page = 1, page_size = 10 } = obj;
    let sql = 'select * from playList';
    let num = 'select count(*) from playList';
    const cont = []; // 参数
    let isMore = false; // 是否有多个查询参数
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
      cont.push('%' + title + '%');
      isMore = true;
    }
    if (place) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and place LIKE ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and place LIKE ?';
      } else {
        sql += ' WHERE place LIKE ?';
        num += ' WHERE place LIKE ?';
      }
      cont.push('%' + place + '%');
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
    if (content) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and content IN ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and content IN ?';
      } else {
        sql += ' WHERE content IN ?';
        num += ' WHERE content IN ?';
      }
      cont.push(content);
      isMore = true;
    }

    if (isMore) {
      // true代表有多个参数
      sql += 'and isDelete != ?'; // and是两个条件都必须满足，or是或的关系
      num += 'and isDelete != ?';
    } else {
      sql += ' WHERE isDelete != ?';
      num += ' WHERE isDelete != ?';
    }
    cont.push(1);

    // 开启分页
    if (page || page_size) {
      const current = page; // 当前页码
      const pageSize = page_size; // 一页展示多少条数据
      sql += ' limit ?,?';
      cont.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const bowenList = await this.app.mysql.query(sql, cont);

    const bowenListNum = await this.app.mysql.query(num, cont);

    return {
      data: bowenList.map(item => ({
        ...item,
        // eslint-disable-next-line no-eval
        imgs: eval('(' + item.imgs + ')'),
      })),
      meta: {
        page,
        page_size,
        total: bowenListNum[0]['count(*)'],
      },
    };
  }

  // 获取详情
  async _getItinerary(id) {
    return await this.app.mysql.get('playList', { id });
  }
}

module.exports = ItineraryService;
