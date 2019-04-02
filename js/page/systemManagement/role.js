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
            field: '',
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
                return btns;
            },
            events: { //编辑级别
                'click .edit': function(e, value, row, index){
                    $('#levelModal .modal-title').html('编辑级别');
                    $('#levelName').val(row.accountName);
                    $('#phone').val(row.mobile);
                    $('#password').val(row.accountName);
                    $('#levelId').val(row.id);
                    $('#confirm').attr('data-type', 'edit');
                    $('#levelModal').modal();

            $('#form').serializeObject().class_ids = [1,2]


                }
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        // 'url': 'accountLevel/initAccountLevelPageList',
        'url': 'data/systemManagement/dataRole.json',
        'type': 'get',
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
            console.log(res)
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
        $('#levelModal .modal-title').html('新增级别');
        $('#levelName').val('');
        $('#confirm').attr('data-type', 'add');
        $('#levelModal').modal();
        $('#levelName').val('');
        $('#phone').val('');
        $('#password').val('');
        $('.icheckbox_square-green').removeClass('checked')
    });

    //级别确定
    $('#confirm').on('click', function(){
        

        var _this = $(this),
            type = _this.attr('data-type'),
            url = '',
            obj = $('#form').serializeObject(); //表单中的数据
        // if(!obj.levelName){
        //     $('#levelName').focus();
        //     return;
        // };
        var a = 0;
        if(obj.class_ids.length == 1){
            obj.class_ids = [obj.class_ids]

        }

        console.log(obj)
        return 

        //如果新增级别
        if(type == 'add'){
            delete obj.levelId;
            url = 'accountLevel/addAccountLevel';
        }else{ //如果编辑级别
            url = 'accountLevel/editAccountLevel';
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