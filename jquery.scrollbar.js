(function($){
	
	$.fn.scrollbar = function( opts ) {
		
		var args = $.extend({}, $.fn.scrollbar.default, opts);
		
		//添加事件监听函数
		function addListener(elem, type, handler) {
			if(elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			}else if(elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			}else {
				elem['on' + type] = handler;
			}
		}
		
		var scrollInit = function(elem) {
			
			//添加父级容器
			elem.wrap('<div id="'+args.parent+'"></div>');
			var parent = elem.parent('#' + args.parent);
			//添加滚动条
			$('<div id="'+args.scroll+'"><div id="'+args.scroll_inner+'"></div></div>').appendTo(parent);
			
			var scrollbar = $('#' + args.scroll),
				scrollInner = $('#' + args.scroll_inner);
			
			//滚动参数
			var content_H = elem.height(),
			    viewbox_H = parent.height(),
			    scroll_inner_H = viewbox_H * viewbox_H /content_H,
			    contentMoveDis = content_H - viewbox_H,					//内容区可供滚动的最大距离
		        barMoveDis = viewbox_H - scroll_inner_H,				//滚动条可供滚动的最大距离
		        scale = barMoveDis/contentMoveDis,						//滚动比例			
		        curPos = 0,
		        wheelDis = args.wheel_distance;							
		    
		    //触摸参数
		    var lastPoint = 0;
			
			//设置滚动滑块高度
			scrollInner.height(scroll_inner_H + 'px');
//			elem.css({'top':'0'});
			
			//获取dom
			var viewbox = parent.get(0);
			//绑定鼠标滚动事件
			addListener(viewbox, 'mousewheel', mouseWheelHandler);	//IE,chrome
			addListener(viewbox, 'DOMMouseScroll', mouseWheelHandler); //Firefox
			
			//绑定触摸滑动事件
			addListener(viewbox,'touchstart',touchStartHandler);
			addListener(viewbox,'touchmove',touchMoveHandler);

			function mouseWheelHandler(event) {
				
				var ev = event || window.event;
				ev.preventDefault();	
				var isDown = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;//IE,chrome: ev.wheelDelta | Firefox:ev.detail
				if(isDown){
			
					if(curPos >= contentMoveDis){
						return false;
					}else{
						curPos = (curPos + wheelDis <= contentMoveDis) ? (curPos + wheelDis) : contentMoveDis;
					}
				}else{
			
					if(curPos <= 0){
						return false;
					}else{
						curPos = (curPos - wheelDis >=0) ? (curPos - wheelDis) : 0;
					}
				}
				elem.css({
					'transform':'translate3d(0,'+ (-curPos) +'px,0)',
					'-webkit-transform':'translate3d(0,'+ (-curPos) +'px,0)'
				});
				scrollInner.css({
					'transform':'translate3d(0,'+ (curPos*scale) +'px,0)',
					'-webkit-transform':'translate3d(0,'+ (curPos*scale) +'px,0)'
				});
				return false;				
			}
			
			function touchStartHandler(event) {

				lastPoint = event.touches[0].clientY;
				return false;
			}
			
			function touchMoveHandler(event) {
				
				event.preventDefault();
				var curPoint = event.touches[0].clientY;
				var moveDis = curPoint - lastPoint;
				if(moveDis < 0){
					//向上滑动
					if(curPos >= contentMoveDis){
						return false;
					}
					if(curPos - moveDis >= contentMoveDis){
						curPos = contentMoveDis;
					}else{
						curPos -= moveDis;
						lastPoint = curPoint;
					}
				}else{
					//向下滑动
					if(curPos <= 0){
						return false;
					}
					if(curPos - moveDis <= 0){
						curPos = 0;
					}else{
						curPos -= moveDis;
						lastPoint = curPoint;
					}
				}
				elem.css({
					'transform':'translate3d(0,'+ (-curPos) +'px,0)',
					'-webkit-transform':'translate3d(0,'+ (-curPos) +'px,0)'
				});
				scrollInner.css({
					'transform':'translate3d(0,'+ (curPos*scale) +'px,0)',
					'-webkit-transform':'translate3d(0,'+ (curPos*scale) +'px,0)'
				});
				return false;
			}
		}
		
		//强制隐式迭代
		return this.each(function() {
			new scrollInit($(this));
		});
	}
	
	//默认参数
	$.fn.scrollbar.default = {
		parent : 'scroll_viewbox',		//父级元素的id
		scroll : 'scroll_bar',			//滚动条的id
		scroll_inner: 'scroll_inner',	//滚动条滑块的id
		wheel_distance : 30				//鼠标轮动一次内容的位移增量 
	}
	
})(jQuery);
