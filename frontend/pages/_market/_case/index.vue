<template>
  <b-container v-if="getCase">
    <b-card>
      <b-card-header>
        <b-row>
          <b-col>
            <h3>{{ caseName }} {{ percentToSuccess }}</h3>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <p>Открытий кейса: {{ getCase.numberOfOpenCases}}</p>
        <p>Удачных кейсов: {{ getCase.goodCases}}</p>
        <p>Не удачных кейсов: {{ getCase.badCases}}</p>
        <p>Выпало предметов на: {{ parseInt(getCase.amountOfMoneyPaidFromCases)}}</p>
        <p>Потрачено на кейсы: {{ getCase.amountOfMoneySpentOnCases}}</p>
        <p>Кейсов давших х2: {{ getCase.X_2}}</p>
        <p>Кейсов давших х5: {{ getCase.X_5}}</p>
        <p>Кейсов давших х10: {{ getCase.X_10}}</p>
        <b-table v-if="tableData" :items="tableData" :per-page="perPage" :current-page="currentPage"/>
        <div class="case__pagination">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          />
        </div>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { socket } from "@/plugins/socket";

export default {
  name: "index",
  data: () => ({
    currentPage: 1,
    perPage: 25
  }),
  computed: {
    ...mapGetters('settings', ['getCase']),
    caseName() {
      return this.$route.params?.case
    },
    rows() {
      return this.tableData?.length
    },
    channelName() {
      return `full-update-case-${this.$route.params?.market}-${this.$route.params?.case}`
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
    percentToSuccess () {
      return `+${this.getCase.percentToSuccessOpen}% к успешному открытию`
    },
    tableData() {
      const tryCases = this.getCase?.amountOfTrySpentOnCases || []
      return this.getCase?.amountOfMoneySpentToTryCases?.reduce((items, item, index) => {
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
      },[]) || []
    },
  },
  created() {
    this.fetchCase({
      market: this.$route.params?.market,
      caseName: this.$route.params?.case
    })
  },
  mounted() {
    if (process.client) {
      socket.emit('subscribe', {
        channel: this.channelName
      })


      socket.on(this.channelName, this.updateCase)
    }
  },
  beforeRouteLeave(to, from, next) {
    const channel  = `${this.channelName}`
    socket.emit('unsubscribe', {
      channel: channel
    })
    socket.off(channel, this.updateCase)
    next()
  },
  methods: {
    ...mapActions('settings', ['fetchCase']),
    ...mapMutations('settings', ['updateCase']),
    getLink(key) {
      return `/${this.$route.params?.market}/${key}`
    }
  }
}
</script>

<style lang="scss">
.case__pagination {
  display: flex;
  justify-content: center;
}
</style>
