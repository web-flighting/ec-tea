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
            field: 'areaName',
            title: '地区名称',
            align: 'center'
        },
        {
            field: 'parentId',
            title: '编号',
            align: 'center'
        },
        {
            field: 'updateAccountName',
            title: '最后编辑人',
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
            events: { //编辑地区
                'click .edit': function(e, value, row, index){
                    $('#cityModal .modal-title').html('编辑地区');
                    $('#cityName').val(row.areaName);
                    $('#cityId').val(row.areaId);
                    $('#confirm').attr('data-type', 'edit');
                    $('#cityModal').modal();
                }
            }
        }
    ];
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'data/basicDataManagement/initAccountCityPageList.json',
        'type': 'get',
        'data': [],
        'pageInfoName': 'cityPageInformation',
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

    //确定
    $('#confirm').on('click', function(){
        var _this = $(this),
            type = _this.attr('data-type'),
            url = '',
            obj = $('#form').serializeObject(); //表单中的数据
        if(!obj.cityName){
            $('#cityName').focus();
            return;
        };
        url = 'data/basicDataManagement/editAccountCity.json';
        method.ajax({
          'url': url,
          'type': 'get',
          'data': obj,
          'success': function(res){
            $('#cityModal').modal('hide');
            searchTable();
            layer.alert('保存成功', {
                time: 1000,
                btn: []
            });
          } 
        });
    });

})