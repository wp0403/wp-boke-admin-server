/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-21 11:10:33
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-08-26 09:46:54
 */
'use strict';

const Service = require('egg').Service;

class ClassifyService extends Service {
  async getList(obj) {
    // 解构参数
    const {
      title,
      classify_id,
      classify_sub_id,
      desc,
      isDelete = 1,
      type,
      sortKey,
      sortOrder,
      author,
      page = 1,
      page_size = 10,
    } = obj;

    let sql = 'select * from Bowen';
    let num = 'select count(*) from Bowen';
    const content = []; // 参数
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
      content.push('%' + title + '%');
      isMore = true;
    }
    if (author) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and author LIKE ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and author LIKE ?';
      } else {
        sql += ' WHERE author LIKE ?';
        num += ' WHERE author LIKE ?';
      }
      content.push('%' + author + '%');
      isMore = true;
    }
    if (classify_id) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and classify_id IN (?)'; // and是两个条件都必须满足，or是或的关系
        num += 'and classify_id IN (?)';
      } else {
        sql += ' WHERE classify_id IN (?)';
        num += ' WHERE classify_id IN (?)';
      }
      content.push(classify_id);
      isMore = true;
    }
    if (classify_sub_id) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and classify_sub_id IN (?)'; // and是两个条件都必须满足，or是或的关系
        num += 'and classify_sub_id IN (?)';
      } else {
        sql += ' WHERE classify_sub_id IN (?)';
        num += ' WHERE classify_sub_id IN (?)';
      }
      content.push(classify_sub_id);
      isMore = true;
    }
    if (desc) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and desc LIKE ?'; // and是两个条件都必须满足，or是或的关系
        num += 'and desc LIKE ?';
      } else {
        sql += ' WHERE desc LIKE ?';
        num += ' WHERE desc LIKE ?';
      }
      content.push('%' + desc + '%');
      isMore = true;
    }
    if (type) {
      if (isMore) {
        // true代表有多个参数
        sql += 'and type IN (?)'; // and是两个条件都必须满足，or是或的关系
        num += 'and type IN (?)';
      } else {
        sql += ' WHERE type IN (?)';
        num += ' WHERE type IN (?)';
      }
      content.push(type);
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
    content.push(isDelete);

    // 开启排序
    if (!sortKey || !sortOrder) {
      sql += ' order by selected desc,  time_str desc';
    } else {
      sql += ` order by ${sortKey} ${sortOrder}`;
    }

    // 开启分页
    if (page || page_size) {
      const current = page; // 当前页码
      const pageSize = page_size; // 一页展示多少条数据
      sql += ' limit ?,?';
      content.push((current - 1) * pageSize, parseInt(pageSize));
    }

    const bowenList = await this.app.mysql.query(sql, content);

    const bowenListNum = await this.app.mysql.query(num, content);

    return {
      data: bowenList,
      meta: {
        page,
        page_size,
        total: bowenListNum[0]['count(*)'],
      },
    };
  }
  // 是否精选事件
  async isSelectedFun(obj) {
    const { id, selected } = obj;

    // 查找对应的数据
    const result = await this.app.mysql.update('Bowen', {
      id,
      selected: selected ? 1 : 0,
    }); // 更新 Bowen 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 是否放入回收站
  async delBowenList(obj) {
    const { id, isDelete } = obj;

    // 查找对应的数据
    const result = await this.app.mysql.update('Bowen', {
      id,
      isDelete: isDelete ? 1 : 0,
    }); // 更新 Bowen 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 获取博文详情
  async _getClassifyDetails(id) {
    return await this.app.mysql.get('Bowen', { id });
  }
  // 编辑博文详情
  async _putClassifyDetails(obj) {
    const result = await this.app.mysql.update('Bowen', obj);

    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 修改博文审核状态
  async _putClassifyToExamine(obj) {
    const { id, type } = obj;

    // 查找对应的数据
    const result = await this.app.mysql.update('Bowen', { id, type: +type }); // 更新 Bowen 表中的记录
    // 判断更新成功
    return result.affectedRows === 1;
  }
  // 新增博文
  async _createClassifyDetails(obj) {
    const result = await this.app.mysql.insert('Bowen', obj);
    // 判断更新成功
    return result.affectedRows === 1 ? result.insertId : false;
  }
  // 删除博文
  async _deleteClassifyDetails(id) {
    const result = await this.app.mysql.delete('Bowen', {
      id,
    });
    // 判断删除成功
    return result.affectedRows === 1;
  }
}

module.exports = ClassifyService;
