import express, {Request, Response, NextFunction} from "express";
import {UserDisplayName} from "../util";
import Contact from "../models/contacts";

export function DisplayAddPage(req : Request, res : Response, next : NextFunction) : void
{
    res.render('index', { title: 'Add Contact', page : "edit", displayName : UserDisplayName(req) });
}
export function ProcessAddPage(req : Request, res : Response, next : NextFunction) : void
{
    let newContact = new Contact(
        {
            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress
        }
    );
    Contact.create(newContact).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to add contact to database " + err);
        res.end(err);
    });
}

export function DisplayContactListPage(req : Request, res : Response, next : NextFunction) : void
{
    Contact.find().then(function (data) {
        //console.log(contacts);
        res.render('index', {
            title: 'Contact List', page: "contact-list",
            contacts: data, displayName: UserDisplayName(req)
        });
    }).catch(function (err) {
        console.error("Encountered an Error reading from Database: " + err);
        res.end();
    });
}

export function DisplayDeletePage(req : Request, res : Response, next : NextFunction) : void
{
    let id = req.params.id;

    Contact.deleteOne({_id: id}).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to delete contact from database " + err);
        res.end();
    });
}

export function DisplayEditPage(req : Request, res : Response, next : NextFunction) : void
{
    let id = req.params.id;

    Contact.findById(id).then(function (contactToEdit) {
        res.render('index', {
            title: 'Edit Contact', page: "edit",
            contact: contactToEdit, displayName: UserDisplayName(req)
        });
    }).catch(function (err) {
        console.error("Failed to retrieve contact from database " + err);
        res.end();
    });
}

export function ProcessEditPage(req : Request, res : Response, next : NextFunction) : void
{
    let id = req.params.id;

    let updatedContact = new Contact(
        {
            "_id": id,
            "FullName": req.body.fullName,
            "ContactNumber": req.body.contactNumber,
            "EmailAddress": req.body.emailAddress
        }
    );

    Contact.updateOne({_id: id}, updatedContact).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to edit in database " + err);
        res.end(err);
    });
}
