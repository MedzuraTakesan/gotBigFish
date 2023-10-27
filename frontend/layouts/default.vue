<template>
  <div>
    <b-nav class="mb-5" tabs>
      <b-nav-item
        v-for="{link, key, variant} in links"
        :key="key"
        :active="market === link"
        @click="$router.push(`/${link}`)"
      >
        {{link}}
        <b-spinner :key="variant" :variant="variant" type="grow" small></b-spinner>
      </b-nav-item>
    </b-nav>
    <client-only>
      <admin-panel/>
    </client-only>
    <nuxt/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "default",
  computed: {
    ...mapGetters('settings', ['getMarkets', 'getStatus']),
    market() {
      return this.$route?.params?.market
    },
    links() {
      return this.getMarkets.map((link) => ({
        key: `${link}_${this.getVariant(link)}`,
        link,
        variant: this.getVariant(link)
      }))
    }
  },
  created() {
    this.fetchMarkets()
    this.fetchStatus()
    setInterval(() => {
      this.fetchStatus()
    }, 5000)
  },
  methods: {
    ...mapActions('settings', ['fetchMarkets', 'fetchStatus']),
    getVariant(link) {
      const status = this.getStatus?.[link]
      if (status === 'open' || status === 1) {
        return 'success'
      }

      return 'danger'
    }
  }
}
</script>

<style scoped>

</style>
