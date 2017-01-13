module.exports = {
  plugins: [
    require('precss'),
    require('postcss-cssnext'),
    require('lost'),
    require('postcss-font-magician')({
      variants: {
        'Roboto': {
          '300': ['woff, eot, woff2'],
          '400 italic': ['woff2']
        }
      }
    }),
    require('rucksack-css')
  ]
}
