/*
 * @Descripttion: 
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-09 17:33:42
 * @LastEditors: 王鹏
 * @LastEditTime: 2022-04-09 17:50:33
 */

const jwt = require('jsonwebtoken');

module.exports = {
    // 设置token
    loginToken(data, expires = 7200, cert = 'wp0403') {
        const exp = Math.floor(Date.now() / 1000) + expires
        const token = jwt.sign({ data, exp }, cert)
        return token;
    },
};