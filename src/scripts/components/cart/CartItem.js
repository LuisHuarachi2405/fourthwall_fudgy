/** @jsx h */

import { h } from 'preact'
import { CartQuantity } from './CartQuantity'
import { urls } from '../../utils'

export const CartItem = ({
  id,
  image,
  productTitle,
  variantTitle,
  url,
  quantity,
  price,
  onQuantityChange,
}) => {
  const handleRemoveItem = () => {
    onQuantityChange(0, id, productTitle)
  }

  const decodeProductName = (productName) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = productName;
    return textarea.value
  }

  return (
    <div data-testid="cart.item" className="cart-item">
      <div className="cart-item__image">
        <a href={urls.cartItemLocalizedPrefix + url} className="cart-item__image-link">
          <div className="image image--background-color">
            <div className="image__object">
            {image && <img src={image} alt={productTitle} />}
            </div>
          </div>
        </a>
      </div>

      <div className="cart-item__main">
        <div className="cart-item__description">
          <a href={urls.cartItemLocalizedPrefix + url} className="cart-item__title">
            {decodeProductName(productTitle)}
          </a>
          {variantTitle && (
            <p data-testid="item.details" className="cart-item__variant-title">{variantTitle}</p>
          )}
        </div>

        <div className="cart-item__price">
          <p className="cart-item__price-value">{price}</p>
        </div>

        <div className="cart-item__quantity">
          <CartQuantity id={id} value={quantity} onChange={onQuantityChange} />
        </div>
      </div>

      <div className="cart-item__remove">
        <button className="cart-item__remove-button" onClick={handleRemoveItem}>
          <svg
            class="svg-fill-current-color"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7L1.27 1.27 7 7l5.73-5.73L7 7zm0 0l5.73 5.73L7 7l-5.73 5.73L7 7z"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="square"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
