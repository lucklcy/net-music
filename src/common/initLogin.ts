import _http from '@/service'
import store from '@/store'
import { UserInfo } from '@/common/interface/base.ts'

const initPromise: Promise<any> = new Promise((resolve, reject) => {
  _http
    .login({ phone: 15618334565, password: 'forget416' })
    .then((resultLogin: { profile: UserInfo }) => {
      let { profile } = resultLogin
      store.commit('setUserInfo', profile)
      let { userId } = profile
      _http.getLikedSongList({ uid: userId }).then((res: { ids: number[]; code: number }) => {
        let { ids, code } = res
        code === 200 && store.commit('initialLikedSonglist', ids)
        resolve()
      })
    })
    .catch((err: Error) => {
      reject(err)
    })
})

export default initPromise
