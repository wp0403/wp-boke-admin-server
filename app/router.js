'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/vcode', controller.verificationCode.createVCode); // 登陆验证码接口
  router.post('/login', controller.login.index); // 登陆接口
  router.post('/createUser', controller.login.createUser); // 注册接口
  /**
   * 博文请求接口
   */
  router.get('/getClassifyList', controller.classify.getList); // 获取博文列表接口
  router.put('/changeClassifySelected', controller.classify.isSelectedFun); // 修改博文精选的接口
  router.put('/delBowenList', controller.classify.delBowenList); // 将博文放入回收站的接口
  router.get('/getClassifyDetails', controller.classify.getClassifyDetails); // 获取博文详情
  router.put('/putClassifyDetails', controller.classify.putClassifyDetails); // 更新博文详情
  router.put('/putClassifyToExamine', controller.classify.putClassifyToExamine); // 修改博文审核状态
  router.post(
    '/createClassifyDetails',
    controller.classify.createClassifyDetails
  ); // 新增博文
  router.delete('/deleteClassifyDetails', controller.classify.deleteClassifyDetails); // 删除博文
  /**
   * 旅行日记请求接口
   */
  router.get('/getItineraryList', controller.itinerary.getList); // 获取旅行日记列表接口
  router.get('/getItineraryDetails', controller.itinerary.getItineraryDetails); // 获取博文详情
  /**
   * 树洞请求接口
   */
  router.get('/getSecretList', controller.secret.getList); // 获取树洞列表接口
  router.put('/changeSecretIsTop', controller.secret.isTopFun); // 修改树洞的置顶接口
  router.put('/delSecretList', controller.secret.delSecretList); // 将树洞放入回收站的接口
  router.put('/putSecretDetails', controller.secret.putSecretDetails); // 更新树洞详情
  router.put('/putSecretToExamine', controller.secret.putSecretToExamine); // 修改树洞审核状态
  router.post('/createSecretDetails', controller.secret.createSecretDetails); // 新增树洞
  router.delete('/deleteSecretDetails', controller.secret.deleteSecretDetails); // 删除树洞
  /**
   * 网站时间轴
   */
  router.get('/getTimeAxisList', controller.timeAxis.getList); // 获取列表接口
  router.put('/putTimeAxisDetails', controller.timeAxis.putTimeAxisDetails); // 更新详情
  router.put('/putTimeAxisToExamine', controller.timeAxis.putTimeAxisToExamine); // 修改审核状态
  router.post('/createTimeAxisDetails', controller.timeAxis.createTimeAxisDetails); // 新增
  router.delete('/deleteTimeAxisDetails', controller.timeAxis.deleteTimeAxisDetails); // 删除
  /**
   * cos对象储存接口
   */
  router.get('/sts', controller.cosServer.index); // 获取腾讯云cos签名
  // router.get('/stsCosKey', controller.cosServer.getCosKey); // 获取腾讯云cos的用户密钥 安全问题弃用
  /**
   * 用户接口
   */
  router.get('/searchUserList', controller.user.searchUserList); // 根据关键字查询用户列表
  router.get('/getUserList', controller.user.getUserList); // 根据关键字查询用户列表
  router.put('/putUserToExamine', controller.user.putUserToExamine); // 修改用户状态
  router.put('/putUserState', controller.user.putUserState); // 修改用户角色
  router.get('/getUserDetails', controller.user.getUserDetails); // 根据用户id获取用户详情信息
  router.put('/putUserDetails', controller.user.putUserDetails); // 更新用户详情
  /**
   * 数据操作
   */
  router.put('/putImgList', controller.resources.insertImgs); // 批量写入图片数据
  router.put('/putImg', controller.resources.insertImg); // 写入图片数据
  router.get('/getImgList', controller.resources.getImgList); // 获取图片列表
};
