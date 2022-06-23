/*
 * @Descripttion: 验证码
 * @version: 1.0.0
 * @Author: WangPeng
 * @Date: 2022-06-14 15:48:08
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-06-20 15:55:37
 */
'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

// size: 4 // 验证码长度
// ignoreChars: '0o1i' // 验证码字符中排除 0o1i
// noise: 1 // 干扰线条的数量
// color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
// background: '#cc9966' // 验证码图片背景颜色
// idth: number // width of captcha
// height: number // height of captcha
// fontSize: number // captcha text size
// charPreset: string // random character preset

class VerificationCodeController extends Controller {
  createVCode() {
    const { ctx } = this;
    // 字符串
    const vCode = svgCaptcha.create({ size: 6, noise: 3 });
    // 算数式
    // const vCode = svgCaptcha.createMathExpr({ size: 6, noise: 3 });
    ctx.session.login_code = vCode.text.toLowerCase();
    ctx.session.maxAge = 1000 * 60 * 10;
    ctx.status = 200;
    ctx.body = {
      code: 200,
      data: vCode.data,
    };
  }
}

module.exports = VerificationCodeController;
