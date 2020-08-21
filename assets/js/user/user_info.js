$(function () {
    //1.自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1-6位之间";
            }
        }
    })
    //用户渲染
    initUserInfo();
    //导出layer
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                //成功后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click', function (e) {
        alert('11')
        //阻止表单的默认重置行为
        e.preventDefault();
        //调用函数还原数据,渲染用户
        initUserInfo();
    })
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功
                // console.log(res.message);
                layer.msg('恭喜您,修改用户信息成功!')
                //调用父框架的全局方法
                window.parent.getUserInfo();
            }
        })
    })
})