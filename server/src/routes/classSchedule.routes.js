const express = require('express');
const { listPublic } = require('../controllers/classSchedule.controller');

const router = express.Router();

router.get('/', listPublic);

module.exports = router;
