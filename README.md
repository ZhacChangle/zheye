# zheye

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## ValidateInput
### 父子组件实现 v-model
### 透传 $attrs  inheritAttrs  自定义添加到哪个节点上面去 给ValidateInput添加placeholder
### 3.00 mitt 要求，每个事件名称和 事件类型要一一对应，可以给 ts 更好的类型推论 解决方案：type Events = { 'form-item-created': ValidateFunc } export const emitter = mitt<Events>() 
### 用户传入 tag 来实现 ValidateInput 为 input 或 textarea
## ValidateForm
### 语义化化包裹 ValidateInput
### 提交按钮有默认值，也可以自定义 具名插槽
## 验证包裹的 ValidateInput 组件的结果 
### 一开始的想法：通过 ref 获取 validateInput 组件实例调用 validateInput 方法进行验证 实验的时候发现不可行:1.validateInput 传入 ValidateForm 里面的 slot slot上面没有 ref 属性 2.ref只能获取单个组件实例
### 通过自定义事件来实现：1.this.$on 被废弃 通过 mitt 来实现自定义事件  把 validateInput 方法传递过去统一放到一个数组里面最后统一验证
```
const callback = (func?: ValidateFunc) => {
  if (func) {
    funcArr.push(func)
  }
}
emitter.on('form-item-created', callback)
emitter.emit('form-item-created', validateInput)
const submitForm = () => {
  const result = funcArr.map((func) => func()).every((result) => result)
  context.emit('form-submit', result)
}

```
### 点击提交按钮 清空input Bootstrap的限制：未通过验证的input无法清空 在F12中手动调用 API 清空在 blur 的时候还是会填上去 所有验证通过之后在清空


## Error and Warning
### to属性不能少写一个 / 不然会在原有 path 的情况下追加 例如从详情页面进入新建文章页面 会进不去导致错误的 url :http://localhost:8080/column/create   正确的 url :http://localhost:8080/create

```
<router-link to="create" class="dropdown-item"
  >新建文章
</router-link>
```
### setup中的代码只会执行一次 如果想要获取到 props 里面字段的更新要用 computed 包裹

## vue-router
### 路由守卫 配合 meta 字段实现路由拦截 路由 meta 字段上有 requiredLogin:true 的需要登录后才能进入，有redirectAlreadyLogin:true 即已经登陆过的用户进入登陆页面会跳转到首页


## RESTful API
### put patch 的区别：put要提供需要更新的全部内~容 patch可提供部分内容
### axios添加默认 query 参数 当有其他 query 参数时 这个参数被放在最后
### fetchCurrentUser 放到 router.beforeEach 中去处理 不在 App 组件挂载的时候处理 因为 fetchCurrentUser 是异步的 当我们在 需要登录权限的页面（比如 create）刷新的时候会跳转到登录页面 因为此时 store.state.user.isLogin=false 还没有被更新 会被路由守卫重定向到 login页面



``` 
axios.interceptors.request.use((config) => {
config.params = { ...config.params, icode: '123' }
return config
})
```
### 可以在 axios.interceptors.response.use 的这个函数中处理成功或失败 
```
<!-- 成功了隐藏 loading 效果 -->
axios.interceptors.response.use(
(config) => {
store.commit('setLoading', false)
return config
},
<!-- 失败了 返回  Promise.reject(error) 交给外界 catch-->
(e) => {
const { error } = e.response.data
store.commit('setError', { status: true, message: error })
store.commit('setLoading', false)
return Promise.reject(error)
}
)

```
### message 组件弹窗 二次验证失败 不 alter 的解决方案
```
axios.interceptors.request.use((config) => {
store.commit('setLoading', true)
// 请求成功后将 status 置为 false 不然 watch 无法监听到 status 的变化 二次验证失败的时候不会弹出 alter
store.commit('setError', { status: false, message: '' })

return config
})
```


## Loader 组件
### 支持自定义背景颜色和 loaer 图标下面的文字
### 不挂载在 div#app 身上 避免其父组件或其他组件对 Loader 组件的布局造成影响 通过 <teleport to="#back"> 挂载到 div#back 身上 div#back 动态生成（setup中生成 onUnmounted 销毁 ）不让用户手动添加












