/**
 * postcss配置文件 自动完善css样式前缀
 */
module.exports = {
  plugins: {
    'autoprefixer': {browsers: 'last 5 version'},
    'cssnano':{
    	'discardComments':{
          removeAll: true
        },
        safe:true
    }
  }
}