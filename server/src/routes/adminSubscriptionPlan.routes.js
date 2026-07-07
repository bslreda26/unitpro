const express = require('express');
const {
  listAdmin,
  create,
  update,
  remove,
} = require('../controllers/subscriptionPlan.controller');
const { requireAuth, requirePermission } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(requireAuth, requirePermission('manage_subscriptions'));

router.get('/', listAdmin);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
