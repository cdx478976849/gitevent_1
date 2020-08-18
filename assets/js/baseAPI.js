//开发服务器地址:
var baseURL = 'http://ajax.frontend.itheima.net';
// 测试环境服务器地址:
// var baseURL = 'http://ajax.frontend.itheima.net';
// 生产环境服务器地址:
// var baseURL = 'http://ajax.frontend.itheima.net';

//注意:每次调用$.ajax()的时候.会先调用ajaxPrefilter这个函数
//这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //在发起真正的ajax请求之前,统一拼接请求的根路径
    options.url = baseURL + options.url;
    // alert(options.url);
})