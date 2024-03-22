const dataPrefixDonationForm = 'data-donation'
const dataPrefixForm = 'data-form'

export const selectors = {
  form: `[${dataPrefixDonationForm}="form"]`,
  formSubmitButton: `[${dataPrefixDonationForm}="submit"]`,
  amountRadio: `[${dataPrefixDonationForm}="amount-radio"]`,
  amountInputContainer: `[${dataPrefixDonationForm}="amount-input-container"]`,
  amountInput: `[${dataPrefixDonationForm}="amount-input"]`,
  amountFinalInput: `[${dataPrefixDonationForm}="amount"]`,
  name: `[${dataPrefixDonationForm}="name"]`,
  message: `[${dataPrefixDonationForm}="message"]`,
  inputError: `${dataPrefixForm}-error`,
}
