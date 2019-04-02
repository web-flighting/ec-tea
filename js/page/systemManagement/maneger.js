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
            field: 'mobile',
            title: '手机号',
            align: 'center'
        },
        {
            field: 'accountName',
            title: '姓名',
            align: 'center'
        },
        {
            field: 'roleNames',
            title: '角色',
            align: 'center',
            formatter: function (value, row, index) {
                return value.join(',')
            }
        },
        {
            field: 'createDate',
            title: '创建时间',
            align: 'center'
        },
        {
            field: 'lastLoginDateText',
            title: '最近登陆',
            align: 'center'
        },
        {
            field: 'do',
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                var btns = '';
                if(authEdit){
                    btns += '<button class="btn btn-sm btn-primary edit" type="button"><i class="fa fa-edit"></i> 编辑</button>';
                };
                return btns;
            },
            events: { //编辑级别
                'click .edit': function(e, value, row, index){
                    $('#levelModal .modal-title').html('编辑管理员');
                    $('#confirm').attr('data-type', 'edit');
                    $('#levelModal').modal();
                    method.ajax({
                        'url': 'admin/initAdminEditOperatePage',
                        'type': 'post',
                        'data': {"adminId": row.accountId},
                        'success': function(res){
                            var body = res.body;
                            $('#adminName').val(body.adminName);
                            $('#adminId').val(row.accountId);
                            $('#phone').val(body.mobile);
                            $('#password').val(body.password);
                            //渲染用户角色
                            var data = body.roleListSelect.selectOptionItems,
                                html = template('roleTpl',{data: data});
                            $('#roleList').html(html);
                            //单选框
                            $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green"});
                        } 
                    });
                }
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'admin/queryAdminPageList',
        'type': 'post',
        'data': [],
        'pageInfoName': 'adminPageInformation',
        'columns': columns,
        'queryParams': function (params) {
            var data = {},
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
        }
    });


    function searchTable(){
        var param = function (params) {
            var data = {},
                userParams = wsCache.get('userParams');
            data.roleId = userParams.roleId;
            data.menuId = userParams.menuId;
            return method.getTableParams(params, data);
        };
        $('#table').bootstrapTable('selectPage', 1);
        //$('#table').bootstrapTable('refreshOptions', {queryParams: param});
    };

    //新增级别
    $('#add').on('click', function(){
        $('#modal .modal-title').html('新增管理员');
        $('#adminName').val('');
        $('#phone').val('');
        $('#password').val('');
        $('#confirm').attr('data-type', 'add');
        $('#levelModal').modal();
        method.ajax({
            'url': 'admin/initAdminAddOperatePage',
            'type': 'post',
            'success': function(res){
                //渲染用户角色
                var data = res.body.roleListSelect.selectOptionItems,
                    html = template('roleTpl',{data: data});
                $('#roleList').html(html);
                //单选框
                $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green"});
            } 
        });
    });

    //确定
    $('#confirm').on('click', function(){
        var _this = $(this),
            type = _this.attr('data-type'),
            url = '',
            obj = $('#form').serializeObject(); //表单中的数据
        
        if(!obj.adminName){
            $('#adminName').focus();
            return;
        };
        if(!obj.mobile){
            $('#phone').focus();
            return;
        };
        if(!method.phoneReg.test(obj.mobile)){
            $('#phone').focus();
            layer.tips('手机号格式不正确', '#confirm', {
                tips: [1, '#18a689'],
                time: 1500
            });
            return;
        };
        if(!obj.password){
            $('#password').focus();
            return;
        };
        if(!obj.roleIds){
            layer.tips('请至少选择一个用户角色', '#confirm', {
                tips: [1, '#18a689'],
                time: 1500
            });
            return;
        };
        if(typeof obj.roleIds == 'string'){
            obj.roleIds = obj.roleIds.split(',');
        };
        //如果新增
        if(type == 'add'){
            delete obj.adminId;
            url = 'admin/addAdmin';
        }else{ //如果编辑
            url = 'admin/editAdmin';
        };
        method.ajax({
          'url': url,
          'type': 'post',
          'data': obj,
          'success': function(res){
            $('#levelModal').modal('hide');
            searchTable();
            layer.alert('保存成功', {
                time: 1000,
                btn: []
            });
          } 
        });
    });

})