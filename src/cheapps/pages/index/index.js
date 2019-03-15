/**
 * 货车头条交互 mm-18/10/29
 *
 *
 * cityid	城市id	number
 from	来源[0=>外1=>58车]	 number
 keywordId	外部/内部id      number
 page	页数	number
 refresh
 */

import './index.scss';//页面样式
import {headLine} from '../../common/js/headLine.js';

var ua = navigator.userAgent.toLowerCase();
var imei="";
var is58app = false;
if (ua.match(/WUBA/i) == "wuba") {
	is58app = true;
	if( /iphone|ipad|ipod/i.test(ua)){
		var btn_1s = document.getElementById('tiwenico');
		if(btn_1s){
			btn_1s.style.bottom = '60px';
		}
		WBAPP.action.getUserInfo('openudid', function(resp){
			imei=resp;
			initYouLiao();
		});
	}else{
		WBAPP.action.getUserInfo('imei', function(resp){
			imei=resp;
			initYouLiao();
		});
	}


}else{
	initYouLiao();
}

//che.loadJs('//www.58che.com/js_ip_city.php',function(){
// var _c = (typeof (xgoJsIpCity) != 'undefined' && xgoJsIpCity.listId) ? xgoJsIpCity.listId : 1;
//如果xgoJsIpCity有数据并且有listId就走xgoJsIpCity.listId，否则
function initYouLiao(){
	headLine.init({
		index : 0,
		data:[
			{
				moreDataUrl : '//huoche-app.58che.com/material/ajax_index/index/?cityId=0&keywordId=keywordId15592&imei='+imei,
				upDataUrl : ''
			},{
				moreDataUrl : '//huoche-app.58che.com/material/ajax_index/index/?cityId=0&keywordId=10&imei='+imei,
				upDataUrl : ''
			},{
				moreDataUrl : '//huoche-app.58che.com/material/ajax_index/index/?cityId=0&from=1&imei='+imei,
				upDataUrl : ''
			},
			{
				moreDataUrl : '//wenda.58.com/question/list.do',   //问答列表接口
				upDataUrl : ''
			},
			{
				moreDataUrl : '//huoche-app.58che.com/material/ajax_index/index/?cityId=0&keywordId=keywordId10006&imei='+imei,
				upDataUrl : ''
			}
		],
		callback : function(index){
			switch (index){
				case 0 :
					document.querySelector("#tiwenico").style.display="none";
					_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_1']);
					break;
				case 1 :
					document.querySelector("#tiwenico").style.display="none";
					_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_2']);
					break;
				case 2 :
					document.querySelector("#tiwenico").style.display="none";
					_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_3']);
					break;
				case 3 :
					if(is58app){
						document.querySelector("#tiwenico").style.display="block";
					}
					_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_4']);
					break;
				case 4 :
					document.querySelector("#tiwenico").style.display="none";
					_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_5']);
					break;
			}
		}
	});
	var _box_=document.querySelector('.swiper-box');
	che.delegate(_box_,'#_tab0',"click",function(){
		_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_content1']);
	});
	che.delegate(_box_,'#_tab1',"click",function(){
		_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_content2']);
	});
	che.delegate(_box_,'#_tab2',"click",function(){
		_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_content3']);
	});
	che.delegate(_box_,'#_tab3',"click",function(){
		_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_content4']);
	});
	che.delegate(_box_,'#_tab4',"click",function(){
		_hmt.push(['_trackEvent', 'apps', 'click', 'youliao_content5']);
	});
//});
}


//问答热门车系列表
var _tab3listlen=document.querySelectorAll(".tuico_list").length;
//数据请求
che.jsonp("//wenda.58.com/hotseries.do?page=1",{
	topN : 5
},'callback',function(d){
	var tuico_list=document.querySelectorAll(".tuico_list");
	var _html1 = '';
	if(d && d.result && d.result.length){
		d.result.forEach(function(data){
			var serieId=data.subcategory;//车系id
			var brandId=data.category;//品牌id
			var goUrl='https://wenda.58.com/index.html#/expertlist/'+serieId+'/'+brandId;

			var newImgsrc=data.brandImg.replace('http','https');

			var _htmlc='<a href="'+goUrl+'" class="tuico addFootmark"><img src="'+newImgsrc+'" alt=""><em>'+data.series+'</em></a>';


			_html1+=_htmlc;
		});
		for(var i=0;i<tuico_list.length;i++){
			tuico_list[i].innerHTML=_html1;
		}

	}
});

//判断a标签新页打开
var ua = navigator.userAgent.toLowerCase();
if (ua.match(/WUBA/i) == "wuba") {
	var hostname=window.location.protocol+"//"+window.location.hostname;
	var _box_2=document.querySelector('.swiper-box');
	che.delegate(_box_2,'.addFootmark',"click",function(e){
		var url=this.href;
		url=url.indexOf("//")!=-1?url:hostname+url;
		WBAPP.invoke('pagetrans',{
			action:'pagetrans',
			tradeline:'core',
			content:{
				pagetype:'common',
				url:url ,
				title:"有料",
				save_step:true
			}
		});
		e.preventDefault();
		return false;
	});

	che.delegate(_box_2,'.addFootmark2',"click",function(e){
		var url=this.href;
		url=url.indexOf("//")!=-1?url:hostname+url;
		WBAPP.action.pagetrans("core", {
			"pagetype": "video",
			"url": url,   //视频url
			// "picurl": picurl,   //封面url,暂时不可用
			"autoplay": true,
			"isWbmainJump": true,   //IOS必须，统一加上
			"hideRotateButton": true  //隐藏全屏，现在必须，全屏有问题
		});
		e.preventDefault();
		return false;
	});
}