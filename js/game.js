// 页面初始化
pageSize({
	target: document.getElementById('pageBox'),
	vwidth: 750,
	success: function(json) {
		var pageVaryItems = json;
		var pageItems = {
			base_items: [
				{id: 0, title: '蛋卷冰淇淋', finish_num: 0, all_num: 4, finish_all_num: 0, first_type: true, coin: 0, src: 'images/game_base01.png'},
				{id: 1, title: '甜筒冰淇淋', finish_num: 0, all_num: 2, finish_all_num: 0, first_type: true, coin: 10, src: 'images/game_base02.png'},
				{id: 2, title: '圣代冰淇淋', finish_num: 0, all_num: 3, finish_all_num: 0, first_type: true, coin: 20, src: 'images/game_base03.png', task_title: '任务：查询话费账单', task_url: 'https://'},
				{id: 3, title: '冰风暴冰淇淋', finish_num: 0, all_num: 1, finish_all_num: 0, first_type: true, coin: 30, src: 'images/game_base04.png', task_title: '任务：进入话费查询', task_url: 'https://'}
			], // 每日制作冰淇淋数量，finish_num 当前已完成冰淇淋数量 all_num 当天多制作该冰淇淋数量（每日随机生成） finish_all_num 当前已有该冰淇淋数量 first_type 是否当天首次 coin 需要消耗和微币数 task_url 做任务链接
			main_items: {
				main: {
					items: [
						{id: 0, src: 'images/game_main01.png', type: 1},
						{id: 1, src: 'images/game_main02.png', type: 1},
						{id: 2, src: 'images/game_main03.png', type: 1},
						{id: 3, src: 'images/game_main04.png', type: 1},
						{id: 4, src: 'images/game_main05.png', type: 1},
						{id: 5, src: 'images/game_main06.png', type: 1},
						{id: 6, src: 'images/game_main07.png', type: 1},
					]
				},
				barrier: {
					src: 'images/game_barrier.png',
					items: {
						result: {src: 'images/game_barrier_result.png'}
					},
					type: 2
				}
			},
			coin_num: 100, // 我的和微币数
			left_num: 5, // 我的生命值
		};

		var ratio = pageVaryItems.ratio;
		var scale = pageVaryItems.scale;
		var canvasObj = $('#gameCanvas')[0];
			canvasObj.width = 670 * ratio;
			canvasObj.height = 596 * ratio;
		var ctxt = canvasObj.getContext('2d');

		var baseIndex = 0;
		var mainArr = [];
		var mainGainArr = []; // 储存已接到的冰淇淋
		var barrierItem;
		var startType = false; // 游戏开始状态
		var taskType = false; // 做任务状态

		// 显示引导
		guideShow();

		imgLoad({
			data: pageItems.base_items,
			success: function() {
				
				gameInit();
				imgLoad({
					data: pageItems.main_items,
					success: function() {
						var mainData = pageItems.main_items.main.items;
						for(var i=0; i<mainData.length; i++) {
							(function(n) {
								mainData[n].w = mainData[n].image.width * ratio;
								mainData[n].h = mainData[n].image.height * ratio;
								mainData[n].y = 0;
							})(i)
						}

						var barrierData = pageItems.main_items.barrier;
						barrierData.w = barrierData.image.width * ratio;
						barrierData.h = barrierData.image.height * ratio;
						barrierData.y = 0;

						var barrierResultData = barrierData.items.result;
						barrierResultData.w = barrierResultData.image.width * ratio;
						barrierResultData.h = barrierResultData.image.height * ratio;
						leftShow();
						// gameStart();
					}
				});
			}
		});

		var numJson;
		pageItemInit(pageItems, function(json) {
			var baseItemObj = $('#gameBaseBox .item');
			var startBtnObj = $('#startBtn');

			var baseItem;

			numJson = json;
			baseItemObj.unbind().on('click', function() {
				// 选择冰淇淋
				var _this = $(this);
				if(startType) return;

				if(_this.hasClass('active')) return;

				baseIndex = _this.index();
				baseItem = pageItems.base_items[baseIndex];
				taskType = false;
				if(baseItem.first_type && baseItem.task_url) {
					console.log('需要做任务')
					taskType = true;
					
				}
				_this.addClass('active').siblings('.item').removeClass('active');
				gameDraw();
			});
			// 开始游戏
			startBtnObj.unbind().on('click', function() {
				var _this = $(this);

				baseItem = pageItems.base_items[baseIndex];

				if(taskType) {
					var popObj = $('#popTaskOper');
					popShow({
						object: popObj,
						success: function() {
							popObj.find('.task-title').html(baseItem.task_title)
							popObj.find('.pop-btn-task').unbind().on('click', function() {
								popObj.hide();
								taskType = false;
								location.href = baseItem.task_url; // 跳转任务链接
							})
						}
					});
				} else {
					if(numJson.finishNum >= numJson.allNum) {
						// 今日次数用完
						console.log('今日次数用完');
						var popObj = $('#popPrompt02');
						popShow({
							object: popObj,
							success: function() {
								popObj.find('.pop-btn-share').unbind().on('click', function() {
									popShow({
										object: $('#popShare')
									})
								})
							}
						})
					} else {
						if(baseItem.finish_num >= baseItem.all_num) {
							// 当前冰淇淋当天次数用完
							promptShow('该冰淇淋可制作次数不足');
						} else {
							if(baseItem.coin && !baseItem.first_type) {
								// 扣除积分提示
								var popObj = $('#popPrompt01');
								popShow({
									object: popObj,
									success: function() {
										popObj.find('.title').html(baseItem.title);
										popObj.find('.coin').html(baseItem.coin);
										popObj.find('.pop-btn01').unbind().on('click', function() {
											if(pageItems.coin_num < baseItem.coin) {
												// 微币不足

												coinTaskShow();
												
											} else {
												promptShow('制作冰淇淋&nbsp;&nbsp;&nbsp;&nbsp;-' + baseItem.coin, '<i class="coin-icon' + baseItem.coin + '"></i>'); // 提示扣分
												pageItems.coin_num -= baseItem.coin;
												pageItemInit(pageItems); // 更新页面
												popObj.hide();
												gameStart();
											}
										})
									}
								})
							} else {
								gameStart();	
							}
						}
					}
				}	
			});

			// 分享提示
			$('#shareBtn').unbind().on('click', function() {
				popShow({
					object: $('#popShare')
				});
			});

			// 活动规则
			$('#btnRule').unbind().on('click', function() {
				popShow({
					object: $('#popRule'),
					success: function() {
						scrollInit({
							object: $('#popRule .rule-item')
						})
					}
				});
			});

			// 获取和微币
			$('#btnCoin').unbind().on('click', function() {
				coinTaskShow();
			});

		});
		function pageItemInit(data, callback) {
			// 页面信息初始化
			$('#gameCoinNum').html(data.coin_num + '个');
			var finishNum = 0;
			var allNum = 0;
			var finishAllNum = 0;

			var baseItemObj = $('#gameBaseBox .item');
			var baseItems = data.base_items;
			for(var i=0; i<baseItems.length; i++) {
				finishNum += baseItems[i].finish_num;
				allNum += baseItems[i].all_num;
				finishAllNum += baseItems[i].finish_all_num;
				if(baseItems[i].first_type) {
					baseItemObj.eq(i).find('.num').html('免费');
				} else {
					baseItemObj.eq(i).find('.num').html(baseItems[i].finish_num + '/' + baseItems[i].all_num);
					if(baseItems[i].coin) {
						baseItemObj.eq(i).attr('data-coin', baseItems[i].coin);
					}
				}
				
			}
			if(finishAllNum >= 1000) {
				finishAllNum = 999;
			}
			$('#gameFinishAllNum').html(finishAllNum >= 10 ? finishAllNum : '0' + finishAllNum);
			$('#gameFinishNum').html(finishNum + '/' + allNum);

			if(callback && typeof callback == 'function') {
				callback({
					finishNum : finishNum,
					allNum : allNum,
					finishAllNum : finishAllNum
				})
			}
		}
		function mainSite() {
			var siteData = [];
			for(var i=0; i<5; i++) {
				siteData.push(canvasObj.width / 6 * (i + 1));
			}
			return siteData;
		}
		function leftShow() {
			var leftObj = $('#lifeItem i');
			leftObj.removeClass('active');
			for(var i=0; i<leftObj.length; i++) {
				if(i < pageItems.left_num) {
					leftObj.eq(i).addClass('active');
				}
			}
		}
		// 游戏界面初始化
		function gameInit() {
			var baseData = pageItems.base_items;
			startType = false;
			$('#startBtn').parent().removeClass('anim-hide').addClass('anim-show');
			for(var i=0; i<baseData.length; i++) {
				(function(n) {
					baseData[n].w = baseData[n].image.width * ratio;
					baseData[n].h = baseData[n].image.height * ratio;
					baseData[n].x = (canvasObj.width - baseData[n].image.width * ratio) / 2;
					baseData[n].y = canvasObj.height - baseData[n].image.height * ratio;
					baseData[n].my = baseData[n].y;
				})(i)
			}
			mainArr = [];
			mainGainArr = [];
			pageItems.left_num = 5;
			barrierItem = '';
			leftShow();
			gameDraw();
		}
		// 开始游戏
		function gameStart() {
			var baseItem = pageItems.base_items[baseIndex];
			var mainData = pageItems.main_items.main.items;
			var barrierData = pageItems.main_items.barrier;
			var barrierResultData = barrierData.items.result;

			var startArr = {x: 0, y: 0},
				endArr = {x: 0, y: 0};
			var sTop = $('.page-scroll')[0].scrollTop;
			var canvasX = $(canvasObj).offset().left;
			var canvasY = $(canvasObj).offset().top;

			var moveType = false;

			startType = true;
			
			$('#startBtn').parent().removeClass('anim-show').addClass('anim-hide');
			$(canvasObj).unbind().on('touchstart', function() {
				event.preventDefault();
				var touch = event.touches[0];
				canvasX = $(canvasObj).offset().left;
				canvasY = $(canvasObj).offset().top;

				startArr.x = (touch.pageX - canvasX) / scale;
				startArr.y = (touch.pageY - canvasY) / scale;

				// console.log(startArr.x + ';' + baseItem.x)
				if(startArr.x >= baseItem.x && startArr.x <= baseItem.x + baseItem.w && startArr.y >= baseItem.y && startArr.y <= baseItem.y + baseItem.h) {
					console.log(true)
					moveType = true;
				}
			});
			$(canvasObj).on('touchmove', function() {
				event.preventDefault();
				var touch = event.touches[0];
				if(moveType) {
					endArr.x = (touch.pageX - canvasX) / scale;
					endArr.y = (touch.pageY - canvasY) / scale;

					baseItem.x += endArr.x - startArr.x;

					if(baseItem.x <= 0) {
						baseItem.x = 0;
					}
					if(baseItem.x >= canvasObj.width - baseItem.w) {
						baseItem.x = canvasObj.width - baseItem.w;
					}

					startArr.x = endArr.x;
					startArr.y = endArr.y;
				}
			});
			$(canvasObj).on('touchend', function() {
				moveType = false;
			});

			var mainSiteArr = [];
			var mainProbArr = [0, 1];
			var n = 0;
			var siteRandom;
			var mainRandom;
			var mainProbRandom;

			mainArr = [];
			mainGainArr = [];
			var mainItem;
			var mainType = false;
			var barrierNum = 0;
			var gameTime = setInterval(function() {
				n ++;
				if(mainSiteArr.length == 0) {
					mainSiteArr = mainSite();
				}
				if(barrierNum == 0) {
					barrierItem = '';
				} else {
					barrierNum --;
				}
				if(n % 100 == 0) {
					siteRandom = Math.floor(Math.random() * mainSiteArr.length);
					mainProbRandom = Math.floor(Math.random() * mainProbArr.length);
					if(mainProbArr[mainProbRandom]) {
						// 显示冰淇淋
						mainRandom = Math.floor(Math.random() * mainData.length);
						mainItem = mainData[mainRandom];
					} else {
						// 显示炸弹
						mainItem = barrierData;
					}

					mainArr.push({
						image: mainItem.image,
						x: mainSiteArr[siteRandom] - (mainItem.w / 2),
						y: 0,
						dy: canvasObj.height / 500,
						w: mainItem.w,
						h: mainItem.h,
						type: mainItem.type
					})

					mainSiteArr.splice(siteRandom, 1);
				}
				mainType = false;
				for(var i=0; i<mainArr.length; i++) {
					(function(n) {
						mainArr[n].dy += 0.02 * scale;
						mainArr[n].y += mainArr[n].dy;

						if(mainArr[n].x + mainArr[n].w >= baseItem.x + baseItem.w / 2 && mainArr[n].x <= baseItem.x + baseItem.w / 2 && mainArr[n].y + mainArr[n].h >= baseItem.my && mainArr[n].y + mainArr[n].h * 3  / 4 < baseItem.my) {
							if(mainArr[n].type == 1) {
								// 接到冰淇淋
								mainGainArr.push({
									image: mainArr[n].image,
									w: mainArr[n].w,
									h: mainArr[n].h
								});
								baseItem.my -= mainArr[n].h * 5 / 7;
							} else {
								// 接到炸弹
								barrierItem = barrierResultData;
								barrierNum = 50;
								pageItems.left_num --;
								leftShow();
							}
							mainType = true;
						}

						if(mainArr[n].y > canvasObj.height || mainType) {
							if(mainArr[n].y > canvasObj.height && mainArr[n].type == 1) {
								pageItems.left_num --;
								leftShow();
							}
							mainArr.splice(n, 1);
						}
						if(mainGainArr.length == 5 || pageItems.left_num == 0) {
							// 游戏结束
							clearInterval(gameTime);
							if(!baseItem.first_type) {
								baseItem.finish_num ++;
							} else {
								baseItem.first_type = false;
							}
							if(mainGainArr.length == 5) {
								// 冰淇淋制作成功
								baseItem.finish_all_num ++;

								var successPopObj;
								if(baseItem.coin > 0) {
									successPopObj = $('#popSuccess02');
								} else {
									successPopObj = $('#popSuccess01');
								}
								popShow({
									object: successPopObj,
									success: function() {
										successPopObj.find('.title').html(baseItem.title);
										successPopObj.find('.pop-success-icon').attr('data-type', baseItem.id);
										successPopObj.find('.pop-btn-continue').unbind().on('click', function() {
											successPopObj.hide();
											gameInit();
										})
									}
								})
							} else {
								if(pageItems.left_num == 0) {
									// 冰淇淋制作失败
									var FailurePopObj;
									if(baseItem.coin > 0) {
										FailurePopObj = $('#popFailure01');
									} else {
										FailurePopObj = $('#popFailure02');
									}
									popShow({
										object: FailurePopObj,
										success: function() {
											FailurePopObj.find('.pop-btn-continue').unbind().on('click', function() {
												FailurePopObj.hide();
												gameInit();
											})
										}
									})
								}
							}
							pageItemInit(pageItems); // 更新页面
						}
					})(i);
				}

				gameDraw();
			}, 10);
		}
		// 游戏界面绘制
		function gameDraw() {
			var baseItem = pageItems.base_items[baseIndex];
			ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
			for(var i=0; i<mainArr.length; i++) {
				ctxt.drawImage(mainArr[i].image, mainArr[i].x, mainArr[i].y, mainArr[i].w, mainArr[i].h);
			}
			for(var i=0; i<mainGainArr.length; i++) {
				ctxt.drawImage(mainGainArr[i].image, baseItem.x + (baseItem.w - mainGainArr[i].w) / 2, baseItem.y - mainGainArr[i].h * (i + 1) * 5 / 7, mainGainArr[i].w, mainGainArr[i].h);
			}
			ctxt.drawImage(baseItem.image, baseItem.x, baseItem.y, baseItem.w, baseItem.h);
			if(barrierItem) {
				ctxt.drawImage(barrierItem.image, baseItem.x + (baseItem.w - barrierItem.w) / 2, baseItem.my - barrierItem.h / 2, barrierItem.w, barrierItem.h);
			}
		}
		// 引导页初始化
		function guideShow() {
			var guideObj = $('#popGuide');
			$('.game-start-box').hide();
			popShow({
				object: guideObj,
				success: function() {
					guideObj.find('.pop-box').css({'transform': 'scale('+ scale +')', '-webkit-transform': 'scale('+ scale +')'});
					guideObj.find('.pop-guide-btn').unbind().on('click', function() {
						guideObj.hide();
						$('.game-start-box').show();
					});
				}
			})
		}

		// 做任务赚金币
		function coinTaskShow() {
			var popTaskObj = $('#popCoinTask01'); // 显示弹窗 popCoinTask01 微信 popCoinTask02 APP
			popShow({
				object: popTaskObj,
				success: function() {
					popTaskObj.find('.task-btn').unbind().on('click', function() {
						// 点击做任务
					})
				}
			})
		}
	}
});