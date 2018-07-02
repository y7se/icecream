/*设计图为750 计算参数为100*/
function changefontsize(){
		var _this = this;

		var html = document.getElementsByTagName('html')[0];

		var screenWitdh = _this.innerWidth > 750 ? 750 : _this.innerWidth;

		html.style.fontSize = screenWitdh * 100 / 750 + "px";
}
changefontsize();

window.onresize = changefontsize;

function pageSize(json) {
	var targetObj = $(json.target);
	var parentObj = targetObj.parent();
	var targetHeight = targetObj.outerHeight();
	var parentWidth = parentObj.outerWidth();
	var parentHeight = parentObj.outerHeight();
	var scale = 1;
	if(parentHeight < targetHeight) {
		scale = parentHeight / targetHeight;
	}
	targetObj.css({'transform': 'scale('+ scale +')', '-webkit-transform': 'scale('+ scale +')'});
	if(json.success && typeof json.success == 'function') {
		json.success({
			scale: scale,
			ratio: parentWidth / json.vwidth
		})
	}
}

// 图片预加载
function imgLoad(json) {
	var sourceArr = json.data;
	var imgLength = 0;
	for (var i in sourceArr) {
		if(sourceArr[i].src) {
			imgLength ++;
		}
		if(sourceArr[i].items) {
			for(var j in sourceArr[i].items) {
				imgLength ++;
			}
		}
	}
	function loadImage(path, callback){
		var img = new Image();
		img.onload = function(){
			img.onload = null;
			path.image = img;
			callback(path);
		};
		img.src = path.src;
	};
	function imgLoader(imgs, callback){
		var k = 0;
		for(var i in imgs){
			if(imgs[i].src) {
				loadImage(imgs[i], function(path){
					callback(path, ++k, imgLength);
				});
			}
			if(imgs[i].items) {
				for(var j in imgs[i].items) {
					loadImage(imgs[i].items[j], function(path){
						callback(path, ++k, imgLength);
					});
				}
			}
		}
	};
	imgLoader(sourceArr, function(path, curNum, total){
		var percent = curNum / total;
		if(json.plan_obj) {
			json.plan_obj.css('width', parseInt(percent * 100) + '%')
		}
		if(json.plan_text) {
			json.plan_text.html(parseInt(percent * 100) + '%');
		}
		if(percent == 1) {
			if(json.success && typeof json.success == 'function') {
				json.success(sourceArr);
			}
		}
	});
};

// 滚动处理
function scrollInit(json) {
	var scrollObj = json.object;
	var parentObj = scrollObj.parent();
	var planObj = parentObj.find('.scroll-plan');
	var planItemObj = planObj.find('i');
	var scrollH = scrollObj.outerHeight();
	var parentH = parentObj.outerHeight();
	var planH = planObj.outerHeight();
	var planItemH = 0;

	if(scrollObj.attr('data-scroll')) return;
	scrollObj.attr('data-scroll', 1);

	if(scrollH <= parentH) return;

	scrollObj.css({'padding-right': '.5rem', 'top': scrollTop});
	planObj.show();
	scrollH = scrollObj.outerHeight();
	
	planItemH = parentH / scrollH * planH;
	planItemObj.css({'height': planItemH});

	var startTop = 0, endTop = 0;
	var scrollTop;
	scrollObj.on('touchstart', function() {
		event.preventDefault();
		var touch = event.touches[0];
		startTop = touch.pageY;
		scrollTop = $(this).attr('data-top') ? parseInt($(this).attr('data-top')) : 0;
	});
	scrollObj.on('touchmove', function() {
		event.preventDefault();
		var touch = event.touches[0];
		endTop = touch.pageY;

		scrollTop += endTop - startTop;
		if(scrollTop >= 0) {
			scrollTop = 0;
		}
		if(scrollTop <= parentH - scrollH) {
			scrollTop = parentH - scrollH
		}
		$(this).css({'top': scrollTop}).attr('data-top', scrollTop);
		planItemObj.css({'top': -scrollTop / scrollH * planH}).attr('data-top', -scrollTop / scrollH * planH)

		startTop = endTop;
	});

	planItemObj.on('touchstart', function() {
		event.preventDefault();
		var touch = event.touches[0];
		startTop = touch.pageY;
		scrollTop = $(this).attr('data-top') ? parseInt($(this).attr('data-top')) : 0;
	});

	planItemObj.on('touchmove', function() {
		event.preventDefault();
		var touch = event.touches[0];
		endTop = touch.pageY;

		scrollTop += endTop - startTop;
		if(scrollTop <= 0) {
			scrollTop = 0;
		}
		if(scrollTop >= planH - planItemH) {
			scrollTop = planH - planItemH
		}
		planItemObj.css({'top': scrollTop}).attr('data-top', scrollTop);
		scrollObj.css({'top': -scrollTop / planH * scrollH}).attr('data-top', -scrollTop / planH * scrollH)

		startTop = endTop;
	});
}


// 显示弹窗
function popShow(json) {
	var popObj = json.object;
	popObj.show().siblings('.pop-mask').hide();
	popObj.find('.pop-hide').unbind().on('click', function() {
		popObj.hide();
	})
	if(json.success && typeof json.success == 'function') {
		json.success();
	}
}

// 显示提示
function promptShow(text, icon) {
	var promptObj = $('#promptBox');
	if(icon) {
		promptObj.prepend(icon);
	}
	promptObj.show().find('p').html(text);
	setTimeout(function(){
		promptObj.find('i').remove();
		promptObj.hide().find('p').html('');
	}, 1000);
}