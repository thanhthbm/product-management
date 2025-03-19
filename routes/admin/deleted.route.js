const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/deleted.controller');

router.get('/', controller.deleted);
router.patch('/restore/:id', controller.restore);

module.exports = router;