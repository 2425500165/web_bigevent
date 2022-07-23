$(function() {
    //  去注册
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 去登录

    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui 获取 from 对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
        var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value) {
                return '两次输入的密码不一致'
            }
        }
    })

    // 监听表单注册提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data =  { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser', data, function(res) {
            if(res.status !==0 ) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录！');
            // 模拟人的点击行为
        $('#link_login').click()
        })
    })

    // 监听登录事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        var data = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val()}
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                  return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                console.log(res.token)
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
              }
        })
    })

})


// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAyMjgsInVzZXJuYW1lIjoicXEyNDIiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTY1ODU4NzkyMywiZXhwIjoxNjU4NjIzOTIzfQ.UGCAI0SsmV71o47Re-MyVy79HhBMNaf-OtjdxK0BVn0