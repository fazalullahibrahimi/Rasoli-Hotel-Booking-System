const express = require('express');
const Hotel = require('../models/Hotel');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Public route to get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.send(hotels);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Public route to get a specific hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).send({ error: 'Hotel not found' });
    }
    res.send(hotel);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Admin-only routes
router.post('/', adminAuth, async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).send(hotel);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(404).send({ error: 'Hotel not found' });
    }
    res.send(hotel);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).send({ error: 'Hotel not found' });
    }
    res.send({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
