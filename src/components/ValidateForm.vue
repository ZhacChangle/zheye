<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type Events = { 'form-item-created': ValidateFunc }

export const emitter = mitt<Events>()
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    const clearInputs = () => {
      const list: HTMLInputElement[] = Array.from(
        document.getElementsByClassName('form-control')
      ) as HTMLInputElement[]

      for (let i = 0; i < list.length; i++) {
        list[i].value = ''
      }
    }
    const submitForm = () => {
      const result = funcArr.map((func) => func()).every((result) => result)

      // if (result) clearInputs()

      context.emit('form-submit', result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }

    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
