import { createApp, h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (
  message: string,
  type: MessageType,
  timeout = 2000
) => {
  const messageVNode = h(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVNode, mountNode)
  const destroy = () => {
    render(null, mountNode)
    document.body.removeChild(mountNode)
  }
  if (timeout) {
    setTimeout(() => {
      destroy()
    }, timeout)
  }
  // 实例上的方法
  return {
    destroy
  }
}

export default createMessage
