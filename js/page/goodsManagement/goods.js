$(function(){
    var authEdit = false;
    var columns = [
        {
            field: 'itemId',
            title: 'ID',
            align: 'center',
            width: 50
        },
        {
            field: 'itemName',
            title: '商品名称',
            align: 'center',
            width: 130
        },
        {
            field: 'sku',
            title: 'SKU',
            align: 'center',
            width: 150
        },
        {
            field: 'categoryText',
            title: '分类',
            align: 'center',
            width: 80
        },
        {
            field: 'propertiesText',
            title: '规格',
            align: 'center',
            width: 130
        },
        {
            field: 'quantity',
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
            field: 'price',
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
            field: 'remark',
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
                if(authRepositoryMgt){
                    btns += ' <a class="J_menuItem btn btn-sm btn-primary" href="/views/goodsManagement/stock.html?id='+ row.createAccountId +'"><i class="glyphicon glyphicon-briefcase"></i> 库存</a>';
                };
                return btns;
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'data/goodsManagement/queryItemPageList.json',
        'type': 'get',
        'data': [],
        'pageInfoName': 'itemPageList',
        'columns': columns,
        'queryParams': function (params) {
            var data = $('#form').serializeObject(),
                userParams = wsCache.get('userParams');
            data.roleId = userParams.roleId;
            data.menuId = userParams.menuId;
            var itemCategoryId = '';
            if(data.itemCategoryId != ''){
                itemCategoryId = data.itemCategoryId[0];
                if(data.itemCategoryId[1] != ''){
                    itemCategoryId = data.itemCategoryId[1];
                };
                if(data.itemCategoryId[2] != ''){
                    itemCategoryId = data.itemCategoryId[2];
                };
            };
            data.itemCategoryId = itemCategoryId;
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
            var RepositoryMgt = authoritys.filter(function(item){
                return item.authCode == 'RepositoryMgt';
            });
            if(RepositoryMgt.length != 0){
                authRepositoryMgt = true;
            };
        }
    });

    //初始化商品分页列表页面条件
    method.ajax({
      'url': 'data/goodsManagement/initItemPageList.json',
      'type': 'get',
      'success': function(res){
            //状态
            var data = res.body.itemStatusSelectOption.selectOptionItems,
                html = template('optionTpl',{data: data});
            $('#statusSelect').html(html);
            //分类
            var data = res.body.itemCategorySelectOption.selectOptionItems,
                html = template('optionTpl',{data: data});
            $('#classify1').html(html);
      } 
  });

    //初始化分类
    function getClassify(selector, parentId){
      method.ajax({
          'url': 'data/goodsManagement/getSubItemCategory.json',
          'type': 'get',
          'data': {"parentId": parentId},
          'success': function(res){
              //分类
            var data = res.body.itemCategorySelectOption.selectOptionItems,
                html = template('optionTpl',{data: data});
              selector.html(html);
          } 
      });
    };
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
            var itemCategoryId = '';
            if(data.itemCategoryId != ''){
                itemCategoryId = data.itemCategoryId[0];
                if(data.itemCategoryId[1] != ''){
                    itemCategoryId = data.itemCategoryId[1];
                };
                if(data.itemCategoryId[2] != ''){
                    itemCategoryId = data.itemCategoryId[2];
                };
            };
            data.itemCategoryId = itemCategoryId;
            return method.getTableParams(params, data);
        };
        $('#table').bootstrapTable('selectPage', 1);
        //$('#table').bootstrapTable('refreshOptions', {queryParams: param});
    };


})