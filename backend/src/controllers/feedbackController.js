const Feedback = require('../models/Feedback');
const { notifyRole, notifyUser } = require('../utils/notification');

exports.getAllFeedback = async (req, res) => {
  try {
    const { category, status, limit = 10, page = 1 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (req.user.role === 'student') {
      filter.submittedBy = req.user.id;
    }

    const feedbacks = await Feedback.find(filter)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Feedback.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('submittedBy', 'name email department')
      .populate('assignedTo', 'name email');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (req.user.role === 'student' && feedback.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    req.body.submittedBy = req.user.id;
    const feedback = await Feedback.create(req.body);

    notifyRole('admin', {
      type: 'new_feedback',
      message: `New feedback: ${feedback.title}`,
      data: feedback
    });

    res.status(201).json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    notifyUser(feedback.submittedBy, {
      type: 'feedback_update',
      message: `Feedback status: ${status}`,
      data: feedback
    });

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addAdminResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback.adminResponse = {
      message,
      respondedBy: req.user.id,
      respondedAt: Date.now()
    };

    await feedback.save();

    notifyUser(feedback.submittedBy, {
      type: 'feedback_response',
      message: 'Admin responded to your feedback',
      data: feedback
    });

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.upvoteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const hasUpvoted = feedback.upvotes.includes(req.user.id);

    if (hasUpvoted) {
      feedback.upvotes = feedback.upvotes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      feedback.upvotes.push(req.user.id);
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      message: hasUpvoted ? 'Upvote removed' : 'Upvoted',
      upvotes: feedback.upvotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (feedback.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
