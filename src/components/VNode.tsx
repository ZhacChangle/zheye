import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VNode',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const count = ref(1)
    return () => (
      <div>
        <h1>{props.message}</h1>
        <p>{count.value}</p>
      </div>
    )
  }
})
