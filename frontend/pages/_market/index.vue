<template>
  <b-container>
    <b-row v-if="getMarket">
      <p>Открытий кейса: {{ getMarket.numberOfOpenCases}}</p>
      <p>Удачных кейсов: {{ getMarket.goodCases}}</p>
      <p>Не удачных кейсов: {{ getMarket.badCases}}</p>
      <p>Выпало предметов на: {{ parseInt(getMarket.amountOfMoneyPaidFromCases)}}</p>
      <p>Потрачено на кейсы: {{ getMarket.amountOfMoneySpentOnCases}}</p>
    </b-row>
    <b-row>
      <b-col cols="4">
        <b-form-select v-model="currentFilter" :options="filters"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="currentSortType" :options="sortTypes"></b-form-select>
      </b-col>
    </b-row>
    <b-row v-if="cases && cases.length">
      <b-col
        v-for="item in currentCases"
        :key="item.key"
        :cols="cols"
      >
        <short-case-view :item="item"/>
      </b-col>
      <b-pagination
        v-model="currentPage"
        :total-rows="cases.length"
        :per-page="perPage"
        aria-controls="my-table"
      />
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { socket } from "@/plugins/socket";

const FILTERS = {
  name: 'name',
  count: 'count',
  profit: 'profit',
  notProfit: 'notProfit',
  desc: 'desc', // по убыванию,
  asc: 'asc', // по возрастанию
}

export default {
  name: "index",
  data: () => ({
    currentPage: 1,
    perPage: 6,
    currentFilter: FILTERS.count,
    currentSortType: FILTERS.desc,
    filters: [
      {
        value: FILTERS.count,
        text: 'Количество открытий'
      },
      {
        value: FILTERS.name,
        text: 'По имени'
      },
      {
        value: FILTERS.profit,
        text: 'Прибыльность'
      }
    ],
    sortTypes: [
      {
        value: FILTERS.asc,
        text: 'По возрастанию'
      },
      {
        value: FILTERS.desc,
        text: 'По убыванию'
      },
    ]
  }),
  computed: {
    ...mapGetters('settings', ['getMarket']),
    cases() {
      if (this.currentFilter === FILTERS.count) {
        return this.filterByCount(this.getMarket?.cases)
      }

      if (this.currentFilter === FILTERS.profit) {
        return this.filterByProfit(this.getMarket?.cases)
      }


      return this.filterByName(this.getMarket?.cases)
    },
    channelName() {
      return `short-update-case-${this.$route.params?.market}`
    },
    currentCases() {
      return this.cases.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
    cols() {
      const isMobile = window.innerWidth < 728

      return isMobile ? 12 : 4
    }
  },
  created() {
    this.fetchMarket(this.$route.params?.market)
  },
  mounted() {
    if (process.client) {
      setTimeout(() => {
        socket.emit('subscribe', {
          channel: this.channelName
        })
      }, 500)


      socket.on(this.channelName, this.setMarketsCase)
    }
  },
  beforeRouteUpdate(to, from, next) {
    const channel  = `${this.channelName}`
    socket.emit('unsubscribe', {
      channel: channel
    })
    socket.off(this.channelName, this.setMarketsCase)
    next()
  },
  methods: {
    ...mapActions('settings', ['fetchMarket']),
    ...mapMutations('settings', ['setMarketsCase']),
    filterByCount(cases) {
      if (!cases) {
        return []
      }

      return cases.sort((a, b) => this.getSort(a.data.numberOfOpenCases, b.data.numberOfOpenCases))
    },
    filterByName(cases) {
      if (!cases) {
        return []
      }

      return cases.sort((a, b) => this.getSort(a.key, b.key))
    },
    filterByProfit(cases) {
      if (!cases) {
        return []
      }

      return cases.sort((a, b) => {
        const aProfit = a.data.amountOfMoneyPaidFromCases / a.data.amountOfMoneySpentOnCases
        const bProfit = b.data.amountOfMoneyPaidFromCases / b.data.amountOfMoneySpentOnCases

        return this.getSort(aProfit, bProfit)
      })
    },
    getSort(a, b) {
      if (this.currentSortType === FILTERS.asc) {
        return a > b ? 1 : -1
      }

      return  a < b ? 1 : -1
    }
  }
}
</script>

<style scoped>

</style>
