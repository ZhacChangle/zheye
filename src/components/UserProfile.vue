<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img
        :src="fitUrl"
        :alt="user.nickName"
        class="rounded-circle img-thumbnail"
      />

      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{
          user.description
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { addColumnAvatar } from '@/helper'
import { computed, defineComponent, PropType } from 'vue'
import { IUser } from '../store'
export default defineComponent({
  props: {
    user: {
      type: Object as PropType<IUser>,
      required: true
    }
  },
  setup (props) {
    const fitUrl = computed(() => {
      addColumnAvatar(props.user)
      const { avatar } = props.user
      return avatar?.url || avatar?.fitUrl
    })

    return {
      fitUrl
    }
  }
})
</script>
