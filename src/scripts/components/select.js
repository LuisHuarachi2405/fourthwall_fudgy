import { cssClasses } from '../utils'
const selectContainerSelector = '[data-select="container"]'

const extendSelect = (selectContainer) => {
  const select = selectContainer.querySelector('select')
  const inputContainer = document.querySelector(
    `[data-select-input="${select.dataset.triggerInput}"]`
  )
  const input = inputContainer.querySelector('input')

  const onChange = (e) => {
    if (e.currentTarget.value === 'more') {
      selectContainer.classList.add(cssClasses.hidden)
      inputContainer.classList.remove(cssClasses.hidden)
      select.removeAttribute('name')
      input.setAttribute('name', 'quantity')
      input.focus()
    }
  }

  select.addEventListener('change', onChange)
}

export const select = () => {
  const selectContainers = document.querySelectorAll(selectContainerSelector)
  for (let i = 0; i < selectContainers.length; i++) {
    extendSelect(selectContainers[i])
  }
}
