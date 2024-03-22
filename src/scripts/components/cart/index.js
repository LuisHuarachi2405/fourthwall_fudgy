/** @jsx h */

import { render, h, createContext } from 'preact'
import { useState } from 'preact/hooks'

import { CartContainer } from './CartContainer'

const cartComponentSelector = '#cart-component'
export const CartStore = createContext(false)

export const cart = () => {
  let cartComponent = document.querySelector(cartComponentSelector)
  let currencyIso = cartComponent ? cartComponent.dataset.currency || '' : ''
  if (!cartComponent) return
  const CartApp = () => {
    const [modalActive, setModalActive] = useState(false)
    const [modalContent, setModalContent] = useState({
      name: '',
      callback: null,
    })

    const initialStore = {
      modal: {
        active: modalActive,
        setActive: setModalActive,
        content: modalContent,
        setContent: setModalContent,
        currencyIso: currencyIso,
      },
    }

    return (
      <CartStore.Provider value={initialStore}>
        <CartContainer />
      </CartStore.Provider>
    )
  }

  render(<CartApp />, cartComponent)
}
