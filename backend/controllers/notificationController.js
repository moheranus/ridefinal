const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const notifications = await Notification.find({ userEmail, isRead: false });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

exports.createNotification = async (req, res) => {
  const { userEmail, message } = req.body;
  if (!userEmail || !message) {
    return res.status(400).json({ error: 'userEmail and message are required' });
  }

  try {
    const notification = new Notification({ userEmail, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: 'Error creating notification' });
  }
};
