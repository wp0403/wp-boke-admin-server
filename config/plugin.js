/*
 * @Descripttion: 
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-08 23:05:36
 * @LastEditors: 王鹏
 * @LastEditTime: 2022-04-09 16:12:10
 */
'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
