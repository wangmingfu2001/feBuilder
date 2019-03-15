/**
 * webpack基础配置，根据 mode 合并dev/prod配置文件
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-11 16:55:17
 * @version $Id$
 */

require('./check-versions')();//检查node/npm版本

const path = require('path');
const glob = require("glob");
const fs = require('fs');

const baseConfig=require('../config');
const methods=require('./methods.js');
const utils=require('./utils');

const webpack=require('webpack');
const merge=require('webpack-merge');

const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');//通过Scope Hoisting提升webpack命名空间 优化webpack输出
const {VueLoaderPlugin} = require('vue-loader');
const htmlConfigPlugin=require('./htmlConfigPlugin.js');//自定义插件 用于往页面追加js/css

const HappyPack=require('happypack'),
       happyThreadPool = HappyPack.ThreadPool({ size:baseConfig.toolConfig.cpus});

const isDev = baseConfig.env.isDev;//是开发环境还是生产环境
const fileName='[name]';
const buildType=baseConfig.env.buildType;
const projectName=baseConfig.env.projectName;//对哪个项目进行打包，默认为tuanche
const pageName=baseConfig.env.pageName;

let developmentConfig;
require('./webpack.dev.config.js')(baseConfig).then(function(returnObj){
	developmentConfig=returnObj;
});
const productionConfig=require('./webpack.prod.config.js');
const entryFun=require('./createEntryObj.js');
const projectConfig=require(`../${baseConfig.path.projectInfo.configPath}`);

module.exports=entryFun(baseConfig).then(function(entrys){
	/**
	 * [generateConfig 基础配置]
	 * @Author   gaogao
	 * @DateTime 2018-06-25
	 * @return   {[object]}   [返回webpack基础配置对象]
	 */
	const generateConfig=()=>{
		return {
			  mode:baseConfig.env.mode,
			  entry:entrys.entryJsObj,
			 // entry:function(){
				// 	/**
				// 	 * [getEntry 获取压缩入口文件地址] 
				// 	 * @Author   gaogao
				// 	 * @DateTime 2018-06-02
				// 	 * @return   {[object]}   [入口文件所组成的对象，key为入口文件夹名称 value 为文件夹下的index.js地址]
				// 	 */
					
				// 	let files=glob.sync('./src/tuanche/*/index.js'),
				// 		newEntries={},
				// 		fileName,
				// 		name;
				// 		files.forEach( function(file) {
				// 			//name=/.*\/(tuanche\/.*?\/index)\.js/.exec(file)[1];//输出结果 tuanche/detail_brand/index
				// 			//name=/.*\/(tuanche\/.*?)\/index.js/.exec(file)[1];//输出结果 tuanche/detail_brand/
				// 			fileName=/.*\/(.*?)\/index.js/.exec(file)[1];//输出结果 detail_brand
				// 			name='tuanche/js/'+fileName;
				// 			//name=fileName;
				// 			newEntries[name]=file;
				// 		});
				// 		//newEntries['jquery']=['jquery'];
				// 		newEntries['common/mTools']=['mTools'];
				// 		return newEntries;
					
				// },

			  output: {
			  	filename:fileName+'.js',
			    chunkFilename:fileName+'-[chunkhash:8].js',//vue路由按需加载0.js 1.js 添加hash随机值，放置缓存
			    path:path.resolve(__dirname,`../${baseConfig.path.outputFilePath}/`) ,
			    publicPath:baseConfig.path.publicPath
			  	},

			  module: {
			     rules: [
			  //    {
				 //      test:/jquery\.dll\.js$/,
				 //      use: [{
				 //        loader: 'expose-loader',
				 //        options: 'jQuery'
				 //      },{
				 //        loader: 'expose-loader',
				 //        options: '$'
				 //      }]
				 // },
				  {
			        test: /\.vue$/,
			        loader: 'vue-loader',
			        include:[path.resolve(__dirname,`../${baseConfig.path.platformInfo.commonPath}/js/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)],
			        exclude:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.configPath}/`)],
			        options: utils.vueLoaders
			      },
				{
					test:/\.css$/,
					include:[path.resolve(__dirname,`../${baseConfig.path.platformInfo.commonPath}/css/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)],
					exclude:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.configPath}/`)],
					use:utils.cssLoaders
				},
				// {
				// 	test:/\.less$/,
				// 	include:[path.resolve(__dirname,`../${baseConfig.path.platformInfo.commonPath}/css/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)],
				// 	exclude:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.configPath}/`)],
				// 	use:utils.lessLoaders
				// },
				{
					test:/\.(scss|sass)$/,
					include:[path.resolve(__dirname,`../${baseConfig.path.platformInfo.commonPath}/css/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)],
					exclude:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.configPath}/`)],
					use:utils.sassLoaders
				},
			    {
				    test:/\.js$/,
				    include:[path.resolve(__dirname,`../${baseConfig.path.platformInfo.commonPath}/js/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)],
					exclude:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`),path.resolve(__dirname,`../${baseConfig.path.projectInfo.configPath}/`)],
					loader:'happypack/loader?id=js'
				    // use:[{loader: 'babel-loader'}]
				},
			    {
			        test: /\.(png|svg|jpg|gif)$/,
			        include:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`)],
			        use:utils.fileLoader
			    },
		      	{
			        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			        include:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.imagesPath}/`)],
			        use:utils.fileLoader
		      	},
			    {
			        test:/\.html$/,
			        include:[path.resolve(__dirname,`../${baseConfig.path.projectInfo.pagesPath}/`)],
			        loader:'happypack/loader?id=html'
			        // use:[
			        //   {
			        //     loader:'html-loader',
			        //     options:{
			        //       minimize:false,
			        //       attrs:['img:src','img:data-original']
			        //     }
			        //   }
			        // ]
			    }
			  ]},
			 resolve: {
			 	  mainFields: ['jsnext:main', 'browser', 'main'],
			      alias:Object.assign(
			      		{
			          		'@platform': path.resolve(__dirname,`../${baseConfig.path.platformInfo.rootPath}/`),
			          		'@project': path.resolve(__dirname,`../${baseConfig.path.projectInfo.rootPath}/`)
			      		},
			      		utils.alias(),
			      	) ,
			      extensions: ['*','.js','.vue','.json','.scss']
			  },
			 plugins:[
			 		  ...utils.getHtmlPlugin(entrys),
			 		  ...utils.extractCSS(entrys),
		 			  ...utils.analysisPlugin,
		 			  ...utils.dllPlugin(),
		 			  ...utils.transcode_gbk,
		 			  new VueLoaderPlugin(),
				 	  new ModuleConcatenationPlugin(),
				 	  new htmlConfigPlugin(),
				 	  new HappyPack({
				            id: 'js',
				            threadPool: happyThreadPool,
				            loaders: [{
				                loader: 'babel-loader',
				                options: {
				                    cacheDirectory: true
				                }
				            }]
				        }),
				 	  new HappyPack({
				            id: 'html',
				            threadPool: happyThreadPool,
				            loaders: [{
				                loader:'html-loader',
					            options:{
					              minimize:false,
					              attrs:['img:src','img:data-original']
					            }
				            }]
				        })
		 			 ],
			 // optimization:{
			 //         splitChunks:
			 //          {
			 //            chunks:'all', //webpack自动生成功的代码抽取
			 //            name:true,
			 //            cacheGroups:{
			 //            	mTools:{
			 //            		test: /vue.esm.js/,
			 //            		minSize:1,
			 //            		name:"aa",
			 //            		minChunks:1
			 //            	}
			 //            }
			 //          }
			 //  },
			 externals:{
			 	jquery:'jQuery'
			 },
			 devtool:baseConfig.toolConfig[baseConfig.env.mode].devtool
			};
	}
	return new Promise(function(resolve,reject){
		let config=isDev?developmentConfig:productionConfig;
	    resolve(merge(generateConfig(),config)); 
	})
})
