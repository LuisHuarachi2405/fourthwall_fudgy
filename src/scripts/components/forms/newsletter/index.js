import { cssClasses, strings } from '../../../utils'
import { isEmpty, isEmail } from '../../../utils/validate'
import { newsletterService } from '../../../utils/newsletterService'

import { selectors } from './constants'

export const setupNewsletterForm = (newsletterFormContainerEl) => {
  const formContainer = newsletterFormContainerEl

  const form = formContainer.querySelector('form')
  const emailInput = formContainer.querySelector(selectors.emailInput)
  const formSubmitButton = formContainer.querySelector(
    selectors.formSubmitButton
  )
  const responseSuccess = formContainer.querySelector(selectors.responseSuccess)
  const responseError = formContainer.querySelector(selectors.responseError)
  const responseErrorContent = formContainer.querySelector(
    selectors.responseErrorContent
  )

  if (!form || !emailInput || !formSubmitButton) {
    console.error('DOM Elements for newsletter components do not exist.')
    return
  }

  if (!responseSuccess || !responseError || !responseErrorContent) {
    console.error('DOM Elements for form responses do not exist.')
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

  const clearAllErrors = () => {
    const formErrors = formContainer.querySelectorAll(`[${selectors.inputError}]`)

    for (let i = 0; i < formErrors.length; i++) {
      formErrors[i].classList.remove(cssClasses.visible)
    }
  }

  const clearResponse = () => {
    responseSuccess.classList.remove(cssClasses.visible)
    responseError.classList.remove(cssClasses.visible)
  }

  const displayErrors = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      let errorEl = formContainer.querySelector(
        `[${selectors.inputError}="${errors[i].field}"]`
      )
      errorEl.innerHTML = errors[i].content
      errorEl.classList.add(cssClasses.visible)
    }
  }

  const setErrorResponseContent = (error) => {
    if (!error.response || !error.response.data) {
      responseErrorContent.innerHTML = `<li>${strings.generalError}</li>`
      return
    }

    responseErrorContent.innerHTML = ''

    for (let key in error.response.data) {
      responseErrorContent.innerHTML += `<li>${error.response.data[key]}</li>`
    }
  }

  const displayErrorResponse = (error) => {
    clearResponse()
    setErrorResponseContent(error)
    responseError.classList.add(cssClasses.visible)
  }

  const displaySuccessResponse = () => {
    clearResponse()
    responseSuccess.classList.add(cssClasses.visible)
  }

  const getValidationErrors = () => {
    let errors = []

    if (isEmpty(emailInput.value)) {
      errors.push({
        field: 'email',
        content: strings.newsletter.missingEmailError,
      })
    } else if (!isEmail(emailInput.value)) {
      errors.push({
        field: 'email',
        content: strings.newsletter.invalidEmailError,
      })
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
    emailInput.addEventListener('blur', validateForm)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      initValidationOnChange()
      return
    }

    clearResponse()
    setFormLoading(true)

    let formData = {
      contact: {
        email: emailInput.value,
      },
    }

    newsletterService
      .register(formData)
      .then((response) => {
        displaySuccessResponse()
        setFormLoading(false)
      })
      .catch((error) => {
        setFormLoading(false)
        displayErrorResponse(error)
      })

    return ''
  }

  const setEvents = () => {
    form.addEventListener('submit', handleFormSubmit)
  }

  setEvents()
}

export const newsletter = () => {
  const newsletterForms = document.querySelectorAll(selectors.formContainer)

  for (let i = 0; i < newsletterForms.length; i++) {
    setupNewsletterForm(newsletterForms[i])
  }
}
