/*
 * @Descripttion:
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-08 23:05:36
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-15 11:46:59
 */
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  security: {
    // eslint-disable-next-line eggache/no-unexpected-plugin-keys
    csrf: false,
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
