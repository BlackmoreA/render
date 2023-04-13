import express, {Request, Response, NextFunction} from "express";
import passport from "passport";
import User from "../models/user";

export function DisplayLoginPage(req : Request, res : Response, next : NextFunction) : void
{
    if(!req.user) {
        return res.render('index', { title: 'Login', page : "login",
            messages : req.flash('loginMessage'), displayName : "" });
    }
    return res.redirect('/contact-list');
}
export function ProcessLoginPage(req : Request, res : Response, next : NextFunction) : void
{
    passport.authenticate('local', function(err : Error, user : any, info : string) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        if (!user) {
            req.flash('loginMessage', "Authentication Error");
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.redirect('/contact-list');
        });

    })(req, res, next);
}

export function DisplayRegisterPage(req : Request, res : Response, next : NextFunction) : void
{
    if(!req.user) {
        return res.render('index', { title: 'Register', page : "register",
            messages : req.flash('registerMessage'), displayName : "" });
    }
    return res.redirect('/login');
}

export function ProcessRegisterPage(req : Request, res : Response, next : NextFunction) : void
{
    let newUser = new User({
        username : req.body.username,
        EmailAddress : req.body.emailAddress,
        DisplayName : req.body.firstName + " " + req.body.lastName
    });

    User.register(newUser, req.body.password, function(err) {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error('Error: User Already Exists');
                req.flash('registerMessage', 'Registration Error');
            }
            console.error('Error: Server Error');
            req.flash('registerMessage', 'Server Error');
            res.redirect('/register');
        }

        return passport.authenticate('local')(req, res, function() {
            res.redirect('/contact-list');
        });
    });
}

export function ProcessLogout(req : Request, res : Response, next : NextFunction) : void
{
    req.logout(function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        return res.redirect('/login');
    });
}