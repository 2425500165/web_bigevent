$(function() {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage
    // 定义没话事件过滤器
    template.defaults.imports,dataFormat = function(date){
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
      return  n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()
    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('数据列表获取失败！')
                }
                // 使用模版引擎导入数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 渲染分页
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !==0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模版引擎渲染数据可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    
    //筛选表单查询
    $('#form-search').on('submit', function(e){
        e.preventDefault()
        // 获取表单选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 渲染分页方法

    function renderPage(total) {
          //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2,3,5,10],
            layout: ['count','limit','prev', 'page', 'next','skip'],
            jump: function(obj, first){
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
            }
        });
    }

    // 通过代理绑定删除
    $('tbody').on('click','.btn-delete',function() {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: function(res){
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})