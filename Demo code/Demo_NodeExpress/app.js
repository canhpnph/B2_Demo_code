var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require('express-session');
const { createServer } = require("http");
const { Server } = require("socket.io");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var nyManagerRouter = require('./routes/nyManager');
const { log } = require('console');

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("Connected to socket.io in http://localhost:3001/");

  socket.on("TestEvent", (message) => {
    console.log("Client: " + message);
  })

  socket.on("Test", (message1, message2) => {
    console.log("Client: " + message1 + "," + message2);
  })

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//sesison đặt trước router
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret:process.env.KEY_SESSION, // chuỗi ký tự đặc biệt để Session mã hóa, tự viết
  resave:false,
  saveUninitialized:false
}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/nyManager', nyManagerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function sendSocket(data) {
  io.emit("NotifyFromServer", data );
}

httpServer.listen(3001);

module.exports.sendSocket = sendSocket;

module.exports = app;
