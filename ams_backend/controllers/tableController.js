const Table = require('../models/Table');

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().populate('class');
    res.json(tables);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('class');
    if (!table) return res.status(404).send('Table not found');
    res.json(table);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create new table
exports.createTable = async (req, res) => {
  try {
    const newTable = new Table(req.body);
    const table = await newTable.save();
    res.json(table);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update table
exports.updateTable = async (req, res) => {
  try {
    let table = await Table.findById(req.params.id);
    if (!table) return res.status(404).send('Table not found');

    table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(table);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).send('Table not found');

    await table.remove();
    res.json({ msg: 'Table removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
