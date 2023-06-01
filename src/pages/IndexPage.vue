<template>
  <q-page class="q-pa-sm">
    <q-card class="q-mt-sm" bordered :class="darkMode == false ? 'bg-warning' : 'bg-dark'">
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar>
            <q-icon color="secondary" name="analytics" size="44px"/>
          </q-item-section>
          <q-item-section>
            <span class="text-h5">Order Book -
              <span class="text-h6 text-secondary">BTC/USDT</span>
            </span>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="row" :class="darkMode == false ? 'bg-warning' : 'bg-primary'">
        <div class="col-lg-7 col-sm-12 col-xs-12 col-md-7">
          <div class="row">
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="green-13" text-color="dark" icon="arrow_upward"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">{{ bestBidPrice }} USDT</q-item-label>
                  <q-item-label class="text-body1 text-weight-medium">{{ bestBidAmount }} BTC</q-item-label>
                  <q-item-label caption>Best bid</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="red-12" text-color="dark" icon="arrow_downward"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">{{ bestAskPrice }} USDT</q-item-label>
                  <q-item-label class="text-body1 text-weight-medium">{{ bestAskAmount }} BTC</q-item-label>
                  <q-item-label caption>Best ask</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="positive" text-color="dark" icon="percent"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">{{ spreadValue }}</q-item-label>
                  <q-item-label caption>Spread</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="yellow-14" text-color="dark" icon="sell"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">User's orders</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-around">
          <div class="col-lg-4 col-md-5 col-xs-12 col-sm-6">
            <div class="q-pa-md">
              <q-table
                bordered
                :card-class="darkMode == false ? 'bg-info' : 'bg-primary'"
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
                    <q-badge class="text-body2 text-weight-medium text-dark" :color="(props.row.fromUserOrder == true) ? 'yellow-14' : 'green-13'" :label="props.value" />
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
          <div class="col-lg-4 col-md-5 col-xs-12 col-sm-6">
            <div class="q-pa-md">
              <q-table
                bordered
                :card-class="darkMode == false ? 'bg-info' : 'bg-primary'"
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
                    <q-badge class="text-body2 text-weight-medium text-dark" :color="(props.row.fromUserOrder == true) ? 'yellow-14' : 'red-12'" :label="props.value" />
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useOrdersStore } from '../stores/orders'

export default defineComponent({
  name: 'IndexPage',
  props: {
    darkMode: Boolean
  },
  setup () {
    const ordersStore = useOrdersStore()
    return { ordersStore }
  },
  data () {
    return {
      spreadValue: 0,

      bestBidPrice: 0,
      bestBidAmount: 0,

      bestAskPrice: 0,
      bestAskAmount: 0,
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

        this.bestBidPrice = [bids].sort(sortMaxBid)[0][0][0].toFixed(2)
        this.bestBidAmount = [bids].sort(sortMaxAsk)[0][0][1].toFixed(2)

        this.bestAskPrice = [asks].sort(sortMaxBid)[0][0][0].toFixed(2)
        this.bestAskAmount = [asks].sort(sortMaxAsk)[0][0][1].toFixed(2)

        this.spreadValue = +(this.bestAskPrice - this.bestBidPrice).toFixed(2)

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
