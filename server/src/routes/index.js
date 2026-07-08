const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const permissionRoutes = require('./permission.routes');
const subscriptionPlanRoutes = require('./subscriptionPlan.routes');
const adminSubscriptionPlanRoutes = require('./adminSubscriptionPlan.routes');
const contactInfoRoutes = require('./contactInfo.routes');
const adminContactInfoRoutes = require('./adminContactInfo.routes');
const groupClassRoutes = require('./groupClass.routes');
const adminGroupClassRoutes = require('./adminGroupClass.routes');
const classScheduleRoutes = require('./classSchedule.routes');
const adminClassScheduleRoutes = require('./adminClassSchedule.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/subscription-plans', subscriptionPlanRoutes);
router.use('/admin/subscription-plans', adminSubscriptionPlanRoutes);
router.use('/contact-info', contactInfoRoutes);
router.use('/admin/contact-info', adminContactInfoRoutes);
router.use('/group-classes', groupClassRoutes);
router.use('/admin/group-classes', adminGroupClassRoutes);
router.use('/class-schedule', classScheduleRoutes);
router.use('/admin/class-schedule', adminClassScheduleRoutes);

module.exports = router;
