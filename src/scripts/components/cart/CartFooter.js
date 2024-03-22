/** @jsx h */

import { h } from 'preact'

import { urls, strings } from '../../utils'

export const CartFooter = ({ totalPrice, currencyIso }) => {
  return (
    <div className="cart-footer">
      <div className="cart-footer__cta-container">
        <div className="cart-footer__totals">
          <div className="cart-totals">
            <div className="cart-totals__item cart-totals__item--subtotal">
              <div className="cart-totals__label">
                <span className="cart-totals__subtotal">
                  {strings.subtotal}
                </span>
              </div>
              <div className="cart-totals__amount cart-totals__amount--subtotal">
                {currencyIso} {totalPrice}
              </div>
            </div>
          </div>
        </div>

        <div className="cart-footer__cta">
          <div className="cart-footer__checkout">
            <form
              action={urls.cart}
              method="post"
              novalidate
              className="cart-footer__checkout-form"
              data-cart="form"
            >
              <button
                type="submit"
                name="checkout"
                className="button button--primary button--large button--expand"
                data-cart="cta"
                data-testid="cart.checkout.button"
              >
                {strings.checkout}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="cart-footer__continue">
        <a
          href={urls.allProductsCollection}
          class="button button--outline button--large button--expand"
        >
          {strings.backToShopping}
        </a>
      </div>
    </div>
  )
}
