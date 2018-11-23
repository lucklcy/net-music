import { State } from './state'
import { isBoolean, isObject } from 'lodash'
import { UserInfo } from './state'

export interface IkeyVal {
  key: string
  val: any
}

export default {
  isLoading(state: State, val: boolean | {}) {
    if (isBoolean(val)) {
      Object.assign(state.indicator, { text: '正在加载...', visible: val })
    } else if (isObject(val)) {
      Object.assign(state.indicator, val)
    }
  },
  setUserInfo(state: State, val: UserInfo) {
    Object.assign(state.userInfo, val)
  }
}
