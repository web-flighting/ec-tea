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
      'url': 'data/orderManagement/initAddAccountPage.json',
      'type': 'get',
      'success': function (res) {
        // 渲染订单id
        $('#accountOrderNo').val(res.body.orderNo);
        //渲染订单状态
        var statusSelect = $('#statusSelect'),
          data = res.body.accountStatusSelectOption.selectOptionItems,
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
      'url': 'data/orderManagement/initEditAccountPage.json',
      'type': 'get',
      'success': function (res) {
        var body = res.body;
        // 渲染订单id
        $('#accountOrderNo').val(body.orderNo);
        // 渲染商品SKU
        $('#accountSku').val(body.accountSku);
        // 渲染订单数量
        $('#accountNum').val(body.accountNum);
        //手机号
        $('#accountMobile').val(body.accountMobile);
        //备注
        $('#accountRemark').val(body.accountRemark);

        //常用收货地址（省、市、区初始化）
        var data = body.accountAddresses,
          html = template('addressTpl', {
            data: data
          });
        $('#addressWrap').html(html);
        //单选框
        $(".i-checks").iCheck({
          checkboxClass: "icheckbox_square-green",
          radioClass: "iradio_square-green"
        });
        //常用收货地址（省、市、区初始化）
        $('.province').each(function () {
          var _this = $(this);
          method.initCity({
            'selector': _this,
            'provinceId': _this.attr('data-provinceId'),
            'cityId': _this.attr('data-cityId'),
            'areaId': _this.attr('data-areaId')
          });
        });

        //渲染订单状态
        var statusSelect = $('#statusSelect'),
          data = body.accountStatusSelectOption.selectOptionItems,
          html = template('optionTpl', {
            data: data
          });
        statusSelect.html(html).attr('disabled', 'disabled');
      }
    });
  };

  //常用收货地址验证
  function addressCheck() {
    var mark = true;
    $('#addressWrap .address-row').each(function () {
      var row = $(this);
      //验证当前行中的省、市、区
      row.find('select').each(function () {
        var _this = $(this),
          value = _this.val();
        if (value == '') {
          _this.focus();
          layer.msg('请选择收货地址');
          mark = false;
          return false;
        }
      });
      //验证当前行中的详细地址
      if (mark) {
        var address = row.find('.address'),
          value = $.trim(address.val());
        if (value == '') {
          address.focus();
          layer.msg('请填写详细地址');
          mark = false;
        };
      };
      return mark;
    });
    return mark;
  };

  //设置标题
  $('#title').text(title);
  //添加常用收货地址
  $('body').on('click', '.js-add-address', function () {
    var mark = addressCheck();
    if (mark) {
      var data = [{
          "address": "",
          "isDefault": false
        }],
        html = template('addressTpl', {
          data: data
        });
      $('#addressWrap').append(html);
      //单选框
      $("#addressWrap .i-checks:last").iCheck({
        checkboxClass: "icheckbox_square-green",
        radioClass: "iradio_square-green"
      });
      $('.js-del-address').show();
      //常用收货地址（省、市、区初始化）
      method.initCity({
        'selector': $('.province:last')
      });
    };
  });
  //删除当前常用收货地址
  $('body').on('click', '.js-del-address', function () {
    var _this = $(this),
      parent = _this.parent(),
      radio = parent.find('.isDefault');
    //如果只剩当前一行，则不可删除(按钮是通过在控制台调样式显示出来的)
    if (parent.siblings().length == 0) {
      $('.js-del-address').hide();
      return;
    };
    //如果删除后只剩一行，则隐藏减号，不可在删除
    if (parent.siblings().length <= 1) {
      $('.js-del-address').hide();
    };
    parent.remove();
    //如果当前行是选中的，则删除后默认让第一行选中
    if (radio.prop('checked')) {
      $('#addressWrap .isDefault:first').iCheck('check');
    };
  });
  //form验证配置
  var icon = "<i class='fa fa-times-circle'></i> ";
  var validateFirtst = $("#form").validate({
    debug: true,
    rules: {
      accountSku: 'required',
      accountNum: 'required',
      accountMobile: {
        'required': true,
        'phone': true
      },
    },
    messages: {
      accountSku: icon + '请输入商品SKU',
      accountNum: icon + '请输入数量',
      accountMobile: {
        'required': icon + '请输入手机号'
      }
    }
  });
  //确定
  $('#save').on('click', function () {
    var _this = $(this);
    if (validateFirtst.form()) { //form表单验证通过后
      var mark = addressCheck();
      if (mark) {
        var obj = $('#form').serializeObject(); //表单中的数据
        var accountAddresses = [];
        $('.address-row').each(function () {
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

        var url = 'data/orderManagement/addAccount.json';
        //如果为修改，则上传订单id
        if (!!params.id) {
          url = 'data/orderManagement/editAccount.json';
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
          'success': function (res) {
            layer.alert('保存成功', {
              time: 1000,
              btn: [],
              end: function () {
                method.gotoPage(_this.prev().attr('href'));
              }
            });
          }
        });
      };
    } else {
      //定位至第一个错误提示
      var errorTop = $('#form .has-error:first').offset().top - 20;
      $('body,html').animate({
        'scrollTop': errorTop
      }, 100);
    };
  });
})