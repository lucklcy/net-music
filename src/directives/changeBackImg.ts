import { DirectiveOptions } from 'vue'
import { preloadImg } from '@/utils/index.ts'

const directive: DirectiveOptions = {
  inserted(el, node) {
    const { backgroundImg } = el.dataset
    preloadImg(backgroundImg as string).then(() => {
      el.style.backgroundImage = `url(${backgroundImg})`
    })
  },
  update(el) {
    const { backgroundImg } = el.dataset
    preloadImg(backgroundImg as string).then(() => {
      el.style.backgroundImage = `url(${backgroundImg})`
    })
  }
}

export default directive
