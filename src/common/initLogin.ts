import _http from '@/service'
import store from '@/store'
import { UserInfo } from '@/store/state'
import { srorageGet } from '@/utils'

const initPromise: Promise<any> = new Promise((resolve, reject) => {
  store.commit('setPlayList', srorageGet('playList'))
  store.commit('setCurrentSong', srorageGet('currentSong'))
  _http
    .login({ phone: 15618334565, password: 'forget416' })
    .then((resultLogin: { profile: UserInfo }) => {
      store.commit('setUserInfo', resultLogin.profile)
      resolve()
    })
    .catch((err: Error) => {
      reject(err)
    })
})

export default initPromise
