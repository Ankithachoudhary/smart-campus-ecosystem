const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const auth = require('../middleware/auth');

router.get('/', clubController.getAllClubs);
router.get('/my-clubs', auth.protect, clubController.getMyClubs);
router.get('/:id', clubController.getClub);
router.post('/', auth.protect, auth.authorize('admin'), clubController.createClub);
router.put('/:id', auth.protect, clubController.updateClub);
router.delete('/:id', auth.protect, auth.authorize('admin'), clubController.deleteClub);
router.post('/:id/join', auth.protect, clubController.joinClub);
router.post('/:id/leave', auth.protect, clubController.leaveClub);

module.exports = router;
