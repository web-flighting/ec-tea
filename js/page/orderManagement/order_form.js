$(function () {
  //单选框
  $(".i-checks").iCheck({
    checkboxClass: "icheckbox_square-green",
    radioClass: "iradio_square-green"
  });


  var params = method.getParams(), //获取地址栏参数
    title = ''; //初始化标题名称


  //如果没有参数，则为新增订单
  if ($.isEmptyObject(params)) {
    //标题
    title = '新增订单';
    //常用收货地址（省、市、区初始化）
    method.initCity({
      'selector': $('.province')
    });
    //订单添加页面初始化
    method.ajax({
      'url': 'trade/initAddTradePage',
      'type': 'post',
      'success': function (res) {
        // 渲染订单id
        $('#tradeNo').val(res.body.tradeNo);

        //渲染订单状态
        var statusSelect = $('#statusSelect'),
          data = res.body.tradeStatusSelectOption.selectOptionItems,
          html = template('optionTpl', {
            data: data
          });
        statusSelect.html(html);
      }
    });
  } else { //编辑订单
    //标题
    title = '编辑订单';
    //订单修改页面初始化
    method.ajax({
      'url': 'trade/initEditTradePage',
      'type': 'post',
      'data': {
        'tradeId': params.id
      },
      'success': function (res) {
        var body = res.body;
        // 渲染订单id
        $('#tradeNo').val(body.tradeNo);
        // 渲染商品SKU
        $('#sku').val(body.sku);
        // 渲染订单数量
        $('#quantity').val(body.quantity);
        //手机号
        $('#mobile').val(body.mobile);
        //备注
        $('#remark').val(body.remark);

        //收货地址
        var data = body.addressList,
          html = template('addressTpl', {
            data: data
          });
        $('#addressWrap').html(html);
        //单选框
        $(".i-checks").iCheck({
          checkboxClass: "icheckbox_square-green",
          radioClass: "iradio_square-green"
        });

        //渲染订单状态
        var statusSelect = $('#statusSelect'),
          data = body.tradeStatusSelectOption.selectOptionItems,
          html = template('optionTpl', {
            data: data
          });
      }
    });
  };

  

  //设置标题
  $('#title').text(title);
  //通过手机号获取用户地址列表接口
  $('#mobile').on('blur', function(){
     var mobile = $.trim($(this).val());
     if(mobile == '' || !method.phoneReg.test(mobile)){
      return;
     };
      method.ajax({
      'url': 'trade/getAccountAddress',
      'type': 'post',
      'data': {"mobile": mobile},
      'success': function (res) {
        //收货地址
        var data = res.body.addressList,
          html = template('addressTpl', {
            data: data
          });
        $('#addressWrap').html(html);
        //单选框
        $(".i-checks").iCheck({
          checkboxClass: "icheckbox_square-green",
          radioClass: "iradio_square-green"
        });
      }
    });
  });

  //form验证配置
  var icon = "<i class='fa fa-times-circle'></i> ";
  var validateFirtst = $("#form").validate({
    debug: true,
    rules: {
      sku: 'required',
      quantity: 'required',
      mobile: {
        'required': true,
        'phone': true
      },
    },
    messages: {
      sku: icon + '请输入商品SKU',
      quantity: icon + '请输入数量',
      mobile: {
        'required': icon + '请输入手机号'
      }
    }
  });
  //确定
  $('#save').on('click', function () {
    var _this = $(this);
    if (validateFirtst.form()) { //form表单验证通过后
        var obj = $('#form').serializeObject(); //表单中的数据
        var addressCheck = $('#addressWrap .isDefault:checked');
        if(addressCheck.length == 0){
          layer.msg('请输入正确的买家手机号获取收货地址');
          return;
        };
        obj.provinceId = addressCheck.attr('data-provinceId');
        obj.cityId = addressCheck.attr('data-cityId');
        obj.districtId = addressCheck.attr('data-districtId');
        obj.address = addressCheck.attr('data-address');

        var url = 'trade/doAddTrade';
        //如果为修改，则上传订单id
        if (!!params.id) {
          url = 'trade/doEditTrade';
          obj.tradeId = params.id;
        };
        method.ajax({
          'url': url,
          'type': 'post',
          'data': obj,
          'success': function (res) {
            parent.layer.alert('保存成功', {
              time: 1000,
              btn: [],
              end: function () {
                method.gotoPage(_this.prev().attr('href'));
              }
            });
          }
        });
    } else {
      //定位至第一个错误提示
      var errorTop = $('#form .has-error:first').offset().top - 20;
      $('body,html').animate({
        'scrollTop': errorTop
      }, 100);
    };
  });
})