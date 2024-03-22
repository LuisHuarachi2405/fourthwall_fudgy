import { cssClasses, setBodyScroll } from '../utils'

const drawerSelector = 'data-drawer'
const triggerSelectorPrimary = 'data-drawer-trigger-primary'
const triggerSelectorSecondary = 'data-drawer-trigger-secondary'

export const toggleDrawer = (targetName) => {
  const drawer = document.querySelector(`[${drawerSelector}="${targetName}"]`)
  drawer.classList.toggle(cssClasses.visible)

  if (drawer.classList.contains(cssClasses.visible)) {
    setBodyScroll(false)
  } else {
    setBodyScroll(true)
  }
}

export const drawer = () => {
  const primaryTriggers = document.querySelectorAll(`[${triggerSelectorPrimary}]`)
  const secondaryTriggers = document.querySelectorAll(`[${triggerSelectorSecondary}]`)

  for (let i = 0; i < primaryTriggers.length; i++) {
    primaryTriggers[i].addEventListener('click', (e) => {
      e.preventDefault()
      const targetName = e.currentTarget.getAttribute(triggerSelectorPrimary)
      toggleDrawer(targetName)
    })
  }

  for (let t = 0; t < secondaryTriggers.length; t++) {
    secondaryTriggers[t].addEventListener('click', (e) => {
      e.target.classList.toggle('active')
    })
  }
}
