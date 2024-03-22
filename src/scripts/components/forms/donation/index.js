import { cssClasses, strings } from '../../../utils'
import { isEmpty, isNumeric } from '../../../utils/validate'

import { selectors } from './constants'

export const setupDonationForm = () => {
  const form = document.querySelector(selectors.form)
  const nameInput = document.querySelector(selectors.name)
  const messageInput = document.querySelector(selectors.message)
  const formSubmitButton = document.querySelector(selectors.formSubmitButton)
  const amountRadios = document.querySelectorAll(selectors.amountRadio)
  const amountInput = document.querySelector(selectors.amountInput)
  const amountInputContainer = document.querySelector(
    selectors.amountInputContainer
  )
  const amountFinalInput = document.querySelector(selectors.amountFinalInput)

  if (!amountInputContainer || !amountInput || !amountRadios.length) {
    console.error('DOM Elements for form amounts do not exist.')
    return
  }

  if (!formSubmitButton) {
    console.error('DOM Element for form submit button does not exist.')
    return
  }

  const setFormLoading = (loading) => {
    if (loading) {
      formSubmitButton.disabled = true
      formSubmitButton.classList.add(cssClasses.loading)
    } else {
      formSubmitButton.disabled = false
      formSubmitButton.classList.remove(cssClasses.loading)
    }
  }

  const handleAmountRadioChange = (e) => {
    if (e.currentTarget.checked) {
      amountInput.value = ''
      amountInput.classList.remove(cssClasses.filled)
      amountInputContainer.classList.remove(cssClasses.selected)
    }
  }

  const handleAmountInputFocus = () => {
    amountInputContainer.classList.add(cssClasses.selected)
    for (let i = 0; i < amountRadios.length; i++) {
      amountRadios[i].checked = false
    }
  }

  const handleAmountInputBlur = () => {
    if (amountInput.value === '') {
      amountInputContainer.classList.remove(cssClasses.selected)
    } else {
      amountInput.value = currencyData.currency === 'JPY' ? amountInput.value : parseFloat(amountInput.value).toFixed(2)
    }
  }

  const displayErrors = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      let errorEl = document.querySelector(
        `[${selectors.inputError}="${errors[i].field}"]`
      )
      errorEl.innerHTML = errors[i].content
      errorEl.classList.add(cssClasses.visible)
    }
  }

  const clearAllErrors = () => {
    const formErrors = document.querySelectorAll(`[${selectors.inputError}]`)

    for (let i = 0; i < formErrors.length; i++) {
      formErrors[i].classList.remove(cssClasses.visible)
    }
  }

  const getDonationAmount = () => {
    let donationAmount = 0
    let amountRadioChecked = document.querySelector(
      `${selectors.amountRadio}:checked`
    )

    if (amountRadioChecked) {
      donationAmount = amountRadioChecked.value
    } else {
      donationAmount = amountInput.value
    }

    if (isEmpty(donationAmount)) {
      donationAmount = 0
    }

    let donationValue = currencyData.currency === 'JPY' ? parseFloat(donationAmount.replace(",", "")) : parseFloat(donationAmount)

    return donationValue
  }

  const getValidationErrors = () => {
    let errors = []

    let donationAmount = getDonationAmount()

    if (donationAmount === 0) {
      errors.push({
        field: 'amount',
        content: strings.donation.invalidAmountError,
      })
    } else if (donationAmount < 0 || !isNumeric(donationAmount)) {
      errors.push({
        field: 'amount',
        content: strings.donation.missingAmountError,
      })
    }

    if (nameInput) {
      if (isEmpty(nameInput.value)) {
        errors.push({
          field: 'name',
          content: strings.donation.missingNameError,
        })
      }
    }

    if (messageInput) {
      if (isEmpty(messageInput.value)) {
        errors.push({
          field: 'message',
          content: strings.donation.missingMessageError,
        })
      }
    }

    return errors
  }

  const validateForm = () => {
    const validationErrors = getValidationErrors()

    clearAllErrors()

    if (validationErrors.length > 0) {
      displayErrors(validationErrors)
      return false
    }

    return true
  }

  const initValidationOnChange = () => {
    amountInput.addEventListener('blur', validateForm)

    if (nameInput) {
      nameInput.addEventListener('blur', validateForm)
    }

    if (messageInput) {
      messageInput.addEventListener('blur', validateForm)
    }
  }

  const handleFormSubmit = (e) => {
    if (validateForm()) {
      setFormLoading(true)
      amountFinalInput.value = getDonationAmount()
    } else {
      initValidationOnChange()
      e.preventDefault()
    }
  }

  const setEvents = () => {
    // Amount inputs
    for (let i = 0; i < amountRadios.length; i++) {
      amountRadios[i].addEventListener('change', handleAmountRadioChange)
    }
    amountInput.addEventListener('focus', handleAmountInputFocus)
    amountInput.addEventListener('blur', handleAmountInputBlur)

    // Form submit
    form.addEventListener('submit', handleFormSubmit)
  }

  setEvents()
}

export const donation = () => {
  if (document.querySelector(selectors.form)) {
    setupDonationForm()
  }
}
