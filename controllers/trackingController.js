

// controllers/trackingController.js
const Bus = require('../models/Bus');

exports.getHomePage = async (req, res) => {
    try {
        const buses = await Bus.find().populate('driver', 'username');
        res.render('index', { title: 'All Buses', buses });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getTrackingPage = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);
        if (!bus) return res.status(404).send('Bus not found');
        res.render('track', { title: `Tracking ${bus.busNumber}`, bus: bus });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};