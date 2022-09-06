/*
 * @Descripttion: 树洞先生
 * @version:
 * @Author: WangPeng
 * @Date: 2022-06-23 16:31:01
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-09-05 16:16:28
 */
'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

class SecretController extends Controller {
  async getList() {
    const { ctx } = this;
    // 解构参数
    const { author, type, content, time_str, page, page_size, isDelete } = ctx.request.query;

    await this.service.secret.getList({ author, type, content, time_str, page, page_size, isDelete }).then(data => {
      ctx.body = {
        code: 200,
        msg: '树洞列表数据获取成功',
        ...data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '树洞列表数据获取失败',
      };
    });
  }
  // 修改是否置顶
  async isTopFun() {
    const { ctx } = this;
    // 解构参数
    const { id, isTop } = ctx.request.body;

    await this.service.secret.isTopFun({ id, isTop }).then(data => {
      ctx.body = {
        code: 200,
        msg: '设置成功',
        data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '设置失败',
      };
    });
  }
  // 是否放入回收站
  async delSecretList() {
    const { ctx } = this;
    // 解构参数
    const { id, isDelete } = ctx.request.body;

    await this.service.secret.delSecretList({ id, isDelete }).then(data => {
      ctx.body = {
        code: 200,
        msg: '操作成功',
        data,
      };
    }).catch(e => {
      console.log(e);
      ctx.body = {
        code: 300,
        msg: '操作失败',
      };
    });
  }
  // 更新树洞详情数据
  async putSecretDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;

    if (!obj) {
      // eslint-disable-next-line no-return-assign
      return ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
    }

    try {
      const isEdit = await ctx.service.secret._putSecretDetails({ ...obj, secretType: 3 });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '树洞详情数据修改成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '树洞详情数据修改失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '树洞详情数据修改失败',
        // data: e,
      };
    }
  }
  // 修改树洞审核状态
  async putSecretToExamine() {
    const { ctx } = this;

    const { id, secretType } = ctx.request.body;

    if (!id || !secretType) {
      // eslint-disable-next-line no-return-assign
      return (ctx.body = {
        code: 304,
        msg: '缺失数据',
      });
    }

    try {
      const isEdit = await ctx.service.secret._putSecretToExamine({
        id,
        secretType,
      });

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '树洞修改审核成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '树洞修改审核失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '树洞详情数据修改失败',
        // data: e,
      };
    }
  }
  // 新增树洞
  async createSecretDetails() {
    const { ctx } = this;

    const obj = ctx.request.body;

    if (!obj || !Object.keys(obj)) {
      ctx.body = {
        code: 304,
        msg: '缺失详情数据',
      };
      return;
    }

    try {
      const data = await ctx.service.secret._createSecretDetails(obj);

      if (data) {
        ctx.body = {
          code: 200,
          data,
          msg: '新增成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '新增失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '新增失败',
        // data: e,
      };
    }
  }
  // 删除树洞
  async deleteSecretDetails() {
    const { ctx } = this;

    const { id } = ctx.request.body;

    try {
      const token = ctx.request.header.authorization;
      const userInfo = jwt.verify(token, 'wp0403');
      const arr = await ctx.service.auth.index(userInfo.data.userId);

      if (!arr.includes(3)) {
        ctx.body = {
          code: 305,
          msg: '您暂无该权限，请联系管理员操作',
          // data: e,
        };
        return;
      }

      const isEdit = await ctx.service.secret._deleteSecretDetails(id);

      if (isEdit) {
        ctx.body = {
          code: 200,
          msg: '删除成功',
        };
      } else {
        ctx.body = {
          code: 305,
          msg: '删除失败',
          // data: e,
        };
      }
    } catch (e) {
      ctx.body = {
        code: 305,
        msg: '删除失败',
        // data: e,
      };
    }
  }
}

module.exports = SecretController;
