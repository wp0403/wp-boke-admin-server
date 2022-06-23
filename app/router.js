'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/vcode', controller.verificationCode.createVCode);
  router.post('/login', controller.login.index);
  router.get('/getClassifyList', controller.classify.getList);
  router.get('/getSecretList', controller.secret.getList);
};
