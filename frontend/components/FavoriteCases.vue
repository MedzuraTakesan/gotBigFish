<template>
  <b-container v-if="cases.length">
    <b-row>
      <h3>Отслеживаемые кейсы</h3>
    </b-row>
    <b-row>
      <b-col
        v-for="item in currentCases"
        :key="item.favoriteKey"
        class="mt-2"
        :cols="cols"
      >
        <short-case-view
          :item="item"
          :market="item.marketName"
        />
      </b-col>
    </b-row>
    <div class="favorite-cases__pagination">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      />
    </div>
  </b-container>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { socket } from "@/plugins/socket";

export default {
  name: "FavoriteCases",
  data: () => ({
    currentPage: 1,
    perPage: 6,
  }),
  computed: {
    ...mapGetters('settings', ['getFavoriteCasesData', 'getFavoriteCases']),
    cases () {
      return this.getFavoriteCases.reduce((favoriteCases, favoriteKey) => {
        const caseData = this.getFavoriteCasesData.find((item) => item.favoriteName === favoriteKey)
        if (!caseData) {
          return favoriteCases
        }

        favoriteCases.push({
          favoriteKey,
          marketName: favoriteKey.replace(`-${caseData?.key}`, ''),
          ...caseData
        })
        return favoriteCases
      }, [])
    },
    rows() {
      return this.cases?.length
    },
    currentCases() {
      return this.cases.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
    cols() {
      const isMobile = window.innerWidth < 728

      return isMobile ? 12 : 4
    }
  },
  watch: {
    getFavoriteCases (newValue, oldValue) {
      this.subscribeToEvents(newValue, oldValue)

      if (!oldValue) {
        return
      }

      this.unsubscribeToEvents(newValue, oldValue)
    }
  },
  mounted() {
    if (process.client) {
      this.subscribeToEvents(this.getFavoriteCases, null)
    }
  },
  methods: {
    ...mapMutations('settings', ['updateFavoriteCase']),
    subscribeToEvents(newValue, oldValue) {
      newValue.forEach((key) => {
        if (oldValue && oldValue.includes(key)) {
          return
        }

        const channel = `favorite-update-case-${key}`

        socket.emit('subscribe', {
          channel
        })

        socket.on(channel, this.updateFavoriteCase)
      })
    },
    unsubscribeToEvents(newValue, oldValue) {
      oldValue?.forEach((key) => {
        if (newValue && newValue.includes(key)) {
          return
        }

        const channel = `favorite-update-case-${key}`

        socket.emit('unsubscribe', {
          channel
        })

        socket.off(channel, this.updateFavoriteCase)
      })
    }
  }
}
</script>

<style lang="scss">
.favorite-cases__pagination {
  display: flex;
  justify-content: center;
}
</style>
