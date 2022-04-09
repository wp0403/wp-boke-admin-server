/*
 * @Descripttion: 
 * @version: 1.1.1
 * @Author: 王鹏
 * @Date: 2022-04-09 17:38:07
 * @LastEditors: 王鹏
 * @LastEditTime: 2022-04-09 17:45:59
 */

// 'use strict'
// const jwt = require('jsonwebtoken') //引入jsonwebtoken
// const whiteList = ['/login'];

// module.exports = (options, app) => {
//     return async function userInterceptor(ctx, next) {

//         if (whiteList.some(item => ctx.request.url.includes(item))) {
//             await next();
//             return;
//         }

//         let authToken = ctx.header.authorization // 获取header里的authorization
//         if (authToken) {
//             authToken = authToken.substring(7)
//             const res = verifyToken(authToken) // 解密获取的Token
//             if (res.corpid && res.userid) {
//                 // 如果需要限制单端登陆或者使用过程中废止某个token，或者更改token的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效
//                 // 此处使用redis进行保存
//                 const redis_token = await app.redis.get('loginToken').get(res.corpid + res.userid) // 获取保存的token
//                 if (authToken === redis_token) {
//                     ctx.locals.corpid = res.corpid
//                     ctx.locals.userid = res.userid
//                     await next()
//                 } else {
//                     ctx.body = { code: 411, msg: '您的账号已在其他地方登录' }
//                 }
//             } else {
//                 ctx.body = { code: 412, msg: '登录状态已过期' }
//             }
//         } else {
//             ctx.body = { code: 413, msg: '请登陆后再进行操作' }
//         }
//     }
// }

// // 解密，验证
// function verifyToken(token, cert = 'wp0403') {
//     let res = ''
//     try {
//         const result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {}
//         const { exp } = result,
//             current = Math.floor(Date.now() / 1000)
//         if (current <= exp) res = result.data || {}
//     } catch (e) {
//         console.log(e)
//     }
//     return res
// }