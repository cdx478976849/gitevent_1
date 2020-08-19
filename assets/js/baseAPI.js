//开发服务器地址:
var baseURL = 'http://ajax.frontend.itheima.net';
// 测试环境服务器地址:
// var baseURL = 'http://ajax.frontend.itheima.net';
// 生产环境服务器地址:
// var baseURL = 'http://ajax.frontend.itheima.net';

//注意:每次调用$.ajax()的时候.会先调用ajaxPrefilter这个函数
//这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //统一为有权限的接口,设置headers请求头
    // if (options.url.indexOf('/my/') === 0) {
    //     options.headers = {
    //         Authorization: localStorage.getItem('token') || ''
    //     }
    // }

    //在发起真正的ajax请求之前,统一拼接请求的根路径
    options.url = baseURL + options.url;
    // alert(options.url);

    //统一为有权限的接口,设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //拦截所有响应,判断身份认证信息
    options.complete = function (res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            //1.清空本地token
            localStorage.removeItem('token');
            //2.页面跳转
            location.href = '/login.html';
        }
    }
})