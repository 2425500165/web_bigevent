$.ajaxPrefilter(function(options){
    options.url = 'http://www.liulongbin.top:3007' + options.url

    if(options.url.indexOf('/my') !== -1){
        // 统一设置请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete
    options.complete = function(res){
        if(res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败！'){
            // 1、清空token
            localStorage.removeItem('token')
            // 2、回到登录
            location.href = '/login.html'
        }
    }
})