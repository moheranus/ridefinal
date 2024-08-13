const Contact = require('../models/ContactMessage');

// Get all messages
const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const newMessage = new Contact({ name, email, subject, message });
        await newMessage.save();
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a message
const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getMessages,
    sendMessage,
    deleteMessage,
};
