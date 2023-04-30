const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 部署到 github 上面时 要设置为 ‘./’ 默认为 ‘/’
  publicPath: './',
  transpileDependencies: true
})
