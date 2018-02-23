var express = require('express');
var ejs = require('ejs')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('express-session');
var bodyParser = require('body-parser');
const multer = require('multer');

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

app.all('*', function (req, res, next) {
	  // res.header('Access-Control-Allow-Credentials', true); 
    next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);  // 设置html后缀
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({dest:'../public/images/'}).any());
app.use(cookieParser('12345'));
app.use(cookieSession({
    secret: '12345',
    name: 'userId',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
}))
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截
app.use(function (req, res, next) {
	if (req.session.userId) {
		next()
	} else{
		if (req.originalUrl == '/users/login' || req.originalUrl == '/users/loginOut' || req.path == '/goods/list') {
			next()
		} else{
			res.json({
			  status: '2',
			  msg: '当前未登录',
			  result: ''
			})
		}
	}
})

// router
app.use('/', index);
app.use('/goods', goods)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
