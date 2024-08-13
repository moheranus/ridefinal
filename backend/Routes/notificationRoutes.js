const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/:username', async (req, res) => {
  try {
    const notifications = await Notification.find({ username: req.params.username, read: false });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router;
