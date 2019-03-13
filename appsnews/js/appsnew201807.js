/* 
 * 文件名称 : appsnew201807.js 
 * 创建者 : 张辛玥 
 * 创建日期: 2018/07/05
 * 文件描述: 业务代码
 * 历史记录: 无
 */

/*-------------------车系页添加对比功能----------------------*/
var contrastBtn = document.querySelectorAll(".contrastBtn");
var vsiconbox = document.querySelector("i");
var appsarr = new Array();

//控制按钮点击状态
for(var i = 0; i < contrastBtn.length; i++) {
	contrastBtn[i].index = i;
	contrastBtn[i].ontouchstart = function() {
		var thisindex = contrastBtn[this.index];
		var nameId = thisindex.getAttribute("name");
		if(contrastBtn[this.index].className == "contrastBtn") {
			console.log("添加");

			//控制按钮UI关闭
			contrastBtn[this.index].classList.add("no");

			//校验数量
			regNum("productId", function() {
				alert("最多只能添加20款对比车型");
			});

			//push车型id至数组
			appsarr.push(thisindex.getAttribute("name"));

			//添加车型id
			addProductID("productId", appsarr, 1, function() {
				//操作右侧漂浮UI
				if(dupRem(appsarr).length > 0) {
					vsiconbox.style.display = "block";
				}
			})
		} else {
			console.log("删除");
			//控制按钮UI开启
			contrastBtn[this.index].classList.remove("no");

			//删除车型id
			delProductID("productId", nameId, 1, function() {
				//操作右侧漂浮UI
				if(cookie("productId") == "") {
					vsiconbox.style.display = "none";
				}
			});
		}
	};

	//判断刷新页面后按钮状态
	if(cookie("productId") && vsiconbox) {
		var nameidstr=+contrastBtn[i].getAttribute("name");
		var cookiestr=cookie("productId");
		console.log(nameidstr);
		console.log(cookiestr);
		if(cookiestr.indexOf(nameidstr)!=-1){
			contrastBtn[i].classList.add("no");
		}
			
	}

}

//控制右侧漂浮红点状态
if(cookie("productId") && vsiconbox) {
	if(cookie("productId")==""){
		vsiconbox.style.display="none";
	}else{
		vsiconbox.style.display = "block";
	}
}

/*-------------------车系页降价倒计时----------------------*/
Datedown("2018/08/05 18:05", "Dateday", "Datehours", function() {
	//回调函数
	alert(1)
});