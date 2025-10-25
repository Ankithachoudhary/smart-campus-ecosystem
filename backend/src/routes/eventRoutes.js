const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.post('/', auth.protect, auth.authorize('faculty', 'admin'), eventController.createEvent);
router.put('/:id', auth.protect, auth.authorize('faculty', 'admin'), eventController.updateEvent);
router.delete('/:id', auth.protect, auth.authorize('faculty', 'admin'), eventController.deleteEvent);
router.post('/:id/register', auth.protect, eventController.registerForEvent);
router.post('/:id/unregister', auth.protect, eventController.unregisterFromEvent);

module.exports = router;
