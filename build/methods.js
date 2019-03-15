/**
 * 
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-08-02 16:23:25
 * @version $Id$
 */
const path = require('path');
const chalk = require('chalk');
/**
 * [resolve 返回dir的绝对路径]
 * @Author   gaogao
 * @DateTime 2018-07-11
 * @param    {[string]}   dir [src开头的文件路径]
 * @return   {[string]}       [dir的绝对路径地址]
 */

exports.resolve=function(dir) {
    return path.join(__dirname, '..', dir)
};

exports.errorInfo=function(info){
  console.log(`${chalk.red.bgWhiteBright.bold('Error:'+info)}`);
  process.exit(1);
};

exports.warnInfo=function(info){
  console.log(`${chalk.yellow.bold('Warn:'+info)}`);
};

