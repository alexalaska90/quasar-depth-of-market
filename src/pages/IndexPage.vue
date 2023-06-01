<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table
        dense
        title="Buy Order"
        :rows="rowsBids"
        :columns="columnsBids"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-bottom
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <q-badge :color="(props.row.fromUserOrder == true) ? 'warning' : 'positive'" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="q-pa-md">
      <q-table
        dense
        title="Sell Order"
        :rows="rowsAsks"
        :columns="columnsAsks"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-bottom
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <q-badge :color="(props.row.fromUserOrder == true) ? 'warning' : 'negative'" :label="props.value" />
          </q-td>
        </template>
      </q-table>
    </div>
    <p class="text-h3">{{ spreadValue }}</p>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useOrdersStore } from '../stores/orders'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const ordersStore = useOrdersStore()
    return { ordersStore }
  },
  data () {
    return {
      spreadValue: 0,
      columnsBids: [
        {
          name: 'bids',
          required: true,
          label: 'Side',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
        },
        { name: 'price', align: 'left', label: 'Price(USDT)', field: 'price' },
        { name: 'amount', align: 'left', label: 'Amount(BTC)', field: 'amount' }
      ],
      rowsBids: [],

      columnsAsks: [
        {
          name: 'asks',
          required: true,
          label: 'Side',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
        },
        { name: 'price', align: 'left', label: 'Price(USDT)', field: 'price' },
        { name: 'amount', align: 'left', label: 'Amount(BTC)', field: 'amount' }
      ],
      rowsAsks: []
    }
  },
  created () {
    for (let i = 0; i < 20; i++) {
      this.rowsBids.push({
        name: `Buy ${i + 1}`,
        price: 0,
        amount: 0,
        fromUserOrder: false
      })
      this.rowsAsks.push({
        name: `Sell ${i + 1}`,
        price: 0,
        amount: 0,
        fromUserOrder: false
      })
    }
  },
  async mounted () {
    this.getOrdersBookData()
    await this.ordersStore.getUserOrdersData()
  },
  methods: {
    getOrdersBookData: function () {
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20@1000ms')
      this.ws.onmessage = (e) => {
        const orders = (order, userNumber = 0) => {
          let ordersArray = this.ordersStore.ordersBinance

          const ordersObject = JSON.parse(e.data)
          ordersArray = ordersObject[order].slice()
          ordersArray = ordersArray.map(el => [
            parseFloat(el[0]),
            parseFloat(el[1])
          ])

          const cloneUser = Object.assign({}, this.ordersStore.userOrders[userNumber])
          cloneUser.fromUserOrder = true
          const { id, pair, side, ...userOrder } = cloneUser

          const n = ordersArray.length
          const randomIndex = Math.floor(Math.random() * (n + 1))

          ordersArray.splice(randomIndex, 0, Object.values(userOrder))

          const orderFixString = order.charAt(0).toUpperCase() + order.slice(1)
          for (let i = 0; i < 20; i++) {
            this[`rows${orderFixString}`][i].price = ordersArray[i][0].toFixed(2)
            this[`rows${orderFixString}`][i].amount = ordersArray[i][1].toFixed(2)
            if (ordersArray[i][2]) {
              this[`rows${orderFixString}`][i].fromUserOrder = true
            } else this[`rows${orderFixString}`][i].fromUserOrder = false
          }

          return ordersArray
        }

        orders('bids')
        orders('asks', 1)

        const bids = orders('bids')
        const asks = orders('asks', 1)
        const bestBid = [bids].sort(sortMaxBid)[0][0]
        const bestAsk = [asks].sort(sortMaxAsk)[0][0]
        this.spreadValue = +(bestAsk[0] - bestBid[0]).toFixed(2)

        function sortMaxBid (a, b) {
          if (a[0] === b[0] && a[1] === b[1]) {
            return 0
          } else {
            return (a[0] > b[0] && a[1] > b[1]) ? -1 : 1
          }
        }

        function sortMaxAsk (a, b) {
          if (a[0] === b[0] && a[1] === b[1]) {
            return 0
          } else {
            return (a[0] < b[0] && a[1] > b[1]) ? -1 : 1
          }
        }
      }
    }
  }
})
</script>
