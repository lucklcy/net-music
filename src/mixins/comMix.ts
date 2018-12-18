import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { HttpService, default as service } from '@/service'
import { isValidUrl } from '@/utils'
import { isEmpty, isFunction } from 'lodash'
import { Indicator } from '@/common/interface/base.ts'

@Component
export default class CommonMixin extends Vue {
  protected service: HttpService = service
  protected beforeRedirect: (url: string) => void
  @Mutation
  protected isLoading!: (payload: boolean | Indicator) => void
  protected redirectTo(url: string) {
    const beforeRedirect = this.beforeRedirect || null
    if (!isEmpty(url)) {
      if (isFunction(beforeRedirect)) {
        beforeRedirect(url)
      }
      if (isValidUrl(url)) {
        this.isLoading(false)
        window.location.href = url
      } else {
        this.isLoading(false)
        if (url.indexOf('/free') === 0) {
          this.$router.push({
            path: url
          })
        } else {
          this.$router.push({
            path: url,
            replace: true
          })
        }
      }
    }
  }
}
