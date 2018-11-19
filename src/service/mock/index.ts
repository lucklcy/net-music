import Mock from 'mockjs'

Mock.setup({
  timeout: 1000
})

Mock.mock(/^\/api\/***$/, (config: { [propName: string]: any }) => {
  const { url, type, body } = config
  console.log(`'${url}' by '${type}'\t\tparams is:${body}`)
  return {
    result: 0,
    resultMessage: '成功',
    resultContent: null,
    redirectUrl: null
  }
})
