/* 获取当前日期
 * @Function
 * @return：array[0] ---> 年
 *          array[1] ---> 月
 *          array[2] ---> 日
 */
function getDays(){
	var now = new Date();  
		var days = [];
    var year = now.getFullYear(),
    	month = now.getMonth() + 1, 
    	day = now.getDate();
    days.push(year);
    days.push(month);
    days.push(day);  
    return days;
}

/* 获取某年某个月有多少天
 * @Function
 * @param year:年份
 * @param month:月份
 * @return 某年某月的最大天数
 */
function getDaysInMonth (year,month) {
      month = parseInt(month,10);
      var temp = new Date(year,month,0);
      return temp.getDate();
}

/* 监听滚动区域
 * @Function
 * @param id:滚动区域的id
 * @param nullLi:显示区域最上方有几条为空的数据，默认为2
 *				 例如显示区域一次展示5条，则nullLi为2;
 *					 显示区域一次展示7条，则nullLi为3;
 * @param num:限制滚动的序号，默认为nullLi(不限制滚动);
 */
function dialog(id,num,nullLi){
	var result,
		index,endIndex,//初始位置的序号
		dom = document.getElementById(id),
        $dom = $(dom).children("ul");//dom
		liH = $dom.children("li").height(),//滚动区域单条高度
		liLen = $dom.children("li").length;//滚动区域总条数
	//显示区域最上方有几条为空的数据,默认为2条
	if(!nullLi){var nullLi = 2;}
	//判断是否有限制滚动，默认无
	if(!num){var num = nullLi;}
	endIndex = index = num > nullLi ? num : nullLi;
	//初始位置值
	var initTop = - (index - nullLi) * liH;
    $dom.css("top",initTop);
    //初始位置的样式
    $dom.children("li").eq(index)
        	.addClass("active").siblings().removeClass("active");

    //监听
	var watcher = new TouchWatcher(id);
    watcher.init({
        type: 'yWatch',
        startFunc: function (THIS) {
			result = parseInt($(THIS.dom).children("ul").css("top"));
        },
        moveFunc: function (THIS) {
        	var moveLoc = THIS.deltaY + result; //滚动过程中top值
    		var moveActive = index - Math.round(THIS.deltaY / liH);//滑动过程中处于选中区域的序号
    		//为了流畅性，滚动过程中用top值去判断临界点 
    		if(moveLoc > initTop && THIS.deltaY >= 0){//滑动到 第一条数据||限制数据
    			moveActive = endIndex;
    			moveLoc = initTop;
    		}else if(moveLoc < - (liLen - nullLi - 1) * liH && THIS.deltaY < 0){//滑动到 最后一条数据 				
    			moveActive = liLen - 1;
    			moveLoc = - (liLen - nullLi - 1) * liH;
    		}
    		//滑动过程中，滚动区域的位置以及样式
    		$(THIS.dom).children("ul").css("top",moveLoc);
    		$(THIS.dom).children("ul").children("li").eq(moveActive)
    			.addClass("active").siblings().removeClass("active");	
        },
        endFunc: function (THIS) {
        	var resultTop;//停止滚动的位置
        	index = index - Math.round(THIS.deltaY / liH);//停止滑动，处于选中区域的序号
        	
        	//停止滚动用序号去判断哪一条数据应该处于选中区域 
        	if(index < endIndex && THIS.deltaY >= 0){//滑动到 第一条数据||限制数据
        		index = endIndex;
        		resultTop = initTop;
    		}else if(index > liLen - 1 && THIS.deltaY <= 0){//滑动到 最后一条数据
    			index = liLen - 1;
        		resultTop = -(liLen - nullLi - 1) * liH;
    		}else{//最终位置
        		resultTop = - (index - nullLi) * liH;
    		}

        	$(THIS.dom).children("ul").css("top",resultTop);
        }
    });
}