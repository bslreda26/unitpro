const express = require('express');
const { listPublic } = require('../controllers/subscriptionPlan.controller');

const router = express.Router();

router.get('/', listPublic);

module.exports = router;
