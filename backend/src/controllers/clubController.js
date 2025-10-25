const Club = require('../models/Club');

exports.getAllClubs = async (req, res) => {
  try {
    const { category, isActive = true } = req.query;
    
    const filter = { isActive };
    if (category) filter.category = category;

    const clubs = await Club.find(filter)
      .populate('president', 'name email department')
      .populate('vicePresident', 'name email')
      .populate('facultyCoordinator', 'name email department')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: clubs.length,
      clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'name email department studentId')
      .populate('vicePresident', 'name email department')
      .populate('facultyCoordinator', 'name email department')
      .populate('members.user', 'name email department studentId');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.status(200).json({
      success: true,
      club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);

    res.status(201).json({
      success: true,
      club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateClub = async (req, res) => {
  try {
    let club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    if (req.user.role !== 'admin' && club.president.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    await club.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Club deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const isMember = club.members.some(
      member => member.user.toString() === req.user.id
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member'
      });
    }

    club.members.push({ user: req.user.id, role: 'member' });
    await club.save();

    res.status(200).json({
      success: true,
      message: 'Joined club successfully',
      club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    club.members = club.members.filter(
      member => member.user.toString() !== req.user.id
    );

    await club.save();

    res.status(200).json({
      success: true,
      message: 'Left club successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyClubs = async (req, res) => {
  try {
    const clubs = await Club.find({
      $or: [
        { president: req.user.id },
        { vicePresident: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    res.status(200).json({
      success: true,
      count: clubs.length,
      clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
