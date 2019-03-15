/**
 * 基本配置信息
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-07-03 17:40:58
 * @version $Id$
 */
const Paras=require('../build/getNpmParas.js');//存放npm执行脚本相关参数
const sourceFilePath=`src`;//源文件根目录名称
const outputPath=`output`;//生成打包后文件的根目录名称
const dllSourceFileName=`common`;//dll打包的公用文件根目录名称
//源文件平台目录名称 本地是m/app/pc  服务器编译是“环境.平台.项目”
let sourceFileSubPath=Paras.isLocal==1?`${Paras.platform}`:`${Paras.testEnv}.${Paras.platform}.${Paras.projectName}`;
//生成打包后文件的二级目录文件名 
let outputSubPath=((Paras.testEnv=='test2'||Paras.testEnv=='test3') && Paras.isLocal==1)?'test':Paras.testEnv;
//dll打包源文件二级目录名，本地是common 服务器编译是"环境.common.common"
let dllsourceFileSubPath=Paras.isLocal==1?`${dllSourceFileName}`:`${Paras.testEnv}.${dllSourceFileName}.${dllSourceFileName}`;
//dll打包生成后文件二级目录名 即环境参数名， test/test2/tes3/box/online
let dllOutputSubPath=Paras.testEnv;
//入口js文件名称
const pageJsName='index.js';
//入口模板页面名称
const pageHtmlName='index.html';
//页面配置文件名称
const pageConfigName='config.json';

module.exports={
	env:Paras,//存放npm执行脚本相关参数
	toolConfig:{//打包编译工具配置信息
		clearTest:true,//开发环境编译（非本地服务器测试环境）时是否清除test环境
		log:true,//预留 是否显示提示信息
		cpus:Paras.isLocal==1?'4':'4',//happyPack 开启多线程打包最大量
		development:{//开发环境配置信息
			devtool:'cheap-module-eval-source-map',
			cssSourceMap:true
		},
		production:{//生产环境配置信息
			devtool:'',			  // 生产环境 source-map
			cssSourceMap:false
		},
		imageLimit:10000,             //图片小于此数则会被转化成base64格式，单位为B
		analyzerPort:'1111',//打包分析端口号
		serverPort:'4444',//本地服务器端口号
		pageInfo:{//页面文件相关信息
			jsName:pageJsName,//入口js文件名
			htmlName:pageHtmlName,//入口模板文件名
			configName:pageConfigName,//页面配置文件名
		},
		domainName:{//域名
			test:'//sr-tests.xgo-img.com.cn',//test环境域名
			test2:'//sr-tests.xgo-img.com.cn',//test2环境域名
			test3:'//sr-tests.xgo-img.com.cn',//test3环境域名
			box:'//sr-box.xgo-img.com.cn',//box环境域名
			online:'//sr.xgo-img.com.cn'//线上环境域名
		}
	},
	path:{//常用路径信息
		outputEnvPath:`${outputPath}/${outputSubPath}`,//output/test/
		baseConfigPath:`${Paras.feBuilderPath}/config/index.js`,//系统配置文件
		sourceFilePath:sourceFilePath,//源文件根目录 src
		outputFilePath:`${outputPath}/${outputSubPath}/${Paras.platform}`,//项目编译后生成文件地址
		publicPath:Paras.serverOff?`/`:`/${Paras.platform}/`,//静态资源相对路径
		dllInfo:{//dll打包通用文件常用路径
			configPath:`${sourceFilePath}/${dllsourceFileSubPath}/config`,//列举dll待打包文件
			sourceCodePath:`${sourceFilePath}/${dllsourceFileSubPath}/js`,//dll待打包源文件路径
			commonImgPath:`${sourceFilePath}/${dllsourceFileSubPath}/images`,//通用图片
			outputPath:`${outputPath}/${dllOutputSubPath}/common/`//dll打包文件生成路径

		},
		platformInfo:{//平台常用路径
			rootPath:`${sourceFilePath}/${sourceFileSubPath}`,//平台根路径
			commonPath:`${sourceFilePath}/${sourceFileSubPath}/common`,//平台公共文件路径
			configPath:`${sourceFilePath}/${sourceFileSubPath}/config`,//平台配置文件路径
			templatePath:`${sourceFilePath}/${sourceFileSubPath}/template`,//项目模板路径
			outputFilePath:`${outputSubPath}/${Paras.platform}`//生成文件目录
		},
		projectInfo:{//项目常用路径
			//项目根路径
			rootPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}`,
			//项目公共文件路径
			commonPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/common`,
			//项目配置文件路径
			configPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/config`,

			//entryFilePath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/config/entry.json`,
			//页面模板路径
			templatePath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/config/template`,
			//组件根路径
			componentsPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/components`,
			//图片根路径
			imagesPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/images`,
			//页面根路径
			pagesPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/pages`,
			//入口js路径
			entryJsPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/pages/*/${pageJsName}`,
			//页面路径
			entryHtmlPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/pages/*/${pageHtmlName}`,
			//页面配置文件路径
			pageConfigPath:`${sourceFilePath}/${sourceFileSubPath}/projects/${Paras.projectName}/pages/*/${pageConfigName}`
		}		
	},
	alias:{
		//站的别名文件，排除dll所需要的和项目内部的
		//形如'别名名称':'文件地址' 文件地址分为两种
		//1、通过npm安装的如同vue/dist/vue.esm.js
		//2、源文件中的如同@platform/common/js/getAjaxDomain.js
	}

}