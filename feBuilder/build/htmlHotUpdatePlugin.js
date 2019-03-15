/**
 * html热更新插件
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-07-18 11:24:55
 * @version $Id$
 */
function htmlHotUpdatePlugin(options) {
	this.options = options;
}

htmlHotUpdatePlugin.prototype.apply = function(compiler) {
    var that=this;
    if (compiler.hooks) {
	    // webpack 4 support
	    compiler.hooks.compilation.tap('htmlHotUpdatePlugin', function (compilation) {
	      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('htmlHotUpdatePlugin', function (htmlPluginData, callback) {
	      	console.log('html更新');
	      	//如何刷新浏览器？？？？
    		callback();
	      });
	    });
	  } else {
	    // Hook into the html-webpack-plugin processing
	    compiler.plugin('compilation', function (compilation) {
	      compilation.plugin('html-webpack-plugin-after-emit', function (htmlPluginData, callback) {
	       	console.log('html更新');
	       	//如何刷新浏览器？？？？
    		callback();
	      });
	    });
	  }
};


module.exports = htmlHotUpdatePlugin;