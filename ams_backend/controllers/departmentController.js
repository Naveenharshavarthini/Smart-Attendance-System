const Department = require('../models/Department');

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
      const departments = await Department.find();
      res.json(departments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  
  // Get department by ID
  exports.getDepartmentById = async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) return res.status(404).json({ msg: 'Department not found' });
      res.json(department);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  
  // Create new department
  exports.createDepartment = async (req, res) => {
    try {
      const newDepartment = new Department(req.body);
      const department = await newDepartment.save();
      res.json(department);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  
  // Update department
  exports.updateDepartment = async (req, res) => {
    try {
      let department = await Department.findById(req.params.id);
      if (!department) return res.status(404).json({ msg: 'Department not found' });
      
      department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(department);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (!department) return res.status(404).json({ msg: 'Department not found' });
  
      res.json({ msg: 'Department removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error',err });
    }
  };
  
