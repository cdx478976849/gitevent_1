//入口函数
$(function () {
    //点击去注册,显示注册区域,隐藏登录区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登录,显示登录区域,隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //自定义验证规则 
    //从layui中获取form对象
    var form = layui.form;
    //从layui中获取layer对象
    var layer = layui.layer
    // console.log(layui);
    //通过form.verify()函数自定义验证规则
    form.verify({
        //密码规则 自定义一个pwd验证规则,通过数组的形式
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6 - 16位, 且不能输入空格'
        ],
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容,value是确认密码的值
            // console.log(value);
            //选择器必须带空格,选择的是后代input,name属性值为password的那个标签
            var pwd = $('.reg-box [name=password]').val();
            //比较,判断失效return一个提示消息
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        //发起ajax的post请求,提交用post
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            // data: $(this).serialize(),//username=zs&password=111
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                //返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //提交成功后处理代码
                layer.msg('注册成功,请登录!');
                //手动切换到登录界面
                $('#link_login').click();
                //重置form表单 reset()是dom方法,要转为dom对象
                $('#form_reg')[0].reset();
            }
        })
    })

    //登录功能给form标签绑定事件,button按钮触发提交事件
    $('#form_login').submit(function (e) {
        //先阻止默认提交行为ajax
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            method: 'POST',
            //每次调用$.ajax()的时候,会先调用ajaxPrefilter这个函数,
            // 在登录页面已经引进了ajaxPrefilter这个函数的js样式,就不用写根路径
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                //校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提示信息,保存token,跳转页面
                layer.msg('恭喜您,登录成功!');
                //保存token,未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转到index首页
                location.href = '/index.html';
            }
        })
    })
})