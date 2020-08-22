$(function () {

    // alert(location.search.split('=')[1]);

    function initForm() {
        var id = location.search.split('=')[1];
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像!');
                }
                //根据选择的文件，创建一个对应的 URL 地址
                var newImgURL = baseURL + res.data.cover_img
                //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域

                // setTimeout(function () {
                //     window.parent.document.getElementById('art_pub').click();
                // }, 10);
            }
        })
    }

    //定义加载文章分类的方法
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 2.1初始化富文本编辑器
    initEditor()
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
                initForm();
            }
        })
    }



    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {

        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    //监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        //4.1拿到用户选择的文件
        var file = e.target.files[0]
        //非空校验
        if (file.length == undefined) {
            return
        }
        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    //设置状态
    var state = '已发布';
    // $('#btnSave1').on('click', function () {
    //     state = '已发布';
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    $('#form-pub').on('submit', function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', state);
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (file) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', file);
                publishArticle(fd);
            })

    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            //FormData类型数据ajax提交,需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您,修改文章成功!');
                // location.href = '/article/art_list.html';
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1500);
            }
        })
    }
})