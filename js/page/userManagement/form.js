$(function(){
	//单选框
    $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green"});

	//获取地址栏参数
	var params = method.getParams();

	//如果没有参数，则为新增用户
	if($.isEmptyObject(params)){
		//标题
		$('#title').text('新增用户');
		//常用收货地址
		method.initCity({
			'selector': $('.province')
		});
		//用户添加页面初始化
		method.ajax({
	        'url': 'data/userManagement/initAddAccountPage.json',
	        'type': 'get',
	        'success': function(res){
	            //渲染用户级别与状态
	            var levelSelect = $('#levelSelect');
	            var data = res.body.accountLevelSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            levelSelect.html(html);

	            var statusSelect = $('#statusSelect'),
	                data = res.body.accountStatusSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            statusSelect.html(html);
	        } 
	    });


		return;
	};
	
	//编辑用户
	//标题
	$('#title').text('编辑用户');
})