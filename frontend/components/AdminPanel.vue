<template>
  <div
    v-if="isVisible"
    class="mb-3"
  >
    <b-container>
      <b-row>
        <b-col cols="3">
          <b-button @click="setToken">Обновить куки case-battle.io</b-button>
        </b-col>
        <b-col>
          <b-input v-model="token"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AdminPanel",
  data: () => ({
    token: ''
  }),
  computed: {
    isVisible () {
      const isAdmin = localStorage.getItem('admin-user-panel')

      return !!isAdmin
    }
  },
  methods: {
    ...mapActions('settings', ['fetchToken']),
    setToken() {
      this.fetchToken(this.token)
    }
  }
}
</script>

<style scoped>

</style>
