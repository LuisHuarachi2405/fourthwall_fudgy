import {cssClasses, setBodyScroll } from '../utils'

export const tiers = () => {
  const selectors = {
    modalSelector: '[data-modal="tiers"]',
    modalTriggerSelector: '[data-modal-trigger="tiers"]',
    modalClose: '[data-modal-trigger-close="tiers"]',
    modalContent: '[data-modal-content="tiers"]',
    form: '[data-gift-tier="form"]',
    error: '[data-gift-tier="error"]',
    priceSpan: '[data-gift-tier="price-span"]',
    priceLabel: '[data-gift-tier="options"]',
    quantitySelectContainer: '[data-select="container"]',
    quantityInputContainer: '[data-select-input="more"]',
    inputPrices: '[data-gift-tier="price-input"]',
    totalPrice: '[data-gift-tier="total-price"]',
    quantity: '[data-gift-tier="quantity"]',
    tierNameSpan: '[data-gift-tier="name"]'
  }

  const modalTriggers = document.querySelectorAll(selectors.modalTriggerSelector)
  const cancelButtons = document.querySelectorAll(selectors.modalClose)
  const tiersPriceInputs = document.querySelectorAll(selectors.inputPrices)
  const quantitySelectors = document.querySelectorAll(selectors.quantity)
  const priceSpan = document.querySelectorAll(selectors.priceSpan)
  const totalPriceContainer = document.querySelector(selectors.totalPrice)
  const form = document.querySelector(selectors.form)
  const errorElem = document.querySelector(selectors.error)
  const changeEvents = ['change', 'keyup']
  let modalEventsAssigned = false
  let autoTriggerHash = window.location.hash

  const assignModalEvents = () => {
    if (modalEventsAssigned) return

    for (let x = 0; x < cancelButtons.length; x++) {
      cancelButtons[x].addEventListener('click', (e) => {
        e.preventDefault()
        const quantityInputContainer = document.querySelector(selectors.quantityInputContainer)
        const input = quantityInputContainer.querySelector('input')
        const quantitySelectContainer = document.querySelector(selectors.quantitySelectContainer)
        const select = quantitySelectContainer.querySelector('select')
        const errorElem = document.querySelector(selectors.error)
        errorElem.classList.remove(cssClasses.visible)
        select.value = '1'
        select.setAttribute('name', 'quantity')
        input.removeAttribute('name')
        quantitySelectContainer.classList.remove('hidden')
        quantityInputContainer.classList.add('hidden')
        toggleModal()
      })
    }

    for (let z = 0; z < 2; z++) {
      if (tiersPriceInputs[z]) tiersPriceInputs[z].addEventListener('change', checkQuantity)
      for(let y = 0; y < changeEvents.length; y++){
        if (quantitySelectors[z]) quantitySelectors[z].addEventListener(changeEvents[y], checkQuantity)
      }
    }

    if (form) form.addEventListener('submit', (e) => {
      if (errorElem.classList.contains(cssClasses.visible)) e.preventDefault()
    })

    modalEventsAssigned = true
  }

  const checkQuantity = () => {
    for(let i = 0; i < tiersPriceInputs.length; i++) {
      if (tiersPriceInputs[i].checked) {
        let price = tiersPriceInputs[i].dataset.monthlyPrice || tiersPriceInputs[i].dataset.annualPrice

        for (let z = 0; z < quantitySelectors.length; z++) {
          if (quantitySelectors[z].hasAttribute('name')) {
            if (quantitySelectors[z].value == '' || quantitySelectors[z].value == 0) {
              totalPriceContainer.innerHTML =  ''
              errorElem.classList.add(cssClasses.visible)
            } else {
              let total = price * quantitySelectors[z].value
              totalPriceContainer.innerHTML = ' ($' + (total % 1 == 0 ? total : total.toFixed(2)) + ')'
              if (errorElem.classList.contains(cssClasses.visible)) errorElem.classList.remove(cssClasses.visible)
            }
          }
        }
      }
    }
  }

  const toggleModal = () => {
    const modal = document.querySelector(selectors.modalSelector)
    const modalContent = document.querySelector(selectors.modalContent)
    modalContent.classList.toggle(cssClasses.hidden)
    modal.classList.toggle(cssClasses.hidden)
    modal.classList.toggle(cssClasses.visible)

    if (modal.classList.contains(cssClasses.visible)) {
      setBodyScroll(false)
    } else {
      setBodyScroll(true)
    }
  }

  const updateModalDetails = (tierOfferData) => {
    const monthlyPriceSpan = Array.from(priceSpan).filter((span) => span.getAttribute('id') == 'monthly-price')[0]
    const annualPriceSpan = Array.from(priceSpan).filter((span) => span.getAttribute('id') == 'annual-price')[0]
    const monthlyPriceInput = Array.from(tiersPriceInputs).filter((input) => input.getAttribute('id') == 'monthly')[0]
    const annualPriceInput = Array.from(tiersPriceInputs).filter((input) => input.getAttribute('id') == 'annual')[0]
    const priceLabel = document.querySelector(selectors.priceLabel)
    const tierNameSpan = document.querySelector(selectors.tierNameSpan)
    let includePromotion = false

    if (tierNameSpan) tierNameSpan.innerHTML = tierOfferData.tierName
    if (tierOfferData.annualPrice != '0') {
      if (tierOfferData.discountFirstMonthPrice != '' && tierOfferData.discountFirstMonthPrice != '0' && includePromotion) {
        monthlyPriceSpan.innerHTML = `<span class="tiers-modal__option-price--line-through">$${tierOfferData.monthlyPrice}</span> $${tierOfferData.discountFirstMonthPrice} <span class="tiers-modal__option-price--description">first month</span>`
        monthlyPriceInput.dataset.monthlyPrice = tierOfferData.discountFirstMonthPrice
      } else {
        monthlyPriceSpan.innerHTML = '$' + tierOfferData.monthlyPrice
        monthlyPriceInput.dataset.monthlyPrice = tierOfferData.monthlyPrice
      }
      monthlyPriceInput.setAttribute('value', tierOfferData.monthlyOfferId)

      if (tierOfferData.discountFirstYearPrice != '' && tierOfferData.discountFirstYearPrice != '0' && includePromotion) {
        annualPriceSpan.innerHTML = `<span class="tiers-modal__option-price--line-through">$${tierOfferData.annualPrice}</span> $${tierOfferData.discountFirstYearPrice} <span class="tiers-modal__option-price--description">first year</span>`
        annualPriceInput.dataset.annualPrice = tierOfferData.discountFirstYearPrice
      } else {
        annualPriceSpan.innerHTML = '$' + tierOfferData.annualPrice
        annualPriceInput.dataset.annualPrice = tierOfferData.annualPrice
      }
      annualPriceInput.setAttribute('value', tierOfferData.annualOfferId)
    } else {
      priceLabel.classList.add(cssClasses.hidden)
      document.querySelector(selectors.modalContent).classList.add('modal__content--small')
      document.querySelector('.tiers-modal__quantity-container').classList.add('tiers-modal__quantity-container--expand')
      monthlyPriceInput.dataset.monthlyPrice = tierOfferData.monthlyPrice
      monthlyPriceInput.setAttribute('value', tierOfferData.monthlyOfferId)
    }
  }

  for (let i = 0; i < modalTriggers.length; i++) {
    modalTriggers[i].addEventListener('click', (e) => {
      e.preventDefault()
      if (tiersPriceInputs) tiersPriceInputs[0].checked = true
      const monthlyPrice = e.currentTarget.getAttribute('monthly-price')
      const annualPrice = e.currentTarget.getAttribute('annual-price')
      const monthlyOfferId = e.currentTarget.getAttribute('monthly-offer-id')
      const annualOfferId = e.currentTarget.getAttribute('annual-offer-id')
      const discountFirstMonthPrice = e.currentTarget.getAttribute('discount-first-month-price')
      const discountFirstYearPrice = e.currentTarget.getAttribute('discount-first-year-price')
      const tierName = e.currentTarget.getAttribute('tier-name')
      updateModalDetails({monthlyPrice: monthlyPrice, annualPrice: annualPrice, monthlyOfferId: monthlyOfferId, annualOfferId: annualOfferId, discountFirstMonthPrice: discountFirstMonthPrice, discountFirstYearPrice: discountFirstYearPrice, tierName: tierName})
      checkQuantity()
      toggleModal()
      assignModalEvents()
    })

    if(modalTriggers[i].getAttribute('auto-trigger') == autoTriggerHash) modalTriggers[i].click()
  }
}