import express from 'express';
import Contact from '../models/contacts';
import passport from "passport";
import User from '../models/user';
import {AuthGuard, UserDisplayName} from "../util";

const router = express.Router();

/************* Top Level Routes ******************/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', page : "home", displayName : UserDisplayName(req) });
});
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', page : "home", displayName : UserDisplayName(req) });
});

router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About Us', page : "about", displayName : UserDisplayName(req) });
});
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Our Products', page : "products", displayName : UserDisplayName(req) });
});
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Our Services', page : "services", displayName : UserDisplayName(req) });
});
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact Us', page : "contact", displayName : UserDisplayName(req) });
});
/************* Top Level Routes ******************/

/************* Contact List Routes ***************/
router.get('/add', AuthGuard, function(req, res, next) {
  res.render('index', { title: 'Add Contact', page : "edit",
                   contact : '', displayName : UserDisplayName(req) });
});
router.post('/add', AuthGuard, function(req, res, next) {
  let newContact = new Contact (
      {
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
      }
  );
  Contact.create(newContact).then(function(contactToEdit) {
    res.redirect('/contact-list');
  }).catch(function(err) {
    console.error("Failed to add contact to database " + err);
    res.end(err);
  });
});

router.get('/contact-list', AuthGuard, function(req, res, next) {
  Contact.find().then(function (data) {
    //console.log(contacts);
    res.render('index', { title: 'Contact List', page : "contact-list",
               contacts : data,  displayName : UserDisplayName(req) });
  }).catch(function(err) {
    console.error("Encountered an Error reading from Database: " + err);
    res.end();
  });

});

router.get('/delete/:id', AuthGuard, function(req, res, next) {
  let id = req.params.id;

  Contact.deleteOne({_id : id}).then(function(contactToEdit) {
    res.redirect('/contact-list');
  }).catch(function(err) {
    console.error("Failed to delete contact from database " + err);
    res.end();
  });
});

router.get('/edit/:id', AuthGuard, function(req, res, next) {
  let id = req.params.id;

  Contact.findById(id).then(function(contactToEdit) {
    res.render('index', { title: 'Edit Contact', page : "edit",
               contact : contactToEdit, displayName : UserDisplayName(req) });
  }).catch(function(err) {
    console.error("Failed to retrieve contact from database " + err);
    res.end();
  });
});
router.post('/edit/:id', AuthGuard, function(req, res, next) {
  let id = req.params.id;

  let updatedContact = new Contact (
      {
        "_id": id,
        "FullName": req.body.fullName,
        "ContactNumber": req.body.contactNumber,
        "EmailAddress": req.body.emailAddress
      }
  );

  Contact.updateOne({_id : id}, updatedContact).then(function(contactToEdit) {
    res.redirect('/contact-list');
  }).catch(function(err) {
    console.error("Failed to edit in database " + err);
    res.end(err);
  });
});
/************* Contact List Routes ***************/

/************* Authentication Routes *************/
router.get('/login', function(req, res, next) {
  if(!req.user) {
    return res.render('index', { title: 'Login', page : "login",
                      messages : req.flash('loginMessage'), displayName : "" });
  }
  return res.redirect('/contact-list');
});
router.post('/login', function (req, res, next) {
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
});

router.get('/register', function(req, res, next) {
  if(!req.user) {
    return res.render('index', { title: 'Register', page : "register",
      messages : req.flash('registerMessage'), displayName : "" });
  }
  return res.redirect('/login');
});
router.post('/register', function (req, res, next) {
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
});

router.get('/logout', function(req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }
    return res.redirect('/login');
  });
});

/************* Authentication Routes *************/


export default router;