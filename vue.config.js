const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  baseUrl: `${process.env.VUE_APP_CDN}`,
  outputDir: `${process.env.VUE_APP_DIST_DIR}`,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: process.env.VUE_APP_SOURCE_MAP === 'yes',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'assets',
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。
  indexPath: 'index.html',
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
  // 然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。
  // 如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  filenameHashing: true,
  // 多页面
  pages: undefined,
  // 编译警告
  lintOnSave: false,
  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: [],
  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  // 需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。
  crossorigin: undefined,
  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。
  // 如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性。
  // 需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响。
  // 另外，当启用 SRI 时，preload resource hints 会被禁用，因为 Chrome 的一个 bug 会导致文件被下载两次。
  integrity: false,
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/assets/scss/variables.scss";@import "@/assets/scss/mixins.scss";`
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    inline: true,
    proxy: {
      '/api/*': {
        target: 'http://10.113.24.80:3000',
        // target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api': ''
        },
        onProxyReq: function(proxyReq, req, res) {}
      }
    }
  },
  configureWebpack: config => {
    let resolve_alias = config['resolve']['alias']
    resolve_alias['~'] = resolve('src/components')
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.performance
        ? (config.performance.hints = false)
        : (config.performance = { hints: false })
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')

    //重点:删除默认配置中处理svg
    config.module.rules.delete('svg')
    //const svgRule = config.module.rule('svg')
    //svgRule.uses.clear()
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}
