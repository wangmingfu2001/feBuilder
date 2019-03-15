/**
 * production 配置
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-09 17:30:34
 * @version $Id$
 */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const webpack=require('webpack');
const path = require('path');

module.exports ={
 plugins:[
  new UglifyJsPlugin({ parallel: true,sourceMap:true}),
  new OptimizeCSSPlugin()
 ]
};