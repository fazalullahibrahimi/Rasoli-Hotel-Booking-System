const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/:hotelId', auth, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).send({ error: 'Hotel not found' });
    }

    const { checkInDate, checkOutDate } = req.body;
    const totalPrice =
      (hotel.pricePerNight * (new Date(checkOutDate) - new Date(checkInDate))) /
      (1000 * 60 * 60 * 24);

    const booking = new Booking({
      userId: req.user._id,
      hotelId: hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate(
      'hotelId'
    );
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send({ error: 'Booking not found' });
    }

    // Check if the user is an admin or the booking owner
    if (
      req.user.role !== 'admin' &&
      booking.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .send({ error: 'Not authorized to cancel this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.send({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Admin-only route to view all bookings
router.get('/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')
      .populate('hotelId');
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
