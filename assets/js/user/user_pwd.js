$(function () {
    //定义校验规则
    var form = layui.form;
    form.verify({
        //全部的密码框校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //新密码的校验规则
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '原密码和旧密码不能相同!'
            }
        },
        //确认新密码的校验规则 判断
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码输入不一致!'
            }
        }
    })

    //表单提交
    var layer = layui.layer;
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                }
                //成功
                // console.log(res.message);
                layer.msg('修改密码成功!')
                //清空内容
                $('.layui-form')[0].reset();
            }
        })
    })
})