/** @jsx h */

import { h } from 'preact'
import { strings } from '../../utils'

export const CartHeader = ({ itemCount, totalPrice }) => {
  const itemCountLabel = itemCount === 1 ? strings.item : strings.items
  const heading = strings.cart.heading
    .replace('[item_count]', itemCount)
    .replace('[item_count_label]', itemCountLabel)
    .replace('[total]', totalPrice)

  return (
    <div className="cart-header">
      <h1 className="cart-header__heading">{heading}</h1>
    </div>
  )
}
