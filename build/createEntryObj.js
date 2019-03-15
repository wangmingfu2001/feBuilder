/**
 * 
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-06-20 16:05:12
 * @version $Id$
 *1、遍历 {$project}/{$PAGE}/index.js文件
 *2、获取同级目录下的config.json,(此文件用于存放js&css版本号)
 *3、生成'[name]_v'+jsVersion:file
 *4、向{$project}/entry.json中赋值
 *5、完成项目下所有遍历
 *6、npm配置script node ./config/createEntryObj.js && webpack
 * 
 */
const fs=require('fs');
const glob = require("glob");
//let entryFilePath;
let pagesPath;
let entryJsPath;
/**
 * [getProdVersion 获取制定文件夹下的config.json中的css/js/version，生成有html路径：入口js路径 && 入口js路径：入口css路径 && 入口js路径：js路径]
 * @Author   gaogao
 * @DateTime 2018-06-21
 * @param    {String}   projectName [对哪个项目进行打包，默认为团车]
 * @param    {[type]}   file        [入口文件路径]
 * @return   {[object]} {key:file}  [{"entryJs":{"${entryJSKey}":"${file}"},"htmlChunk":{"${htmlPath}":"${entryJSKey}"},"entryCss":{"${entryJSKey}":"${entryCssName}"}}]
 */
var getProdVersion=function(Paras,file){
	let entryObj={},
		entryJSKey,
		entryCssName,
		cssVersion,
		jsVersion;
	const pagePath=file.split(Paras.toolConfig.pageInfo.jsName)[0],//页面里路径
		  versionFilePath=`${pagePath}${Paras.toolConfig.pageInfo.configName}`,//页面配置页路径
		  //pageName=/.*\/(.*?)\/index.js/.exec(file)[1],//输出结果 detail_brand 页面名称
		  regExpObj=new RegExp(`.*\/(.*?)\/${Paras.toolConfig.pageInfo.jsName}`),
		  pageName=regExpObj.exec(file)[1],//输出结果 detail_brand 页面名称
		  htmlPath=`${pagesPath}/${pageName}/${Paras.toolConfig.pageInfo.htmlName}`;
	return new Promise(function(resolve,reject){
		const pageConfig=require('.'+versionFilePath);
		jsVersion=pageConfig['js'][0]['version'];
    	cssVersion=pageConfig['css'][0]['version'];
    	entryJSKey=`${Paras.env.projectName}/js/${pageName}_v${jsVersion}`;
    	entryCssName=`${Paras.env.projectName}/css/${pageName}_v${cssVersion}`;
    	var t=`{"entryJs":{"${entryJSKey}":"${file}"},"htmlChunk":{"${htmlPath}":"${entryJSKey}"},"entryCss":{"${entryJSKey}":"${entryCssName}"}}`;
    	resolve(JSON.parse(t))
		// fs.readFile(versionFilePath, 'utf-8', function (err, data) {
		//     if (err) {
		//         console.log(`"读取${type}版本号失败，${err}"`);
		//         reject();
		//     } else {
		//     	var logs=JSON.parse(data);
		//     	jsVersion=logs['js'][0]['version'];
		//     	cssVersion=logs['css'][0]['version'];
		//     	entryJSKey=Paras.projectName+'/js/'+pageName+'_v'+jsVersion;
		//     	entryCssName=Paras.projectName+'/css/'+pageName+'_v'+cssVersion;
		//     	var t=`{"entryJs":{"${entryJSKey}":"${file}"},"htmlChunk":{"${htmlPath}":"${entryJSKey}"},"entryCss":{"${entryJSKey}":"${entryCssName}"}}`;
		//     	resolve(JSON.parse(t))
		//     }
		// })
	})	
}
const getEntryFile=function(Paras){
	let filesName=entryJsPath;
	if(Paras.env.buildType=='page'){
		//对页面打包
		filesName=`${pagesPath}/${Paras.env.pageName}/${Paras.toolConfig.pageInfo.jsName}`;
	}
	let files=glob.sync(filesName);
	let arr = files.map(function(file){
			return getProdVersion(Paras,file);
	});
	return arr;
}
/**
 * [setEntryFile 写入入口文件数据到./src/{$projectName}/entry.json]
 * @Author   gaogao
 * @DateTime 2018-06-21
 * @param    {String}   projectName [description]
 */
const setEntryFile=function(Paras){
	var entryJsObj={},
		entryCssObj={},
		entryHtmlObj={};
	//entryFilePath=`./${Paras.path.projectInfo.entryFilePath}`;
	pagesPath=`./${Paras.path.projectInfo.pagesPath}`;
	entryJsPath=`./${Paras.path.projectInfo.entryJsPath}`;
	return new Promise(function(resolve,reject){
		Promise.all(getEntryFile(Paras)).then((pageEntrys)=>{
			pageEntrys.forEach( function(element, index) {
				Object.assign(entryJsObj,element.entryJs);
				Object.assign(entryCssObj,element.entryCss);
				Object.assign(entryHtmlObj,element.htmlChunk);
			});
			var entryData={"entryJsObj":entryJsObj,"entryCssObj":entryCssObj,"entryHtmlObj":entryHtmlObj};
			// fs.writeFile(entryFilePath,JSON.stringify(entryData),function(err){
			// 	  if(err){
			// 	  	console.log("入口文件写入失败:",err);
			// 	  }else{
			// 	  	console.log('入口文件写入成功')
			// 	  }
			// });
			resolve(entryData);
		});		
	});
}
module.exports=setEntryFile;


