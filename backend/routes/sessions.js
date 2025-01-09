const router = require('express').Router();
const auth = require('../middleware/auth');
const Session = require('../models/Session');

// Create new session
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating new session:', req.body);
    console.log('User ID:', req.user.user.id);

    const { activity, startTime, endTime, duration } = req.body;

    const session = new Session({
      userId: req.user.user.id,
      activity,
      startTime,
      endTime,
      duration,
    });

    await session.save();
    console.log('Session saved successfully:', session);

    res.json(session);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ message: 'Error creating session', error: err.message });
  }
});

// Get all sessions for user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching sessions for user:', req.user.user.id);

    const sessions = await Session.find({ userId: req.user.user.id }).sort({ startTime: -1 });

    console.log('Found sessions:', sessions);
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
});

module.exports = router;
