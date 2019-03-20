$(function(){
	//获取地址栏参数
	var params = method.getParams();

	//如果没有参数，则为新增用户
	if($.isEmptyObject(params)){
		//标题
		$('#title').text('新增用户');



		return;
	};
	
	//编辑用户
	//标题
	$('#title').text('编辑用户');
})