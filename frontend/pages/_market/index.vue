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
      <b-col
        v-for="item in cases"
        :key="item.key"
        :cols="cols"
      >
        <b-card>
          <b-card-header>
            {{ item.key }}
          </b-card-header>
          <b-card-body>
            <p>Открытий кейса: {{ item.data.numberOfOpenCases}}</p>
            <p>Удачных кейсов: {{ item.data.goodCases}}</p>
            <p>Не удачных кейсов: {{ item.data.badCases}}</p>
            <p>Выпало предметов на: {{ parseInt(item.data.amountOfMoneyPaidFromCases)}}</p>
            <p>Потрачено на кейсы: {{ item.data.amountOfMoneySpentOnCases}}</p>
            <b-button variant="outline-danger" @click="$router.push(getLink(item.key))">
              Подробнее
            </b-button>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "index",
  computed: {
    ...mapGetters('settings', ['getMarket']),
    cases() {
      return this.getMarket?.cases
    },
    cols() {
      const isMobile = window.innerWidth < 728

      return isMobile ? 12 : 4
    }
  },
  created() {
    this.fetchMarket(this.$route.params?.market)
  },
  methods: {
    ...mapActions('settings', ['fetchMarket']),
    getLink(key) {
      return `/${this.$route.params?.market}/${key}`
    }
  }
}
</script>

<style scoped>

</style>
