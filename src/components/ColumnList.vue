<template lang="">
  <div class="row">
    <div class="col-4 mb-4" v-for="column in ColumnList" :key="column._id">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar.url"
            class="rounded-circle border border-light my-3"
            :alt="column.title"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">
            {{ column.description }}
          </p>

          <!-- <router-link
            :to="{ name: 'column', params: { id: column.id } }"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          > -->
          <router-link
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { IColumn } from '@/store'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<IColumn[]>,
      required: true
    }
  },

  setup (props) {
    const ColumnList = computed(() => {
      const list = props.list.map((column) => {
        if (!column.avatar) {
          column.avatar = {
            url: require('@/assets/column.jpg')
          }
        }
        return column
      })
      return list
    })

    return {
      ColumnList
    }
  }
})
</script>
<style scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
