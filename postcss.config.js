module.exports = ({ env }) => {
    const isProd = (env !== 'development')
    const plugins = {
      'postcss-easy-import': {},
      'postcss-mixins': {},
      'postcss-for': {},
      'postcss-nested': {},
      'postcss-custom-media': {},
    }
  
    if (isProd) {
      plugins['postcss-preset-env'] = {}
    }
  
    return { plugins }
  }