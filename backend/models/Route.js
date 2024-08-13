const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
});

module.exports = mongoose.model('Route', routeSchema);
