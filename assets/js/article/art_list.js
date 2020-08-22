$(function () {
    //定义提交参数
    var q = {
        pagenum: 1,   //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: '',  //文章分类的 Id
        state: '',    //文章的状态，可选值有：已发布、草稿
    }
    template.defaults.imports.dataFormat = function (data) {
        var now = new Date(data);
        var year = now.getFullYear();
        var month = padZero(now.getMonth() + 1);
        var date = padZero(now.getDate());
        var hour = padZero(now.getHours());
        var minute = padZero(now.getMinutes());
        var second = padZero(now.getSeconds());
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    };

    initTable();
    initCate()
    //获取数据 渲染文章列表
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl_table', res);
                $('tbody').html(str);
                //渲染页面的发放
                renderPage(res.total)
            }
        })
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //套用模板引擎渲染select
                var str = template('tpl_cate', res);
                $('[name=cate_id]').html(str);
                //再调用layui的form的render()方法渲染页面
                form.render();
            }
        })
    }
    //筛选功能
    $('#form-search').on('submit', function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        //获取
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //赋值
        q.cate_id = cate_id;
        q.state = state;
        //初始化文章列表
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //只要调用form.render(),一直会发生死循环
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数
                // console.log(first, obj.curr, obj.limit);
                //  得到当前页，以便向服务端请求对应页的数据。
                //当前的页数赋值给页码值
                q.pagenum = obj.curr;
                //把最新的q获取对应的数据列表,并渲染页面
                q.pagesize = obj.limit;
                //第一次不回调函数
                if (!first) {
                    //根据最新的q获取对应的数据列表,并渲染表格
                    initTable();
                }
            }
        });
    }

    //删除
    $('tbody').on('click', '.btn-delete', function () {
        //获取页面里的按钮个数
        var len = $('.btn-delete').length;
        console.log(len);
        //获取Id的值
        var Id = $(this).attr('data-id');
        //提示框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('恭喜您,文章删除成功!')
                    //页面汇总删除按钮个数等于1,页面大于1
                    if (len === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    //更新成功,重新渲染页面
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})