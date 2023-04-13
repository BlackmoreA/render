import express from 'express';
import {
    DisplayLoginPage,
    DisplayRegisterPage,
    ProcessLoginPage,
    ProcessLogout,
    ProcessRegisterPage
} from "../controllers/auth";

const router = express.Router();

/************* Authentication Routes *************/
router.get('/login', DisplayLoginPage);
router.post('/login', ProcessLoginPage);

router.get('/register', DisplayRegisterPage);
router.post('/register', ProcessRegisterPage);

router.get('/logout', ProcessLogout);

/************* Authentication Routes *************/


export default router;