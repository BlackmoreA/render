import express from 'express';
import {
  DisplayAboutPage,
  DisplayContactPage,
  DisplayHomePage,
  DisplayProductsPage,
  DisplayServicesPage
} from "../controllers";

const router = express.Router();

/************* Top Level Routes ******************/
router.get('/', DisplayHomePage);
router.get('/home', DisplayHomePage);

router.get('/about', DisplayAboutPage);
router.get('/products', DisplayProductsPage);
router.get('/services', DisplayServicesPage);
router.get('/contact', DisplayContactPage);
/************* Top Level Routes ******************/

export default router;