const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const lostItemRoutes = require('./lostItemRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const clubRoutes = require('./clubRoutes');

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/lost-items', lostItemRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/clubs', clubRoutes);

module.exports = router;
