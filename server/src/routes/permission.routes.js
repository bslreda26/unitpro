const express = require('express');
const { list } = require('../controllers/permission.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, requireRole('super_admin'), list);

module.exports = router;
