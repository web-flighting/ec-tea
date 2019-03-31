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
            field: 'typeText',
            title: '进出货',
            align: 'center',
            width: 100
        },
        {
            field: 'afterQuality',
            title: '进出货量',
            align: 'center',
            width: 130
        },
        {
            field: 'quality',
            title: '总库存（袋）',
            align: 'center',
            width: 130
        },
        {
            field: 'createDateText',
            title: '进出货时间',
            align: 'center',
            width: 130
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
            width: 200
        }
    ];
    var param = method.getParams();
    //初始化table
    method.initTableServer({
        'id': 'table',
        'url': 'stock/queryStockPageList',
        'type': 'post',
        'data': [],
        'pageInfoName': 'stockPageInformation',
        'columns': columns,
        'queryParams': function (params) {
            var data = $('#form').serializeObject();
            data.skuId = param.id;
                
            return method.getTableParams(params, data);
        },
        'success': function(res){
            //渲染状态
            var statusSelect = $('#statusSelect');
            if(statusSelect.hasClass('off')){ //只渲染一次
                return;
            };
            statusSelect.addClass('off');

            var data = res.body.stockTypeSelectOption.selectOptionItems,
                html = template('optionTpl',{data: data});
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
    $("#startTime").datepicker().on('changeDate', function(e) {
        //获取选取的开始时间
        var endTimeStart = $("#startTime input").val();
        //设置结束时间
        $('#endTime').datepicker('setStartDate', endTimeStart);
    });
     //设置结束时间必须晚于开始时间
    $("#endTime").datepicker().on('changeDate', function(e) {
        //获取选取的开始时间
        var endTimeStart = $("#startTime input").val();
        //设置结束时间
        $('#endTime').datepicker('setStartDate', endTimeStart);
        var endTime = $("#endTime input").val();
        $('#startTime').datepicker('setEndDate', endTime);
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
            data.skuId = param.id;
            return method.getTableParams(params, data);
        };
        $('#table').bootstrapTable('selectPage', 1);
        //$('#table').bootstrapTable('refreshOptions', {queryParams: param});
    };


})