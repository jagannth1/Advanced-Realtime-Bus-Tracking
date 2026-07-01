const Driver = require('../models/Driver');
const Bus = require('../models/Bus');
const bcrypt = require('bcryptjs');

// Renders the registration page
exports.getRegister = (req, res) => {
    res.render('driver/register', { title: 'Driver Register' });
};

// Handles new driver registration
exports.postRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if driver already exists
        const existingDriver = await Driver.findOne({ username });
        if (existingDriver) {
            // Add error handling feedback later if needed
            return res.redirect('/auth/register');
        }
        const driver = new Driver({ username, password });
        await driver.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during registration.');
    }
};

// Renders the login page
exports.getLogin = (req, res) => {
    res.render('driver/login', { title: 'Driver Login' });
};

// Handles driver login
exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const driver = await Driver.findOne({ username });
        if (!driver) {
            return res.redirect('/auth/login');
        }
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.redirect('/auth/login');
        }
        req.session.isLoggedIn = true;
        req.session.driverId = driver._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during login.');
    }
};

// ** ADVANCED LOGOUT: Stops tracking on logout **
exports.postLogout = async (req, res) => {
    try {
        const driverId = req.session.driverId;
        if (driverId) {
            // Find the bus associated with this driver
            const bus = await Bus.findOne({ driver: driverId });
            if (bus) {
                // Update its tracking status to false
                bus.trackingStarted = false;
                await bus.save();

                // Inform all clients that this bus has stopped tracking
                const io = req.app.get('socketio'); // A way to access io, needs setup in server.js
                // For simplicity, we assume io is globally accessible or passed.
                // A better pattern is to emit from a dedicated service.
                // The current server.js handles this by direct socket calls.
                // This logic is best placed within a socket disconnect event.
                console.log(`Driver ${driverId} logged out, stopping tracking for bus ${bus._id}`);
            }
        }
    } catch (err) {
        console.error("Error during logout cleanup:", err);
    } finally {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Could not log out.");
            }
            res.redirect('/');
        });
    }
};