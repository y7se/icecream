// 页面loading
var imgData = [
	{src: 'images/bg_index.jpg'},
	{src: 'images/bg_game_top.jpg'},
	{src: 'images/bg_game_center.jpg'},
	{src: 'images/bg_game_bottom.jpg'},
	{src: 'images/game_base_icon01.png'},
	{src: 'images/game_base_icon02.png'},
	{src: 'images/game_base_icon03.png'},
	{src: 'images/game_base_icon04.png'},
	{src: 'images/game_border.png'},
	{src: 'images/game_border_active.png'},
	{src: 'images/game_title01.png'},
	{src: 'images/game_title02.png'},
	{src: 'images/life_item.png'},
	{src: 'images/bg_center.jpg'},
	{src: 'images/center_main01.png'},
	{src: 'images/center_main02.png'},
	{src: 'images/center_main03.png'},
	{src: 'images/center_main04.png'},
	{src: 'images/error_icon.png'},
	{src: 'images/pop_bg01.png'},
	{src: 'images/pop_bg02.png'},
	{src: 'images/pop_bg03.png'},
	{src: 'images/pop_bg04.png'},
	{src: 'images/pop_btn01.png'},
	{src: 'images/pop_btn02.png'},
	{src: 'images/pop_close.png'},
	{src: 'images/pop_share_icon.png'},
	{src: 'images/pop_task01.png'},
	{src: 'images/pop_task02.png'},
	{src: 'images/guide_icon01.png'},
	{src: 'images/guide_icon02.png'},
	{src: 'images/guide_icon03.png'},
	{src: 'images/bg_award.jpg'},
	{src: 'images/award_active_btn.png'},
	{src: 'images/award_btn01.png'},
	{src: 'images/award_btn02.png'},
	{src: 'images/share_btn01.png'},
	{src: 'images/share_btn02.png'},
	{src: 'images/share_icon01.png'},
	{src: 'images/share_icon02.png'},
	{src: 'images/share_icon03.png'},
	{src: 'images/share_icon04.png'}
];
imgLoad({
	data: imgData,
	plan_obj: $('#palnItem i'),
	plan_text: $('#planText'),
	success: function(data) {
		setTimeout(function() {
			$('.index-plan').hide();
			$('.index-oper').show();
		}, 500);
	}
})