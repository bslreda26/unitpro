const express = require('express');
const { getAdmin, update } = require('../controllers/contactInfo.controller');
const { requireAuth, requirePermission } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth, requirePermission('manage_settings'));

router.get('/', getAdmin);
router.patch('/', update);

module.exports = router;
