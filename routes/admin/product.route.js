const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter.js');
const upload = multer( { storage: storageMulter()});
const controller = require('../../controllers/admin/product.controller.js');
const validate = require('../../validates/admin/product.validate.js');

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id', controller.deleteItem);

//no need to pass req and res args to router
router.get('/create', validate.createPost, controller.create);
router.post('/create', upload.single('thumbnail'), controller.createPost);

module.exports = router;