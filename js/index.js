var selecter = {};

//清空滚动区域
selecter.clr = function () {
	$("#dialog ul").html("");
}

/* @Function 添加内容至滚动区域
 * @param start:第一条数据的值
 * @param end:最后一条数据的值
 * @param nullLi:最上方空数据的条数，默认为2
 */
selecter.addData = function (start,end,nullLi) {
	if(!nullLi){var nullLi = 2;}
	
	var li = "";
	for(var i = 1;i <= nullLi;i++){
		li = li + "<li></li>";
	}
	for(var i = start ; i <= end; i++){
		li =li + "<li>" + i + "</li>";
	}
	$(li).appendTo($("#dialog ul"));
}

//禁止弹窗浮层背景滚动
selecter.forbid = function () {
	$(".dialogBg").on("touchmove",function (event) {
		event.preventDefault();
	})
}

/* @Function 判断当前日期是否合理
 * @param _selectTime:当前选中的日期
 */
selecter.judgeDate = function (_selectTime) {
	if(_selectTime.year == this.nowTime[0] && (_selectTime.month < this.nowTime[1] || 
		(_selectTime.month == this.nowTime[1] && _selectTime.date < this.nowTime[2]))){
		//选择日期小于当天，不处理 页面显示日期对象
	}else{//选择日期合理，更新 页面显示日期对象
		this._date.year = _selectTime.year;
		this._date.month = _selectTime.month;
		this._date.date = _selectTime.date;
	}

	var maxDate = getDaysInMonth(this._date.year,this._date.month);
	if(this._date.date > maxDate){
		this._date.date = maxDate;
		$("#date").html(maxDate);
	}
}

//初始化页面日期
selecter.initDate = function () {
	$("#year").html(this._date.year);
	$("#month").html(this._date.month);
	$("#date").html(this._date.date);
}

//添加事件
selecter.setEvents = function () {
	var THIS = this;
	THIS.nowTime = getDays();
	THIS._date = { //页面显示日期对象，默认值为当天日期
		year:THIS.nowTime[0],
		month:THIS.nowTime[1],
		date:THIS.nowTime[2]
	}

	$("#year,#month,#date").on("click",function () {
		THIS.clr();
		var switchId = $(this).attr("id");
		$(".dialogBg").removeClass("year date month").addClass(switchId);
		$(".dialogBg,.dialog").removeClass("z-hide");

		switch(switchId){
			case "year":
				THIS.addData(THIS.nowTime[0],2030);
				dialog("dialog");
				break;
			case "month":
				THIS.addData(1,12);
				if(THIS._date.year != THIS.nowTime[0]){
					dialog("dialog");
				}else{
					dialog("dialog",THIS.nowTime[1] + 1);
				}
				break;
			case "date":
				THIS.addData(1,getDaysInMonth(THIS._date.year,THIS._date.month));
				if(THIS._date.year == THIS.nowTime[0] && THIS._date.month == THIS.nowTime[1]){
					dialog("dialog",THIS.nowTime[2] + 1);
				}else{
					dialog("dialog");
				}
				break;
		}
	})

	//弹框消失
	$(".dialogBg").on("click",function () {
		var $t = $(this);
		var activeVal = $(".active").html();
		var _selectTime = {
			year: THIS._date.year,
			month: THIS._date.month,
			date: THIS._date.date
		}

		//对年、月、日进行操作
		if($t.hasClass("year")){
			_selectTime.year = activeVal;
			THIS.judgeDate(_selectTime);
			$("#year").html(THIS._date.year);
		}
		if($t.hasClass("month")){
			_selectTime.month = activeVal;
			THIS.judgeDate(_selectTime);
			$("#month").html(THIS._date.month);
		}
		if($t.hasClass("date")){
			_selectTime.date = activeVal;
			THIS.judgeDate(_selectTime);
			$("#date").html(THIS._date.date);
		}
		//消失
		$(".dialogBg,.dialog").addClass("z-hide");
	})
}
//
selecter.init = function () {
	this.setEvents();
	this.initDate();
	this.forbid();
}
