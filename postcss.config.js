module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 75,
      unitPrecision: 5,
      minPixelValue: 2,
      propList: ['*']
    }
  }
}
