import createError from 'http-errors';
import express, {NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import flash from 'connect-flash';

let localStrategy = passportLocal.Strategy;
import User from '../models/user';

import indexRouter from '../routes/index';
import authRouter from '../routes/auth';
import contactListRouter from '../routes/contact-list';
import usersRouter from '../routes/users';

import mongoose from 'mongoose';

import * as DBConfig from './db';
mongoose.connect(DBConfig.RemoteURI);

import cors from 'cors';
import passportJWT from 'passport-jwt';

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

const db = mongoose.connection;

const app = express();

db.on("error", function() {
  console.error("Connection Error!");
});
db.once("open", function () {
  console.log(`Connected to MongoDB at ${DBConfig.HostName}`);
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../Client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use(cors());

app.use(session ( {
  secret : DBConfig.SessionSecret,
  saveUninitialized : false,
  resave : false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let jwtOptions =
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: DBConfig.SessionSecret
    }

let strategy = new JWTStrategy(jwtOptions, function(jwt_payload, done) {
  User.find({id: jwt_payload.sub}).then(function(user) {
    if(user){
      return done(null, user);
    }else{
      return done(null, false);
    }
  }).catch(function(err){
    if(err){
      return done(err, false);
    }
  });
});

passport.use(strategy);

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', contactListRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err : createError.HttpError, req : express.Request, res : express.Response, next : NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
