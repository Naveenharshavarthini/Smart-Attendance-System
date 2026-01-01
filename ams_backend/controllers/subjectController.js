const Subject = require('../models/Subject');

// Create a new subject
exports.createSubject = async (req, res) => {
  const { name, code, latitude, longitude } = req.body;

  try {
    const subject = new Subject({
      name,
      code,
      latitude,
      longitude
    });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};

// Get a subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};

// Update a subject
exports.updateSubject = async (req, res) => {
  const { name, code, latitude, longitude } = req.body;

  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.latitude = latitude || subject.latitude;
    subject.longitude = longitude || subject.longitude;

    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    await Subject.deleteOne({ _id: req.params.id });
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
};
