const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, deleteMessage } = require('../controllers/contactController');

// GET messages
router.get('/messages', getMessages);

// POST message
router.post('/sendemail', sendMessage);

// DELETE message
router.delete('/messages/:id', deleteMessage);

module.exports = router;
