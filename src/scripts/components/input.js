import { cssClasses } from '../utils'

const selectors = {
  container: '[data-input="container"]',
  input: '[data-input="input"]',
}

export const setInputFocus = () => {
  let containers = document.querySelectorAll(selectors.container)

  for (let i = 0; i < containers.length; i++) {
    containers[i].addEventListener('click', (e) => {
      if (e.currentTarget.dataset.input === 'container') {
        e.currentTarget.querySelector(selectors.input).focus()
      }
    })
  }
}

export const input = () => {
  let containers = document.querySelectorAll(selectors.container)

  for (let i = 0; i < containers.length; i++) {
    let input = containers[i].querySelector(selectors.input)

    if (input.value !== '') {
      input.classList.add(cssClasses.filled)
    } else {
      input.classList.remove(cssClasses.filled)
    }

    input.addEventListener('blur', () => {
      if (input.value !== '') {
        input.classList.add(cssClasses.filled)
      } else {
        input.classList.remove(cssClasses.filled)
      }
    })
  }

  setInputFocus()
}
