$(function(){
	var params = method.getParams(), //获取地址栏参数
		title = ''; //初始化标题名称

	var setMark = true; //规格设置修改过，则需要确定

	//如果没有参数，则为新增商品
	if($.isEmptyObject(params)){
		$('#setWrap .none').removeClass('none');
		$('#reset, #sure').removeClass('none');
		//标题
		title = '新增商品';

		//新增商品页面初始化
		method.ajax({
	        'url': 'item/initItemAddOperatePage',
	        'type': 'post',
	        'success': function(res){
	        	//商品产地（省、市、区初始化）
	            var province = $('.province');
	            var data = res.body.provinceSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            province.html(html);

	            //渲染商品单位与状态
	            var unitSelect = $('#unitSelect');
	            var data = res.body.itemUnitSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            unitSelect.html(html);

	            var statusSelect = $('#statusSelect'),
	                data = res.body.itemStatusSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            statusSelect.html(html);
	        } 
	    });
	}else{ //修改商品
		setMark = false;
		//标题
		title = '修改商品';
		//修改商品页面初始化
		method.ajax({
	        'url': 'item/initEditItemOperatePage',
	        'type': 'post',
	        'data': {"itemId": params.id},
	        'success': function(res){
	        	var body = res.body;
	        	//商品名称
	        	$('#itemName').val(body.itemName);
	        	//详细地址
	        	$('#addressDetail').val(body.addressDetail);
	        	//商品分类
	        	if(!!body.itemCategory){
	        		$('#addClassifyBtn').hide();
			    	$('#classifyId').val(body.itemCategory);
			    	$('#classifyBtn').text(body.itemCategoryText).show();
	        	};
	        	//备注
	        	$('#remark').val(body.remark);

	        	//商品产地（省、市、区初始化）
	            var province = $('.province');
	            var data = body.provinceSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            province.html(html);
	            //商品产地（省、市、区初始化）
	            var city = $('.city');
	            var data = body.citySelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            city.html(html);
	            //商品产地（省、市、区初始化）
	            var area = $('.area');
	            var data = body.areaSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            area.html(html);

    			//规格设置
    			var setWrap = $('#setWrap');
	            var data = body.propertiesConfigures,
	                html = template('setTpl',{data: data, edit: true});
	            setWrap.html(html);
	            $('#setWrap input').prop('disabled', true);
	            //通过确定按钮来渲染出价格的整体结构，然后在填入值
	            if(!!body.itemPriceGroups && body.itemPriceGroups.length != 0){
	            	setObj.rowArr = body.itemPriceGroups;
		            $('#sure').addClass('auto').trigger('click');
		            $.each(body.itemPriceGroups, function(index, item){
		            	var priceRow = $('.price-row').eq(index),
		            		select = priceRow.find('select'),
		            		priceBox = priceRow.find('.price'),
		            		totalBox = priceRow.find('.total'),
		            		skuId = item.skuId,
		            		propertiesIdGroup = item.propertiesIdGroup,
		            		price = item.price,
		            		quantity = item.quantity;
		            	priceBox.val(price).attr('data-skuid', skuId);
		            	totalBox.val(quantity);
		            	$.each(propertiesIdGroup.split(';'), function(i, t){
		            		t = t.split(':')[1];
		            		if(!!t){
		            			select.eq(i).find('option[value="'+ t +'"]').prop('selected', true);
		            		};
		            	});
		            });
	            };
	            

	            //渲染商品单位与状态
	            var unitSelect = $('#unitSelect');
	            var data = body.itemUnitSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            unitSelect.html(html);

	            var statusSelect = $('#statusSelect'),
	                data = body.itemStatusSelectOption.selectOptionItems,
	                html = template('optionTpl',{data: data});
	            statusSelect.html(html);
	        } 
	    });
	};

    //获取商品分类树形结构列表
    var data = {},
        userParams = wsCache.get('userParams');
        data.roleId = userParams.roleId;
        data.menuId = userParams.menuId;
    method.ajax({
        'url': 'item/getECTeaItemCategoryTree',
        'type': 'post',
        'data': data,
        'success': function(res){
            var setting = {
                'view': {
                    'selectedMulti': false
                },
                'data': {
                    'key': {
                        'name': 'categoryName',
                        'children': 'teaCategoryTreeChildren'
                    }
                }
            };
            var tree = $.fn.zTree.init($("#tree"), setting, res.body.teaCategoryTrees);
            tree.expandAll(true);
        } 
    });

    //商品产地
    method.initCity2({
    	'selector': $('.province'),
    	'url': 'item/getItemCityByParentId'
    });

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
    		name = node[0].categoryName;
    	$('#addClassifyBtn').hide();
    	$('#classifyId').val(id);
    	$('#classifyBtn').text(name).show();
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

	//规格设置修改过，则需要确定
	$('#setWrap').on('keyup', 'input', function(){
		setMark = true;
	});

	var setObj = {
		"rowArr": [{}],
		"selectArr": []
	};
	//规格设置-确定
	$('#sure').on('click', function(){
		var _this = $(this);
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
			if(_this.hasClass('auto')){ //编辑初始化时通过自动点击确定来渲染价格的结构
				_this.removeClass('auto');
				var html = template('priceTpl',{data: setObj});
				setObj.rowArr = [{}];
			}else{
				var html = template('priceTpl',{data: setObj});
			};
            $('#priceWrap').html(html);
            $('#priceBox').show();
            setMark = false;
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
	//验证价格下的规格是否有选择重复
	function checkRepeat(){
		var mark = true;
		$('#priceWrap select').each(function(){
			var _this = $(this),
				parent = _this.parent(),
				rowSelects = parent.find('select'),
				index = $.makeArray(rowSelects).indexOf(_this.get(0)),
				value = _this.val();
			parent.siblings().each(function(){
				var siblingsValue = $(this).find('select').eq(index).val();
				if(value == siblingsValue){
					_this.focus();
					layer.msg('检测到有选择重复的规格');
					mark = false;
					return false;
				};
			});
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
            itemName: 'required'
        },
        messages: {
            itemName: icon + '请输入商品名称',
        }
    });
    //确定
    $('#save').on('click', function(){
    	var _this = $(this);
        if(validateFirtst.form()){ //form表单验证通过后
            var mark = addressCheck();
	    	if(mark){
	    		var obj = $('#form').serializeObject(); //表单中的数据

		    	var url = 'item/doAddItem';
		    	//如果为修改，则上传用户id
		    	if(!!params.id){
		    		url = 'item/doEditItemOperate';
		    		obj.itemId = params.id;
		    	};
		    	if(!setCheck() || !priceCheck()){
		    		return;
		    	};
		    	//如果规格设置有修改过，则需要确定
		    	if(setMark){
		    		parent.layer.alert('检测到规格设置有过修改，但尚未确定');
		    		return;
		    	};
		    	//检测价格下的规格是否有选择重复的
		    	if(!checkRepeat()){
		    		return;
		    	};
		    	//获取规格设置
		    	var propertiesConfigures = [];
		    	$('.set-row').each(function(){
		    		var row = $(this),
		    			propertiesName = $.trim(row.find('.spec').val()),
		    			propertiesValue = $.trim(row.find('.attr').val()),
		    			rowObj = {
		    				"propertiesName": propertiesName,
		    				"propertiesValue": propertiesValue
		    			};
		    		propertiesConfigures.push(rowObj);
		    	});
		    	obj.propertiesConfigures = propertiesConfigures;
		    	delete obj.propertiesName;
		    	delete obj.propertiesValue;

		    	//获取价格
		    	var itemPriceGroups = [];
		    	$('.price-row').each(function(){
		    		var row = $(this),
		    			select = row.find('select'),
		    			price = $.trim(row.find('.price').val()),
		    			skuId = row.find('.price').attr('data-skuid'),
		    			quantity = $.trim(row.find('.total').val()),
		    			rowObj = {
		    				"price": price,
		    				"quantity": quantity
		    			};
		    		if(!!params.id){
		    			if(!skuId){
		    				skuId = '';
		    			};
		    			rowObj.skuId = skuId;
		    		};
		    		var arr = [];
		    		select.each(function(){
		    			var _this = $(this),
		    				spec = _this.find('option:first').text(),
		    				spec = spec.substring(2),
		    				attr = '';
		    			if(_this.val() != ''){
		    				attr = _this.find('option:selected').text();
		    			};
		    			var str = spec + ':' + attr;
		    			arr.push(str);
		    		});
		    		rowObj.propertiesIdGroup = arr.join('-');
		    		itemPriceGroups.push(rowObj);
		    	});
		    	obj.itemPriceGroups = itemPriceGroups;
		    	delete obj.propertiesIdGroup;
		    	delete obj.price;
		    	delete obj.quantity;
		    	method.ajax({
		          'url': url,
		          'type': 'post',
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