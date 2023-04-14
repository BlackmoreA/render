"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayContactPage = exports.DisplayServicesPage = exports.DisplayProductsPage = exports.DisplayAboutPage = exports.DisplayHomePage = void 0;
const util_1 = require("../util");
function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: "home", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayHomePage = DisplayHomePage;
function DisplayAboutPage(req, res, next) {
    res.render('index', { title: 'About Us', page: "about", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayAboutPage = DisplayAboutPage;
function DisplayProductsPage(req, res, next) {
    res.render('index', { title: 'Our Products', page: "products", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayProductsPage = DisplayProductsPage;
function DisplayServicesPage(req, res, next) {
    res.render('index', { title: 'Our Services', page: "services", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayServicesPage = DisplayServicesPage;
function DisplayContactPage(req, res, next) {
    res.render('index', { title: 'Contact Us', page: "contact", displayName: (0, util_1.UserDisplayName)(req) });
}
exports.DisplayContactPage = DisplayContactPage;
//# sourceMappingURL=index.js.map