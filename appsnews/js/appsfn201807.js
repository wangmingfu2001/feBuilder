/* 
 * 文件名称 : appsfn201807.js
 * 创建者 : 张辛玥 
 * 创建日期: 2018/07/05
 * 文件描述: 公共函数
 * 历史记录: 无
 */


//倒计时
function Datedown(newt, Dayobj, Hoursobj, fn) {
	clearInterval(timeto);
	setInterval(timeto, 1000);
	function timeto() {
		var newTime = new Date(newt);
		var nowTime = new Date();
		var time = Math.floor((newTime - nowTime) / 1000);
		var Day = document.getElementById(Dayobj);
		var Hours = document.getElementById(Hoursobj);
		Day.innerHTML = Math.floor(time / 86400);
		Hours.innerHTML = Math.floor(time % 86400 / 3600);
		if(Day.innerHTML == -1 || Hours.innerHTML == -1) {
			Hours.innerHTML = Day.innerHTML = 0
		}
		if(Day.innerHTML.length < 2 || Hours.innerHTML.length < 2) {
			Day.innerHTML = "0" + Day.innerHTML;
			Hours.innerHTML = "0" + Hours.innerHTML;
		}
	}
	timeto();
};

//去重
function dupRem(con) {
	for(var i = 0; i < con.length; i++) {
		for(var j = i + 1; j < con.length; j++) {
			if(con[i] == con[j]) {
				con.splice(j, 1);
				j--;
			}
		}
	}
	return con;
}

//cookie存储&&读取
function cookie(name, value, options) {
	if(typeof value != 'undefined') {
		options = options || {};
		if(value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if(options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if(typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else {
		var cookieValue = null;
		if(document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for(var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i].trim();
				if(cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
}

//cookie叠加&&总数校验
function regNum(productid,endfn){
	var cookiearrn="";
	if(cookie(productid)){
		cookiearrn=cookie(productid).split(",");
	}
	if(dupRem(cookiearrn).length>=19){
	   endfn&&endfn();
	}
}

//添加车型
function addProductID(productid,arr,type,endfn){
	if(cookie(productid)){
		var cookiearrc=cookie(productid).split(",");
		var arrnew=arr.concat(cookiearrc);
        cookie(productid,dupRem(arrnew), 7);
	}else{
		cookie(productid,dupRem(arr), 7);
	}
	switch (type){
		case 1:
			//console.log("车系页进入")
			break;
		case 2:
			//console.log("详情页进入")
			break;
	}
	endfn&&endfn();
}

//删除车型
function delProductID(productid,nameID,type,endfn){
	if(cookie(productid)){
		var cookiearr=cookie(productid).split(",");
		cookiearr.splice(cookiearr.indexOf(nameID),1);
		cookie(productid,cookiearr, 7);
		console.log(cookiearr)
	}
	switch (type){
		case 1:
			//console.log("车系页进入")
			break;
		case 2:
			//console.log("详情页进入")
			break;
	}
	endfn&&endfn();
}

//读车型id
function readProductID(productid,type,endfn){}

//按钮状态初始化
function initBtn(){}

