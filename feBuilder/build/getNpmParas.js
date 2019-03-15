/**
 * 获取命令行参数，返回打包配置所需的参数
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-28 10:33:54
 * @version $Id$
 */
const argv = require('yargs').argv;//接收npm  --key value
const path = require('path');

const isLocal=typeof process.env.npm_config_isLocal=='undefined'?1:process.env.npm_config_isLocal;//本地编译标识位 1为本地编译 0为服务器端编译
const testEnv=typeof process.env.npm_config_testEnv=='undefined'?'test':process.env.npm_config_testEnv;//npm run 类型  ['test','test2','test3','box','online']
const para_project=process.env.npm_config_project;
const para_page=process.env.npm_config_page;
let buildType='project';
let platform='';//平台
let projectName='';//项目名称
let pageName="";//页面名称
const isDev = argv.mode != 'production'?true:false;//是开发环境还是生产环境
const isAnalysis=argv.analysis;//是否分析打包结果
const serverOff=argv.serverOff;
const feBuilderPath=path.resolve('./').replace(/\\/g, '\/');//前端打包工具的路径
const npmScriptName=process.env.npm_lifecycle_event;
const methods=require('./methods.js');
/**
 * [获取npm参数 ]
 * @Author   gaogao
 * @DateTime 2018-06-28
 * @return   {[object]}   [{isDev:是否是开发环境 true/false,isAnalysis:是否分析打包 true/false,buildType:按项目打包或者按页面打包 project/page,projectName:待打包项目名称 tuanche,pageName:待打包页面 空/页面名称 }]
 */
const Paras=()=>{
	if(typeof para_project=='undefined' && typeof para_page=='undefined' && npmScriptName!="dll"){
		methods.errorInfo('缺少打包类型参数！如果您要打包项目,请在npm命令语句后添加 --project=平台名称/项目名称');
	}
	if(typeof para_project!='undefined'){
		const a=para_project.split('/');
		platform=a[0];
		projectName=a[1];
	}else if(typeof para_page!='undefined'){
		buildType='page';
		const b=para_page.split('/');
		platform=b[0];
		projectName=b[1];
		pageName=b[2];	
	}
	if((typeof platform=='undefined' || typeof projectName=='undefined') && npmScriptName!="dll"){
		methods.errorInfo('缺少打包类型参数！如果您要打包项目,请在npm命令语句后添加 --project=平台名称/项目名称');
	}
	return {
			feBuilderPath,
			npmScriptName,
			isLocal,
			testEnv,
			isDev,
			mode:argv.mode,
			isAnalysis,
			serverOff,
			buildType,
			platform,
			projectName,
			pageName
		  };
}
module.exports=Paras();