module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-write-svg': { utf8: true },
    'postcss-px-to-viewport': {
      // (Number) The width of the viewport.
      viewportWidth: 1080,
      // (Number) The height of the viewport.
      viewportHeight: 1920,
      // (Number) The decimal numbers to allow the REM units to grow to.
      unitPrecision: 5,
      // (String) Expected units.
      viewportUnit: 'vw',
      // (Array) The selectors to ignore and leave as px.
      selectorBlackList: ['.vwignore', 'html', /^body$/],
      // (Number) Set the minimum pixel value to replace.
      minPixelValue: 2,
      // (Boolean) Allow px to be converted in media queries.
      mediaQuery: false
    },
    cssnano: {
      preset: ['default', { discardComments: { removeAll: true } }]
    }
  }
}
