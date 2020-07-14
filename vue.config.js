'use strict'
const path = require('path')
const { execSync } = require('child_process')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')

const resolve = dir => path.join(__dirname, dir)
const title = process.env.VUE_APP_TITLE
const version = execSync('git rev-list HEAD --count').toString().replace('\n', '')

module.exports = {
  publicPath: '/jinjian/static',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  runtimeCompiler: true,
  productionSourceMap: false,
  transpileDependencies: [
    'query-string',
    'strict-uri-encode',
    'split-on-first'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'common': resolve('src/common'),
        'fonts': resolve('src/assets/fonts'),
        'images': resolve('src/assets/images'),
        'styles': resolve('src/assets/styles')
      }
    },
    plugins: [
      new GenerateJsonPlugin('version.json', { version })
    ]
  },
  chainWebpack: config => {
    config.entry('main').add('@babel/polyfill')
    config.plugin('html')
      .tap(args => {
        args[0].version = version
        args[0].template = 'public/index.ejs'
        args[0].chunksSortMode = 'dependency'
        return args
      })
    config.plugins.delete('pwa')
    config.plugins.delete('workbox')
  },
  css: {
    loaderOptions: {
      sass: {
        data: "@import '~styles/common.scss';"
      }
    }
  },
  devServer: {
    port: 8080,
    open: true,
    proxy: [
      '/passport',
      '/jinjian/personalCenter',
      '/jinjian/message',
      '/jinjian/opinion',
      '/jinjian/apply',
      '/jinjian/award',
      '/jinjian/bs',
      '/jinjian/ocr',
      '/jinjian/user',
      '/jinjian/query',
      '/jinjian/myBroker',
      '/jinjian/customer',
      '/saas-harbour'
    ].reduce((result, item) => {
      result[item] = {
        target: 'http://webapi.soydai.cn:3499/apitest',
        changeOrigin: true,
        ws: true,
        secure: true
      }
      return result
    }, {})
  },
  pwa: {
    name: title,
    themeColor: '#302d2d',
    msTileColor: '#302d2d',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js'
    }
  }
}
