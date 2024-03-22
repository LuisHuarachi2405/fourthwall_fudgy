/** @jsx h */

import { h } from 'preact'
import { strings } from '../../utils'

export const CartItemsHeader = () => {
  return (
    <div className="cart-items-header">
      <div className="cart-items-header__item">
        {strings.cart.tableHeader.item}
      </div>
      <div className="cart-items-header__quantity">
        {strings.cart.tableHeader.quantity}
      </div>
      <div className="cart-items-header__price">
        {strings.cart.tableHeader.price}
      </div>
      <div className="cart-items-header__remove" />
    </div>
  )
}
