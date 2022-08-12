'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async userAccess() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
