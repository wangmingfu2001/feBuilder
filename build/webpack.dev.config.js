/**
 * development配置
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-09 17:27:43
 * @version $Id$
 */

const webpack=require('webpack');
const path = require('path');
const utils=require('./utils.js');

//const htmlHotUpdatePlugin=require('./htmlHotUpdatePlugin.js');//自定义插件 用于html热更新

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');//端口被占用时友好提示插件
const portfinder = require('portfinder');//检测端口是否被占用插件

/**
   * [getIPAdress 通过node获取当前电脑IP地址]
   * @Author   gaogao
   * @DateTime 2018-06-02
   * @return   {[string]}   [当前电脑IP地址]
   */
const getIPAdress=function(){  
      var interfaces = require('os').networkInterfaces();  
      for(var devName in interfaces){  
            var iface = interfaces[devName];  
            for(var i=0;i<iface.length;i++){  
                 var alias = iface[i];  
                 if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                       return alias.address;  
                 }  
            }  
      }  
  }
  
module.exports= function(Paras){
    let openPage,pageName=Paras.env.pageName,
        curPort= Paras.toolConfig.serverPort && Number(Paras.toolConfig.serverPort),
        friendlyPlugins=[],
        curIpAdress=getIPAdress();
        portfinder.basePort = curPort;
    
    if(Paras.env.buildType!='page'){
      pageName='index';
    }
    const projectConfig=require(`../${Paras.path.projectInfo.configPath}/`);
    //let htmlHotPlugin=[];
    // if(Paras.env.serverOff){
    //   htmlHotPlugin.push(new htmlHotUpdatePlugin());
    // }
    return new Promise((resolve, reject) => {
      portfinder.getPort((err, port) => {
            curPort=port;
            if(Paras.env.npmScriptName=='start'){
              friendlyPlugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                  messages: [`Your application is running here: http://${curIpAdress}:${curPort}`],
                }
                //,
                //onErrors: console.log('本地服务器已开启！！')
              }));
            }
            resolve({
              devServer: {
                  //contentBase: path.join(__dirname, "../src"),
                  //publicPath:'/',
                  useLocalIp:true,
                  host:'0.0.0.0',
                  port: curPort,
                  overlay: true, // 浏览器页面上显示错误
                  openPage:Paras.env.projectName+'/html/'+pageName+'.html',
                  headers: {
                    "Content-Type": ";charset=GBK"
                    },
                  open: true, // 开启浏览器
                  stats: "errors-only", //stats: "errors-only"表示只打印错误：
                  hot: true, // 开启热更新
                  noInfo: true,
                  compress: true,
                  before:function(app){
                    if(typeof projectConfig.localInterfaceSwitch!='undefined'&&projectConfig.localInterfaceSwitch==='on'){
                      projectConfig.localInterface(app);
                    }
                  }
                },
               plugins: [
                  //热更新
                  new webpack.HotModuleReplacementPlugin(),
                  new webpack.NamedModulesPlugin(),
                  new webpack.NoEmitOnErrorsPlugin(),
                  ...utils.clearPlugin,
                  ...friendlyPlugins
                ]
            });

        })
     
    });   
    
};

