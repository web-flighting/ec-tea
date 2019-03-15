$(function(){
    //获取当前登录用户所有角色列表
    method.ajax({
        'url': 'data/main/initAccountRoles.json',
        'type': 'get',
        'success': function(res){
            var securityRoles = res.body.securityRoles,
                html = template('roleListTpl',{data: securityRoles});
            $('#roleList').html(html);
            getSystemMenus(securityRoles[0]['roleId']);
        } 
    });
    //获取系统菜单
    function getSystemMenus(roleId){
        method.ajax({
            'url': 'data/main/getSystemMenus.json',
            'type': 'get',
            'data': {"selectAccountRoleId": roleId},
            'success': function(res){
                var html = template('menuTpl',{data: res.body.ecTeaSystemMenus});
                $('#side-menu').html(html);
                // MetsiMenu
                $('#side-menu').metisMenu();
                $('#side-menu > li a:first').trigger('click');
                $('#side-menu .J_menuItem:first').trigger('click');
            } 
        });
    };
    //退出账号
    $('#logout').on('click', function(){
        parent.layer.confirm('确定要注销账号吗？', {
            
        }, function(){
            method.ajax({
                'url': 'data/main/loginOut.json',
                'type': 'get',
                'success': function(res){
                    wsCache.delete('tokenId');
                    wsCache.delete('userInfo');
                    window.location.href = config.loginUrl;
                } 
            });
        }, function(){
            
        });
    });
    

    //菜单点击选中
    $('#side-menu').on('click', '.J_menuItem', function(){
        $('#side-menu .J_menuItem').removeClass('active');
        $(this).addClass('active');
    });

    //角色切换重新获取系统菜单
    $('#roleList').on('change', function(){
        var roleId = $(this).find('option:selected').val();
        getSystemMenus(roleId);
    });

    //获取用户信息
    var userInfo = wsCache.get('userInfo');
    if(!!userInfo){
       $('#userName').text(userInfo.accountName); 
    }else{
        window.location = config.loginUrl;
    };
    

    function NavToggle() {
        $('.navbar-minimalize').trigger('click');
    }

    // 侧边栏高度
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    }
    fix_height();

    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });


    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    $('#side-menu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function () {
        if ($(window).width() < 769) {
            NavToggle();
        }
    });

    $('.nav-close').click(NavToggle);

    //ios浏览器兼容性处理
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //$('#content-main').css('overflow-y', 'auto');
    };

    $(window).bind("load resize", function () {
        if ($(this).width() < 769) {
            $('body').addClass('mini-navbar');
            $('.navbar-static-side').fadeIn();
        }
    });
})
