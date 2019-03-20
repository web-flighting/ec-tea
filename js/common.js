//公用配置
var config = {
  'service': '/', //api请求
  'loginUrl': '/login.html' //登录页地址 
};
//公用方法
var method = {
    //ajax请求http服务
    ajax: function (obj) {
        var tokenId = wsCache.get('tokenId');
        if(!obj.data){
            obj.data = {};
        };
        obj.data.tokenId = tokenId;
        var url = config.service + obj.url;
        $.ajax({
            url: url,
            type: obj.type,
            data: JSON.stringify(obj.data),
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            xhrFields: {
              withCredentials: true 
            },
            crossDomain: true,
            cache: false,
            success: function (res) {
                //如果登录超时则跳转至登录页
                if (res.code == 92 && res.messageCode == 'I000061') {
                    wsCache.delete('tokenId');
                    wsCache.delete('userInfo');
                    window.location = config.loginUrl;
                    return;
                };
                if (obj.success){
                  obj.success(res);  
                };
            },
            error: function (status) {
                
            }
        })
    },
    /**
   * @method 配置Table查询时的相关参数
   * @param {params} table返回的参数 {obj}查询时获取到的参数
   */
    getTableParams: function (params, obj) {
        var data = obj;
        data.pageSize = params.limit;
        data.currentPage = Math.ceil(params.offset / 10) + 1;
        return JSON.stringify(data);
    },
    //初始化Table
    initTableServer: function (obj) {
        var uniqueId = obj.uniqueId || 'id',
            height = obj.height || 0,
            type = obj.type || 'post',
            contentType;
        if(method == 'post'){
            contentType = 'application/x-www-form-urlencoded';
        }else{
            contentType = 'application/json';
        };
        $('#' + obj.id).bootstrapTable({
          url: config.service + obj.url, //请求后台的URL（*）
          method: type, //请求方式（*）
          contentType: contentType,
          data: obj.data,
          striped: true, //是否显示行间隔色
          cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
          pagination: true, //是否显示分页（*）
          sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
          queryParams: obj.queryParams, //参数
          pageNumber: 1, //初始化加载第一页，默认第一页
          pageSize: obj.pageSize || 10, //每页的记录行数（*）
          pageList: [20, 50, 100], //可供选择的每页的行数（*）
          clickToSelect: true, //是否启用点击选中行
          maintainSelected: true,
          height: height, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
          uniqueId: uniqueId, //每一行的唯一标识，一般为主键列
          columns: obj.columns,
          onCheck: obj.onCheckRow,
          onUncheck: obj.onUnCheckRow,
          onClickRow: obj.onClickRow,
          onDblClickRow: obj.onDblClickRow,
          onPageChange: obj.onPageChange,
          rowStyle: obj.rowStyle,
          //ajaxOptions: {async:true,timeout:800},
          formatLoadingMessage: function () {
            return '正在努力地加载数据中，请稍候……';
          },
          formatNoMatches: function () { //没有匹配的结果
            return '没有找到匹配的记录';
          },
          responseHandler: function (res) {
            var json = {
              "body": res.body,
              "rows": res.body[obj.pageInfoName].result,
              "total": res.body[obj.pageInfoName].pageInfo.totalCounts
            };
            if (obj.success){
              obj.success(json);  
            };
            return json;
          },
        });
    },
    //获取iframe||地址栏参数
    getParams: function() {
        var url = $(window.parent.document).find('.J_iframe').attr('src');
        if(!url){
            url = location.href;
        };
        var param = {};
        url.replace(/([^?&]+)=([^?&]+)/g, function(s, v, k) {
            param[v] = decodeURIComponent(k);
            return k + '=' +  v;
        });
        return param;
    }
};
//初始化WebStorageCache本地存储
var wsCache = new WebStorageCache();

$(function(){
    //限制输入数字
    $('body').on('keyup blur input', '.js-num-input', function(){
        var self = $(this),
            value = $.trim(self.val());
        if(/\D/.test(value)){ //如果输入的值包含除了数字的其他东西则过滤
            value = value.replace(/\D/g,'');
        };
        self.val(value);
    });
});

//表单序列化为json
(function($){  
    $.fn.serializeObject = function() {  
        var o = {};  
        var a = this.serializeArray();  
        $.each(a, function() {  
            if (o[this.name]) {  
                if (!o[this.name].push) {  
                    o[this.name] = [ o[this.name] ];  
                };
                var value = $.trim(this.value);
                o[this.name].push(value)  
            } else { 
                var value = $.trim(this.value);
                o[this.name] = value;
            }  
        });  
        return o;  
    }  
})(jQuery);