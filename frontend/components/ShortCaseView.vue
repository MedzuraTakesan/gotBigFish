<template>
  <b-card>
    <b-card-header>
      <b-row align-content="center">
        <b-col cols="8">
          <span> {{ item.key }}</span>
          <span class="short-case-view__header--percent"> {{ percentToSuccess }}</span>
        </b-col>
        <b-col cols="4">
          <b-button @click="onFavoriteClick"> {{ favoriteString }} </b-button>
        </b-col>
      </b-row>
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
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "ShortCaseView",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    market: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('settings', ['getFavoriteCases']),
    percentToSuccess () {
      return `+${this.item.data.percentToSuccessOpen}%`
    },
    favoriteKey () {
      return`${this.market}-${this.item.key}`
    },
    isFavorite () {
      return this.getFavoriteCases.includes(this.favoriteKey)
    },
    favoriteString () {
      return this.isFavorite ? 'Отписаться' : 'Подписаться'
    }
  },
  methods: {
    ...mapMutations('settings', ['addFavoriteCase', 'removeFavoriteCase']),
    getLink(key) {
      return `/${this.market}/${key}`
    },
    onFavoriteClick() {
      if (!this.isFavorite) {
        this.addFavoriteCase(this.favoriteKey)
        return
      }

      this.removeFavoriteCase(this.favoriteKey)
    },
    onClick(item) {
      this.$emit('onAboutClick')
      this.$router.push(this.getLink(this.item.key))
    }
  },
}
</script>

<style lang="scss">
.short-case-view__header--percent {
  color: #1b5b16;
  font-weight: bold;
}
</style>
