const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

router.get('/', auth.protect, feedbackController.getAllFeedback);
router.get('/:id', auth.protect, feedbackController.getFeedback);
router.post('/', auth.protect, feedbackController.submitFeedback);
router.put('/:id/status', auth.protect, auth.authorize('faculty', 'admin'), feedbackController.updateFeedbackStatus);
router.post('/:id/response', auth.protect, auth.authorize('faculty', 'admin'), feedbackController.addAdminResponse);
router.post('/:id/upvote', auth.protect, feedbackController.upvoteFeedback);
router.delete('/:id', auth.protect, feedbackController.deleteFeedback);

module.exports = router;
