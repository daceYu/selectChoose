/*
*	touchWatcher.js
*	build time: 2017.03.22
*	@param: id - element's id
*	@param: options - option json
*	@param: options.type - watch type('xWatch')
*	@param: options.startFunc - watch start funciton
*	@param: options.moveFunc - watch move funciton
*	@param: options.endFunc - watch end function
*	example: var watcher = new TouchWatcher('test'),
*			     watcher.init({type: 'leftWatch', moveFunc: function(THIS) {console.log(THIS.deltaX)}})
*/

;(function () {
	window.TouchWatcher = function (id) {
		this.dom = document.getElementById(id);
		if (!this.dom) {
			console.warn('Cannot set element.');
			return false;
		}
	}
	
	//纵向监听
	TouchWatcher.prototype.yWatcher = function(options){
		var THIS = this,
			startY;
		this.speedY = 0,
		this.deltaY = 0;
		this.flagY = false;
		
		this.start = function (event) {
			this.flagY = true;
			THIS.startTime = parseInt((new Date()).getTime()) / 1000;
			var touch = event.touches[0];
			startY = touch.pageY;
			THIS.startY = startY;
			THIS.deltaY = 0;//点击的时候重置
			if (options.startFunc) options.startFunc(THIS);
		};
		this.move = function (event) {
			if (!this.flagY) return false;
			var touch = event.touches[0];
			THIS.deltaY = touch.pageY - THIS.startY;
			if (options.moveFunc) options.moveFunc(THIS);
			event.preventDefault();
		};
		this.end = function (event) {
			this.flagY = false;
			THIS.endTime = parseInt((new Date()).getTime()) / 1000;
			THIS.speed = THIS.deltaY / (THIS.endTime - THIS.startTime);
			if (options.endFunc) options.endFunc(THIS);
		};	
	}
	
	//横向监听
	TouchWatcher.prototype.xWatcher = function(options){
		var THIS = this,
			startX;
		this.speed = 0,
		this.deltaX = 0;
		this.flag = false;
		
		this.start = function (event) {
			this.flag = true;
			THIS.startTime = parseInt((new Date()).getTime()) / 1000;
			var touch = event.touches[0];
			startX = touch.pageX;
			THIS.startX = startX;
			if (options.startFunc) options.startFunc(THIS);
		};
		this.move = function (event) {
			if (!this.flag) return false;
			var touch = event.touches[0];
			THIS.deltaX = touch.pageX - THIS.startX;
			if (options.moveFunc) options.moveFunc(THIS);
			event.preventDefault();
		};
		this.end = function (event) {
			this.flag = false;
			THIS.endTime = parseInt((new Date()).getTime()) / 1000;
			THIS.speed = THIS.deltaX / (THIS.endTime - THIS.startTime);
			if (options.endFunc) options.endFunc(THIS);
		};	
	}
	
	//加上事件
	TouchWatcher.prototype.init = function (options) {
		if (!options.type) {
			console.warn('Cannot find watch type');
			return false;
		}

		if (options.type == 'xWatch') {
			this.xWatcher(options);
		}else if (options.type == 'yWatch') {
			this.yWatcher(options);
		}
		if (!this.start || !this.move || !this.end) return false;
		
		this.dom.addEventListener("touchstart", this.start, false);
		this.dom.addEventListener("touchmove", this.move, false);
		this.dom.addEventListener("touchend", this.end,false);
	}
	
	//取消事件
	TouchWatcher.prototype.destory = function () {
		this.dom.removeEventListener("touchstart", this.start);
        this.dom.removeEventListener("touchmove", this.move);
        this.dom.removeEventListener("touchend", this.end);
	}
}());/*@charset "utf-8"*/