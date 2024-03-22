import validatorIsEmail from 'validator/lib/isEmail'

export const isEmpty = (string) => {
  if (string === '') {
    return true
  }
  return false
}

export const isNumeric = (string) => {
  if (!isNaN(string)) {
    return true
  }
  return false
}

export const isEmail = (string) => {
  return validatorIsEmail(string)
}
