//入口函数
$(function () {
    //获取用户信息
    getUserInfo();
    //退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html';
            //3.关闭询问框
            layer.close(index);
        });
    })
})

//获取用于信息(封装到入口函数的外面)
//后面其他页面要调用,是全局函数
function getUserInfo() {
    //发送ajax
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     //重新登录,因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                //判断状态码
                return layui.layer.msg('res.message')
            }
            //请求成功渲染用户信息
            // console.log(res.data);
            renderAvatar(res.data);
        },
        // complete: function (res) {
        //     // console.log(res.responseJSON);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败! ') {
        //         //1.清空本地token
        //         localStorage.removeItem('token');
        //         //2.页面跳转
        //         location.href = '/login.html';
        //     }
        // }
    })
}


//封装用户名渲染函数
function renderAvatar(user) {
    //1.用户名(昵称优先,没有用username)
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //2. 用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.user-avatar').hide();
    } else {
        //没有头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.user-avatar').html(first).show();
    }
}