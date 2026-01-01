const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Check for default admin credentials
      if (email === 'admin@admin.com' && password === 'admin') {
        const payload = { user: { id: 'admin', role: 'admin' } }; // Dummy ID for admin
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, user: payload.user }); // Include user details
      }
  
      // Proceed with regular user authentication
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const payload = { user: user };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
       res.json({ token, user: payload.user }); // Include user details
    } catch (err) {
        console.log(err)
      res.status(500).send('Server Error',err);
    }
  };

// Forgot password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Implement password reset logic (email sending, etc.)
    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
