/* 
 * �ļ����� : appsnew201807.js 
 * ������ : �����h 
 * ��������: 2018/07/05
 * �ļ�����: ҵ�����
 * ��ʷ��¼: ��
 */

/*-------------------��ϵҳ��ӶԱȹ���----------------------*/
var contrastBtn = document.querySelectorAll(".contrastBtn");
var vsiconbox = document.querySelector("i");
var appsarr = new Array();

//���ư�ť���״̬
for(var i = 0; i < contrastBtn.length; i++) {
	contrastBtn[i].index = i;
	contrastBtn[i].ontouchstart = function() {
		var thisindex = contrastBtn[this.index];
		var nameId = thisindex.getAttribute("name");
		if(contrastBtn[this.index].className == "contrastBtn") {
			console.log("���");

			//���ư�ťUI�ر�
			contrastBtn[this.index].classList.add("no");

			//У������
			regNum("productId", function() {
				alert("���ֻ�����20��Աȳ���");
			});

			//push����id������
			appsarr.push(thisindex.getAttribute("name"));

			//��ӳ���id
			addProductID("productId", appsarr, 1, function() {
				//�����Ҳ�Ư��UI
				if(dupRem(appsarr).length > 0) {
					vsiconbox.style.display = "block";
				}
			})
		} else {
			console.log("ɾ��");
			//���ư�ťUI����
			contrastBtn[this.index].classList.remove("no");

			//ɾ������id
			delProductID("productId", nameId, 1, function() {
				//�����Ҳ�Ư��UI
				if(cookie("productId") == "") {
					vsiconbox.style.display = "none";
				}
			});
		}
	};

	//�ж�ˢ��ҳ���ť״̬
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

//�����Ҳ�Ư�����״̬
if(cookie("productId") && vsiconbox) {
	if(cookie("productId")==""){
		vsiconbox.style.display="none";
	}else{
		vsiconbox.style.display = "block";
	}
}

/*-------------------��ϵҳ���۵���ʱ----------------------*/
Datedown("2018/08/05 18:05", "Dateday", "Datehours", function() {
	//�ص�����
	alert(1)
});