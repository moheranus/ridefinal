const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tripType: { type: String },
  pickupAddress: { type: String },
  returnPickupAddress: { type: String },
  dropoffAddress: { type: String },
  returnDropoffAddress: { type: String },
  numberOfPassengers: { type: Number },
  pickupDate: { type: Date, required: true },
  returnPickupDate: { type: Date },
  pickupTime: { type: String, required: true },
  returnPickupTime: { type: String },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  vehicleName: { type: String, required: true },
  image: { type: String, required: true },
  dropoffDate: { type: Date },
  serviceType: { type: String },
  totalPrice: { type: Number, required: true },
  airportName: { type: String },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true, match: /.+\@.+\..+/ },
  guestPhone: { type: String, required: true, match: /^[0-9]{10}$/ },
  guestAddress: { type: String, required: true },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  },
  chooseCar: { type: String },
  hotelName: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
