/*
 * @Descripttion: 资源操作
 * @version: 1.0.0
 * @Author: WangPeng
 * @Date: 2022-09-06 09:39:32
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-09-06 15:20:25
 */
'use strict';

const Service = require('egg').Service;

class ResourcesService extends Service {
  // 批量写入图片
  async _insertImgs(v) {
    const values = v.map(item => ([ item.id, item.name, item.url, item.updateTime, item.size ]));
    const sql = 'INSERT INTO img_list (id,name,url,updateTime,size) VALUES ?';
    const res = await this.app.mysql.query(
      sql, [ values ]
    );
    return res.affectedRows;
  }
  // 获取图片列表
  async _getImgList(obj) {
    // 解构参数
    const {
      sortKey,
      sortOrder,
      name,
      page = 1,
      page_size = 10,
    } = obj;

    let sql = 'select * from img_list';
    let num = 'select count(*) from img_list';
    const content = []; // 参数
    // let isMore = false; // 是否有多个查询参数
    /**
     * @模糊查询-量大的时候效率低
     * select * from user where name like ? % 内容 %
     * 在user表中全局查找name值 == 内容的
     * % 内容 % 全局查找内容
     *   内容 %  查找以 内容 开头的数据
     * */
    if (name) {
      sql += ' where name like ?';
      num += ' where name like ?';
      content.push('%' + name + '%');
    //   isMore = true;
    }

    // 开启排序
    if (!sortKey || !sortOrder) {
      sql += ' order by id desc,create_time desc';
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

    const imgList = await this.app.mysql.query(sql, content);

    const imgListNum = await this.app.mysql.query(num, content);

    return {
      data: imgList,
      meta: {
        page,
        page_size,
        total: imgListNum[0]['count(*)'],
      },
    };
  }
  // 写入图片
  async _insertImg(v) {
    const imgObj = await this.app.mysql.get('img_list', { name: v.name });
    let res;
    if (imgObj) {
      res = await this.app.mysql.update('img_list', { id: imgObj.id, ...v });
    } else {
      res = await this.app.mysql.insert('img_list', v);
    }
    return res.affectedRows === 1;
  }
}

module.exports = ResourcesService;
