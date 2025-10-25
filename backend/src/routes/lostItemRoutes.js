const express = require('express');
const router = express.Router();
const lostItemController = require('../controllers/lostItemController');
const auth = require('../middleware/auth');

router.get('/', lostItemController.getAllLostItems);
router.get('/my-items', auth.protect, lostItemController.getMyItems);
router.get('/:id', lostItemController.getLostItem);
router.post('/', auth.protect, lostItemController.reportLostItem);
router.put('/:id', auth.protect, lostItemController.updateLostItem);
router.delete('/:id', auth.protect, lostItemController.deleteLostItem);
router.post('/:id/claim', auth.protect, lostItemController.claimItem);

module.exports = router;
