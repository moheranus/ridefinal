const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'NebyatAhmed21@gmail.com', // Your website's Gmail address
    pass: 'nvel ufry bkso lrhq'    // Your Gmail password
  },
  tls: {
    rejectUnauthorized: false // This will allow self-signed certificates
  }
});

exports.createBooking = async (req, res) => {
  try {
    // console.log('Request Body:', req.body);
    const booking = await Booking.create(req.body);

    const mailOptions = {
      from: '"johnwayneShuttle 👻" NebyatAhmed21@Gmail.com',
      to: 'danielshobe90@gmail.com',
      subject: 'New Booking Received',
      text: `A new booking has been made:
             Trip Type: ${booking.tripType}
             Pickup Address: ${booking.pickupAddress}
             Dropoff Address: ${booking.dropoffAddress}
             Pickup Date: ${booking.pickupDate}
             Pickup Time: ${booking.pickupTime}
             Service Type: ${booking.serviceType}
             Total Price: ${booking.totalPrice}
             Guest Name: ${booking.guestName}
             Guest Email: ${booking.guestEmail}
             Guest Phone: ${booking.guestPhone}
             Guest Address: ${booking.guestAddress}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Booking created but failed to send email', Booking });
      }

      console.log('Email sent: ' + info.response);

      res.status(201).json({ message: 'Booking created successfully and email sent', Booking });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

let lastChecked = new Date();

exports.getNewBookings = async (req, res) => {
    try {
        const newBookings = await Booking.find({ createdAt: { $gt: lastChecked } });
        lastChecked = new Date();
        res.status(200).json(newBookings);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching new bookings' });
    }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'approved';
    await booking.save();

    // Send notification email to user
    const mailOptions = {
      from: `"johnwayneShuttle 👻" <${process.env.GMAIL_USER}>`,
      to: booking.guestEmail, // Make sure this is correct
      subject: 'Your Booking is Approved',
      text: `Dear ${booking.guestName},
             Your booking for ${booking.serviceType} from ${booking.pickupAddress}, to ${booking.dropoffAddress}, ${booking.airportName}, ${booking.vehicleName} on ${booking.pickupDate} at ${booking.pickupTime} has been approved.
             Thank you for choosing our service!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Booking approved but failed to send email', booking });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Booking approved successfully and email sent', booking });
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ error: 'Error approving booking' });
  }
};


exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'rejected';
    await booking.save();
    // send notification email to user
    const mailOptions={
      from: `"johnwayneShuttle 👻" <${process.env.GMAIL_USER}>`,
      to: booking.guestEmail,
      subject: 'Your Booking is Rejected',
      text: `Dear ${booking.guestName},
             Your booking for $${booking.serviceType}, from ${booking.pickupAddress}, to ${booking.dropoffAddress}, ${booking.airportName},${booking.vehicleName} on ${booking.pickupDate} at ${booking.pickupTime} has been rejected.
             Please contact us for more information.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Booking rejected but failed to send email', booking });
      }
      console.log('Email sent: ' + info.response);
    });
    res.status(200).json({ message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting booking' });
  }
};