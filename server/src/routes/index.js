const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const permissionRoutes = require('./permission.routes');
const subscriptionPlanRoutes = require('./subscriptionPlan.routes');
const adminSubscriptionPlanRoutes = require('./adminSubscriptionPlan.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/subscription-plans', subscriptionPlanRoutes);
router.use('/admin/subscription-plans', adminSubscriptionPlanRoutes);

module.exports = router;
