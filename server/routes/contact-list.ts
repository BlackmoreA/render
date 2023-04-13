import express from 'express';
import {AuthGuard} from "../util";
import {
    DisplayAddPage,
    DisplayContactListPage,
    DisplayDeletePage,
    DisplayEditPage,
    ProcessAddPage, ProcessEditPage
} from "../controllers/contact-list";


const router = express.Router();

/************* Contact List Routes ***************/
router.get('/add', AuthGuard, DisplayAddPage);
router.post('/add', AuthGuard, ProcessAddPage);

router.get('/contact-list', AuthGuard, DisplayContactListPage);

router.get('/delete/:id', AuthGuard, DisplayDeletePage);

router.get('/edit/:id', AuthGuard, DisplayEditPage);
router.post('/edit/:id', AuthGuard, ProcessEditPage);
/************* Contact List Routes ***************/

export default router;