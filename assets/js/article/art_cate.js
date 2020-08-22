$(function () {
    initArtCateList();
    //获取服务器数据,渲染页面
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                var str = template('tpl_table', res);
                $('tbody').html(str);
            }
        })
    }
    //显示添加文章分类列表
    var layer = layui.layer;
    var indexAdd = null;
    $('#btnAdd').on('click', function () {
        //利用框架代码,显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        })
    })

    //提交文章分类添加(事件委托)
    $('body').on('submit', '#form-add', function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg('恭喜您,文章类别添加成功!');
                layer.close(indexAdd);
            }
        })
    })

    //编辑文章分类添加(事件委托)
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        //4.1 利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        })
        //4.2 获取Id,发送ajax获取数据,渲染到页面
        var id = $(this).attr('data-id');
        // alert(id);
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })


    //通过代理的形式,为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您,文章类别更新成功!');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function () {
        // !!!!获取Id,发送ajax获取数据,渲染到页面
        var id = $(this).attr('data-id');
        //显示对话框
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    //因为我们更新成功,所有要重新渲染页面中的数据
                    initArtCateList();
                    layer.msg('恭喜您,文章类别删除成功!');
                    layer.close(index);
                }
            })
        })
    })
})