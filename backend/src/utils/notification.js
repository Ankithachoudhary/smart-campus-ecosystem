const { getIO } = require('../config/socket');

exports.notifyUser = (userId, notification) => {
  try {
    const io = getIO();
    io.to(`user_${userId}`).emit('notification', notification);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

exports.notifyRole = (role, notification) => {
  try {
    const io = getIO();
    io.to(`role_${role}`).emit('notification', notification);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
  }
};

exports.notifyAll = (notification) => {
  try {
    const io = getIO();
    io.emit('notification', notification);
  } catch (error) {
    console.error('Error broadcasting to all:', error);
  }
};
