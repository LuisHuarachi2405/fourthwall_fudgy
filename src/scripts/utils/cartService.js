import axios from 'axios'
import { urls } from './index'

export const cartService = {
  getCart: () => axios.get(`${urls.cart}.js`),

  setItemQuantity: (id, quantity) =>
    axios.post(`${urls.cartChangeUrl}.js`, {
      id,
      quantity,
    }),

  addToCart: (items) =>
    axios.post(`${urls.cartAddUrl}.js`, {
      items,
    }),
}
