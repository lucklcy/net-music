import Mock from 'mockjs'
import PLUGINS from './actionPlugins'
import { LINE_TAG_INFO_MAP } from '@/common/const'

Mock.setup({
  timeout: 1000
})

/*
Url                                      Title                                  Component
/free/loanfailure                        申请结果                                 Failure
/free/authcenter                         授权认证中心                             Authcenter
/free/phoneauth                          手机认证【闪电】                          Phone
/free/bindcard                           绑定银行卡                               Bind
/bindcard                                绑定银行卡                               Bind
/phoneauth-bigger                        手机认证【大额】                          PhoneauthBigger
/phoneauth                               手机认证【渠道h5】                        PhoneAuth
/baseinfo                                基础资料                                 Basic
/baseinfocpts                            基础资料[组件化]                          BasicNew
/detailinfov2                            完善信息                                 Perfectv2
/detailinfov3                            完善信息                                 Perfectv3
/detailinfocpts                          完善信息[组件化]                          PerfectNew
/amountguide                             预授信额度                               Amountguide
/authentry                               授权认证                                 Auth
/authentryv2                             授权认证[大额]                           AuthBigger
/amount                                  额度评估                                 Credit
/amountv2                                额度评估[大额]                           CreditBigger
/precredit                               预授信额度                               Precredit
/idupload                                省份证上传                               Upload
/free/enterfailure                       禁入页                                  EnterFailure
/insufficient                             重新授权                                Insufficient
/loanfailure-bigger                      申请结果                                LoanfailureBigger
/free/bindcard                           银行卡绑定                               Bind
/confirmloan                              额度确认                                Confirmloan
/callback.html                           认证中                                  Callback
/instopencallback.html                   认证中                                  InstopenCallback
/loanstatus                              完成申请                                Success
*/
const currentAction = '/confirmloan'

/**
 * 返回码   message                  跳转url【redirectUrl】
 * 104     非新客                    //mloan.ppdai.com?from=bigm
 * 105     存在进行中的标的            //mloan.ppdai.com?from=bigm
 * 106     被禁言                    /free/loanfailure
 * 107     有24小时内审核失败的标的     /free/loanfailure
 * 108     有逾期的标的               /free/loanfailure
 * 109     撤假标失败                 //mloan.ppdai.com?from=bigm
 * 110     用户为投资人               /free/enterfailure?code=110
 * 111     用户为担保人               /free/enterfailure?code=111
 */
Mock.mock(/^\/api\/bigm\/core\/mark$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '成功',
    resultContent: null,
    redirectUrl: null
  }
})

// 获取用户当前流程（页面）信息
// POST /bigm/core/viewmeta
/**
 * 返回码   message                  跳转url【redirectUrl】
 * 104     非新客                    //mloan.ppdai.com?from=bigm
 * 105     存在进行中的标的            //mloan.ppdai.com?from=bigm
 * 106     被禁言                    /free/loanfailure
 * 107     有24小时内审核失败的标的     /free/loanfailure
 * 108     有逾期的标的               /free/loanfailure
 * 109     撤假标失败                 //mloan.ppdai.com?from=bigm
 * 110     用户为投资人               /free/enterfailure?code=110
 * 111     用户为担保人               /free/enterfailure?code=111
 */
Mock.mock(/^\/api\/bigm\/core\/canprocess$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '成功',
    resultContent: null,
    redirectUrl: null
  }
})

// 获取用户当前流程（页面）信息
// POST /bigm/core/viewmeta
Mock.mock(/^\/api\/bigm\/core\/viewmeta$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  let returnType = 2
  const [tag, flowCode] = [
    LINE_TAG_INFO_MAP.LINE_TAG_SQB_SHOP.tag,
    LINE_TAG_INFO_MAP.LINE_TAG_SQB_SHOP.flowCode
  ]
  if (returnType === 1) {
    let otherResult = {
      result: 0,
      resultMessage: '调用成功',
      resultContent: {
        flowCode,
        action: '/amount',
        plugins: [{ code: 'amount', frontCode: 'amount', name: '额度评估', allowBlank: false }],
        username: 'pdu0305275546',
        tag,
        selfAppStatus: 'Released',
        bulletin: null
      },
      redirectUrl: null
    }
    return otherResult
  } else if (returnType === 2) {
    let stepsPlugins = [
      {
        code: 'layout-style2-1-on',
        frontCode: 'layout-style2-1-on'
      },
      {
        code: 'layout-style2-2',
        frontCode: 'layout-style2-2'
      },
      {
        code: 'layout-style2-3',
        frontCode: 'layout-style2-3'
      }
    ]
    let plugins = PLUGINS[currentAction] || []
    plugins = plugins.concat(stepsPlugins)
    return {
      result: 0,
      resultMessage: '调用成功',
      redirectUrl: null,
      resultContent: {
        flowCode, // String  流程编码
        action: currentAction, // String action(url)当前功能对应的URL
        plugins, // array 插件组
        username: 'pdu1857440457', // String 当前用户的用户名
        tag, // String 当前用户控制流程的标签
        selfAppStatus: 'Released', // String 应用程序状态, Auditing 审核中, Released 正常上线中【现专指汇邦小贷】
        // bulletin: {
        //   content: '公告正文，淘宝认证，暂时不稳定' // 公告系统，当bulletin为null是则不展示公告系统提示
        // }
        bulletin: null
      }
    }
  }
})

/**
 * 获取页面组件（给非流程页面使用）
 */
Mock.mock(/^\/api\/bigm\/core\/viewmeta4free$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  let { action: forwardAction } = JSON.parse(body) || {}
  let plugins = {
    '/loanothers': [
      {
        id: 1,
        code: 'loanapp',
        name: '借款APP',
        frontCode: 'loanapp',
        allowBlank: true
      },
      {
        id: 2,
        code: 'loanmarket',
        name: '借款超市',
        frontCode: 'loanmarket',
        allowBlank: true
      }
    ],
    '/authentry': [
      {
        id: 1,
        code: 'phoneauth',
        name: '手机认证',
        frontCode: 'phoneauth'
      },
      {
        id: 2,
        code: 'taobaoaccountqrauth',
        name: '淘宝认证（账号密码在前）',
        frontCode: 'taobaoaccountqrauth'
      }
    ],
    '/authcenter': [
      {
        id: 1,
        code: 'phoneauth',
        name: '手机认证',
        frontCode: 'phoneauth'
      },
      {
        id: 2,
        code: 'newtaobaoauth',
        name: '淘宝认证（账号密码在前）',
        frontCode: 'newtaobaoauth'
      }
    ]
  }

  return {
    result: 0,
    resultMessage: '调用成功',
    redirectUrl: null,
    resultContent: {
      flowCode: 'bigger-e-h5', // String  流程编码
      action: currentAction, // String action(url)当前功能对应的URL
      plugins: plugins[forwardAction], // array 插件组
      username: 'pdu1857440457', // String 当前用户的用户名
      tag: 'bigger-e', // String 当前用户控制流程的标签
      selfAppStatus: 'Released' // String 应用程序状态, Auditing 审核中, Released 正常上线中【现专指汇邦小贷】
    }
  }
})

// 用户行为日志 | 后端数据埋点
Mock.mock(/^\/api\/bigm\/core\/useractivity$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null
  }
})

/** ----------------------------------------------   Basic   ----------------------------------------------- ****/
/** 获取用户基本资料 */
Mock.mock(/^\/api\/bigm\/biz\/getuserbaseinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  if (Math.random() > 0.9) {
    return {
      result: 0,
      resultMessage: '调用成功',
      resultContent: {
        userId: 12345,
        phone: '15000659811',
        realName: '张三',
        idNumber: '240103189005081232',
        qq: '12334576',
        educationId: 2,
        marriageId: 1,
        isPhoneValidate: false,
        isIdValidate: false,
        isEducationValidate: false
      }
    }
  } else {
    return {
      result: 0,
      resultMessage: '调用成功',
      resultContent: {
        userId: 12345,
        phone: '15000659811',
        realName: null,
        idNumber: null,
        qq: null,
        educationId: null,
        marriageId: null,
        isPhoneValidate: true,
        isIdValidate: false,
        isEducationValidate: false
      }
    }
  }
})

/** 保存用户基本资料 */
Mock.mock(/^\/api\/bigm\/biz\/submituserbaseinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return Mock.mock({
    // 'result|1': [100, 200, 201, 202, 203, 204, 211, 212, 213, 214, 215, 216, 217, 221, 222, 231, 232, 241, 242],
    result: 215,
    resultMessage: '身份证已被注册',
    resultContent: {
      boundPhone: '150****9811',
      mobileChangeBindingUrl:
        'https://passport.ppdai.com/password.html#/changeidcard?id=xGT0iVCm7dsc4m%2FNtN6bL6Eg%2FFfArZFZ673fqQcp3PD9En00zfHsHFN3BlrGwVwZUtrrwrc7dz72Me9BzN7X5gfPen13IpBc7mfPu%2FnBwt3hG31liF6OhYfyXAn8wpjYYiB6M%2BisBTnolw71aqCsIwLrCdLseO8mDY3jyqn%2B54LxXOPBSKsFTxCiLYArraBT'
    }
  })
})

/** ----------------------------------------------   User   ----------------------------------------------- ****/
const loaddatauserbaseanddetailinfo = () => {
  if (Math.random() < 0.1) {
    return {
      result: 0,
      resultMessage: '调用成功',
      resultContent: {
        plugins: []
      }
    }
  }
  /* eslint-disable */
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      plugins: [
        {
          code: 'loanmoneyoption',
          data: {
            loanMoneyOptionId: null
          }
        },
        {
          code: 'mobile',
          data: {
            phone: '150***9811',
            isPhoneValidate: true
          }
        },
        {
          code: 'idauth',
          data: {
            idNumber: '240103189005081232',
            realName: '张三',
            isIdValidate: false
          }
        },
        {
          code: 'education',
          data: {
            educationId: 7,
            universityName: '清华大学',
            graduateTime: 2008,
            educationLevel: 3,
            isEducationValidate: false
          }
        },
        {
          code: 'educationauth',
          data: {
            educationId: 7,
            universityName: '清华大学',
            graduateTime: 2008,
            educationLevel: 3,
            isEducationValidate: false
          }
        },
        {
          code: 'qq',
          data: {
            qq: '12334576'
          }
        },
        {
          code: 'marriagestatus',
          data: {
            marriageId: 1
          }
        },
        {
          code: 'creditcardnumber',
          data: {
            creditCard: '6259760290113385'
          }
        },
        {
          code: 'repaymentsource',
          data: {
            repaymentSourceId: 20,
            isRepaymentSourceModifiable: true
          }
        },
        {
          code: 'income',
          data: {
            incomeTypeId: 36
          }
        },
        {
          code: 'jobinfo',
          data: {
            occupationId: 8,
            weCompanyName: '上海拍-拍-贷',
            weCompanyPhone: '15000659811',
            coCompanyName: ''
          }
        },
        {
          code: 'contacts',
          data: {
            firstContactRelationshipId: 1,
            firstContactRealName: '张三',
            firstContactPhone: '15000981111',
            secondContactRelationshipId: 2,
            secondContactRealName: '李四',
            secondContactPhone: '15000982222'
          }
        },
        {
          code: 'X-estimatedlimit',
          data: {
            tip: '80%与您资质相似的用户获得5000～25000额度'
          }
        }
      ]
    }
  }
}

Mock.mock(/^\/api\/bigm\/biz\/loaddatauserbaseinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return loaddatauserbaseanddetailinfo()
})

Mock.mock(/^\/api\/bigm\/biz\/loaddatauserdetailinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return loaddatauserbaseanddetailinfo()
})

const submitdatauserbaseordetailinfo = () => {
  return {
    result: 2011208,
    resultMessage: '调用成功',
    redirectUrl: '/free/loanfailure',
    resultContent: null
    // result: 2002005,
    // resultMessage: '身份证已被注册',
    // resultContent: {
    //   boundPhone: '150****9811',
    //   mobileChangeBindingUrl:
    //     'https://passport.ppdai.com/password.html#/changeidcard?id=xGT0iVCm7dsc4m%2FNtN6bL6Eg%2FFfArZFZ673fqQcp3PD9En00zfHsHFN3BlrGwVwZUtrrwrc7dz72Me9BzN7X5gfPen13IpBc7mfPu%2FnBwt3hG31liF6OhYfyXAn8wpjYYiB6M%2BisBTnolw71aqCsIwLrCdLseO8mDY3jyqn%2B54LxXOPBSKsFTxCiLYArraBT'
    // }
  }
}

Mock.mock(/^\/api\/bigm\/biz\/submitdatauserbaseinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return submitdatauserbaseordetailinfo()
})

Mock.mock(/^\/api\/bigm\/biz\/submitdatauserdetailinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return submitdatauserbaseordetailinfo()
})

/** ----------------------------------------------   Perfect   ----------------------------------------------- ****/
Mock.mock(/^\/api\/bigm\/biz\/getuserdetailinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  if (Math.random() < 0.09) {
    return {
      result: 0,
      resultMessage: '调用成功',
      resultContent: {
        isRepaymentSourceModifiable: true,
        showIncomeType: true,
        incomeType: 0,
        estimatedLimitTip: '80%与您资质相似的用户获得5000～25000额度'
      }
    }
  }
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      userId: 5516012,
      occupationId: 6,
      weCompanyName: '上海拍-拍-贷',
      weCompanyPhone: '18585666232',
      incomeType: 0,
      showIncomeType: true,
      coCompanyName: '',
      repaymentSourceId: 1,
      incomeTypeId: 0,
      isRepaymentSourceModifiable: true,
      creditCard: '6259760290113385',
      firstContactRelationshipId: 1,
      firstContactRealName: '嘿哈嘿',
      firstContactPhone: '15000659811',
      secondContactRelationshipId: 2,
      secondContactRealName: '嘿嗯嘿',
      secondContactPhone: '15000659812',
      estimatedLimitTip: '您是优质用户，90%可能获得8000~25000额度'
    }
  }
})

Mock.mock(/^\/api\/bigm\/biz\/submituserdetailinfo$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: 'https://wwww.baidu.com'
  }
})

/** ----------------------------------------------   University   ----------------------------------------------- ****/
const ListOfUniversity = []
const countOfUniversity = 100

for (let i = 0; i < countOfUniversity; i++) {
  let tempUniversityName = Mock.Random.pick([
    '大学',
    '科技大学',
    '农业大学',
    '师范大学',
    '理工大学',
    '医科大学',
    '地质大学',
    '外国语大学',
    '艺术学院'
  ])
  let tempPerfix = Mock.Random.pick([
    '湖南',
    '湖北',
    '武汉',
    '上海',
    '西安',
    '北京',
    '重庆',
    '天津',
    '哈尔滨',
    '云南',
    '江西',
    '江苏',
    '福建',
    '深圳',
    '广州'
  ])
  ListOfUniversity.push({
    id: i,
    universityName: `${tempUniversityName}`,
    originalUniversityName: `${tempPerfix}${tempUniversityName}`
  })
}

// 大学列表
Mock.mock(/^\/api\/bigm\/biz\/getuniversitylist$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  const { universityName, page = 1, limit = 10 } = JSON.parse(body)
  let mockList = ListOfUniversity.filter(item => {
    if (universityName && item.universityName.indexOf(universityName) < 0) {
      return false
    }
    return true
  })
  const pageList = mockList.filter((item, index) => {
    return index < limit * page && index >= limit * (page - 1)
  })
  console.log({ pageList })
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: pageList
  }
})

// 大学详情
Mock.mock(/^\/api\/bigm\/biz\/getuniversity$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: ListOfUniversity[0]
  }
})

/** ----------------------------------------------   Failure   ----------------------------------------------- ****/
// 借款失败页面meta信息
Mock.mock(/^\/api\/bigm\/biz\/loanfailurepagemeta$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      canEnterAuthCenter: false,
      showKeFu: true,
      isYjj: false, // 是否为应急金
      yjjCanGoToSuperbig: true // 字段，含义：是否可转闪，true，能转，false，不能转
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/biggerloanfailurepagemeta$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      amount: 50000 // 小额额度
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/biggergotosmallerconfirmloan$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: 'http://baidu.com'
  }
})
/** ----------------------------------------------   Precredit   ----------------------------------------------- ****/
// 认证中心- 查询认证中心资料状态
Mock.mock(/^\/api\/bigm\/core\/getauthcenterstatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      hasEffectiveBill: false,
      billEffectiveTime: null,
      hasEffectiveEBData: true,
      ebDataEffectiveTime: '2018/10/06'
    },
    redirectUrl: null
  }
})
// 认证中心-  是否能进入认证中心
Mock.mock(/^\/api\/bigm\/core\/canenterauthcenter$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      canEnterAuthCenter: true
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/yjjgotosuperbig$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    redirectUrl: '/www'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/loaddataprecredit$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      amount: 3000,
      hasBoundCard: true,
      isPassed: false
    },
    redirectUrl: '/amount'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/submitdataprecredit$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: '/bindcard'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/loaddataamountguide$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      amount: 6000, // 额度
      hasBoundCard: true // 是否已绑卡
    },
    redirectUrl: null
  }
})

// 获取收入列表
Mock.mock(/^\/api\/bigm\/biz\/getincometypelist$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  let list = [
    {
      key: 1,
      value: '2000以下'
    },
    {
      key: 2,
      value: '2000-5000'
    },
    {
      key: 4,
      value: '5000-8000'
    },
    {
      key: 8,
      value: '8000-15000'
    },
    {
      key: 16,
      value: '15000以上'
    }
  ]
  for (let i = 2; i <= 19; i++) {
    list.push({
      key: 17 + i,
      value: `20${(i - 1) * 100}-20${i * 100}`
    })
  }
  return {
    result: 0,
    resultMessage: '',
    resultContent: list
  }
})

Mock.mock(/^\/api\/bigm\/biz\/loaddataamount$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  const r = 4 // Math.floor(Math.random() * 4)
  const urls = [
    '/loanfailure',
    '/precredit',
    // '/confirmloan',
    '/xxxx',
    '/insufficient'
  ]

  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      assessAmountResult: r,
      estimatedGeTime: 10
    },
    redirectUrl: urls[r]
  }
})

Mock.mock(/^\/api\/bigm\/biz\/assessamount$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  let r = 4
  // let randomR = Math.random()
  // if (randomR < 0.02) {
  //   r = 0
  // } else if (randomR >= 0.02 && randomR < 0.04) {
  //   r = 1
  // } else if (randomR >= 0.04 && randomR < 0.06) {
  //   r = 3
  // } else if (randomR >= 0.06 && randomR < 1) {
  //   r = 2
  // }
  const urls = ['/loanfailure', '/precredit', '/confirmloan', '/insufficient']
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      assessAmountResult: r,
      estimatedGeTime: 10
    },
    redirectUrl: urls[r]
  }
})

// 授权认证- 查询信息授权状态接口
Mock.mock(/^\/api\/bigm\/biz\/getauthentrystatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      hasEffectiveData: false,
      canGetAuthEntryStatusAgain: false,
      hasEffectiveBill: true,
      hasEffectiveEBData: false,
      hasEffectiveBankBill: false,
      hasEffectiveGJJ: false,
      showSmallerEntry: true
    },
    redirectUrl: '/amount'
  }
})

// 授权认证- 获取授权url
Mock.mock(/^\/api\/bigm\/biz\/getauthurl$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  const isSuccess = Math.random() > 0
  if (isSuccess) {
    const returnUrl = encodeURIComponent(
      'http://baidu.com&token=0024500234000GN6JX8cRysIL4sQbEN3&subItem=taobao&style=mobile&noProcess=true&notShowTipsMsg=true&loginType=loginForm,qrCode'
    )
    return {
      result: 0,
      resultMessage: '调用成功',
      resultContent: null,
      redirectUrl: `https://prod.gxb.io/v2/auth?returnUrl=${returnUrl}`
    }
  }
  return {
    result: 262,
    resultMessage: '获取电商授权url为空',
    resultContent: null,
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/backtoauthentry$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: '/authentry'
  }
})

// 额度确认-获取额度数据
Mock.mock(/^\/api\/bigm\/biz\/loanoptions$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      defaultMonth: 9,
      maybeStudent: true,
      minAmount: 500,
      months: [3, 6, 9],
      loanUses: [
        {
          loanUseCode: 10001,
          loanUseName: '日常消费'
        },
        {
          loanUseCode: 10002,
          loanUseName: '旅游'
        },
        {
          loanUseCode: 10003,
          loanUseName: '装修'
        },
        {
          loanUseCode: 10004,
          loanUseName: '医疗'
        }
      ],
      availableAmount: 1000,
      availableCoupons: [
        {
          couponId: 12,
          couponAmount: 10,
          ruleType: 1,
          ruleValue: 0,
          validateDate: '2018-07-21 14:09:39'
        },
        {
          couponId: 13,
          couponAmount: 10,
          ruleType: 2,
          ruleValue: 1000,
          validateDate: '2018-07-20 14:09:39'
        },
        {
          couponId: 14,
          couponAmount: 10,
          ruleType: 2,
          ruleValue: 2000,
          validateDate: '2018-07-20 14:09:39'
        },
        {
          couponId: 15,
          couponAmount: 30,
          ruleType: 2,
          ruleValue: 1000,
          validateDate: '2018-07-20 14:09:39'
        }
      ],
      isAppUser: true,
      repaymentSourceId: 1,
      isRepaymentSourceModifiable: true,
      periods: [
        {
          month: 2, // 基数
          minRange: 900, // 当前期数最小金额
          maxRange: 1000 // 当前期数最大金额
        },
        {
          month: 6, // 基数
          minRange: null, // 当前期数最小金额
          maxRange: null // 当前期数最大金额
        },
        {
          month: 12,
          minRange: null,
          maxRange: 900
        },
        {
          month: 18,
          minRange: null,
          maxRange: 2000
        },
        {
          month: 24,
          minRange: 1100,
          maxRange: 900
        },
        {
          month: 36,
          minRange: 1000,
          maxRange: null
        }
      ],
      availableFeeCoupons: [
        {
          couponId: 1178,
          couponAmount: 100,
          couponTitle: '前六期免息券',
          couponDesc: '单期可以免100，最高可免900',
          validateDate: '2018-09-27 00:00:00',
          periodLimit: 3,
          isAsc: 1,
          deductType: 3
        },
        {
          couponId: 1179,
          couponAmount: 200,
          couponTitle: '后三期免费券',
          couponDesc: '单期可以免100，最高可免300',
          validateDate: '2018-09-28 00:00:00',
          periodLimit: 4,
          isAsc: 0,
          deductType: 3
        }
      ],
      isProtocolDefaultChecked: true,
      isShowCreditProtocol: false
    },
    redirectUrl: null
  }
})
// 额度确认-计算还款明细
Mock.mock(/^\/api\/bigm\/biz\/calcmonthrepayment$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      months: 3,
      firstMonths: 3,
      firstRepayAmount: 6905,
      lastRepayAmount: 5238.34,
      obtainAmount: 50000,
      apr: '35.72%',
      allDeductAmount: 45,
      items: [
        {
          month: 1,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15,
          deductAmount: 10,
          deductInterest: 4.43,
          deductOtherFeeAmount: 5.57,
          deductFeeAmount: 1
        },
        {
          month: 2,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15,
          deductAmount: 10,
          deductInterest: 4.43,
          deductOtherFeeAmount: 5.57,
          deductFeeAmount: null
        },
        {
          month: 3,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 4,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 5,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 6,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 7,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 8,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 9,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 10,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 11,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 12,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 13,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 14,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 15,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 16,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 17,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        },
        {
          month: 18,
          amount: 6905,
          principal: 3988.34,
          interest: 395.84,
          feeAmount: 1666.67,
          otherFeeAmount: 854.15
        }
      ]
    },
    redirectUrl: null
  }
})
// 额度确认-确认额度
Mock.mock(/^\/api\/bigm\/biz\/confirm$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '特供标未开户',
    resultContent: {
      pubErrResult: 100006,
      pubErrMsg: '用户存在正在进行的标的'
    },
    redirectUrl: '/free/loanfailure'
  }
})
// 手机认证-获取用户手机信息
Mock.mock(/^\/api\/bigm\/biz\/getphonemsg$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      carrierOperator: 2,
      isShop: true,
      phone: '152****7921'
    }
  }
})
// 手机认证-获取手机认证状态
Mock.mock(/^\/api\/bigm\/biz\/loaddataphoneauth$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      hasEffectiveData: false
    },
    redirectUrl: '/baseinfo'
  }
})
// 手机认证-提交用户手机认证
Mock.mock(/^\/api\/bigm\/biz\/phoneauth$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      token: 'b0a25c4be17394ae8f92f0a7c989f87b',
      authStatus: -1
    },
    redirectUrl: ''
  }
})

Mock.mock(/^\/api\/bigm\/biz\/getbanklist$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      bankList: [
        {
          bankId: 1,
          bankName: '招商银行'
        },
        {
          bankId: 2,
          bankName: '中国银行'
        },
        {
          bankId: 3,
          bankName: '中国工商银行'
        },
        {
          bankId: 23,
          bankName: '交通银行'
        },
        {
          bankId: 6,
          bankName: '平安银行'
        },
        {
          bankId: 10,
          bankName: '中国建设银行'
        }
      ]
    },
    redirectUrl: null
  }
})
Mock.mock(/^\/api\/bigm\/biz\/getbankid$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      bankId: 10
    },
    redirectUrl: null
  }
})
Mock.mock(/^\/api\/bigm\/biz\/sendbindcardverifycode$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功1',
    resultContent: {
      bindCardBizId: '180227050000000013'
    },
    redirectUrl: null
  }
})
Mock.mock(/^\/api\/bigm\/biz\/simplebindcard$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 230,
    resultMessage: '招行开户绑卡失败',
    resultContent: null,
    redirectUrl:
      'http://ppdai.cloud.cmbchina.com/index?secret=DCNT9ZdxZEUnnz8OXubUIF7H+2USHSqn+9XxY5P1FRaW/+LmVtqTDzqpM21opEHmvyljI/jCSS2jz3o8HOoScLmDY+HNE8nTIV5LqqV9WvOIFdLzaHBeTqPYnBphep8y9bcDMmDQFp1x8TUoXQLeafTBV4yVYZSIeaE6OOJm8GB3VRsTxAEDD4DfVSNGwP+eC/0AihnxQtinb+zLSOQb8t6dXqEdmJW1t4QrHMG4bWDXa7xOq1HosTPTn2r68deb3RDf09ngKLkZDLVihmKdzBCf1Ab0lXx7CWGon/Iptwj11swze7NR9erWQ2mpnB8x1mjLWej0szEmHkgD/EcMgIGokm6U2q2xg5Py221FsTJEGBnIFWvd3+QjlKNm+Y2yb+tEJlnV6xAmbdKvfGuFPFAMSf6XxV9saHMd0AU+io9OQmNVaSoijGLPNnkPF1wg6oP3dF6kPEAY8YuemDhQjaYEy/CcyX9hUbnXlUziQZeYifA8j40MZJbkMS5V0rT2'
  }
})
Mock.mock(/^\/api\/bigm\/biz\/submitbindcardverifycode$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: '/xxx'
  }
})
/** ----------------------------------------------   Bind   ----------------------------------------------- ****/
// 银行卡绑定
Mock.mock(/^\/api\/bigm\/biz\/getbindcardstatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      bindCardStatus: 3,
      realName: '*黄三'
    },
    redirectUrl: null
    // 'http://ppdai.cloud.cmbchina.com/index?secret=IcxW+sMDIyUln0dFHaFHTiTp0+z4dGQXMCsuKRy9OngmPQXc/GGmKJTgu/6USwQGJCtNmDgqVJvc/zcysNsqTU68IYwI2Onwy7mNKtNqLYiCBFuDOASBTbgLn2J2AW/uq+aaeFXQRFPyiYsHsPq4Pa3CYLBSaEqveBS77zzcZQIGOLiDEcL2BFMkAfThDIgdbLEpGLVsH2ymVWutxNy0HgF7qPAaHxcw5dCu2sUC2Kr5WNyNW6GKO9f/Yyp8WuJtnE3qYnGm5nIzo9NQPtm+I+NF1ewj6PoLrmVcvHVnN7RpocsRas0DdiBLtux6oXjsekcVxUbuX7cCeHk/I/lYex3wj6RW8QbqELYfylFxlu7hXgoMwWN+7BLZBbSk12Sor5zwDaaGK46DzPisB3rrj3aI3pB2nJpUde9PKxCRKfKf+ehV3MbSrXL42Sv+HZDtmVam+TATddrnYpJtVCtoWKxxpoRpla3/VBolKPexoo67eKSV8ik82/OgWUIUSNbI'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/getbanklist$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      bankList: [
        {
          bankId: 1,
          bankName: '招商银行'
        },
        {
          bankId: 2,
          bankName: '中国银行'
        },
        {
          bankId: 3,
          bankName: '中国工商银行'
        },
        {
          bankId: 23,
          bankName: '交通银行'
        },
        {
          bankId: 6,
          bankName: '平安银行'
        },
        {
          bankId: 10,
          bankName: '中国建设银行'
        }
      ]
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/getbankid$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      bankId: 10
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/sendbindcardverifycode$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功1',
    resultContent: {
      bindCardBizId: '180227050000000013'
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/simplebindcard$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 230,
    resultMessage: '招行开户绑卡失败',
    resultContent: null,
    redirectUrl:
      'http://ppdai.cloud.cmbchina.com/index?secret=DCNT9ZdxZEUnnz8OXubUIF7H+2USHSqn+9XxY5P1FRaW/+LmVtqTDzqpM21opEHmvyljI/jCSS2jz3o8HOoScLmDY+HNE8nTIV5LqqV9WvOIFdLzaHBeTqPYnBphep8y9bcDMmDQFp1x8TUoXQLeafTBV4yVYZSIeaE6OOJm8GB3VRsTxAEDD4DfVSNGwP+eC/0AihnxQtinb+zLSOQb8t6dXqEdmJW1t4QrHMG4bWDXa7xOq1HosTPTn2r68deb3RDf09ngKLkZDLVihmKdzBCf1Ab0lXx7CWGon/Iptwj11swze7NR9erWQ2mpnB8x1mjLWej0szEmHkgD/EcMgIGokm6U2q2xg5Py221FsTJEGBnIFWvd3+QjlKNm+Y2yb+tEJlnV6xAmbdKvfGuFPFAMSf6XxV9saHMd0AU+io9OQmNVaSoijGLPNnkPF1wg6oP3dF6kPEAY8YuemDhQjaYEy/CcyX9hUbnXlUziQZeYifA8j40MZJbkMS5V0rT2'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/submitbindcardverifycode$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: '/xxx'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/bindcardcallback$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      openAccountStatus: true
    },
    redirectUrl: '/bindcard'
  }
})

/** ----------------------------------------------   Upload   ----------------------------------------------- ****/
Mock.mock(/^\/api\/bigm\/biz\/getidpicuploadstatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      appFacePPStatus: true,
      id136Status: true,
      id137Status: false,
      id138Status: true,
      isPassed: true
    },
    redirectUrl: '/loanstatus'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/loaddataidpicture$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      appFacePPStatus: true,
      id136Status: true,
      id137Status: false,
      id138Status: true,
      isPassed: false
    },
    redirectUrl: '/loanstatus'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/geth5iduploadurl$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl:
      'http://pic.ppdai.com/idCardUpload.html?from=bigm&returnurl=https://test.ppdai.com:9001/info.html#/idupload?tag=bigger-e&protocol=1'
  }
})

Mock.mock(/^\/api\/bigm\/biz\/submitdataidpicture$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      isPassed: true,
      id136Status: true,
      id137Status: true,
      id138Status: true
    },
    redirectUrl: 'https://www.baidu.com'
  }
})

/** ----------------------------------------------   Rolecenter   ----------------------------------------------- ****/
Mock.mock(/^\/api\/bigm\/biz\/rolenotmatchmeta$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      switchRoleUrl:
        'https://passport.ppdai.com/switchrolemobile.html#/?appid=1000001967&redirect=https%3A%2F%2Fjie.ppdai.com'
    },
    redirectUrl: null
  }
})

/** ----------------------------------------------   Success   ----------------------------------------------- ****/
Mock.mock(/^\/api\/bigm\/biz\/getloanstatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: {
      loanAmount: 3000,
      loanPeriod: 12,
      actualAmount: 2670.0299999999997,
      bankName: '中国银行',
      bankTailNum: 3111,
      status: 999,
      usedCouponAmount: 0.0,
      atIdPictureAuditByManual: true,
      loanProtocolUrl: 'http://baidu.com',
      loanProtocolName: '借款协议及协议'
    },
    redirectUrl: null
  }
})

Mock.mock(/^\/api\/bigm\/biz\/checkloanstatus$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null,
    redirectUrl: '/loanfailure-bigger' // redirectUrl不为空，就跳转，否则留在当前页
  }
})

/** ----------------------------------------------   Eveluate   ----------------------------------------------- ****/
Mock.mock(/^\/api\/bigm\/biz\/getevaluation$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null
    // resultContent: {
    //   score: 4.0
    // }
  }
})

Mock.mock(/^\/api\/bigm\/biz\/addevaluation$/, ({ url, type, body }) => {
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '调用成功',
    resultContent: null
  }
})
