/**
 * 自定义webpack插件
 * 根据项目配置和页面配置自动往页面上追加js和css
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-07-02 11:11:18
 * @version $Id$
 */
const baseConfig=require('../config/');
/**
 * [htmlConfigPlugin 自定义webpack插件 用于往页面上追加js/css]
 * @Author   gaogao
 * @DateTime 2018-07-02
 * @param    {[object]}   options []
 * @return   {[Function]}         [webpack插件]
 */
function htmlConfigPlugin(options) {
	this.options = options;
	this.projectConfig=require(`../${baseConfig.path.projectInfo.configPath}/`).htmlConfig;
}

htmlConfigPlugin.prototype.apply = function(compiler) {
    var that=this;
    if (compiler.hooks) {
	    // webpack 4 support
	    compiler.hooks.compilation.tap('htmlConfigPlugin', function (compilation) {
	      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('htmlConfigPlugin', function (htmlPluginData, callback) {
	      	that.injectConfigData(compilation,htmlPluginData, callback);
	      });
	    });
	  } else {
	    // Hook into the html-webpack-plugin processing
	    compiler.plugin('compilation', function (compilation) {
	      compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
	       	that.injectConfigData(compilation,htmlPluginData, callback);
	      });
	    });
	  }
};
htmlConfigPlugin.prototype.injectConfigData=function(compilation,htmlPluginData, callback){
	var that=this,
		pageName=/.*\/(.*?).html/.exec(htmlPluginData.plugin.options.filename)[1],
		pageConfig=require(`../${baseConfig.path.projectInfo.pagesPath}/${pageName}/${baseConfig.toolConfig.pageInfo.configName}`).htmlConfig,
		platformInjectCommonJs=[];
		if(typeof that.projectConfig.injectCommonJs !='undefined'){
			that.projectConfig.injectCommonJs.forEach(function(item,index){
				platformInjectCommonJs.push(`${item}.dll.js`);
			})
		}
	var injectJsArr=[...that.projectConfig.injectJs,...platformInjectCommonJs,...pageConfig.injectJs];
	var injectCssArr=(pageConfig.projectInjectCss?that.projectConfig.injectCss:[]).concat(pageConfig.injectCss);
	 	for (var i = injectJsArr.length - 1; i >= 0; i--) {
	 		if(!injectJsArr[i].startsWith('http://') && injectJsArr[i].indexOf('.dll.js')!=-1){
	 			injectJsArr[i]=`${baseConfig.toolConfig.domainName[baseConfig.env.testEnv]}/common/js/${injectJsArr[i]}`
	 		}
            htmlPluginData.assets.js.unshift(injectJsArr[i]);
        }
        for (var i = injectCssArr.length - 1; i >= 0; i--) {
            htmlPluginData.assets.css.unshift(injectCssArr[i]);
        }
      callback(null, htmlPluginData);
}

module.exports = htmlConfigPlugin;
