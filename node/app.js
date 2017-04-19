/**
 * Created by xiaogang on 2017/3/29.
 */
"use strict";
//相关基础依赖
var path = require('path');
var express = require("express");
var session = require('express-session');
var favicon = require('serve-favicon');
var pug = require('pug');
var config = require('config-lite');
var bodyParser = require('body-parser');
// 路由
const routes = require('./router/index');//require('./router');

//相关配置文件
// var pkg = require('../package');
//实例
var app = express();
//设置地址栏icon
app.use(favicon(path.join(__dirname, './public', 'favicon/favi.ico')));

// 设置模板目录和模板引擎pug
app.set('views', path.join(__dirname, 'view'));
// 设置模板引擎为 ejs
app.set('view engine', 'pug');

// 设置静态文件目录
app.use(config.publicPath, express.static(path.join(__dirname, './public')));
// 前端 静态资源区 [更多配置 查看官方api]
// app.use('/', express.static(path.join(__dirname, './webapp')，{maxAge: 1000}));
app.use(express.static(path.join(__dirname, './webapp'), {maxAge: 1000}));

// session 中间件（暂时利用内存 临时 处理session）
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    // store: new MongoStore({// 将 session 存储到 mongodb
    //     url: config.mongodb// mongodb 地址
    // })
}));

// 设置模板全局常量
app.locals.blog = {
    title: "node-express",
    description: "1104"
};
// 建议使用 helmet 插件处理 header
app.disable('x-powered-by');

// bodyParser ：ajax 请求的配置项
// app.use(bodyParser.json({
//      type: 'application/*+json',
//      strict: false
// })); // for parsing application/json
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded

// 路由
routes(app);

//错误处理
app.use(function (err, req, res, next) {
    console.log("=================错误处理=================")
    //其他 业务逻辑
    console.log(err);
    if (res.headersSent) {
        //return next(err);
    }
    res.status(500);
    res.render('error', {error: err});
});

// 监听端口，启动程序
const SERVER = app.listen(config.port, function () {
    var address = SERVER.address();
    console.log(address);
    console.log(`nodeApp listening on port ${config.port}`);
    // console.log(`${pkg.name} listening on port ${config.port}`);
});
