var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var uuid = require('uuid/v4');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var axios = require('axios');
var flash = require('connect-flash');

// view engine setup
passport.use(new LocalStrategy(
    {usernameField: 'email'}, (email, password, done) => {
        axios.get('http://localhost:3000/utilizadores/' + email)
            .then(dados => {
                const user = dados.data;
                if(!user){
                    return done(null, false, {message: 'Utilizador inexistente!\n'});
                }
                if(password != user.password){
                    return done(null, false, {message: 'Password invalida!\n'});
                }
                return done(null, user);
            })
            .catch(erro => done(erro));
    }));

passport.serializeUser((user, done) => {
    console.log('Vou serializar o user: ' + JSON.stringify(user));
    done(null, user.email);
})

passport.deserializeUser((email, done) => {
    console.log('Vou desserializar o user: ' + email);
    axios.get('http://localhost:3000/utilizadores/' + email)
        .then(dados => done(null, dados.data))
        .catch(e => done(e, false));
})

var indexRouter = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    genid: req => {
        console.log('dentro de middleware');
        console.log(req.sessionID);
        return uuid()
    },
    store: new FileStore(),
    secret: 'meu segredo',
    resave: false,
    saveUninicialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

module.exports = app;
