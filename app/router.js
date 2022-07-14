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
  router.get('/getClassifyDetails', controller.classify.getClassifyDetails); // 获取博文详情
  router.put('/putClassifyDetails', controller.classify.putClassifyDetails); // 更新博文详情
  router.put('/putClassifyToExamine', controller.classify.putClassifyToExamine); // 修改博文审核状态
  router.post('/createClassifyDetails', controller.classify.createClassifyDetails); // 新增博文
  router.get('/getItineraryList', controller.itinerary.getList); // 获取旅行日记列表接口
  router.get('/getSecretList', controller.secret.getList); // 获取树洞列表接口
  router.put('/changeSecretIsTop', controller.secret.isTopFun); // 修改树洞的置顶接口
  router.put('/delSecretList', controller.secret.delSecretList); // 将树洞放入回收站的接口
  router.put('/putSecretDetails', controller.secret.putSecretDetails); // 更新树洞详情
  router.post('/createSecretDetails', controller.secret.createSecretDetails); // 新增博文
  router.get('/sts', controller.cosServer.index); // 获取腾讯云cos签名
  router.get('/stsCosKey', controller.cosServer.getCosKey); // 获取腾讯云cos的用户密钥
  router.get('/searchUserList', controller.user.searchUserList); // 根据关键字查询用户列表
};
