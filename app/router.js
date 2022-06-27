'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/vcode', controller.verificationCode.createVCode); // 登陆验证码接口
  router.post('/login', controller.login.index); // 登陆接口
  router.get('/getClassifyList', controller.classify.getList); // 获取博文列表接口
  router.put('/changeClassifySelected', controller.classify.isSelectedFun); // 修改博文精选的接口
  router.put('/delBowenList', controller.classify.delBowenList); // 将博文放入回收站的接口
  router.get('/getItineraryList', controller.itinerary.getList); // 获取旅行日记列表接口
  router.get('/getSecretList', controller.secret.getList); // 获取树洞列表接口
  router.put('/changeSecretIsTop', controller.secret.isTopFun); // 修改树洞的置顶接口
};
