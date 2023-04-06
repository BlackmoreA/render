"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contacts_1 = __importDefault(require("../models/contacts"));
const router = express_1.default.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Home', page: "home", displayName: "" });
});
router.get('/home', function (req, res, next) {
    res.render('index', { title: 'Home', page: "home", displayName: "" });
});
router.get('/about', function (req, res, next) {
    res.render('index', { title: 'About Us', page: "about", displayName: "" });
});
router.get('/products', function (req, res, next) {
    res.render('index', { title: 'Our Products', page: "products", displayName: "" });
});
router.get('/services', function (req, res, next) {
    res.render('index', { title: 'Our Services', page: "services", displayName: "" });
});
router.get('/contact', function (req, res, next) {
    res.render('index', { title: 'Contact Us', page: "contact", displayName: "" });
});
router.get('/add', function (req, res, next) {
    res.render('index', { title: 'Add Contact', page: "edit", contact: '', displayName: "" });
});
router.post('/add', function (req, res, next) {
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
});
router.get('/contact-list', function (req, res, next) {
    contacts_1.default.find().then(function (data) {
        res.render('index', { title: 'Contact List', page: "contact-list", contacts: data, displayName: "" });
    }).catch(function (err) {
        console.error("Encountered an Error reading from Database: " + err);
        res.end();
    });
});
router.get('/delete/:id', function (req, res, next) {
    let id = req.params.id;
    contacts_1.default.deleteOne({ _id: id }).then(function (contactToEdit) {
        res.redirect('/contact-list');
    }).catch(function (err) {
        console.error("Failed to delete contact from database " + err);
        res.end();
    });
});
router.get('/edit/:id', function (req, res, next) {
    let id = req.params.id;
    contacts_1.default.findById(id).then(function (contactToEdit) {
        res.render('index', { title: 'Edit Contact', page: "edit", contact: contactToEdit, displayName: "" });
    }).catch(function (err) {
        console.error("Failed to retrieve contact from database " + err);
        res.end();
    });
});
router.post('/edit/:id', function (req, res, next) {
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
});
router.get('/login', function (req, res, next) {
    res.render('index', { title: 'Login', page: "login", displayName: "" });
});
router.get('/register', function (req, res, next) {
    res.render('index', { title: 'Register', page: "register", displayName: "" });
});
exports.default = router;
//# sourceMappingURL=index.js.map