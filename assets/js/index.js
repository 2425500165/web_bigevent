$(function() {
    // 获取用户基本信息
    getUserInfo()

    var layer = layui.layer
    $('#btnLogout').on('click', function(){
    //    提示是否确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
        //do something
        // 1、清空token 回到登录页
        localStorage.removeItem('token')
        // 2、回到登录页
        location.href = '/login.html'

        // 3、关闭
        layer.close(index);
      });
    })
})
// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user){
    // 1、获取用户名称
    var name = user.nickname || user.username
    // 2、欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3、按需选渲染头像
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}