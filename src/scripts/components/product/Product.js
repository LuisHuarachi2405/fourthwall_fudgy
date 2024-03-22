import {
  strings,
  getPriceString,
  cssClasses,
  setCartWidgetQuantity,
} from '../../utils'
import { toggleDrawer } from '../drawer'
import { Variants } from './Variants'
import { ProductGallery } from './ProductGallery'
import { cartService } from '../../utils/cartService'
import { accountService } from '../../utils/accountService'

const selectors = {
  productJSON: '[data-product="json"]',
  quantity: '[data-product="quantity"]',
  addToCartButton: '[data-product="add"]',
  error: '[data-product="error"]',
  quantityError: '[data-product="quantity-error"]',
  drawerImageContainer: '[data-product-info="image-container"]',
  priceInfo: '[data-product-info="price"]',
  titleInfo: '[data-product-info="title"]',
  quantityInfo: '[data-product-info="quantity"]',
  quantityCartInfo: '[data-product-info="cart-quantity"]',
  priceCartInfo: '[data-product-info="cart-price"]',
  recommendedAddToCartButton: '[data-product="recommended-add"]',
  recommendedSuccess: '[data-product="recommended-success"]',
  recommendedError: '[data-product="recommended-error"]',
  redeemForm: '[data-product="redeem"]',
  variantRedeem: '[data-product="variant-redeem"]',
  membersOnly: '[data-product="members-only"]',
  notLoggedIn: '[data-product="not-logged-in"]',
  nonMember: '[data-product="non-member"]',
  changeTierButton: '[data-product="change-tier"]',
  options: '[data-product="options"]',
  cta: '[data-product="cta"]',
  currencyIso: '[data-currency]'
}

export class Product {
  constructor() {
    this.productObject = this.getProduct()

    if (!this.productObject) {
      console.error('Product JSON does not exist.')
      return
    }

    if (this.productObject.images.length > 0) {
      this.productGallery = new ProductGallery({
        selectedVariant: this.productObject.selected_or_first_available_variant,
      })
    }

    this.variants = new Variants({
      product: this.productObject,
      onVariantChange: this.variantChangeCallback.bind(this),
    })

    this.handleAddToCartClick = this.handleAddToCartClick.bind(this)
    this.handleRedeemFormSubmit = this.handleRedeemFormSubmit.bind(this)
    this.onAddToCart = this.onAddToCart.bind(this)
    this.onAddToCartError = this.onAddToCartError.bind(this)
    this.handleRecommendedAddToCart = this.handleRecommendedAddToCart.bind(this)

    this.initAddToCart()
    this.initRedeemForm()
    this.initRecommendedAddToCart()

    if (this.productObject.members_only === true && this.getProduct().available) {
      this.verifyPermission()
    }
  }

  getProduct() {
    const productJSON = document.querySelector(selectors.productJSON)
    if (productJSON) {
      return JSON.parse(productJSON.innerHTML)
    }
    return false
  }

  variantChangeCallback(variant) {
    if (this.productGallery) {
      this.productGallery.updateImagesByVariant(variant)
    }
  }

  toggleMembersOnlyContent(display) {
    const membersOnly = document.querySelector(selectors.membersOnly)
    const options = document.querySelector(selectors.options)
    const cta = document.querySelector(selectors.cta)

    if (display) {
      options && options.classList.remove(cssClasses.hidden)
      cta && cta.classList.remove(cssClasses.hidden)
      membersOnly && membersOnly.remove()
    } else {
      membersOnly && membersOnly.classList.remove(cssClasses.hidden)
      options && options.remove()
      cta && cta.remove()
    }
  }

  toggleNotLoggedInContent(display) {
    const notLoggedInElements = document.querySelectorAll(selectors.notLoggedIn)

    if (display === true) {
      notLoggedInElements.forEach((el) => {
        el && el.classList.remove(cssClasses.hidden)
      })
    } else {
      notLoggedInElements.forEach((el) => {
        el && el.remove()
      })
    }
  }

  toggleNonMemberContent(display) {
    const nonMemberElements = document.querySelectorAll(selectors.nonMember)

    if (display === true) {
      nonMemberElements.forEach((el) => {
        el && el.classList.remove(cssClasses.hidden)
      })
    } else {
      nonMemberElements.forEach((el) => {
        el && el.remove()
      })
    }
  }

  toggleChangeTierButton(display) {
    const changeTierButton = document.querySelector(selectors.changeTierButton)

    if (display) {
      changeTierButton && changeTierButton.classList.remove(cssClasses.hidden)
    } else {
      changeTierButton && changeTierButton.remove()
    }
  }

  onVerifyPermissionSuccess(account) {
    if (!account.subscription || account.subscription.type !== 'Active') {
      this.toggleNonMemberContent(true)
      this.toggleMembersOnlyContent(false)
      return
    }

    if (this.getProduct().available_for_all_tiers === true) {
      this.toggleMembersOnlyContent(true)
      return
    }

    const isRequiredTier = this.getProduct().required_tiers.some((tier) => {
      return tier.id === account.subscription.tier.id
    })

    if (isRequiredTier) {
      this.toggleMembersOnlyContent(true)
      return
    }

    this.toggleChangeTierButton(true)
    this.toggleMembersOnlyContent(false)
  }

  verifyPermission() {
    accountService
      .getAccount()
      .then((response) => {
        this.onVerifyPermissionSuccess(response.data)
      })
      .catch(() => {
        this.toggleNonMemberContent(true)
        this.toggleNotLoggedInContent(true)
        this.toggleMembersOnlyContent(false)
      })
  }

  initAddToCart() {
    const addToCartButton = document.querySelector(selectors.addToCartButton)
    if (!addToCartButton) return
    addToCartButton.addEventListener('click', this.handleAddToCartClick)
  }

  handleAddToCartClick(e) {
    e.preventDefault()

    if (this.variants.variantErrors()) return

    let selectedVariant = this.variants.getSelectedVariant()
    let quantity = this.getQuantityFromInput()

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      this.setError(strings.missingQuantityError)
      return
    }

    this.addToCart(selectedVariant.id, quantity)
  }

  addToCart(variantId, quantity) {
    this.setError(null)
    this.setAddToCartButtonLoading(true)

    cartService
      .addToCart([{ id: variantId, quantity: parseInt(quantity) }])
      .then(this.onAddToCart)
      .catch(this.onAddToCartError)
      .then(() => {
        this.setAddToCartButtonLoading(false)
      })
  }

  onAddToCart(response) {
    this.updateDrawerDetails(response.data)
    toggleDrawer('product')
    setCartWidgetQuantity(response.data.cart.item_count)
  }

  onAddToCartError(error) {
    if (
      !error.response ||
      !error.response.data ||
      !error.response.data.message
    ) {
      this.setError(strings.generalError)
      return
    }

    this.setError(
      `${error.response.data.message}: ${error.response.data.description}`
    )
  }

  updateDrawerDetails(data) {
    const item = data.items[0]

    const drawerImageContainer = document.querySelector(
      selectors.drawerImageContainer
    )
    const titleInfo = document.querySelector(selectors.titleInfo)
    const priceInfo = document.querySelector(selectors.priceInfo)
    const quantityInfo = document.querySelector(selectors.quantityInfo)
    const quantityCartInfo = document.querySelector(selectors.quantityCartInfo)
    const priceCartInfo = document.querySelector(selectors.priceCartInfo)
    const currencyIsoSelector = document.querySelector(selectors.currencyIso)
    const currencyIso = currencyIsoSelector ? currencyIsoSelector.dataset.currency : ''

    if (drawerImageContainer) {
      if (item.image) {
        drawerImageContainer.innerHTML = `<img src="${item.image}" alt>`
      } else {
        drawerImageContainer.innerHTML = ''
      }
    }

    if (titleInfo) {
      titleInfo.innerHTML = item.title
    }

    if (priceInfo) {
      priceInfo.innerHTML = getPriceString(item.final_price, data.cart.cart_currency)
    }

    if (quantityInfo) {
      quantityInfo.innerHTML = item.quantity
    }

    if (quantityCartInfo) {
      quantityCartInfo.innerHTML = `${data.cart.item_count} ${
        data.cart.item_count > 1 ? strings.items : strings.item
      }`
    }

    if (priceCartInfo) {
      priceCartInfo.innerHTML = `${currencyIso} ${getPriceString(data.cart.items_subtotal_price, data.cart.cart_currency)}`
    }
  }

  getQuantityFromInput() {
    const quantityElem = document.querySelector(selectors.quantity)

    let quantity = quantityElem.options[quantityElem.selectedIndex].value

    if (quantity === 'more') {
      let inputQuantity = document.querySelector(
        `[data-select-input="${quantityElem.dataset.triggerInput}"] input`
      )
      quantity = inputQuantity.value
    }

    return quantity
  }

  setAddToCartButtonLoading(loading) {
    const button = document.querySelector(selectors.addToCartButton)
    if (!button) return

    if (loading === true) {
      if (!button.classList.contains(cssClasses.loading)) {
        button.classList.add(cssClasses.loading)
      }
      button.disabled = true
      return
    }

    button.classList.remove(cssClasses.loading)
    button.disabled = false
  }

  setError(text) {
    const errorElem = document.querySelector(selectors.error)
    if (!errorElem) return

    if (!text) {
      errorElem.classList.remove(cssClasses.visible)
      errorElem.innerHTML = ''
      return
    }

    errorElem.innerHTML = text
    if (!errorElem.classList.contains(cssClasses.visible)) {
      errorElem.classList.add(cssClasses.visible)
    }
  }

  initRecommendedAddToCart() {
    const recommendedAddToCartButtons = document.querySelectorAll(
      selectors.recommendedAddToCartButton
    )

    for (let i = 0; i < recommendedAddToCartButtons.length; i++) {
      recommendedAddToCartButtons[i].addEventListener(
        'click',
        this.handleRecommendedAddToCart
      )
    }
  }

  handleRecommendedAddToCart(e) {
    const button = e.currentTarget
    const variant = button.dataset.recommendedVariant
    const quantity = button.dataset.recommendedQuantity
    const successElem = document.querySelector(
      `${selectors.recommendedSuccess}[data-recommended-variant="${variant}"]`
    )
    const errorElem = document.querySelector(
      `${selectors.recommendedError}[data-recommended-variant="${variant}"]`
    )

    successElem.classList.remove(cssClasses.visible)
    errorElem.classList.remove(cssClasses.visible)

    this.setRecommendedAddToCartButtonLoading(true, button)

    cartService
      .addToCart([{ id: variant, quantity: parseInt(quantity) }])
      .then((response) => {
        this.onRecommendedAddToCart(response, successElem)
      })
      .catch((error) => {
        this.onRecommendedAddToCartError(error, errorElem)
      })
      .then(() => {
        this.setRecommendedAddToCartButtonLoading(false, button)
      })
  }

  setRecommendedAddToCartButtonLoading(loading, button) {
    if (loading === true) {
      if (!button.classList.contains(cssClasses.loading)) {
        button.classList.add(cssClasses.loading)
      }
      button.disabled = true
      return
    }

    button.classList.remove(cssClasses.loading)
    button.disabled = false
  }

  onRecommendedAddToCart(response, successElem) {
    successElem.classList.add(cssClasses.visible)
    this.updateDrawerDetails(response.data)
    setCartWidgetQuantity(response.data.cart.item_count)
  }

  onRecommendedAddToCartError(error, errorElem) {
    if (
      !error.response ||
      !error.response.data ||
      !error.response.data.message
    ) {
      errorElem.innerHTML = strings.generalError
    } else {
      errorElem.innerHTML = `${error.response.data.message}: ${error.response.data.description}`
    }

    if (!errorElem.classList.contains(cssClasses.visible)) {
      errorElem.classList.add(cssClasses.visible)
    }
  }

  initRedeemForm() {
    const redeemForm = document.querySelector(selectors.redeemForm)
    if (!redeemForm) return
    redeemForm.addEventListener('submit', this.handleRedeemFormSubmit)
  }

  handleRedeemFormSubmit(e) {
    e.preventDefault()

    this.setError(null)

    const variantRedeem = document.querySelector(selectors.variantRedeem)
    if (!variantRedeem) return

    if (this.variants.variantErrors()) return
    let selectedVariant = this.variants.getSelectedVariant()
    variantRedeem.value = selectedVariant.id

    e.target.submit()
  }
}