$(function () {
  //获取当前登录用户所有角色列表
  method.ajax({
    'url': 'security/initAccountRoles',
    'type': 'post',
    'success': function (res) {
      var securityRoles = res.body.securityRoles,
        html = template('roleListTpl', {
          data: securityRoles
        });
      $('#roleList').html(html);
      var roleId = securityRoles[0]['roleId'];
      var userParams = wsCache.get('userParams');
      if (!!userParams) {
        userParams.roleId = roleId;
      } else {
        userParams = {
          "roleId": roleId
        };
      };
      wsCache.set('userParams', userParams);
      getSystemMenus(roleId);
    }
  });
  //获取系统菜单
  function getSystemMenus(roleId) {
    method.ajax({
      'url': 'security/getSystemMenus',
      'type': 'post',
      'data': {
        "selectAccountRoleId": roleId
      },
      'success': function (res) {
        var html = template('menuTpl', {
          data: res.body.ecTeaSystemMenus
        });
        $('#side-menu').html(html);
        // MetsiMenu
        $('#side-menu').metisMenu();
        $('#side-menu > li a:first').trigger('click');
        $('#side-menu .J_menuItem:first').trigger('click');
      }
    });
  };
  //退出账号
  $('#logout').on('click', function () {
    parent.layer.confirm('确定要注销账号吗？', {

    }, function () {
      method.ajax({
        'url': 'security/loginOut',
        'type': 'post',
        'success': function (res) {
          method.gotoLogin();
        }
      });
    }, function () {

    });
  });

  template.defaults.imports.menu = function(value){
    switch(value){
      case '/accountManagement.html':
        value = '/userManagement/user.html';
        break;
      case '/accountLevelManagement.html':
        value = '/userManagement/userLevel.html';
        break;
      case '/productManagement.html':
        value = '/goodsManagement/goods.html';
        break;
      case '/productTypeManagement.html':
        value = '/goodsManagement/classify.html';
        break;
      case '/orderOutlineManagement.html':
        value = '/orderManagement/offlineOrder.html';
        break;
      case '/adminManagement.html':
        value = '/systemManagement/manager.html';
        break;
      case '/roleManagement.html':
        value = '/systemManagement/role.html';
        break;
      case '/cityManagement.html':
        value = '/basicDataManagement/city.html';
        break;
      case '/unitManagement.html':
        value = '/basicDataManagement/unit.html';
        break;
    };
    return value;
  };


  //菜单点击选中
  $('#side-menu').on('click', '.J_menuItem', function () {
    $('#side-menu .J_menuItem').removeClass('active');
    $(this).addClass('active');
    var menuId = $(this).attr('data-menuid');
    var userParams = wsCache.get('userParams');
    userParams.menuId = menuId;
    wsCache.set('userParams', userParams);
  });

  //角色切换重新获取系统菜单
  $('#roleList').on('change', function () {
    var roleId = $(this).find('option:selected').val();
    var userParams = wsCache.get('userParams');
    userParams.roleId = roleId;
    wsCache.set('userParams', userParams);
    getSystemMenus(roleId);
  });

  //获取用户信息
  var userInfo = wsCache.get('userInfo');
  if (!!userInfo) {
    $('#userName').text(userInfo.accountName);
  } else {
    window.location.href = config.loginUrl;
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