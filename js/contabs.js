$(function () {
    function menuItem() {
        // 获取标识数据
        var dataUrl = $(this).attr('href'),
            dataIndex = $(this).data('index'),
            menuName = $(this).data('name');
        if(dataUrl == undefined || $.trim(dataUrl).length == 0){
            return false;
        };
        //改动iframe的src
        $('.J_iframe').attr('src', dataUrl);

        //显示loading提示
       var loading = layer.load();
       $('.J_iframe:last').contents().find('body').on('click', '.J_menuItem', menuItem);
       $('.J_mainContent iframe:visible').load(function () {
           //iframe加载完成后隐藏loading提示
           layer.close(loading);
           $(this).contents().find('body').off('click').on('click', '.J_menuItem', menuItem);
       });
       return false;
    };
    //绑定所有链接跳转事件
    $('body').on('click', '.J_menuItem', menuItem);
    $('.J_mainContent iframe:visible').contents().find('body').on('click', '.J_menuItem', menuItem);
    $('.J_mainContent iframe:visible').load(function () {
        $(this).contents().find('body').off('click').on('click', '.J_menuItem', menuItem);
    });

});
