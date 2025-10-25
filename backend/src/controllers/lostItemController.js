const LostItem = require('../models/LostItem');
const { notifyRole } = require('../utils/notification');

exports.getAllLostItems = async (req, res) => {
  try {
    const { category, status, limit = 10, page = 1 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await LostItem.find(filter)
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LostItem.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('claimedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.reportLostItem = async (req, res) => {
  try {
    req.body.reportedBy = req.user.id;
    req.body.contactInfo = {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    };

    const item = await LostItem.create(req.body);

    notifyRole('admin', {
      type: 'lost_item',
      message: `New lost item: ${item.title}`,
      data: item
    });

    res.status(201).json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateLostItem = async (req, res) => {
  try {
    let item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    item = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Item already claimed'
      });
    }

    item.claimedBy = req.user.id;
    item.claimDate = Date.now();
    item.status = 'claimed';
    await item.save();

    res.status(200).json({
      success: true,
      message: 'Claim submitted',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await LostItem.find({ reportedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
