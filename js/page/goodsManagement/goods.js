$(function(){
    var authEdit = false;
    var columns = [
        {
            field: 'id',
            title: 'ID',
            align: 'center',
            width: 50
        },
        {
            field: 'accountName',
            title: '商品名称',
            align: 'center',
            width: 130
        },
        {
            field: 'accountMail',
            title: 'SKU',
            align: 'center',
            width: 150
        },
        {
            field: 'accountMobile',
            title: '分类',
            align: 'center',
            width: 80
        },
        {
            field: 'accountLevelName',
            title: '规格',
            align: 'center',
            width: 130
        },
        {
            field: 'statusText',
            title: '总库存',
            align: 'center',
            width: 100
        },
        {
            field: 'statusText',
            title: '状态',
            align: 'center',
            width: 100
        },
        {
            field: 'updateAccountName',
            title: '售价',
            align: 'center',
            width: 100
        },
        {
            field: 'updateAccountName',
            title: '最后编辑人',
            align: 'center',
            width: 100
        },
        {
            field: 'accountRemark',
            title: '备注',
            align: 'center',
            width: 160
        },
        {
            field: 'do',
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                var btns = '';
                if(authEdit){
                    btns += '<a class="J_menuItem btn btn-sm btn-primary" href="/views/goodsManagement/goods_form.html?id='+ row.createAccountId +'"><i class="fa fa-edit"></i> 编辑</a>';
                };
                btns += ' <a class="J_menuItem btn btn-sm btn-primary" href="/views/goodsManagement/stock.html?id='+ row.createAccountId +'"><i class="glyphicon glyphicon-briefcase"></i> 库存</a>';
                return btns;
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'data/userManagement/initAccountPageList.json',
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
        'success': function(res){
            //处理权限
            var authoritys = res.body.authoritys;
            var add = authoritys.filter(function(item){
                return item.authCode == 'Add';
            });
            if(add.length != 0){
                $('#add').show();
            };
            var edit = authoritys.filter(function(item){
                return item.authCode == 'Edit';
            });
            if(edit.length != 0){
                authEdit = true;
            };
            //渲染状态
            var statusSelect = $('#statusSelect');
            if(statusSelect.hasClass('off')){ //只渲染一次
                return;
            };
            statusSelect.addClass('off');

            var data = res.body.accountStatusSelectOption.selectOptionItems,
                html = template('optionTpl',{data: data});
            statusSelect.html(html);
        }
    });

    //初始化分类
    function getClassify(selector, parentId){
      method.ajax({
          'url': 'data/common/queryCityByParentId.json',
          'type': 'get',
          'data': {"parentId": parentId},
          'success': function(res){
              var html = '<option value="">全部</option>';
              $.each(res.body.citys, function(index, item){
                html += '<option value="'+ item.areaId +'">'+ item.areaName +'</option>';
              });
              selector.html(html);
          } 
      });
    };
    getClassify($('#classify1'), 0);
    $('#classify1').on('change', function(){
        var value = $(this).val();
        $('#classify2').find('option').not(':first').remove();
        $('#classify3').find('option').not(':first').remove();
        if(value != ''){
            getClassify($('#classify2'), value);
        };
    });
    $('#classify2').on('change', function(){
        var value = $(this).val();
        $('#classify3').find('option').not(':first').remove();
        if(value != ''){
            getClassify($('#classify3'), value);
        };
    });

    //查询
    $('#search').on('click', function(){
        searchTable();
    });
    //重置
    $('#reset').on('click', function(){
        //先把相关表单中的输入框等重置后在调取查询方法
        $('#form input').val('');
        $('#form select').each(function(){
            $(this).find('option:first').prop('selected', true);
        });
        $('#classify2').find('option').not(':first').remove();
        $('#classify3').find('option').not(':first').remove();
        searchTable();
    });

    function searchTable(){
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