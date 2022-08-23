/*
 * @Descripttion: cos后端临时密钥生成
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-04 17:30:40
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-08-23 13:31:34
 */
'use strict';

const Controller = require('egg').Controller;
const STS = require('qcloud-cos-sts');
class CosServerController extends Controller {
  async index() {
    const { ctx } = this;
    const cosKeyObj = {};
    const config = {
      bucket: 'img-1302605407', // 存储桶名称
      region: 'ap-beijing', // 存储桶所在地域
      // 密钥的权限列表
      allowActions: '*',
      allowPrefix: '*',
      durationSeconds: 3600,
    };

    await this.service.cos
      .getCosKey()
      .then(data => {
        cosKeyObj.SecretId = data.find(item => item.key === 'SecretId').value;
        cosKeyObj.SecretKey = data.find(
          item => item.key === 'SecretKey'
        ).value;
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '签名生成失败',
        };
      });

    // TODO 这里根据自己业务需要做好放行判断
    // if (allowPrefix === '/') {
    //   ctx.status = 300;
    //   ctx.body = {
    //     msg: '请修改 allowPrefix 配置项，指定允许上传的路径前缀',
    //   };
    // }

    // 获取临时密钥
    const AppId = config.bucket.split('-')[1];
    // 数据万象DescribeMediaBuckets接口需要resource为*,参考 https://cloud.tencent.com/document/product/460/41741
    const policy = {
      version: '2.0',
      statement: [{
        action: config.allowActions,
        effect: 'allow',
        resource: [
          'qcs::cos:' + config.region + ':uid/' + AppId + ':' + config.bucket + '/' + config.allowPrefix,
        ],
      }],
    };
    const startTime = Math.round(Date.now() / 1000);
    await STS.getCredential({
      secretId: cosKeyObj.SecretId,
      secretKey: cosKeyObj.SecretKey,
      region: config.region,
      durationSeconds: config.durationSeconds,
      policy,
    }).then(data => {
      data.startTime = startTime;
      ctx.body = data;
    });
  }

  async getCosKey() {
    const { ctx } = this;

    await this.service.cos
      .getCosKey()
      .then(data => {
        ctx.body = {
          code: 200,
          msg: '数据获取成功',
          data,
        };
      })
      .catch(e => {
        console.log(e);
        ctx.body = {
          code: 300,
          msg: '数据获取失败',
        };
      });
  }
}

module.exports = CosServerController;
