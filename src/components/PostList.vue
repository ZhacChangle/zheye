<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>
          <router-link :to="`/posts/${post._id}}/`">{{
            post.title
          }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-3">
            <img
              :src="
                typeof post.image === 'string' ? post.image : post.image.url
              "
              :alt="post.title"
              class="rounded-lg w-100"
            />
          </div>
          <p :class="{ 'col-9': post.image }">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { PostProps } from '@/store'
import { defineComponent, PropType, toRefs } from 'vue'
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup (props) {
    const { list } = toRefs(props)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      list
    }
  }
})
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 700;
}
.post-list h4 a:hover {
  color: #0d6efd;
}
</style>
