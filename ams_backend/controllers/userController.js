const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);  // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
// Create user with photo upload
exports.createUser = [
  upload.single('profilePhoto'),  // Correct usage of multer middleware
  async (req, res) => {
    console.log('API working');
    const { name, email, password, role, department, class: classId, dob, idCardId, otherDetails, subject } = req.body;
    console.log(req.body);
    console.log(req.file);

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const departmentId = department === '' ? null : department;
      const classObjId = classId === '' ? null : classId;
      const subjectObjId = subject === '' ? null : subject;   
      // Create user first to get the userId
      user = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        department: departmentId,
        class: classObjId,
        Subject :subjectObjId,
        dob,
        idCardId,
        subject,
        otherDetails,
      });

      await user.save();

      // Save file with userId as filename if a file is uploaded
      if (req.file) {
        const newFileName = `uploads/${user._id}${path.extname(req.file.originalname)}`;
        fs.renameSync(req.file.path, newFileName);
        user.profilePhoto = newFileName;
        await user.save();
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error: ' + JSON.stringify(err));
    }
  }
];
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('department').populate('class').populate('subject');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('department').populate('class').populate('subject');
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update user
exports.updateUser = [
  upload.single('profilePhoto'),  // Handle file upload if updating profile photo
  async (req, res) => {
    const { name, email, password, role, department, class: classId, dob, idCardId, otherDetails,subject  } = req.body;
   console.log(req.body);
   
    try {
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');

      // Update fields if provided
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.department = department || user.department;
      user.class = classId || user.class;
      user.dob = dob || user.dob;
      user.idCardId = idCardId || user.idCardId;
      user.otherDetails = otherDetails || user.otherDetails;
      user.subject = subject || user.subject;
      // Update password only if provided
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      // Handle profile photo update
      if (req.file) {
        const newFileName = `uploads/${user._id}${path.extname(req.file.originalname)}`;
        fs.renameSync(req.file.path, newFileName);
        user.profilePhoto = newFileName;
      }

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).send('Server Error: ' + err.message);
    }
  }
];

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    console.log(req.params);
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    await User.deleteOne({_id:req.params.id});
    res.json({ msg: 'User removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
