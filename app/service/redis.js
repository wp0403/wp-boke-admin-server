/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-10-20 16:06:29
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-10-20 18:00:33
 */
'use strict';

const Service = require('egg').Service;
const time = 60 * 60 * 24 * 30; // 默认缓存失效时间 30天

class RedisService extends Service {
  // 设置
  async set(key, value, seconds) {
    // seconds 有效时长
    const { redis } = this.app;
    value = JSON.stringify(value);
    if (!seconds) {
      // await redis.set(key, value);
      await redis.set(key, value, 'EX', time);
    } else {
      // 设置有效时间
      await redis.set(key, value, 'EX', seconds);
    }
  }
  // 获取
  async get(key) {
    const { redis } = this.app;
    let data = await redis.get(key);
    if (!data);
    data = JSON.parse(data);
    return data;
  }
  // 清空redis
  async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
  // 删除指定前缀的缓存
  async delKey(key) {
    const { redis } = this.app;
    await redis.keys(`${key}*`).then(data => {
      Promise.all(data.map(v => redis.del(v))).then(() => {
        // 指定缓存清理成功
      }).catch(() => {
        // 存在不成功的删除全部缓存
        this.flushall();
      });
    });
    return;
  }
}

module.exports = RedisService;
