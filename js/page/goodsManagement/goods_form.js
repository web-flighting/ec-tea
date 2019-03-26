$(function(){
	var params = method.getParams(), //获取地址栏参数
		title = ''; //初始化标题名称


	//如果没有参数，则为新增商品
	if($.isEmptyObject(params)){
		//标题
		title = '新增商品';
		//商品产地（省、市、区初始化）
		method.initCity({
			'selector': $('.province')
		});
		//用户添加页面初始化
		method.ajax({
	        'url': 'data/userManagement/initAddAccountPage.json',
	        'type': 'get',
	        'success': function(res){
	            //渲染商品单位与状态
	            var unitSelect = $('#unitSelect');
	            var data = res.body.accountLevelSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            unitSelect.html(html);

	            var statusSelect = $('#statusSelect'),
	                data = res.body.accountStatusSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            statusSelect.html(html);
	        } 
	    });
	}else{ //修改商品
		//标题
		title = '修改商品';
		//修改商品页面初始化
		method.ajax({
	        'url': 'data/userManagement/initEditAccountPage.json',
	        'type': 'get',
	        'success': function(res){
	        	var body = res.body;
	        	//姓名
	        	$('#accountName').val(body.accountName);
	        	//手机号
	        	$('#accountMobile').val(body.accountMobile);
	        	//邮箱
	        	$('#accountMail').val(body.accountMail);
	        	//备注
	        	$('#accountRemark').val(body.accountRemark);

	        	//商品产地（省、市、区初始化）
	        	var data = body.accountAddresses,
	                html = template('addressTpl',{data: data});
	            $('#addressWrap').html(html);


	            //渲染商品单位与状态
	            var unitSelect = $('#unitSelect');
	            var data = res.body.accountLevelSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            unitSelect.html(html);

	            var statusSelect = $('#statusSelect'),
	                data = res.body.accountStatusSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            statusSelect.html(html);
	        } 
	    });
	};

	//商品分类
	var arr = [
        {
            "id": 1,
            "name": "一级目录",
            "children": [
                {
                    "id": 11,
                    "name": "一级子节点",
                    "children": [
                        {
                            "id": 111,
                            "name": "一级子节点1"
                        },
                        {
                            "id": 112,
                            "name": "一级子节点2"
                        }
                    ]
                }
            ]
        }
    ];
    var setting = {
        'view': {
            'selectedMulti': false
        }
    };
    var tree = $.fn.zTree.init($("#tree"), setting, arr);
    tree.expandAll(true);

    //添加商品分类
    $('#addClassifyBtn,#classifyBtn').on('click', function(){
    	$('#classifyModal').modal();
    });
    //分类确定
    $('#confirm').on('click', function(){
    	var zTree = $.fn.zTree.getZTreeObj("tree"),
    		node = zTree.getSelectedNodes();
    	if(node.length == 0){
    		layer.tips('请选择一个分类', '#confirm', {
			    tips: [1, '#18a689'],
			    time: 1500
			});
    		return;
    	};
    	var id = node[0].id,
    		name = node[0].name;
    	$('#addClassifyBtn').hide();
    	$('#classifyBtn').attr('data-id', id).text(name).show();
    	$('#classifyModal').modal('hide');
    });
	
	//常用收货地址验证
	function addressCheck(){
		var mark = true;
		$('#addressWrap .address-row').each(function(){
			var row = $(this);
			//验证当前行中的省、市、区
			row.find('select').each(function(){
				var _this = $(this),
					value = _this.val();
				if(value == ''){
					_this.focus();
	                layer.msg('请选择收货地址');
					mark = false;
					return false;
				}
			});
			//验证当前行中的详细地址
			if(mark){
				var address = row.find('.address'),
					value = $.trim(address.val());
				if(value == ''){
					address.focus();
	                layer.msg('请填写详细地址');
					mark = false;
				};
			};
			return mark;
		});
		return mark;
	};
	//规格设置验证
	function setCheck(){
		var mark = true;
		$('#setWrap input').each(function(){
			var input = $(this),
				value = $.trim(input.val());
			if(value == ''){
				input.focus();
				mark = false;
			};
			return mark;
		});
		return mark;
	};

	//设置标题
	$('#title').text(title);
	//规格设置
	$('body').on('click', '.js-add-set', function(){
		var mark = setCheck();
		if(mark){
			var data = [{}],
                html = template('setTpl',{data: data});
            $('#setWrap').append(html);
		};
	});

	//删除当前规格设置、价格
	$('body').on('click', '.js-del-btn', function(){
		var _this = $(this),
			parent = _this.parent();
		parent.remove();
	});

	var setObj = {
		"rowArr": [{}],
		"selectArr": []
	};
	//规格设置-确定
	$('#sure').on('click', function(){
		var mark = setCheck();
		if(mark){
			setObj.selectArr = [];
			$('#setWrap .set-row').each(function(){
				var _this = $(this),
					spec = $.trim(_this.find('.spec').val()),
					attr = $.trim(_this.find('.attr').val()),
					obj = {
						"spec": spec,
						"attr": attr
					};
				setObj.selectArr.push(obj);
			});
			var html = template('priceTpl',{data: setObj});
            $('#priceWrap').html(html);
            $('#priceBox').show();
		};
	});
	//规格设置-重置
	$('#reset').on('click', function(){
		$('#setWrap .set-row').not(':first').remove();
		$('#setWrap input').val('');
		$('#priceBox').hide();
		$('#priceWrap').html('');
	});
	//价格验证
	function priceCheck(){
		var mark = true;
		$('#priceWrap .price-row').each(function(){
			var row = $(this);
			row.find('select').each(function(){
				var _this = $(this),
					value = _this.val();
				if(value == ''){
					_this.focus();
	                layer.msg('请选择规格');
					mark = false;
					return false;
				}
			});
			//验证当前行中的详细地址
			if(mark){
				row.find('input').each(function(){
					var _this = $(this),
						value = $.trim(_this.val());
					if(value == ''){
						_this.focus();
						mark = false;
						return false;
					}
				});
			};
			return mark;
		});
		return mark;
	};
	//价格
	$('body').on('click', '.js-add-price', function(){
		var mark = priceCheck();
		if(mark){
			var html = template('priceTpl',{data: setObj});
            $('#priceWrap').append(html);
            $('#priceWrap .js-del-btn:last').show();
		};
	});

	//form验证配置
    var icon = "<i class='fa fa-times-circle'></i> ";
    var validateFirtst = $("#form").validate({
        debug: true,
        rules: {
            accountName: 'required'
        },
        messages: {
            accountName: icon + '请输入商品名称',
        }
    });
    //确定
    $('#save').on('click', function(){
    	var _this = $(this);
        if(validateFirtst.form()){ //form表单验证通过后
            var mark = addressCheck();
	    	if(mark){
	    		var obj = $('#form').serializeObject(); //表单中的数据
				var accountAddresses = [];
		    	$('.address-row').each(function(){
		    		var row = $(this),
		    			provinceId = row.find('.province').val(),
		    			cityId = row.find('.city').val(),
		    			districtId = row.find('.area').val(),
		    			address = $.trim(row.find('.address').val()),
		    			isDefault = row.find('.isDefault').prop('checked'),
		    			rowObj = {
		    				"provinceId": provinceId,
		    				"cityId": cityId,
		    				"districtId": districtId,
		    				"address": address,
		    				"isDefault": isDefault
		    			};
		    		accountAddresses.push(rowObj);
		    	});

		    	var url = 'data/userManagement/addAccount.json';
		    	//如果为修改，则上传用户id
		    	if(!!params.id){
		    		url = 'data/userManagement/editAccount.json';
		    		obj.accountId = params.id;
		    	};
		    	obj.accountAddresses = accountAddresses;
		    	delete obj.provinceId;
		    	delete obj.cityId;
		    	delete obj.districtId;
		    	delete obj.address;
		    	delete obj.isDefault;

		    	method.ajax({
		          'url': url,
		          'type': 'get',
		          'data': obj,
		          'success': function(res){
	                layer.alert('保存成功', {
					    time: 1000,
					    btn: [],
					   	end: function(){
					   		method.gotoPage(_this.prev().attr('href'));
					   	}
					});
		          } 
		      	});
	    	};
        }else{
        	//定位至第一个错误提示
        	var errorTop = $('#form .has-error:first').offset().top - 20;
        	$('body,html').animate({'scrollTop': errorTop}, 100);
        };
    });
})