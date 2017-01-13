// Accept hot module reloading during development
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept()
  }
}

require('./styles/style.css') // The page is now styled
