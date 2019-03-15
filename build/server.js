/**
 * 启动node服务器
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-13 19:10:47
 * @version $Id$
 */

const express=require('express')//搭建服务器
const webpack=require('webpack')
const opn=require('opn') //打开浏览器并打开指定的页面
const webpackDevMiddleware=require('webpack-dev-middleware')
const webpackHotMiddleware=require('webpack-hot-middleware')
const proxyMiddleware=require('http-proxy-middleware')
const historyApiFallback=require('connect-history-api-fallback')

const app=express()//服务启动
const port=3000
const path=require('path')

// const proxyTable=require('./proxy');

// for(let context in proxyTable){
// 	app.use(proxyMiddleware(context,proxyTable[context]))
// }

// app.use(historyApiFallback(require('./historyApiFallback')))

//引入webpack配置
//const config=require('./middleware.config.js');
const configFun=require('./webpack.base.config.js');
//拿到webpack执行配置文件后的

configFun.then(function(config){
	const compiler=webpack(config);
	app.use(webpackDevMiddleware(compiler,{
		publicPath:config.output.publicPath,
		// contentBase: path.resolve(__dirname, '../test/'),
		 headers: {
	      "Content-Type": "text/html; charset=gbk"
	      },
		hot:true,
		lazy:false,
		stats:{colors:true},
		watchOptions:{
			aggregateTimeout:1000,
			poll:true
		}
	}))

	app.use(webpackHotMiddleware(compiler))

	app.listen(port,function(){
		console.log('success listen to ' + port);
		opn('http://localhost:'+port+'/tuanche/html/index.html');
	})
})


