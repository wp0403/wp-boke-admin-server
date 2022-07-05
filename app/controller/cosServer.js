/*
 * @Descripttion:
 * @version:
 * @Author: WangPeng
 * @Date: 2022-07-04 17:30:40
 * @LastEditors: WangPeng
 * @LastEditTime: 2022-07-05 17:46:13
 */
'use strict';

const Controller = require('egg').Controller;
// 临时密钥服务例子
const STS = require('qcloud-cos-sts');

// 配置参数
const config = {
  SecretId: 'AKIDoRoujQs2vXtxkGWUBbkcDXaMs63kAI9j',
  SecretKey: 'KN9drpWw6zbx3tSjjTv60e17w5zcx2qN',
  proxy: '',
  durationSeconds: 1800,
  bucket: 'wp-1302605407',
  region: 'ap-beijing',
  // 允许操作（上传）的对象前缀，可以根据自己网站的用户登录态判断允许上传的目录，例子： user1/* 或者 * 或者a.jpg
  // 请注意当使用 * 时，可能存在安全风险，详情请参阅：https://cloud.tencent.com/document/product/436/40265
  allowPrefix: '*',
  // 密钥的权限列表
  allowActions: [
    // 简单上传
    'name/cos:PutObject',
    'name/cos:PostObject',
    // 分片上传
    'name/cos:InitiateMultipartUpload',
    'name/cos:ListMultipartUploads',
    'name/cos:ListParts',
    'name/cos:UploadPart',
    'name/cos:CompleteMultipartUpload',
  ],
};

class CosServerController extends Controller {
  index() {
    const { ctx } = this;
    // 格式一：临时密钥接口
    // TODO 这里根据自己业务需要做好放行判断
    // if (config.allowPrefix === '_ALLOW_DIR_/*') {
    //   ctx.status = 400;
    //   ctx.body = { error: '请修改 allowPrefix 配置项，指定允许上传的路径前缀' };
    //   return;
    // }

    // 获取临时密钥
    const shortBucketName = config.bucket.substr(
      0,
      config.bucket.lastIndexOf('-')
    );
    const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'));
    const policy = {
      version: '2.0',
      statement: [
        {
          action: config.allowActions,
          effect: 'allow',
          principal: { qcs: [ '*' ] },
          resource: [
            'qcs::cos:' +
              config.region +
              ':uid/' +
              appId +
              ':prefix//' +
              appId +
              '/' +
              shortBucketName +
              '/' +
              config.allowPrefix,
          ],
        },
      ],
    };
    STS.getCredential(
      {
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        durationSeconds: config.durationSeconds,
        policy,
      },
      function(err, tempKeys) {
        const result = JSON.stringify(err || tempKeys) || '';
        ctx.body(result);
      }
    );
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

// const crypto = require('crypto');
// // 格式二：临时密钥接口，支持细粒度权限控制
// // 判断是否允许获取密钥
// var allowScope = function (scope) {
//     var allow = (scope || []).every(function (item) {
//         return config.allowActions.includes(item.action) &&
//             item.bucket === config.bucket &&
//             item.region === config.region &&
//             (item.prefix || '').startsWith(config.allowPrefix);
//     });
//     return allow;
// };
// app.all('/sts-scope', function (req, res, next) {
//     var scope = req.body;
//
//     // TODO 这里根据自己业务需要做好放行判断
//     if (config.allowPrefix === '_ALLOW_DIR_/*') {
//         res.send({error: '请修改 allowPrefix 配置项，指定允许上传的路径前缀'});
//         return;
//     }
//     // TODO 这里可以判断 scope 细粒度控制权限
//     if (!scope || !scope.length || !allowScope(scope)) return res.send({error: 'deny'});
//
//     // 获取临时密钥
//     var policy = STS.getPolicy(scope);
//     var startTime = Math.round(Date.now() / 1000);
//     STS.getCredential({
//         secretId: config.secretId,
//         secretKey: config.secretKey,
//         proxy: config.proxy,
//         durationSeconds: config.durationSeconds,
//         policy: policy,
//     }, function (err, tempKeys) {
//         if (tempKeys) tempKeys.startTime = startTime;
//         res.send(err || tempKeys);
//     });
// });
//
// // 用于 PostObject 签名保护
// app.all('/post-policy', function (req, res, next) {
//     var query = req.query;
//     var now = Math.round(Date.now() / 1000);
//     var exp = now + 900;
//     var qKeyTime = now + ';' + exp;
//     var qSignAlgorithm = 'sha1';
//     var policy = JSON.stringify({
//         'expiration': new Date(exp * 1000).toISOString(),
//         'conditions': [
//             // {'acl': query.ACL},
//             // ['starts-with', '$Content-Type', 'image/'],
//             // ['starts-with', '$success_action_redirect', redirectUrl],
//             // ['eq', '$x-cos-server-side-encryption', 'AES256'],
//             {'q-sign-algorithm': qSignAlgorithm},
//             {'q-ak': config.secretId},
//             {'q-sign-time': qKeyTime},
//             {'bucket': config.bucket},
//             {'key': query.key},
//         ]
//     });
//
//     // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
//     // 步骤一：生成 SignKey
//     var signKey = crypto.createHmac('sha1', config.secretKey).update(qKeyTime).digest('hex');
//
//     // 步骤二：生成 StringToSign
//     var stringToSign = crypto.createHash('sha1').update(policy).digest('hex');
//
//     // 步骤三：生成 Signature
//     var qSignature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');
//
//     console.log(policy);
//     res.send({
//         policyObj: JSON.parse(policy),
//         policy: Buffer.from(policy).toString('base64'),
//         qSignAlgorithm: qSignAlgorithm,
//         qAk: config.secretId,
//         qKeyTime: qKeyTime,
//         qSignature: qSignature,
//         // securityToken: securityToken, // 如果使用临时密钥，要返回在这个资源 sessionToken 的值
//     });
// });
//
// // 上传限制 Content-Type 示例，对应示例 demo/mime-limit.html
// var COS = require('cos-nodejs-sdk-v5');
// var cos = new COS({
//     SecretId: config.secretId,
//     SecretKey: config.secretKey,
// });
// app.post('/uploadSign', function (req, res, next) {
//
//     var T = function (x, n) {
//         return ('0000' + x).slice(-(n || 2));
//     }
//     var guid = function () {
//         var S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//         return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
//     }
//
//     // 后端来决定文件名，安全性更高
//     var filename = req.query.filename; // 前端传文件原名，后端来决定上传路径
//     var ext = pathLib.extname(filename);
//     var d = new Date();
//     var key = `images/${d.getFullYear()}/${T(d.getMonth() + 1)}/${T(d.getDate())}/${guid()}${ext}`;
//
//     // 计算前端可能会用到的多个签名，x-cos-mime-limit: text/plain;img/jpg;img/*
//     var signMap = {};
//     var expires = 7200;
//     var mimeLimit = 'image/*';
//     var host = `${config.bucket}.cos.${config.region}.myqcloud.com`;
//     // 1. ListMultipartUploads 签名
//     signMap.ListMultipartUploads = cos.getAuth({
//         Method: 'GET',
//         Key: '',
//         Expires: expires,
//         Query: { uploads: '', prefix: key },
//         Headers: { host: host },
//     });
//     // 2. ListParts 签名
//     signMap.ListParts = cos.getAuth({
//         Method: 'GET',
//         Key: key,
//         Expires: expires,
//         Headers: { host: host },
//     });
//     // 3. InitiateMultipartUpload 签名
//     signMap.InitiateMultipartUpload = cos.getAuth({
//         Method: 'POST',
//         Key: key,
//         Expires: expires,
//         Query: { uploads: '' },
//         Headers: { host: host },
//     });
//     // 4. UploadPart 签名
//     signMap.UploadPart = cos.getAuth({
//         Method: 'PUT',
//         Key: key,
//         Expires: expires,
//         Headers: { host: host, 'x-cos-mime-limit': mimeLimit },
//     });
//     // 5. CompleteMultipartUpload 签名
//     signMap.CompleteMultipartUpload = cos.getAuth({
//         Method: 'POST',
//         Key: key,
//         Expires: expires,
//         Headers: { host: host },
//     });
//     // 6. PutObject 签名
//     signMap.PutObject = cos.getAuth({
//         Method: 'PUT',
//         Key: key,
//         Expires: expires,
//         Headers: { host: host, 'x-cos-mime-limit': mimeLimit },
//     });
//     res.send({
//         code: 0,
//         host,
//         signMap,
//         bucket: config.bucket,
//         region: config.region,
//         key,
//         mimeLimit,
//     });
// });
