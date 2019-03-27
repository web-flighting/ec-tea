$(function () {
  var authEdit = false;
  var columns = [{
      field: 'code',
      title: '序号',
      align: 'center',
      width: 50,
      formatter: function (value, row, index) {
        return index + 1;
      }
    },
    {
      field: 'accountName',
      title: '订单号',
      align: 'center',
      width: 130
    },
    {
      field: 'accountMobile',
      title: '手机号',
      align: 'center',
      width: 130
    },
    {
      field: 'accountLevelName',
      title: '用户级别',
      align: 'center',
      width: 130
    },
    {
      field: 'statusText',
      title: '订单状态',
      align: 'center',
      width: 130
    },
    {
      field: 'createDate',
      title: '订单最近变化',
      align: 'center',
      width: 180
    },
    {
      field: 'accountRemark',
      title: '备注',
      align: 'center',
      width: 200
    },
    {
      field: 'do',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
        var btns = '';
        if (authEdit) {
          btns += '<a class="J_menuItem btn btn-sm btn-primary" href="/views/orderManagement/order_form.html?id=' + row.createAccountId + '"><i class="fa fa-edit"></i> 编辑</a>';
        };
        return btns;
      }
    }
  ];
  //初始化table
  method.initTableServer({
    'id': 'table',
    'url': 'data/orderManagement/table.json',
    'type': 'get',
    'data': [],
    'pageInfoName': 'accountPageInformation',
    'columns': columns,
    'queryParams': function (params) {
      var data = $('#form').serializeObject(),
        userParams = wsCache.get('userParams');
      data.roleId = userParams.roleId;
      data.menuId = userParams.menuId;
      return method.getTableParams(params, data);
    },
    'success': function (res) {
      //处理权限
      var authoritys = res.body.authoritys;
      var add = authoritys.filter(function (item) {
        return item.authCode == 'Add';
      });
      if (add.length != 0) {
        $('#add').show();
      };
      var edit = authoritys.filter(function (item) {
        return item.authCode == 'Edit';
      });
      if (edit.length != 0) {
        authEdit = true;
      };
      //渲染状态
      var statusSelect = $('#statusSelect');
      if (statusSelect.hasClass('off')) { //只渲染一次
        return;
      };
      statusSelect.addClass('off');
      data = res.body.accountStatusSelectOption.selectOptionItems,
        html = template('optionTpl', {
          data: data
        });
      statusSelect.html(html);
    }
  });

  //日期选择
  $('.js-date').datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true
  });
  $("#startTime").datepicker().on('changeDate', function (e) {
    //获取选取的开始时间
    var endTimeStart = $("#startTime input").val();
    //设置结束时间
    $('#endTime').datepicker('setStartDate', endTimeStart);
  });
  //设置结束时间必须晚于开始时间
  $("#endTime").datepicker().on('changeDate', function (e) {
    //获取选取的开始时间
    var endTimeStart = $("#startTime input").val();
    //设置结束时间
    $('#endTime').datepicker('setStartDate', endTimeStart);
    var endTime = $("#endTime input").val();
    $('#startTime').datepicker('setEndDate', endTime);
  });

  //查询
  $('#search').on('click', function () {
    searchTable();
  });
  //重置
  $('#reset').on('click', function () {
    //先把相关表单中的输入框等重置后在调取查询方法
    $('#form input').val('');
    $('#form select').each(function () {
      $(this).find('option:first').prop('selected', true);
    });
    searchTable();
  });

  function searchTable() {
    var param = function (params) {
      var data = $('#form').serializeObject(),
        userParams = wsCache.get('userParams');
      data.roleId = userParams.roleId;
      data.menuId = userParams.menuId;
      return method.getTableParams(params, data);
    };
    $('#table').bootstrapTable('selectPage', 1);
    //$('#table').bootstrapTable('refreshOptions', {queryParams: param});
  };


})