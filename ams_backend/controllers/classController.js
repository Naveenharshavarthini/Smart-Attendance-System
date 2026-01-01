const Class = require('../models/Class');

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('department');
    res.json(classes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('department');
    if (!classItem) return res.status(404).send('Class not found');
    res.json(classItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create new class
exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const classItem = await newClass.save();
    res.json(classItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    let classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).send('Class not found');
    
    classItem = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
      const classItem = await Class.findById(req.params.id);
      if (!classItem) {
        return res.status(404).json({ msg: 'Class not found' });
      }
  
      await Class.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Class removed successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
