import { cartService } from '../utils/cartService'
import { setCartWidgetQuantity } from '../utils'

const cartSelector = '[data-cart="cart"]'

export const cartWidget = () => {
  const cartDOMElement = document.querySelector(cartSelector)

  if (!cartDOMElement) {
    cartService
      .getCart()
      .then((response) => {
        if (
          response.data !== undefined &&
          response.data.item_count !== undefined
        ) {
          setCartWidgetQuantity(response.data.item_count)
          return
        }

        console.error(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}