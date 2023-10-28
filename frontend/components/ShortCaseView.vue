<template>
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
      <b-button variant="outline-danger" @click="onClick">
        Подробнее
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: "ShortCaseView",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getLink(key) {
      return `/${this.$route.params?.market}/${key}`
    },
    onClick(item) {
      this.$emit('onAboutClick')
      this.$router.push(this.getLink(this.item.key))
    }
  },
}
</script>

<style scoped>

</style>
