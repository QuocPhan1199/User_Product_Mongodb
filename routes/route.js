const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const productController = require('./../controllers/productController');
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.use(authController.protect);
router.post('/createProducts',productController.createProduct);
router.get('/getProducts',productController.getProduct);
router.get('/:id/getProductsId', productController.getProductId);
router.put('/:id/updateProducts',productController.updateProduct);
router.delete('/:id/deleteProducts',productController.deleteProduct);
router.delete('/deleteMe', userController.deleteMe);
// Only admin have permission to access for the below APIs 

router
    .route('/')
    .get(userController.getAllUsers);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
router.use(authController.restrictTo('admin'));
module.exports = router;