const dataPrefixNewsletterForm = 'data-newsletter'
const dataPrefixForm = 'data-form'

export const selectors = {
  formContainer: `[${dataPrefixNewsletterForm}="form-container"]`,
  formSubmitButton: `[${dataPrefixNewsletterForm}="submit"]`,
  emailInput: `[${dataPrefixNewsletterForm}="email"]`,
  marketingEmailsCheckbox: `[${dataPrefixNewsletterForm}="marketing-emails"]`,
  inputError: `${dataPrefixForm}-error`,
  responseSuccess: `[${dataPrefixForm}="response-success"]`,
  responseError: `[${dataPrefixForm}="response-error"]`,
  responseErrorContent: `[${dataPrefixForm}="response-error-content"]`,
}
