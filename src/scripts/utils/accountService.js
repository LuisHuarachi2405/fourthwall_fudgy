import axios from 'axios'

export const accountService = {
  getAccount: () => axios.get('/supporters/api/v1/users/me.json'),
}
