/**
 * 单独打包第三方库 利用webpack.DllPlugin()
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-11 10:10:17
 * @version $Id$
 */

const path    = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin=require('copy-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');//编码格式设置插件

const baseConfig=require('../config');
const dllConfig=require(`../${baseConfig.path.dllInfo.configPath}/`);

const scriptLoader=[{
                    loader: 'babel-loader',
                    options: {
                      presets: [
                      ["@babel/preset-env",{
                          "targets":{
                            "browsers":["last 2 versions"]
                          }
                        }
                      ]
                    ],
                    plugins:['syntax-dynamic-import']
          }
        }];
/**
 * [perfectPath 完善文件绝对路径]
 * @Author   gaogao
 * @DateTime 2018-08-09
 * @param    {[string]}   filePath [文件路径]
 * @return   {[string]}            [文件绝对路径]
 * @说明：filePath路径有四种情况
 *       1）以@platform开头的 将待打包的平台绝对路径替换@platform
 *       2）以@project开头的 将待打包的项目绝对路径替换@project
 *       3）以@dllSourceCode开头的 将待打包的系统公共文件绝对路径替换@dllSourceCode
 *       4）除以上三种情况以外的，默认为调用npm install的插件，绝对路径为node_modules/下
 */
function perfectPath(filePath){
  let absolutePath;
  if(filePath.startsWith('@platform')){
    filePath=filePath.replace('@platform/',`${baseConfig.env.feBuilderPath}/${baseConfig.path.platformInfo.rootPath}/`);
  }else if(filePath.startsWith('@project')){
    filePath=filePath.replace('@project/',`${baseConfig.env.feBuilderPath}/${baseConfig.path.projectInfo.rootPath}/`);
  }else if(filePath.startsWith('@dllSourceCode')){
    filePath=filePath.replace('@dllSourceCode/',`${baseConfig.env.feBuilderPath}/${baseConfig.path.dllInfo.sourceCodePath}/`);
  }else{
    filePath="node_modules/"+filePath;
  }
  absolutePath=path.resolve(filePath);
  return absolutePath;
}
/**
 * [dllEntry 生成待打包的入口文件对象]
 * @Author   gaogao
 * @DateTime 2018-08-09
 * @return   {[object]}   [待打包的入口文件对应关系对象]
 */
function dllEntry(){
  let key,
      filePath,
      entrys={},
      dllFiles=typeof dllConfig.dllFiles=="undefined"?[]:dllConfig.dllFiles;
      dllFiles.forEach(function(item, index) {
      key=item.key.endsWith('$')?item.key.replace('$',''):item.key;
      filePath=perfectPath(item.originPath);
      entrys[key]=[filePath];
    });
    return entrys;
}

/**
 * [copyImgFile 拷贝图片文件夹到生产环境打包的文件夹下]
 * @type {Array}
 */
var copyImgFile=[
    new CopyWebpackPlugin([{
        from:`${baseConfig.path.dllInfo.commonImgPath}`,
        to: `../images`
    }])
] ; 
module.exports = {
  entry:dllEntry(),
  output: {
    path:path.resolve(__dirname,`../${baseConfig.path.dllInfo.outputPath}/js/`),
    filename: '[name].dll.js',
    library: '[name]'
  },
  module:{
    rules:[
       {
          test:/\.js$/,
          include:path.resolve(__dirname, '../src/common/js/'),
          use:scriptLoader
      }
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path:path.resolve( __dirname,`../${baseConfig.path.dllInfo.outputPath}/js/[name]-manifest.json`),
      name: '[name]'
    }),
    new EncodingPlugin({encoding: 'GBK',test:/(\.js|\.css|\.html|\.vue)($|\?)/i}),
    ...copyImgFile
  ],
  optimization:{
  	minimizer:[
  		new UglifyJsPlugin({ parallel: true,sourceMap:true})
  	]
  }
};