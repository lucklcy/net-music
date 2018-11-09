import { REQUEST_METHOD_MAP } from '../../common/const'
export default [
  /**
   * 获取用户基本资料 /getuserbaseinfo
   * 字段名                                 类型                          描述
   * userId                               Long                          拍拍贷UserId
   * phone                                String                        手机号（若手机已绑定，以掩码格式返回）
   * realName                             String                        真实姓名
   * idNumber                             String                        身份证号（若已通过身份认证，以掩码格式返回）
   * qq                                   String                        QQ号
   * educationId                          Int                           学历Id
   * marriageId                           Int                           婚姻状况Id
   * isPhoneValidate                      Bool                          手机是否绑定
   * isIdValidate                         Bool                          身份认证是否通过
   * isEducationValidate                  Bool                          学历认证是否通过
   *
   * 学历Id       学历Name
   * 2            本科
   * 3            大专
   * 4            高中
   * 5            中专
   * 6            初中及以下
   * 7            硕士研究生
   * 8            博士研究
   *
   * 婚姻状况Id     婚姻状态Name
   * 1              未婚
   * 2              已婚
   * 4              离婚
   */
  {
    subUrl: '/bigm/biz/getuserbaseinfo',
    name: 'getUserBaseInfo',
    method: REQUEST_METHOD_MAP.POST,
    module: 'basic'
  },

  /**
   * 提交用户基本资料 /submituserbaseinfo
   * 字段名                  类型                      描述                      是否必填
   * phone                  String                  手机号                      手机未绑定时 Y，否则 N
   * realName               String                  真实姓名                     身份认证未通过时 Y，否则 N
   * idNumber               String                  身份证号                      身份认证未通过时 Y，否则 N
   * qq                     String                  QQ号                        Y
   * educationId            Int                     学历Id                      学历认证未通过时 Y，否则 N
   * marriageId             Int                     婚姻状况Id                    Y
   *
   * Response:
   * 100 保存数据失败
   * 151 不可执行此操作
   * 200 提交数据为空
   * 201 手机号为空
   * 202 手机号格式有误
   * 203 手机号已被注册
   * 204 超出验证手机次数限制
   * 211 身份证号为空
   * 212 身份证号格式不正确
   * 213 真实姓名为空
   * 214 真实姓名格式不正确
   * 215 身份证已被注册
   * 216 身份认证未通过
   * 217 超出验证身份信息次数限制
   * 221 QQ为空
   * 222 QQ格式不正确
   * 231 婚姻状态为空
   * 232 婚姻状态不正确
   * 241 学历为空
   * 242 学历不正确
   */
  {
    subUrl: '/bigm/biz/submituserbaseinfo',
    name: 'submitUserBaseInfo',
    method: REQUEST_METHOD_MAP.POST,
    module: 'basic'
  },
  /**
   * 获取学历信息     /geteducationinfo
   * Response
   * 字段名                             类型                          描述
   * universityName                   String                        高校名称
   * graduateTime                     String                        毕业年份
   * educationLevel                   Int                           学历层次
   */
  {
    subUrl: '/bigm/biz/geteducationinfo',
    name: 'getEducationInfo',
    method: REQUEST_METHOD_MAP.POST,
    module: 'basic'
  }
]
