/**
 * 前端底层代码
 * @mm
 * @date    2019-03-13
 * @version 1.0
 * @依赖：无
 *	@其他：第一版js底层文件，包含 命名空间，基础函数，数据缓存系统，服务系统，插件系统，页面构建系统
 * @保留字：全局变量fe保留，fe的属性追加，请先查看fe的所有属性，或者使用fe.has('属性名')来验证
 **/
;
if(typeof fe != 'undefined'){
	throw "fe conflict";
}
window.fe = {
	has : function(property){
		alert(this.hasOwnProperty(property));
	},
	/*
		获取dom - mm - 18/08/07
		参数说明：
			接收合法的css表达式，如 #a .b span
			ID选择无结果返回null，其他返回空数组
			*注意：复选dom的结果，为空判断一定要判断length
	 */
	g : function(str){
		var str = typeof str == 'string' ? str.trim() : '';
		if(!str){
			return null;
		}
		//id选择
		if(str.indexOf(' ')==-1 && str.indexOf('>')==-1 &&str.indexOf('+')==-1 && str.indexOf('#')==0){
			return document.getElementById(str.split('#')[1]);
		}
		//其他选择
		if(str=='body'){
			//解决58che referrer_58che_m.js对JQ的依赖
			var _dom = document.querySelectorAll(str)[0];
			_dom.one = function(types,fn){
				var _fn = function(){
					fn && fn.call(this);
					_dom.removeEventListener(types,_fn);
				};
				_dom.addEventListener(types,_fn,false);
			};
			return _dom;

		}else{
			return document.querySelectorAll(str);
		}

		//$("body").one("mouseover", function () {
		//c.setCookie("als", "0", 365)
	//});

	},

	//fe.g的别名
	$ : function(arg){ return fe.g(arg); },

	//下一个兄弟节点
	/*next : function(obj,ele){
		if(!obj){return null;}
		return obj.nextElementSibling;
	},*/

	//上一个兄弟节点
	/*prev : function(obj,ele){
		if(!obj){return null;}
		return obj.previousElementSibling;
	},*/

	//格式化样式属性名
	resetClassName: function(sClass) {
		var str = sClass.split('-'),_n = 0;
		if(str[0]==''){
			_n = 1;
		}
		str.forEach(function(v,i){
			if(i==0 || i==_n){
				return;
			}
			str[i] = v.charAt(0).toUpperCase()+v.substring(1)
		});
		return str.join('');
	},

	/*
		设置样式 - mm - 18/08/07
		支持获取 css(obj, 'color')
		支持写入 css(obj, 'color' , '#333')
		支持批量写入 css(obj, {color:'#333',fontSize:'12px'})
		支持创建css段落 css('#a{font-size:13px;color:#333;width:500px}');
	*/
	insertCss: [],
	css: function(obj, cssKey,cssVal) {
		if(!obj){return '';}
		//css段落创建
		if(typeof obj == 'string'){
			var cssText = obj;
			if(this.insertCss.indexOf(cssText)!= -1){ return; }
			this.insertCss.push(cssText);
			var oStyle = document.createElement('style');
			oStyle.type = 'text/css';
			oStyle.appendChild(document.createTextNode(cssText));
			document.getElementsByTagName('head')[0].appendChild(oStyle);
			return;
		}
		//获取或写入样式
		if(typeof cssKey == 'string'){
			var cssKey = this.resetClassName(cssKey);
			if(cssVal){
				obj.style[cssKey] = cssVal;
			}else{
				//判断是否行内有，没有取计算后的样式
				if(obj.style.cssKey){
					return obj.style.cssKey;
				}else{
					return getComputedStyle(obj,false)[cssKey];
				}
			}
		}else if(typeof cssKey == 'object'){
			//批量写入
			for (var j in cssKey) {
				j = this.resetClassName(j);
				obj.style[j] = cssKey[j];
			}
		}else{
			return '';
		}
	},

	//attr
	attr : function(obj,key,val){
		if(key && obj){
			if(val){
				obj.setAttribute(key,val);
			}else{
				return obj.getAttribute(key);
			}
		}
	},

	//位移动画
	transForm : function(obj,speed,iTarget,type){
		var ele=obj.style;
		type = type || 'linear';
		speed = speed || 0;
		ele.webkitTransition = ele.transition ='all '+ speed + 'ms '+type;

		iTarget[0]=iTarget[0]+'';
		iTarget[1]=iTarget[1]+'';
		if(iTarget[0].indexOf('px')==-1){iTarget[0]+='px';}
		if(iTarget[1].indexOf('px')==-1){iTarget[1]+='px';}

		ele.webkitTransform =ele.transform ='translateX('+iTarget[0]+') translateY('+ iTarget[1] +') translateZ(0)';
	},

	//缩放动画
	transForm : function(obj,speed,iTarget,type){
		var ele=obj.style;
		type = type || 'linear';
		speed = speed || 0;
		ele.webkitTransition = ele.transition ='all '+ speed + 'ms '+type;

		iTarget[0]=iTarget[0]+'';
		iTarget[1]=iTarget[1]+'';
		if(iTarget[0].indexOf('px')==-1){iTarget[0]+='px';}
		if(iTarget[1].indexOf('px')==-1){iTarget[1]+='px';}

		ele.webkitTransform =ele.transform ='translateX('+iTarget[0]+') translateY('+ iTarget[1] +') translateZ(0)';
	},

	//缩放动画
	transForm2 : function(obj,speed,str){
		var ele=obj.style;
		speed = speed||0;
		ele.webkitTransition = ele.transition ='all '+ speed + 'ms ';
		ele.webkitTransform =ele.transform =str;
	},

	//动画时间
	tranSition : function(obj,speed){
		var ele=obj.style;
		ele.webkitTransition = ele.transition ='all '+ speed + 'ms ';
	},

	//获得一个随机数
	getRand: function(Min, Max) {
		return (Min + Math.round(Math.random() * (Max - Min)));
	},

	//是否是子元素
	isChild: function(oParent, obj) {
		while (obj) {
			if (obj == oParent) { return true; }
			obj = obj.parentNode;
		}
		return false;
	},

	//DOMready事件
	ready: function(fn) {
		document.addEventListener('DOMContentLoaded', fn, false);
	},

	//绑定事件
	bind: function(obj, sEv, fn, Bubble) {
		!obj._evs && (obj._evs = []);
		function _fn2(ev) {
			var oEvent = ev || event;
			oEvent.cancelBubble = Bubble ? true : false;
			fn.call(obj, ev);
		}
		obj.addEventListener(sEv, _fn2, false);
		obj._evs.push({
			ev_name: sEv,
			ev_fn: _fn2
		});
	},

	/*
		事件代理 - mm - 18/08/07
		参数依次是：
			事件绑定在哪个dom上。null时绑定到document上。
			目标dom的css表达式，如： #box h2 .title
			绑定事件名（小写）
			回调函数（this指向 css表达式符合的dom）
	*/
	delegate : function(obj, cssStr, sEv, fn){
		var obj = obj || document;
		if(!cssStr || !sEv){
			return;
		}
		var sEv = sEv.toLowerCase();

		obj.addEventListener(sEv, function(ev){
			var cssArr = cssStr.trim().split(' ');
			var oEvent = ev || event;
			var oTarget = oEvent.target;

			//事件名不同退出
			if(oEvent.type != sEv){ return; }
			var isContinue = false;
			var _this = null;

			//循环匹配
			while(oTarget){
				//匹配完成或者循环到顶退出
				if(oTarget == obj || cssArr.length==0){
					break;
				}
				//针对数组从后匹配
				var _str = cssArr[cssArr.length-1];
				switch (_str.charAt(0)){
					case '#':
						if(oTarget.id == _str.split('#')[1]){
							isContinue = true;
						}
						break;
					case '.':
						if(oTarget.classList.contains(_str.split('.')[1])){
							isContinue = true;
						}
						break;
					default:
						if(oTarget.tagName.toLowerCase() == _str){
							isContinue = true;
						}
						break;
				}
				if(isContinue){
					//记录满足数组最末尾条件时的dom，以便找到回调的this
					if(!_this){ _this = oTarget; }
					//当符合一个条件时，删掉条件
					cssArr.pop();
				}
				//逆向查找
				oTarget = oTarget.parentNode;
			}

			//全部匹配后执行回调
			if(cssArr.length==0){
				typeof fn == 'function' && fn.call(_this,ev);
			}
			ev.cancelBubble = true; //强制阻止冒泡
		}, false);
	},

	//绑定在document上的代理
	live: function(cssStr, sEv, fn) {
		return this.delegate(document, cssStr, sEv, fn);
	},

	//移除绑定
	unbind: function(obj, sEv) {
		if (!obj._evs) return;
		for (var j = 0; j < obj._evs.length; j++) {
			if (obj._evs[j].ev_name == sEv) {
				obj.removeEventListener(obj._evs[j].ev_name, obj._evs[j].ev_fn, false);
				obj._evs.splice(j, 1);
				j--;
			}
		}
	},

	//获取绝对坐标
	getPos: function(obj) {
		var left = 0,
		top = 0;
		while (obj) {
			left += obj.offsetLeft;
			top += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return {
			x: left,
			y: top
		};
	},

	//获取多选按钮的值
	getCheckBox:function(cname){
		var aBox=document.getElementsByName(cname),arr=[];
		for(var i=0;i<aBox.length;i++){
			aBox[i].checked && (arr.push(aBox[i].value));
		}
		return arr;
	},

	//获取单选按钮的值
	getRadio: function(name) {
		var radioes = document.getElementsByName(name);
		for (var i = 0; i < radioes.length; i++) {
			if (radioes[i].checked) {
				return radioes[i].value;
			}
		}
		return false;
	},

	//获取select选中项的html
	getSelectTxt : function(obj){
		return obj.options[obj.selectedIndex].text;
	},

	//获取select选中项的索引
	getSelectNum : function(obj){
		return obj.selectedIndex;
	},

	//获取键值，默认url，可指定其他字符串
	getUrlKey : function(name,url) {
		var url = url || window.location.search;
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),r =url.substr(1).match(reg);
		if (r != null){return unescape(r[2]);}
		return null;
	},

	//设置url中的参数
	setUrlParam:function(name,value,urlStr){
		var url=urlStr?urlStr:window.location.href.toString(),
		newUrl="",
		reg = new RegExp("(^|)"+ name +"=([^&]*)(|$)"),
		tmp = name + "=" + value;
		if(url.match(reg) != null){
			newUrl= url.replace(eval(reg),tmp);
		}else{
			if(url.match("[\?]")){
				newUrl= url + "&" + tmp;
			}else{
				newUrl= url + "?" + tmp;
			}
		}
		return newUrl;
	},
	//截取length个字
	subStr : function(str,length){
		return str.substr(0,length);
	},
	//截取maxNum个字(识别字符长度)
	getByteLen:function(val,maxNum) {
		/*
		根据字节数截取字符串功能
		返回值：
		{len:str所占字节数,cutOutStr:根据maxNum截取的字符串,ellipsisStr:如果超出maxNum长度则增加...,originStr:原字符串}
		*/
		var len = 0,
		cutOutStr="",
		ellipsisStr="";
		maxNum=maxNum?maxNum:val.length;
		for (var i = 0; i < val.length; i++) {
			if(val.sub(i,i+1)!=undefined){
				if (val.substring(i,i+1).match(/[^\x00-\xff]/ig) != null){ //全角
					len =len+2;
				}else{
					len =len+1;
				}
				if(len<=maxNum){
					cutOutStr=cutOutStr+val.substring(i,i+1);
				}
			}
		}
		if(len>maxNum){
			ellipsisStr=cutOutStr+'...';
		}else{
			ellipsisStr=cutOutStr;
		}
		return {len:len,cutOutStr:cutOutStr,ellipsisStr:ellipsisStr,originStr:val};
	},

	//ajax
	ajax: function(url, type, data, fnSucc, fnFaild) {
		if(arguments.length<3){return;}
		var arr = [];
		if(type.toLowerCase() != 'file' ){
			data.t = Math.random();
		}
		for (var i in data) {
			arr.push(i + '=' + data[i]);
		}
		var sData = arr.join('&');
		if (window.XMLHttpRequest) {
			var oAjax = new XMLHttpRequest();
		} else {
			var oAjax = new ActiveXObject("Microsoft.XMLHttp");
		}
		if (type.toLowerCase() == 'get') {
			oAjax.open('GET', url + '?' + sData, true);
			oAjax.send();
		} else if (type.toLowerCase() == 'post') {
			oAjax.open('POST', url, true);
			oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			oAjax.send(sData);
		}else if(type.toLowerCase() == 'file'){
			oAjax.open('POST', url, true);
			/*oAjax.setRequestHeader('Content-Type', 'multipart/form-data; boundary=----------------'+Date.now());
			oAjax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');*/
			oAjax.send(data);
		}
		oAjax.onreadystatechange = function() {
			if (oAjax.readyState == 4) {
				if (oAjax.status == 200) {
					fnSucc(oAjax.responseText);
				} else {
					if (fnFaild) {
						fnFaild();
					}
				}
			}
		};
	},

	//jsonp
	jsonp: function(url, data, cbName, fnSucc) {
		if(arguments.length<3){return;}
		var fnName = 'jsonp_' + Math.random();
		fnName = fnName.replace('.', '');
		window[fnName] = function() {
			fnSucc && fnSucc.apply(this, arguments);
			oHead.removeChild(oS);
			window[fnName] = null;
		};
		data[cbName] = fnName;
		var arr = [];
		for (var i in data) {
			arr.push(i + '=' + data[i]);
		}
		var str=(url.indexOf('?')==-1)?url+'?'+arr.join('&'):url+'&'+arr.join('&');
		var oS = document.createElement('script');
		var oHead = document.getElementsByTagName('head')[0];
		oS.src = encodeURI(str);
		oHead.appendChild(oS);
	},

	//58che专用jsonp
	getJson : function(url,data,fnSucc){
		return this.jsonp(url, data, 'callback', fnSucc);
	},

	//装载js
	loadJs : function(src,callback){
		var callback = callback||function(){};
		var scripts = window.__needJS__ || (window.__needJS__=[]);
		var script = scripts[src] || (scripts[src] = {loaded:false,callbacks:[]}); //取得全局加载队列中的目标项
		if(script.loaded) return callback(false);
		var cbs = script.callbacks;
		cbs.push(callback); //cbs: 回调函数列表
		if(1 == cbs.length) {
			var js=document.createElement("script");
			if(js.readyState){
				js.onreadystatechange = function(){
					var st=js.readyState;
					if(st && st!="loaded" && st != "complete") return;
					script.loaded = true;
					for(var i=0; i<cbs.length; i++) cbs[i](true);
				};
			}else{
				js.onload =  function(){
					var st=js.readyState;
					if(st && st!="loaded" && st != "complete") return;
					script.loaded = true;
					for(var i=0; i<cbs.length; i++) cbs[i](true);
				};
			}
			js.src=src;
			document.getElementsByTagName("head")[0].appendChild(js);
		}
	},

	cookie : function(name, value, options){
		if (typeof value != 'undefined') {
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
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
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].trim();
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	},

	/**
	 * [objKeySort 对象按照key值排序]
	 * @Author   gaogao
	 * @DateTime 2018-08-29
	 * @param    {[object]}   obj [待排序的对象]
	 * @return   {[object]}       [排序号的新对象]
	 */
	objKeySort : function(obj) {
		var newkey = Object.keys(obj).sort();　　 //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
		var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
		for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
			newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
		}
		return newObj; //返回排好序的新对象
	},

	grounpArray:function( arr,n ){
		//对数组进行分组，返回一个新的数组，arr为原数组 n为几个一组
		var arr = arr.slice();//深拷贝
		var re = [],page = Math.ceil(arr.length / n);
		for (var i = 0; i<page; i++) {
			re.push(arr.splice(0,n))
		}
		return re;
	},

	triggerClick : function ( el ) {
		if(el.click) {
			el.click();
		}else{
			try{
				var evt = document.createEvent('Event');
				evt.initEvent('click',true,true);
				el.dispatchEvent(evt);
			}catch(e){	alert(e) };
		}
	},
    //匹配出字符串里的文件名
    convert : function(url){
        url = url.replace(/(.*\/)*([^.]+).*/ig, "$2");
        return url;
    },
    //匹配出字符串里的文件名2
    convert2 : function (url){
        var re = url.substring(url.lastIndexOf('/')+1);
        re = re.split('.')[0];
        return re;
    },
	//获取第一个子节点
	firstChild : function(parent) {
		if(parent.firstElementChild) {
			return parent.firstElementChild;
		}else {
			var el = parent.firstChild;
			while(el && el.nodeType !== 1) {
				el = el.nextSibling;
			}
			return el;
		}
	},
	//正则验证
	check : {
		'isEmpty':function (val,unit) {
			if (unit) {
				var endIndex = val.indexOf(unit),result=$.trim(val.substring(endIndex));
			}else{
				var result=$.trim(val);
			}
			return result!=='-1' && !!result;
		},
		'isMobile':function(val){
			var reg= /^1[3|4|5|7|8|9][0-9][\d]{8}$/;
			return reg.test(val);
		},
		'isNormalCharater':function (val) {
			var reg =/[^a-zA-Z|\d|\u4e00-\u9fa5]/g;
			return !reg.test(val);
		},
		'onlyNumber':function (val) {
			var reg =/^\d+(\.\d{1,2})?$/g;
			return reg.test(val);
		},
		'onlyChinese':function(val){
			var reg=/^[\u4e00-\u9fa5]+$/g;
			return reg.test(val);
		},
		'onlyPositiveInteger':function(val){
			var reg =/^(?:[1-9]\d*)$/g;
			return reg.test(val);
		},
		'onlyInteger':function(val){
			var reg =/^(?:\d+)$/g;
			return reg.test(val)
		},
		'checkRadio':function(obj){
			if ($('#'+obj).length<1) {
				return false;
			}else{
				var result = $('#'+obj).find('input[type="radio"]:checked').length>0?true:false;
				return result;
			}
		},
		'checkboxSelected':function(obj){
			if ($('#'+obj).length<1) {
				return;
			};
			var result= $('#'+obj).find('input[type="checkbox"]:checked').length>0?true:false;
			return result;
		},
		'carLicenseNum':function(val){
			var reg=/^(([京津冀晋鲁豫辽吉黑蒙陕宁甘新藏云川渝湘鄂皖苏沪浙闽粤贵桂赣琼港澳台军空海北沈兰济南广成使领][A-HJ-NP-Za-hj-np-z])([A-HJ-NP-Za-hj-np-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf]))$/g
			return reg.test(val);
		},
		'bankCard':function (val) {
			var reg = /^(\d{16}|\d{19})$/;
			return reg.test(val);
		}
	}
};
if(typeof $=='undefined'){
	window.$ = fe.$;
}
//帧定时器
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
	function(cb,el) {
		return window.setTimeout(cb, 1000 / 60);
	};
})();

/* touch v3.4 by-momo 2017-07-23 */
/*
 接口说明
 全局暴露函数 touch，参数为被绑定的对象(原生)

 链式方法10个【参数是function】
 start()  move()  tap()  right()
 left()   up()  down()  revert()
 longtap()  end()

 混合方法1个
 swipe(json)  【参数是json】

 解除滑动绑定及再次绑定
 bind()
 unbind()

 保留浏览器默认行为 (不设置为阻止)
 dP()

 阻止/恢复冒泡
 noBubble()
 reBubble()

 属性2个
 this.stop   【 true:停止，默认为false】
 this.cb   【 true:不冒泡，默认为false】

 其他说明，为防止ios的tap事件点穿（非冒泡）
 请在tap事件里，手工添加
 e.preventDefault();

 回调函数的参数说明：
 start和tap方法，可接收到事件对象 e
 move方法，参数有 移动的坐标{x,y}和时间对象 e
 move方法新增rate参数（移动值倍率输出），包括x，y两个属性
 */

/*
3.3版更新文档
	修复了单击触发revert事件，增加保留浏览器默认行为
 */

/*
3.4版更新文档
	1，move方法里，新增 总偏移量输出，便于translate拖拽应用。
	     move方法截至到3.4版，一共有5个参数，依次为
	     【本次偏移量输出，event，倍率sin值输出，本次移动距离，总偏移量输出】
	2，由于translate以后，touch事件触发区域保留原地的bug，不建议用move实现，
	     所以新增了一个方法 drag，该方法参数只有一个，就是 总偏移量，可直接赋值给transLate
 */

;(function(global,doc,factoryFn){
	var factory = factoryFn(global,doc);
	//che接口
	fe.touch = window.touch || factory;
	window.touch = fe.touch;
})(this,document,function(window,document){
	//class-touch
	var Touch = new Function();

	Touch.prototype = {
		version :        '3.4',
		constructor :  Touch,
		hasTouch :  'ontouchstart' in window,

		//全局冒泡开关
		cb : false,

		//初始化 [el：传入的待滑动元素]
		init : function(el){
			if(!el){return;}
			this.EVS = this.hasTouch ? 'touchstart' : 'mousedown';
			this.EVM = this.hasTouch ? 'touchmove' : 'mousemove';
			this.EVE = this.hasTouch ? 'touchend' : 'mouseup';
			this.el = el;
			this.XY = {};              //交互过程中的坐标集合
			this.prevX = 0;       //交互过程中的坐标集合2
			this.prevY = 0;       //交互过程中的坐标集合2
			this.type = {};           //传入的 滑动行为集合
			this.tapTimeOut = null; //tap延迟的定时器
			this.longtapTimeOut = null; //long延迟的定时器
			this.direction = '';         //最终移动的方向
			this.firstMove = false;  //是否是第一次滑动(便于做用户期望选择)
			this.stop = false;          //停止滑动
			this.estimate = '';         //用户预期滑动方向存储
			this.preventD = true;   //move时是否阻止默认行为
			this.el._evs = this.el._evs || null;   //事件队列
			this.oldPos = {x:0,y:0};  //默认translate偏移量
			this.oldX = 0; //按下时的偏移量，end之前不会变
			this.oldY = 0; //按下时的偏移量，end之前不会变
			this.bind();                   //激活事件绑定
		},

		//事件绑定
		bind : function( callback,touchType ){
			var _this = this;
			//事件队列填充(待完善)
			if(!_this.el._evs){
				_this.el._evs = {
					fn_ts : function(e){ _this.ts.call(_this,e) },
					fn_tm : function(e){ _this.tm.call(_this,e) },
					fn_te :  function(e){ _this.te.call(_this,e) },
					fn_td :  function(e){ _this.td.call(_this,e) }
				};
			}
			_this.el.addEventListener( _this.EVS,_this.el._evs.fn_ts,false );
			_this.el.addEventListener( _this.EVM,_this.el._evs.fn_tm,false );
			_this.el.addEventListener( _this.EVE,_this.el._evs.fn_te,false );
			_this.el.onselectstart = function(){return false;};
			return this;
		},

		//事件移除
		unbind : function(){
			var _this = this;
			_this.el.removeEventListener( _this.EVS,_this.el._evs.fn_ts );
			_this.el.removeEventListener( _this.EVM,_this.el._evs.fn_tm );
			_this.el.removeEventListener( _this.EVE,_this.el._evs.fn_te );
			return this;
		},

		//滑动回调队列
		swipe : function( json ){
			typeof(json)=='object' && (this.type = json);
			return this;
		},

		//允许默认行为
		dP: function(){
			this.preventD = false;
			return this;
		},

		//禁止冒泡
		noBubble : function(){
			this.cb = true;
			return this;
		},

		//恢复冒泡
		reBubble : function(){
			this.cb = false;
			return this;
		},
		//滑动开始
		ts : function(e){
			var _this = this, d = this.XY;
			clearTimeout(_this.longtapTimeOut);

			//根据传入的行为绑定，预估出用户期望
			if(!this.estimate){
				if( this.type.left || this.type.right ){
					this.estimate = 'x';
				}
				if( this.type.up || this.type.down ){
					this.estimate = 'y';
				}
				if(this.type.move && !this.type.left && !this.type.right &&  !this.type.down  && !this.type.up){
					this.estimate = 'm';
				}
				_this.prevX = 0;
				_this.prevY = 0;
			}

			//重置滑动开关
			_this.stop = false;

			//记录坐标
			d.x1 = _this.hasTouch ? e.touches[0].pageX : e.clientX;
			d.y1 = _this.hasTouch ? e.touches[0].pageY : e.clientY;

			//本次按下的初始old坐标
			_this.oldX =  _this.oldPos.x;
			_this.oldY =  _this.oldPos.y;

			//执行touchstart事件
			_this.type['start'] && _this.type['start'].call(_this,e);

			//190毫秒后执行tap事件
			_this.tapTimeOut = setTimeout(function(){
				_this.type['tap'] && _this.type['tap'].call(_this,e);
				//_this.stop = true;
			},190);

			//900毫秒后执行longtap事件
			if(_this.type['longtap']){
				e.preventDefault();

				_this.longtapTimeOut = setTimeout(function(){
					_this.type['longtap'].call(_this,e);
					//_this.stop = true;
				},900);
			}

			e.cancelBubble=_this.type['drag'] ? false : _this.cb;

			if(_this.type['drag']){
				document.addEventListener('touchmove',_this.el._evs.fn_td,false );
			}

			return false;
		},

		//滑动进行
		tm : function(e){
			if(this.stop){return;}
			var _this = this,
			d = this.XY,
			vv = {}, //返回的距离按下坐标差
			rate = {}, //返回的倍率基准
			dis = {},//返回本次移动距离
			allDis ={}; //返回的translate总偏移量

			//记录新坐标
			d.x2 = _this.hasTouch ? e.touches[0].pageX : e.clientX;
			d.y2 = _this.hasTouch ? e.touches[0].pageY : e.clientY;

			//坐标差(move函数的参数)
			vv.x = d.x2 - d.x1;
			vv.y = d.y2 - d.y1;

			//输出总偏移量
			allDis.x = _this.oldX+vv.x;
			allDis.y = _this.oldY+vv.y;

			//存储偏移量
			_this.oldPos={
				x : allDis.x,
				y : allDis.y
			};

			var p={}; //本次移动距离
			p.x=vv.x-_this.prevX;
			p.y=vv.y-_this.prevY;

			_this.prevX=vv.x;
			_this.prevY=vv.y;

			//倍率计算
			rate.y = Number((vv.y * 0.005).toFixed(3));
			rate.y>1 && (rate.y=1);
			rate.y<-1 && (rate.y=-1);

			rate.x = Number((vv.x * 0.005).toFixed(3));
			rate.x>1 && (rate.x=1);
			rate.x<-1 && (rate.x=-1);

			//滑动判断
			if(Math.abs(vv.x)>3 || Math.abs(vv.y)>3){   //断定此次事件为move事件

				//已经滑动，清掉tap事件
				clearTimeout(_this.tapTimeOut);
				clearTimeout(_this.longtapTimeOut);

				e.cancelBubble=_this.type['drag'] ? false : _this.cb;

				//先判断用户行为，不move
				if( !_this.firstMove ){
					//匹配用户意图
					switch(_this.estimate){
						case 'x':
							if(Math.abs(vv.x)>Math.abs(vv.y)){
								_this.firstMove = true;
								e.preventDefault();
							}else{
								_this.stop = true;
								return;
							}
							break;
						case 'y':
							if(Math.abs(vv.y)>Math.abs(vv.x)){
								_this.firstMove = true;
								e.preventDefault();
							}else{
								_this.stop = true;
								return;
							}
							break;
						case 'm':
							_this.firstMove = true;
							if(_this.preventD){e.preventDefault();}
							break;
						default:
							break;
					};

				}else{ //第二次开始运动
					if(_this.preventD){e.preventDefault();}
					_this.type['move'] && _this.type['move'].call(_this,vv,e,rate,p,allDis);
				}

			}else{  //断定此次事件为轻击事件
				e.preventDefault();
			}
			return false;
		},

		//滑动结束
		te : function(e){
			if(this.type['drag']){
				document.removeEventListener('touchmove',this.el._evs.fn_td );
			}

			if(this.stop){return;}

			this.type['end'] && this.type['end'].call(this,e);

			clearTimeout(this.longtapTimeOut);

			//当开始执行回调的时候，关闭start 和 move
			this.stop = true;

			//位置计算
			this.direction = Touch.swipeDirection(this.XY.x1, this.XY.x2, this.XY.y1, this.XY.y2);

			//开始运动
			if(this.direction != 'none'){
				if(this.type[this.direction]){
					this.type[this.direction].call(this);
				}else if(this.type['revert']){
					this.type['revert'].call(this);
				}
			}

			//清空坐标集
			this.XY = {};

			//恢复move的方向识别
			this.firstMove = false;
		},

		//drag
		td : function(e){
			var _this = this,
			d = this.XY,
			vv = {}, //返回的距离按下坐标差
			allDis = {}; //返回的translate总偏移量

			//坐标差(move函数的参数)
			vv.x = d.x2 - d.x1;
			vv.y = d.y2 - d.y1;

			//输出总偏移量
			allDis.x = _this.oldX+vv.x;
			allDis.y = _this.oldY+vv.y;

			//存储偏移量
			/*_this.oldPos={
				x : allDis.x,
				y : allDis.y
			};*/

			_this.type['drag'] && _this.type['drag'].call(_this,allDis);
			//e.preventDefault();
			return false;
		},

		//简易transForm
		transForm : function(obj,speed,iTarget,type){
			var ele=obj.style;
			type = type || 'linear';
			speed = speed || 0;
			ele.webkitTransition = ele.transition ='all '+ speed + 'ms '+type;

			iTarget[0]=iTarget[0]+'';
			iTarget[1]=iTarget[1]+'';
			if(iTarget[0].indexOf('px')==-1){iTarget[0]+='px';}
			if(iTarget[1].indexOf('px')==-1){iTarget[1]+='px';}

			ele.webkitTransform =ele.transform ='translateX('+iTarget[0]+') translateY('+ iTarget[1] +') translateZ(0)';
		}
	};

	//扩展方法
	['start','end', 'move', 'tap', 'right', 'left', 'up', 'down', 'revert','longtap','drag'].forEach(function(key){
		Touch.prototype[key] = function(callback){
			this.type[key] = callback;
			return this;
		}
	});

	//滑动方向识别函数
	Touch.swipeDirection=function(x1, x2, y1, y2){
		if(!x2 && !y2){
			return 'none';
		}
		if(Math.abs(x2 - x1) > 70 || Math.abs(y1 - y2) > 70){
			return Math.abs(x1 - x2) >=	Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
		}else{
			return 'revert';
		}
	};

	//init构造器原型指向touch的原型
	Touch.prototype.init.prototype = Touch.prototype;

	//输出工厂函数
	return function( el ){
		return new Touch.prototype.init( el );
	};
});


/* promise兼容 */

if(typeof window.Promise=='undefined'){
	window.Promise = function(fn) {
		var data = undefined, reason = undefined;
		var succallbacks = [], failcallbacks = [];
		var status = "pending";
		this.then = function (fulfilled, rejected) {
			return new Promise(function(resolve,reject) {    //返回一个新的promise
				function suc(value) {   //成功
					var ret = typeof fulfilled === 'function' && fulfilled(value) || value;
					if( ret && typeof ret ['then'] == 'function'){    //判断 then中的 返回的是否是promise对象，如果是注册then方法
						ret.then(function(value){
							resolve(value);
						});
					} else {
						resolve(ret);
					}
				}
				function errback(reason) {  //失败
					reason = typeof rejected === 'function'  && rejected(reason) || reason;
					reject(reason);
				}
				if (status === 'pending') {
					succallbacks.push(suc);
					failcallbacks.push(errback);
				} else if(status === 'fulfilled'){
					suc(data);
				} else {
					errback(reason);
				}
			})
		}

		function resolve(value) {
			setTimeout(function () {   //加入延时
				status = "fulfilled";
				data = value;
				succallbacks.forEach(function(callback){
					callback(value);
				});
			}, 0);
		}

		function reject(value) {
			setTimeout(function () {
				status = "rejected";
				reason = value;
				succallbacks.forEach(function(callback){
					callback(value);
				});
			}, 0);
		}
		fn(resolve, reject);
	}
}



/****   数据   ****/
window.cacheDatas = {};
//ls cache
!function(a,b){"function"==typeof define&&define.amd?define([],b):"undefined"!=typeof module&&module.exports?module.exports=b():a.lscache=b()}(this,function(){function a(){var a="__lscachetest__",c=a;if(void 0!==n)return n;try{if(!localStorage)return!1}catch(a){return!1}try{h(a,c),i(a),n=!0}catch(a){n=!(!b(a)||!localStorage.length)}return n}function b(a){return!!(a&&"QUOTA_EXCEEDED_ERR"===a.name||"NS_ERROR_DOM_QUOTA_REACHED"===a.name||"QuotaExceededError"===a.name)}function c(){return void 0===o&&(o=null!=window.JSON),o}function d(a){return a.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")}function e(a){return a+q}function f(){return Math.floor((new Date).getTime()/s)}function g(a){return localStorage.getItem(p+u+a)}function h(a,b){localStorage.removeItem(p+u+a),localStorage.setItem(p+u+a,b)}function i(a){localStorage.removeItem(p+u+a)}function j(a){for(var b=new RegExp("^"+p+d(u)+"(.*)"),c=localStorage.length-1;c>=0;--c){var f=localStorage.key(c);f=f&&f.match(b),f=f&&f[1],f&&f.indexOf(q)<0&&a(f,e(f))}}function k(a){var b=e(a);i(a),i(b)}function l(a){var b=e(a),c=g(b);if(c){var d=parseInt(c,r);if(f()>=d)return i(a),i(b),!0}}function m(a,b){v&&"console"in window&&"function"==typeof window.console.warn&&(window.console.warn("lscache - "+a),b&&window.console.warn("lscache - The error was: "+b.message))}var n,o,p="lscache-",q="-cacheexpiration",r=10,s=6e4,t=Math.floor(864e13/s),u="",v=!1,w={set:function(d,l,n){if(a()&&c()){try{l=JSON.stringify(l)}catch(a){return}try{h(d,l)}catch(a){if(!b(a))return void m("Could not add item with key '"+d+"'",a);var o,p=[];j(function(a,b){var c=g(b);c=c?parseInt(c,r):t,p.push({key:a,size:(g(a)||"").length,expiration:c})}),p.sort(function(a,b){return b.expiration-a.expiration});for(var q=(l||"").length;p.length&&q>0;)o=p.pop(),m("Cache is full, removing item with key '"+d+"'"),k(o.key),q-=o.size;try{h(d,l)}catch(a){return void m("Could not add item with key '"+d+"', perhaps it's too big?",a)}}n?h(e(d),(f()+n).toString(r)):i(e(d))}},get:function(b){if(!a())return null;if(l(b))return null;var d=g(b);if(!d||!c())return d;try{return JSON.parse(d)}catch(a){return d}},remove:function(b){a()&&k(b)},supported:function(){return a()},flush:function(){a()&&j(function(a){k(a)})},flushExpired:function(){a()&&j(function(a){l(a)})},setBucket:function(a){u=a},resetBucket:function(){u=""},enableWarnings:function(a){v=a}};return w});


/*
* @设置缓存
* @参数：
type有四个值，temp(临时内存变量)，ss(sessionstory)，ls(localstory)，cookie(cookie)
* @示例：如下
	setCache({
		key : 'code',
		val : {a:55,gg:{b:456}},
		time: 1,//分
		type : 'ss'
	});
	getCache('code');
*/
window.setCache = fe.setCache = function(arg){
	if(typeof cacheDatas !='object'){
		throw '缓存变量cacheDatas丢失';
	}
	if(!arg || !arg.key || !arg.val){ return; }

	switch (arg.type){
		case 'ss':
			sessionStorage.setItem(arg.key,arg.val);
		break;
		case 'ls' :
			lscache.set(arg.key,arg.val,Number(arg.time));
		break;
		case 'cookie' :
			var _val = typeof arg.val=='object' ? JSON.stringify(arg.val) : arg.val;
			fe.cookie(arg.key,_val,{
				domain:'',
				path:'/',
				expires: Number(arg.time)/24/60
			});
		break;
		default :
			cacheDatas[arg.key] = arg.val;
		break;
	}
}
window.getCache = fe.getCache = function(key){
	if(!key){ return null; }
	if(cacheDatas[key]){
		return cacheDatas[key];
	}
	if(sessionStorage.getItem(key)){
		return sessionStorage.getItem(key);
	}
	if(lscache.get(key)){
		return lscache.get(key);
	}
	if(fe.cookie(key)){
		var _c = fe.cookie(key);
		try{
			return JSON.parse(_c);
		}catch(e){
			return _c;
		}
	}
}

/****   page   ****/
fe.page = function(arg){
	return new Page('m',arg);
}
function Page(pageType,arg){
	this.init( typeof pageType == 'string' ? pageType : 'm' ,  arg || {});
}
Page.debug = '';
Page.prototype = {
	version: '1.1.2',
	constructor: Page,
	host : location.host,
	init : function(pageType,arg){
		//客户端类型
		this.UA = navigator.userAgent;
		this.pageScene = '';
		this.v = {
			ScreenDirection : (window.orientation==180||window.orientation==0) ? 'y' : 'x',
			ios : !!this.UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
			iphone : /iphone/ig.test(this.UA),
			android : /android/i.test(this.UA),
			wuba : /WUBA/i.test(this.UA)
		};

		//页面环境判断(本地域名带端口号，视为tests)
		if(this.host.match(/(tests.58che|box.58che|dev.58che|:)/g)){
			this.pageScene = this.host.match(/(tests.58che|box.58che|dev.58che|:)/g)[0].match(/(tests|box|dev|:)/g)[0];
			this.pageScene = this.pageScene==':' ? 'tests' : this.pageScene;
		}else if(this.host=='localhost' || this.host=='127.0.0.1' || this.host==''){
			this.pageScene = 'local';
		}else if(location.port){
			this.pageScene = 'local';
		}
		this.pageType = pageType;

		//参数及配置处理
		if(arg.debug && this.pageScene){
			Page.debug = arg.debug;
			this.debug('--你开启了状态打印--');
		}

		//框架配置，页面域名和静态资源路径
		this.data = {};
		this.config = arg || {};
		fe.vm = this;

		//this.methos = (arg && arg.methods) || {};
		var _httpStr = location.protocol!='http:'||location.protocol!='https:' ? 'http:' : '';
		if(typeof pageCfg == 'undefined'){
			window.pageCfg = {};
		}
		this.data = pageCfg;
		this.rootUrl = typeof pageCfg.rootUrl !='undefined' ? pageCfg.rootUrl :  _httpStr+'//'+this.host;
		if(pageCfg.filePath){
			this.filePath = pageCfg.filePath
		}else{
			if(this.pageScene){
				if(this.pageScene == 'local'){
					this.filePath = '../../';
				}else{
					this.filePath = this.pageScene=='box' ? _httpStr+'//static-box.xgo-img.com.cn' : _httpStr+'//static-test.xgo-img.com.cn';
				}
			}else{
				this.filePath = _httpStr+'//static.xgo-img.com.cn';
			}
		}

		//hash处理
		this.hash = {};
		var hash = location.hash.split('#')[1];
		if(hash){
			hash = hash.split('&');
			if(hash.length){
				for(var i=0;i<hash.length;i++){
					var _tmp = hash[i].split('=');
					if(_tmp[0]){
						this.hash[_tmp[0]] = typeof _tmp[1] == 'undefined' ? true : _tmp[1];
					}
				}
			}
		}

		this.debug('基础数据收集完成');
		this.debug('Page类初始化完成');

		//页面生命周期开始
		if(typeof this.config.onStart == 'function'){
			this.debug('onStart完毕');
			this.debug('框架就绪，页面生命周期开始，主流程开启');
			this.config.onStart(this);
		}
		//dom渲染完毕，js加载完毕，触发onReady
		if(typeof this.config.onReady == 'function'){
			var _this = this;
			fe.ready(function(){
				_this.debug('onReady完毕');
				_this.config.onReady();
			});
		}

		//模块装载
		if(typeof this.config.modules == 'object' && this.config.modules.length){
			var _modules = this.config.modules;
			var _moduleNum = _modules.length;
			var _moduleLoadIndex = 0;
			var _this = this;
			function _loadModules(){
				if(_moduleLoadIndex >= _moduleNum){
					//_this.debug('模块装载完成');
					//绑定事件
					_this.bind();
					return;
				}
				//空地址跳过
				if(!_modules[_moduleLoadIndex]){
					_moduleLoadIndex++;
					_loadModules();
				}else{
					//装载js
					fe.loadJs(_this.filePath+'mod/'+_modules[_moduleLoadIndex],function(){
						_moduleLoadIndex++;
						_loadModules();
					});
				}
			}
			_loadModules();
		}else{
			this.debug('没有模块需要装载，直接跳到主流程');
			//绑定事件
			this.bind();
		}

	},
	//绑定事件，启动主流程
	bind : function(){
		var _this = this;
		//模块装载完毕，无模块等同onInitOver
		if(typeof _this.config.onModLoadOver == 'function'){
			_this.config.onModLoadOver(_this);
		}

		if(typeof _this.config.onLoad == 'function'){
			fe.bind(window,'load',function(){
				_this.config.onLoad();
				_this.debug('onload完毕');
			});
		}
		if(typeof _this.config.onShow == 'function'){
			fe.bind(window,'pageshow',function(){
				_this.config.onShow();
				_this.debug('onShow完毕');
			});
		}
		if(typeof _this.config.onHide == 'function'){
			fe.bind(window,'pagehide',function(){
				_this.config.onHide();
			});
		}
		if(typeof _this.config.onOrientationChange == 'function'){
			window.addEventListener("orientationchange", function(){
				_this.v.ScreenDirection = (window.orientation==180||window.orientation==0) ? 'y' : 'x';
				_this.config.onOrientationChange();
			}, false);
		}
		if(typeof _this.config.onRsize == 'function'){
			fe.bind(window,'resize',function(){
				_this.config.onRsize();
			});
		}
		if(typeof _this.config.onScroll == 'function'){
			var _winH = document.documentElement.clientHeight;
			var _top = document.documentElement.scrollTop||document.body.scrollTop;
			var _pageHeight = document.body.scrollHeight;

			//下面的60，是解决浏览器 地址栏 自动隐藏导致高度异常的bug
			var _re = {
                scrollTop : _top,
                pageHeight : _pageHeight,
				windowHeight : _winH,
				isEnd : _top+_winH >= _pageHeight-60,
				isTop : _top==0
			};
			fe.bind(window,'scroll',function(){
                _top = document.documentElement.scrollTop||document.body.scrollTop;
                _pageHeight = document.body.scrollHeight;
                _re.scrollTop = _top;
                _re.pageHeight = _pageHeight;
                _re.isTop = (_top==0);
                _re.isEnd = _top+_winH >= _pageHeight-60;
                _this.config.onScroll(_re);
			});
			if(_top!=0){
				_this.config.onScroll(_re);
			}
		}
		this.debug('事件绑定完成');
	},
	debug : function(str){
		if(Page.debug == 'alert'){
			alert(str);
		}else if(Page.debug == 'log'){
			console.log(str);
		}
	}
};