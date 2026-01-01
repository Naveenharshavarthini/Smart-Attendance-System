const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Staff adds student
exports.addStudent = async (req, res) => {
  const { name, email, password, classId, department,  idCardId, otherDetails } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'Student',
      class: classId,
      department,
      
      idCardId,
      otherDetails
    });

    await newUser.save();
    res.json({ msg: 'Student added' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
