import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    ordersBinance: [],
    userOrders: [],
  }),
  actions: {
    getUserOrdersData: async function () {
      await axios.get('src/assets/orders.json')
      .then(res => this.userOrders = JSON.parse(JSON.stringify(res.data)))
      .catch(err => console.log(err))
    }
  }
})
