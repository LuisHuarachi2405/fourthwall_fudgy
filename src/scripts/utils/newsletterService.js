import axios from 'axios'

const apiUrl = '/contact.js'

export const newsletterService = {
  register: (formData) => axios.post(apiUrl, formData),
}
