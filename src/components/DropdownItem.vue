<template lang="">
  <li class="dropdown-option" :class="{ 'is-disabled': disabled }">
    <slot></slot>
  </li>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    return {}
  }
})
</script>
<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  /*   pointer-events 属性定义元素是否对指针事件做出反应。  */
  pointer-events: none;
  background-color: transparent;
}
</style>
