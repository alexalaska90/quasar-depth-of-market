<template>
  <q-page>
    <q-card>
      <q-card-section>
        <depthChart class="q-mt-md"
                :resizable="true"
                autoresize style="height: 1000px"
                :constructor-type="'stockChart'"
                :options="chartOptions" />
      </q-card-section>
    </q-card>
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

import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
stockInit(Highcharts)

export default defineComponent({
  name: 'IndexPage',
  components: {
    depthChart: Chart
  },
  setup () {
    const ordersStore = useOrdersStore()
    return { ordersStore }
  },
  data () {
    return {
      chartOptions: {
        chart: {
          type: 'area',
          zoomType: 'xy'
        },
        title: {
          text: 'ETH-BTC Market Depth'
        },
        xAxis: {
          minPadding: 0,
          maxPadding: 0,
          plotLines: [{
            color: '#888',
            value: 0.1523,
            width: 1,
            label: {
              text: 'Actual price',
              rotation: 90
            }
          }],
          title: {
            text: 'Price'
          }
        },
        yAxis: [{
          lineWidth: 1,
          gridLineWidth: 1,
          title: null,
          tickWidth: 1,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            align: 'left',
            x: 8
          }
        }, {
          opposite: true,
          linkedTo: 0,
          lineWidth: 1,
          gridLineWidth: 0,
          title: null,
          tickWidth: 1,
          tickLength: 5,
          tickPosition: 'inside',
          labels: {
            align: 'right',
            x: -8
          }
        }],
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillOpacity: 0.2,
            lineWidth: 1,
            step: 'center'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
          valueDecimals: 2
        },
        series: [{
          name: 'Bids',
          data: [
            [
              0.1524,
              0.948665
            ],
            [
              0.1539,
              35.510715
            ],
            [
              0.154,
              39.883437
            ],
            [
              0.1541,
              40.499661
            ],
            [
              0.1545,
              43.262994000000006
            ],
            [
              0.1547,
              60.14799400000001
            ],
            [
              0.1553,
              60.30799400000001
            ],
            [
              0.1558,
              60.55018100000001
            ],
            [
              0.1564,
              68.381696
            ],
            [
              0.1567,
              69.46518400000001
            ],
            [
              0.1569,
              69.621464
            ],
            [
              0.157,
              70.398015
            ],
            [
              0.1574,
              70.400197
            ],
            [
              0.1575,
              73.199217
            ],
            [
              0.158,
              77.700017
            ],
            [
              0.1583,
              79.449017
            ],
            [
              0.1588,
              79.584064
            ],
            [
              0.159,
              80.584064
            ],
            [
              0.16,
              81.58156
            ],
            [
              0.1608,
              83.38156
            ]
          ],
          color: '#03a7a8'
        }, {
          name: 'Asks',
          data: [
            [
              0.1435,
              242.521842
            ],
            [
              0.1436,
              206.49862099999999
            ],
            [
              0.1437,
              205.823735
            ],
            [
              0.1438,
              197.33275
            ],
            [
              0.1439,
              153.677454
            ],
            [
              0.144,
              146.007722
            ],
            [
              0.1442,
              82.55212900000001
            ],
            [
              0.1443,
              59.152814000000006
            ],
            [
              0.1444,
              57.942260000000005
            ],
            [
              0.1445,
              57.483850000000004
            ],
            [
              0.1446,
              52.39210800000001
            ],
            [
              0.1447,
              51.867208000000005
            ],
            [
              0.1448,
              44.104697
            ],
            [
              0.1449,
              40.131217
            ],
            [
              0.145,
              31.878217
            ],
            [
              0.1451,
              22.794916999999998
            ],
            [
              0.1453,
              12.345828999999998
            ],
            [
              0.1454,
              10.035642
            ],
            [
              0.148,
              9.326642
            ],
            [
              0.1522,
              3.76317
            ]
          ],
          color: '#fc5857'
        }]
      },
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
