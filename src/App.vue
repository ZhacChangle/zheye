<template lang="">
  <div class="container">
    <global-header :user="currentUser"></global-header>

    <loader v-if="isLoading"></loader>

    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import axios from 'axios'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'App',
  components: { GlobalHeader, Loader },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    // const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    // onMounted(() => {
    //   if (!currentUser.value.isLogin && token.value) {
    //     axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
    //     store.dispatch('fetchCurrentUser')
    //   }
    // })
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          createMessage(message, 'error')
        }
      }
    )
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>
<style lang=""></style>
