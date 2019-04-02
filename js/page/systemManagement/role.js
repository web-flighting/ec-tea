$(function(){
    var authEdit = false,
        authDelete = false;
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
            field: 'roleName',
            title: '角色名称',
            align: 'center'
        },
        {
            field: 'roleAuthoritys',
            title: '角色权限',
            align: 'center',
             formatter: function (value, row, index) {
                return value.join(',')
            }
        },
        {
            field: 'updateDateText',
            title: '最后编辑时间',
            align: 'center',
           
        },
        {
            field: 'roleName',
            title: '操作人',
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
                if(authDelete){
                    btns += ' <button class="delete btn btn-sm btn-danger" type="button"><i class="glyphicon glyphicon-trash"></i> 删除</button>';
                };
                return btns;
            },
            events: { //编辑级别
                'click .edit': function(e, value, row, index){
                    $('#levelModal .modal-title').html('修改角色');
                    $('#confirm').attr('data-type', 'edit');
                    $('#levelModal').modal();
                    method.ajax({
                        'url': 'role/initEditRolePage',
                        'type': 'post',
                        'data': {"roleId": row.roleId},
                        'success': function(res){
                            var body = res.body;
                            $('#roleName').val(body.roleName);
                            $('#roleId').val(row.roleId);
                            initTree(res.body.menuAuthoritieTree);
                        } 
                    });
                },
                'click .delete': function(e, value, row, index){
                    parent.layer.confirm('确认删除此角色吗？', {
                                
                    }, function(){
                        method.ajax({
                            'url': 'role/deleteRole',
                            'type': 'post',
                            'data': {"roleId": row.roleId},
                            'success': function(res){
                                parent.layer.closeAll();
                                searchTable();
                                layer.alert('删除成功', {
                                    time: 1000,
                                    btn: []
                                });
                            } 
                        });
                    }, function(){
                        
                    });
                }
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'role/initRolePageList',
        'type': 'post',
        'data': [],
        'pageInfoName': 'rolePageInformation',
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
            var deleted = authoritys.filter(function(item){
                return item.authCode == 'Delete';
            });
            if(deleted.length != 0){
                authDelete = true;
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

    //新增角色
    $('#add').on('click', function(){
        $('#levelModal .modal-title').html('新增角色');
        $('#roleName').val('');
        $('#confirm').attr('data-type', 'add');
        $('#levelModal').modal();
        method.ajax({
            'url': 'role/initMenuAuthorityTree',
            'type': 'post',
            'success': function(res){
                initTree(res.body.menuAuthoritieTree);
            }
        });
    });

    function initTree(menuAuthoritieTree){
        var treeStr = JSON.stringify(menuAuthoritieTree);
        treeStr = treeStr.replace(/icon/g, 'icons');
        treeStr = treeStr.replace(/"ecTeaSystemMenus":null/g, '"ecTeaSystemMenuss":null');
        treeStr = treeStr.replace(/teaAuthorityTreeItems/g, 'ecTeaSystemMenus');
        treeStr = treeStr.replace(/authName/g, 'title');
        treeStr = treeStr.replace(/selected/g, 'checked');
       
        var treeData = JSON.parse(treeStr);
        //渲染树形菜单
        var setting = {
            'check': {
                'enable': true,
                'chkboxType': { "Y": "s", "N": "s" }
            },
            'view': {
                'selectedMulti': false
            },
            'data': {
                'simpleData': {
                    'enable': true
                },
                'key': {
                    'name': 'title',
                    'children': 'ecTeaSystemMenus'
                }
            }
        };
        var tree = $.fn.zTree.init($("#tree"), setting, treeData);
    };
    

    //确定
    $('#confirm').on('click', function(){
        var _this = $(this),
            type = _this.attr('data-type'),
            url = '',
            obj = $('#form').serializeObject(); //表单中的数据
        if(!obj.roleName){
            $('#roleName').focus();
            return;
        };
        var zTree = $.fn.zTree.getZTreeObj("tree"),
            nodes = zTree.getCheckedNodes(true);;
        if(nodes.length == 0){
            layer.tips('请至少选择一个角色权限', '#confirm', {
                tips: [1, '#18a689'],
                time: 1500
            });
            return;
        };
        var menuIds = [],
            authorityIds = [];
        $.each(nodes, function(index, item){
            if(!!item.menuId){
                menuIds.push(item.menuId);
            };
            if(!!item.authId){
                authorityIds.push(item.authId);
            };
        });
        obj.menuIds = menuIds;
        obj.authorityIds = authorityIds;

        //如果新增
        if(type == 'add'){
            delete obj.roleId;
            url = 'role/addRole';
        }else{ //如果编辑
            url = 'role/editRole';
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