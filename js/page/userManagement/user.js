$(function(){
    var authEdit = false;
    var columns = [
        {
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
            title: '姓名',
            align: 'center',
            width: 130
        },
        {
            field: 'accountMail',
            title: '邮箱',
            align: 'center',
            width: 150
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
            field: 'status',
            title: '用户状态',
            align: 'center',
            width: 130
        },
        {
            field: 'createDate',
            title: '创建时间',
            align: 'center',
            width: 180
        },
        {
            field: 'createDate',
            title: '最后编辑人',
            align: 'center',
            width: 130
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
                if(authEdit){
                    btns += '<a class="J_menuItem btn btn-sm btn-primary" href="demo/form.html"><i class="fa fa-edit"></i> 修改</a>';
                };
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
            var data = $('#form').serializeObject();
            return method.getTableParams(params, data);
        },
        'success': function(res){
            //处理权限
            var authoritys = res.authoritys;
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
        }
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
        searchTable();
    });

    function searchTable(){
        var param = function (params) {
            var data = $('#form').serializeObject();
            return method.getTableParams(params, data);
        };
        $('#table').bootstrapTable('selectPage', 1);
        //$('#table').bootstrapTable('refreshOptions', {queryParams: param});
    };


})