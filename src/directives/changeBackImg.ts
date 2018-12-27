import { DirectiveOptions } from 'vue'
import { preloadImg } from '@/utils/index.ts'

const directive: DirectiveOptions = {
  inserted(el, binding) {
    const { arg } = binding
    const { backgroundImg } = el.dataset
    preloadImg(backgroundImg as string).then(() => {
      if (arg === 'imgsrc') {
        const imgElement = el as HTMLImageElement
        imgElement.src = `${backgroundImg}`
      } else {
        el.style.backgroundImage = `url(${backgroundImg})`
      }
    })
  },
  update(el, binding) {
    const { arg } = binding
    const { backgroundImg } = el.dataset
    preloadImg(backgroundImg as string).then(() => {
      if (arg === 'imgsrc') {
        const imgElement = el as HTMLImageElement
        imgElement.src = `${backgroundImg}`
      } else {
        el.style.backgroundImage = `url(${backgroundImg})`
      }
    })
  }
}

export default directive
