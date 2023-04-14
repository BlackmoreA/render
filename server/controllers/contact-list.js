"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessEditPage = exports.DisplayEditPage = exports.DisplayDeletePage = exports.DisplayContactListPage = exports.ProcessAddPage = exports.DisplayAddPage = void 0;
const util_1 = require("../util");
const contacts_1 = __importDefault(require("../models/contacts"));
function DisplayAddPage(req, res, next) {
    res.render('index', { title: 'Add Contact', page: "edit", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayAddPage = DisplayAddPage;
function ProcessAddPage(req, res, next) {
    let newContact = new contacts_1.default({
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
    });
    contacts_1.default.create(newContact).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to add contact to database " + err);
        res.end(err);
    });
}
exports.ProcessAddPage = ProcessAddPage;
function DisplayContactListPage(req, res, next) {
    contacts_1.default.find().then(function (data) {
        res.render('index', {
            title: 'Contact List', page: "contact-list",
            contacts: data, displayName: (0, util_1.UserDisplayName)(req)
        });
    }).catch(function (err) {
        console.error("Encountered an Error reading from Database: " + err);
        res.end();
    });
}
exports.DisplayContactListPage = DisplayContactListPage;
function DisplayDeletePage(req, res, next) {
    let id = req.params.id;
    contacts_1.default.deleteOne({ _id: id }).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to delete contact from database " + err);
        res.end();
    });
}
exports.DisplayDeletePage = DisplayDeletePage;
function DisplayEditPage(req, res, next) {
    let id = req.params.id;
    contacts_1.default.findById(id).then(function (contactToEdit) {
        res.render('index', {
            title: 'Edit Contact', page: "edit",
            contact: contactToEdit, displayName: (0, util_1.UserDisplayName)(req)
        });
    }).catch(function (err) {
        console.error("Failed to retrieve contact from database " + err);
        res.end();
    });
}
exports.DisplayEditPage = DisplayEditPage;
function ProcessEditPage(req, res, next) {
    let id = req.params.id;
    let updatedContact = new contacts_1.default({
        "_id": id,
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
    });
    contacts_1.default.updateOne({ _id: id }, updatedContact).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to edit in database " + err);
        res.end(err);
    });
}
exports.ProcessEditPage = ProcessEditPage;
//# sourceMappingURL=contact-list.js.map