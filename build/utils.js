/**
 * webpack loaders&plugins配置信息
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-07-10 16:55:17
 * @version $Id$
 */

const path = require('path');
const glob = require("glob");
const fs = require('fs');
const baseConfig=require('../config');
const methods=require('./methods.js');


const webpack=require('webpack');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const htmlWebpackPlugin=require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');//编码格式设置插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//分析打包结果
const cleanWebpackPlugin=require('clean-webpack-plugin');
// const webpackMd5Hash= require('webpack-md5-hash');//css的contenthash 和js的chunkhash


const buildType=baseConfig.env.buildType;
const projectName=baseConfig.env.projectName;//对哪个项目进行打包，默认为tuanche
const pageName=baseConfig.env.pageName;
const fileName='[name]';
const platformConfig=require(`../${baseConfig.path.platformInfo.configPath}/`);
const projectConfig=require(`../${baseConfig.path.projectInfo.configPath}/`);
const dllConfig=require(`../${baseConfig.path.dllInfo.configPath}/`)

const baseConfigPath=baseConfig.path.baseConfigPath;
const platformConfigPath=`../${baseConfig.path.platformInfo.configPath}/`;
const projectConfigPath=`../${baseConfig.path.projectInfo.configPath}/`;


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
/**
 * [alias 设置alias,从/config/index.js的dllFiles中获取dll的alias数据，再从src/projectName/config/index.js的alias中获取项目的命名数据，整合后返回新的对象]
 * @Author   gaogao
 * @DateTime 2018-07-11
 * @return   {[object]}   [项目alias数据]
 */
exports.alias=function(){
  let aliasArray={},
      dllFiles=typeof dllConfig.dllFiles=="undefined"?[]:dllConfig.dllFiles,
      baseConfigAlias=typeof baseConfig.alias=="undefined"?{}:baseConfig.alias,
      platformConfigAlias=typeof platformConfig.alias=="undefined"?{}:platformConfig.alias,
      projectConfigAlias=typeof projectConfig.alias=="undefined"?{}:projectConfig.alias,
      aliasObj=Object.assign(baseConfigAlias,platformConfigAlias,projectConfigAlias);

  dllFiles.forEach(function(item, index) {
      aliasArray[item.key]=perfectPath(item.originPath);
  });
 for(let key in aliasObj){
   aliasArray[key]=perfectPath(aliasObj[key]);
 }
  return aliasArray;
}


/****************************Loaders***************************************/
const sourceMapFlag=baseConfig.env.isDev?baseConfig.toolConfig.development.cssSourceMap:baseConfig.toolConfig.production.cssSourceMap;
const styleLoaderOptions = [{
  loader: 'style-loader',
  options: {
    sourceMap: sourceMapFlag
  }
}];
const cssOptions = [
  { loader: 'css-loader', options: { sourceMap: sourceMapFlag } },//fast-css-loader 不支持@import 引入文件时使用别名方式写路径 顾不使用
  { loader: 'postcss-loader', options: { sourceMap: sourceMapFlag } }
]
const lessOptions = [...cssOptions, {
  loader: 'less-loader',
  options: {
    sourceMap: sourceMapFlag
  }
}];
const sassOptions = [...cssOptions, {
  loader: 'sass-loader',//fast-sass-loader 不支持@import 引入文件时使用别名方式写路径 顾不使用
  options: {
    sourceMap: sourceMapFlag
  }
}];
const cssHotLoader=baseConfig.env.npmScriptName=='start'?['css-hot-loader']:[];
const cssLoaders=cssHotLoader.concat(ExtractTextPlugin.extract({
          use: cssOptions,
          fallback: styleLoaderOptions
        }));
const lessLoaders=cssHotLoader.concat(ExtractTextPlugin.extract({
          use: lessOptions,
          fallback: styleLoaderOptions
        }));
const sassLoaders=cssHotLoader.concat(ExtractTextPlugin.extract({
          use: sassOptions,
          fallback: styleLoaderOptions
        }));
exports.vueLoaders={
          loaders: {
            css: cssLoaders,
            //less:lessLoaders,
            scss:sassLoaders,
            postcss:cssLoaders
          }
        }
exports.cssLoaders=cssLoaders;
exports.lessLoaders=lessLoaders;
exports.sassLoaders=sassLoaders;
/**
 * [fileLoader 图片编译配置信息]
 * @type {Array}
 */
const imgRelative=path.relative(`${baseConfig.path.outputFilePath}/${projectName}/images/`,`${baseConfig.path.outputEnvPath}`);
exports.fileLoader= [{
                      loader:'url-loader',
                      options:{
                      limit:baseConfig.toolConfig.imageLimit,
                      //publicPath:baseConfig.serverOff?'../images/':`${projectConfig.img.PublicPath}/${baseConfig[baseConfig.mode].rootName}/${baseConfig.gitRootName}/${projectName}/images/`,
                      publicPath:'../images/',
                      //outputPath:`../../${baseConfig[baseConfig.mode].rootName}/${baseConfig.gitRootName}/${projectName}/images/`,
                      outputPath:`${imgRelative}/${baseConfig.path.outputFilePath}/${projectName}/images/`,
                      //useRelativePath:true,
                      name:fileName+'.[ext]'
                      }
                  }];

/*******************************plugin***********************************/
/**
 * [getHtmlPlugin tuanche文件夹下的二级目录中的index.html为模板文件，index.js为页面待引入的chrunk，通过html-webpack-plugin插件生成页面]
 * @Author   gaogao
 * @DateTime 2018-06-02
 * @param    {[array]}   pluginsArr [wepack配置项中plugins的模板页面渲染数组]
 */
exports.getHtmlPlugin=function(entrys){
    let pluginsArr=[],
        pageIndex=buildType==='project'?'*':pageName,
        //pages=glob.sync('./src/'+projectName+'/page/'+pageIndex+'/index.html'),
        pages=glob.sync(`./${baseConfig.path.projectInfo.pagesPath}/${pageIndex}/${baseConfig.toolConfig.pageInfo.htmlName}`),
        htmlPlugin,
        htmlFileName,
        htmlPath,
        chunksName;
        pages.forEach( function(page) {
            //chunksName=/.*\/(tuanche\/.*?)\/index.html/.exec(page)[1];
            regExpObj=new RegExp(`.*\/(.*?)\/${baseConfig.toolConfig.pageInfo.htmlName}`),
            htmlFileName=regExpObj.exec(page)[1];//输出结果 detail_brand
            chunksName=entrys.entryHtmlObj[page];
            htmlPath='./'+projectName+'/html/'+htmlFileName;
            htmlPlugin=new htmlWebpackPlugin({
                filename:htmlPath+'.html',
                template:page,
                chunks:[chunksName],
                chunksSortMode: 'manual',
                minify:false
              });
            pluginsArr.push(htmlPlugin);
        });
        return pluginsArr;
}
/**
 * [dllPlugin 第三方/公共文件打包关联插件配置信息]
 * @Author   gaogao
 * @DateTime 2018-07-10
 * @return   {[array]}   [插件数组]
 */
exports.dllPlugin=function(){
    if(typeof projectConfig.htmlConfig.injectCommonJs=="undefined"){
       methods.errorInfo(`项目配置文件缺少htmlConfig.injectCommonJs字段，请在${projectConfigPath}文件中完善！！！！`);
    }
    let dllPluginArray=[],
        dllManifestArray=projectConfig.htmlConfig.injectCommonJs;
        dllManifestArray.forEach(function(item, index){
            dllPluginArray.push(
                new webpack.DllReferencePlugin({
                    manifest:require(`../${baseConfig.path.dllInfo.outputPath}/js/${item}-manifest.json`)
                })
            );
        })
    return dllPluginArray;
}


/**
 * [transcode_gbk 针对html/js/css进行gbk转码插件]
 * @type {[array]}
 */
exports.transcode_gbk=projectConfig.codeFormat.toLowerCase()!='gbk'?[]:[
    new EncodingPlugin({encoding: 'GBK',test:/(\.js|\.css|\.html|\.vue)($|\?)/i})
];  



/**
 * [analysisPlugin 分析打包的插件]
 * @type {[array]}
 */
exports.analysisPlugin=baseConfig.env.isAnalysis?[
    new BundleAnalyzerPlugin({analyzerPort:baseConfig.toolConfig.analyzerPort})
]:[];


/**
 * [extractCSS 开发环境提取css文件，生产环境提取]
 * @Author   gaogao
 * @DateTime 2018-07-10
 * @param    {[object]}   entrys [入口js文件映射关系的json数据]
 * @return   {[array]}          [提取css插件]
 */

exports.extractCSS=function(entrys){
    const extractCSS = new ExtractTextPlugin({
      filename:  (getPath) => {
         const jsPath=getPath('[name]');
         const cssFileName=entrys.entryCssObj[jsPath];
         return './'+cssFileName+'.css';
      }, 
      allChunks: true
    })
    const extractLESS = new ExtractTextPlugin({
       filename:  (getPath) => {
          const jsPath=getPath('[name]');
          const cssFileName=entrys.entryCssObj[jsPath];
          return './'+cssFileName+'.css';
      },              
      allChunks: true
    })
    const extractSASS = new ExtractTextPlugin({
      filename:  (getPath) => {
         const jsPath=getPath('[name]');
         const cssFileName=entrys.entryCssObj[jsPath];
         return './'+cssFileName+'.css';
      }, 
      allChunks: true
    })
    return [extractCSS,extractLESS,extractSASS]
    // return [
    //               // new webpackMd5Hash(),
    //               new MiniCssExtractPlugin({
    //               　　filename:function(file){
    //                     const cssFileName=entrys.entryCssObj[file.chunk.name];
    //                     return './'+cssFileName+'.css';
    //                 },
    //              　　 chunkFilename: "[id].css"
    //            　　 })
    //           ];
};

/**
 * [clearPlugin npm run dev 时清除test文件夹]
 * @type {[array]}
 */
exports.clearPlugin=baseConfig.toolConfig.clearTest&&!baseConfig.env.serverOff?[
        new cleanWebpackPlugin([`${baseConfig.path.outputFilePath}/${projectName}`],
                            {root:path.resolve(__dirname, '../'),
                             watch:true
                            })
    ]:[];



