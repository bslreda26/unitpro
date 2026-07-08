const express = require('express');
const {
  listAdmin,
  create,
  update,
  remove,
} = require('../controllers/classSchedule.controller');
const { requireAuth, requirePermission } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth, requirePermission('manage_courses'));

router.get('/', listAdmin);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
