const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Admin adds staff
exports.addStaff = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'Staff',
      department
    });

    await newUser.save();
    res.json({ msg: 'Staff member added' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
