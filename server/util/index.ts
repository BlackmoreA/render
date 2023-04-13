import express, {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import * as DBConfig from '../config/db';

export function UserDisplayName(req : Request) : string
{
    if (req.user) {
        let user = req.user as UserDocument;
        return user.DisplayName.toString();
    }
    return '';
}

export function AuthGuard(req : Request, res : Response, next : NextFunction) : void
{
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

export function GenerateToken(user : any) : string
{
    const payload = {
        id: user.id,
        DisplayName: user.DisplayName,
        EmailAddress: user.EmailAddress,
        username: user.username
    }

    const jwtOptions = {
        expiresIn: 604800
    }
    return jwt.sign(payload, DBConfig.SessionSecret, jwtOptions);
}