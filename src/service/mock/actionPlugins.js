export default {
  '/authentryv2': [
    {
      id: 1,
      code: 'taobaoqrauth',
      name: '淘宝认证（账号密码在前）'
    },
    {
      id: 2,
      code: 'bankbillauth',
      name: '银行卡认证'
    },
    {
      id: 3,
      code: 'newbankbillauth',
      name: '银行卡认证'
    }
  ],
  '/authentry': [
    {
      id: 1,
      code: 'taobaoaccountauth',
      name: '淘宝认证（只有账号）'
    },
    {
      id: 2,
      code: 'taobaoaccountqrauth',
      name: '淘宝认证（账号密码在前）'
    },
    {
      id: 3,
      code: 'taobaoqraccountauth',
      name: '淘宝认证（二维码在前）'
    },
    {
      id: 4,
      code: 'taobaoqrauth',
      name: '淘宝认证（只有二维码）'
    },
    {
      id: 5,
      code: 'phoneauth',
      name: '手机认证'
    }
  ],
  '/baseinfocpts': [
    {
      id: 1,
      code: 'loanmoneyoption',
      name: '意愿借款金额',
      allowBlank: false
    },
    {
      id: 2,
      code: 'mobile',
      name: '手机号码',
      allowBlank: false
    },
    {
      id: 3,
      code: 'idauth',
      name: '真实姓名+身份证',
      allowBlank: false
    },
    {
      id: 4,
      code: 'educationauth',
      name: '学历信息',
      allowBlank: false
    },
    {
      id: 5,
      code: 'layout-space',
      name: '空白'
    },
    {
      id: 6,
      code: 'jobinfo',
      name: '工作信息',
      allowBlank: false
    },
    {
      id: 7,
      code: 'layout-space',
      name: '空白'
    },
    {
      id: 8,
      code: 'qq',
      name: 'QQ号',
      allowBlank: true
    },
    {
      id: 9,
      code: 'marriagestatus',
      name: '婚姻状况',
      allowBlank: false
    },
    {
      id: 10,
      code: 'creditcardnumber',
      name: '信用卡',
      allowBlank: false
    }
  ],
  '/detailinfocpts': [
    {
      id: 1,
      code: 'repaymentsource',
      name: '还款来源'
    },
    {
      id: 2,
      code: 'jobinfo',
      name: '工作信息',
      allowBlank: false
    },
    {
      id: 3,
      code: 'income',
      name: '月收入',
      allowBlank: false
    },
    {
      id: 8,
      code: 'educationauth',
      name: '学历信息',
      allowBlank: false
    },
    {
      id: 4,
      code: 'qq',
      name: 'QQ号',
      allowBlank: true
    },
    {
      id: 5,
      code: 'creditcardnumber',
      name: '信用卡',
      allowBlank: false
    },
    {
      id: 6,
      code: 'layout-space',
      name: '空白'
    },
    {
      id: 7,
      code: 'contacts',
      name: '联系人信息',
      allowBlank: false
    },
    {
      id: 8,
      code: 'X-estimatedlimit',
      name: '资质信息'
    }
  ],
  '/idupload': [
    {
      id: 1,
      code: 'h5-idupload',
      name: 'H5传身份证'
    }
  ],
  '/loanstatus': [
    {
      id: 1,
      code: 'satisfactionsurvey',
      name: '满意度测评'
    },
    {
      id: 2,
      code: 'kefu',
      name: '客服'
    }
  ]
}
