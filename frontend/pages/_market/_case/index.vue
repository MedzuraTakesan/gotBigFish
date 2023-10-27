<template>
  <b-container v-if="getCase">
    <b-card>
      <b-card-header>
        <h3>{{ caseName }}</h3>
      </b-card-header>
      <b-card-body>
        <p>Открытий кейса: {{ getCase.numberOfOpenCases}}</p>
        <p>Удачных кейсов: {{ getCase.goodCases}}</p>
        <p>Не удачных кейсов: {{ getCase.badCases}}</p>
        <p>Выпало предметов на: {{ getCase.amountOfMoneySpentOnCases}}</p>
        <p>Потрачено на кейсы: {{ getCase.amountOfMoneyPaidFromCases}}</p>
        <p>Кейсов давших х2: {{ getCase.X_2}}</p>
        <p>Кейсов давших х5: {{ getCase.X_5}}</p>
        <p>Кейсов давших х10: {{ getCase.X_10}}</p>
        <b-table v-if="tableData" :items="tableData" :per-page="perPage" :current-page="currentPage"/>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "index",
  data: () => ({
    currentPage: 1,
    perPage: 25
  }),
  computed: {
    ...mapGetters('settings', ['getCase']),
    cases() {
      return this.getMarket?.cases
    },
    caseName() {
      return this.$route.params?.case
    },
    rows() {
      return Math.ceil(this.tableData?.length / this.perPage)
    },
    medianTryValue() {
      const spendToTry = this.getCase?.amountOfTrySpentOnCases || [1]
      const spend = spendToTry?.reduce((accumulator, currentValue) => accumulator + currentValue) || 0
      return Math.ceil(spend / spendToTry.length)
    },
    medianSpendValue() {
      const moneySpend = this.getCase?.amountOfMoneySpentToTryCases || [1]
      const spend = moneySpend?.reduce((accumulator, currentValue) => accumulator + currentValue) || 0
      return Math.ceil(spend / moneySpend.length)
    },
    tableData() {
      const tryCases = this.getCase?.amountOfTrySpentOnCases?.reverse()
      return this.getCase?.amountOfMoneySpentToTryCases.reverse().reduce((items, item, index) => {
        const tryCounts = tryCases[index]
        const spend = item

        if (!spend || !tryCounts) {
          return items
        }

        items.push({
          'Маркет заработал на попытках': `${spend} рублей`,
          'Количество неудавшихся попыток': `${tryCounts}`,
          '_cellVariants': {
            'Маркет заработал на попытках': this.medianSpendValue < spend ? 'success' : 'danger',
            'Количество неудавшихся попыток': this.medianTryValue < tryCounts ? 'success' : 'danger',
          }
        })

        return items
      },[])
    },
  },
  created() {
    this.fetchCase({
      market: this.$route.params?.market,
      caseName: this.$route.params?.case
    })
  },
  methods: {
    ...mapActions('settings', ['fetchCase']),
    getLink(key) {
      return `/${this.$route.params?.market}/${key}`
    }
  }
}
</script>

<style scoped>

</style>
