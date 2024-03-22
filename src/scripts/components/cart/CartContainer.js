/** @jsx h */

import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import classNames from 'classnames'

import { cartService } from '../../utils/cartService'
import { CartStore } from './index'
import { CartHeader } from './CartHeader'
import { CartItemsHeader } from './CartItemsHeader'
import { CartFooter } from './CartFooter'
import { CartItem } from './CartItem'
import { CartModal } from './CartModal'
import {
  strings,
  urls,
  cssClasses,
  setBodyScroll,
  getPriceString,
  setCartWidgetQuantity,
  scrollToElement
} from '../../utils'

const Cart = ({
  modalContent,
  modalActive,
  setModalContent,
  setModalActive,
  currencyIso,
}) => {
  const errorRef = useRef(null)
  const [cartError, setCartError] = useState(null)
  const [cartLoaded, setCartLoaded] = useState(false)
  const [cartErrorOnLoad, setCartErrorOnLoad] = useState(false)
  const [price, setTotalPrice] = useState(null)
  const [currency, setTotalCurrency] = useState(null)
  const [items, setItems] = useState(null)
  const [itemCount, setItemCount] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)
  
  const handleCartErrorDisplay = (error) => {
    if (
      !error.response ||
      !error.response.data ||
      !error.response.data.message
    ) {
      setCartError(strings.generalError)
      return
    }

    setCartError(
      `${error.response.data.message}: ${error.response.data.description}`
    )
  }

  useEffect(() => {
    cartService
      .getCart()
      .then((response) => {
        setItems(response.data.items)
        setItemCount(response.data.item_count)
        setCartWidgetQuantity(response.data.item_count)
        setTotalPrice(response.data.total_price)
        setTotalCurrency(response.data.cart_currency)
        setCartLoaded(true)
      })
      .catch((error) => {
        setCartLoaded(true)
        setCartErrorOnLoad(true)
        handleCartErrorDisplay(error)
      })
  }, [])
  

  useEffect(() => {
    if (cartError) {
      scrollToError()
    }
  }, [cartError])

  const renderItem = ({
    id,
    images,
    product_title,
    variant_title,
    price,
    quantity,
    url,
  }) => (
    <CartItem
      id={id}
      image={images[0] ? images[0].url : undefined}
      productTitle={product_title}
      variantTitle={variant_title}
      price={getPriceString(price, currency)}
      quantity={quantity}
      url={url}
      onQuantityChange={handleOnQuantityChange}
    />
  )

  const handleOnQuantityChange = (quantity, id, title) => {
    if (quantity === 0) {
      setModalContent({
        title,
        callback: (confirm) => {
          if (confirm) {
            return updateQuantity(quantity, id)
          }
          setModalActive(false)
        },
      })
      setModalActive(true)
    } else {
      updateQuantity(quantity, id)
    }
  }

  const updateQuantity = (quantity, id) => {
    setCartLoading(true)
    setModalActive(false)
    setCartError(null)

    cartService
      .setItemQuantity(id, quantity)
      .then((response) => {
        setTotalPrice(response.data.total_price)
        setItems(response.data.items)
        setItemCount(response.data.item_count)
        setCartWidgetQuantity(response.data.item_count)
        setCartLoading(false)
      })
      .catch((error) => {
        setModalActive(false)
        setCartLoading(false)
        handleCartErrorDisplay(error)
      })
  }
  
  const scrollToError = () => {
    scrollToElement({
      element: errorRef.current,
      offset: 100,
      ifNeeded: true,
    })
  }

  if (!cartLoaded) {
    return
  }

  if (cartErrorOnLoad) {
    return (
      <div className="cart cart--error-on-load">
        <div ref={errorRef} className="cart__error">
          <div className="alert alert--error">{cartError}</div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__content">
          <h1 className="cart-empty__heading">{strings.cart.emptyHeading}</h1>
          <div className="cart-empty__cta">
            <a
              href={urls.allProductsCollection}
              class="button button--primary button--large button--wide"
            >
              {strings.startShopping}
            </a>
          </div>
        </div>
      </div>
    )
  }

  const className = classNames('cart', { [cssClasses.loading]: cartLoading })

  if (modalActive) {
    setBodyScroll(false)
  } else {
    setBodyScroll(true)
  }

  return (
    <div className={className}>
      {modalActive && (
        <CartModal
          title={modalContent.title}
          callback={modalContent.callback}
        />
      )}
      
      <div className="cart__header">
        <CartHeader itemCount={itemCount} totalPrice={getPriceString(price, currency)} />
      </div>
    
      {cartError && (
        <div ref={errorRef} className="cart__error">
          <div className="alert alert--error">{cartError}</div>
        </div>
      )}

      <div data-testid="cart.content" className="cart__content">
        <div className="cart__items-header">
          <CartItemsHeader />
        </div>

        <div className="cart__items">{items.map(renderItem)}</div>
      </div>

      <div className="cart__footer">
        <CartFooter totalPrice={getPriceString(price, currency)} currencyIso={currencyIso} />
      </div>
    </div>
  )
}

// pass context values to Cart component and export Container not Cart itself
export const CartContainer = () => {
  return (
    <CartStore.Consumer>
      {({ modal }) => (
        <Cart
          modalContent={modal.content}
          modalActive={modal.active}
          setModalActive={modal.setActive}
          setModalContent={modal.setContent}
          currencyIso={modal.currencyIso}
        />
      )}
    </CartStore.Consumer>
  )
}
