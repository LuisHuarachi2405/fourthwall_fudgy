import { cssClasses } from '../utils'

const accordionTriggerSelector = '[data-accordion="trigger"]'

export const accordion = () => {
  const accordions = document.querySelectorAll(accordionTriggerSelector)

  for (let i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener('click', (e) => {
      e.currentTarget.classList.toggle(cssClasses.active)

      const content = e.currentTarget.nextElementSibling

      if (content) {
        const { classList, style, scrollHeight } = content
        classList.toggle(cssClasses.active)

        if (style.maxHeight) {
          style.maxHeight = null
        } else {
          style.maxHeight = scrollHeight + 'px'
        }
      }
    })
  }
}
