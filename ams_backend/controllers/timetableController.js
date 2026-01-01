const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// Create Timetable
router.post('/api/timetable', async (req, res) => {
    const { classId, departmentId, schedule } = req.body;
  
    try {
      // Check if a timetable already exists for this class
      const existingTimetable = await Timetable.findOne({ class: classId });
      if (existingTimetable) {
        return res.status(400).json({ message: 'Timetable for this class already exists' });
      }
  
      // Create a new timetable
      const newTimetable = new Timetable({
        class: classId,
       // department: departmentId,
        schedule,
      });
  
      await newTimetable.save();
  
      res.status(201).json({ message: 'Timetable created successfully', timetable: newTimetable });
    } catch (error) {
      console.error('Error creating timetable:', error);
      res.status(500).json({ message: 'Failed to create timetable' });
    }
  });
  

// Get All Timetables
router.get('/api/timetable', async (req, res) => {
  try {
    const timetables = await Timetable.find()
    .populate({
        path: 'class',
        populate: { path: 'department' }  // Nested populate if class has department ref
      })
    //   .populate('class.department')
      .populate('schedule.slots.subject')
    //  .populate('department');
    res.json(timetables);
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ message: 'Failed to fetch timetables' });
  }
});

// Get Timetable by Timetable ID
// Get Timetable by Timetable ID or Class ID
router.get('/api/timetable/:id', async (req, res) => {
    try {
        let timetable = await Timetable.findById(req.params.id)
            .populate({
                path: 'class',
                populate: { path: 'department' }  // Nested populate if class has department ref
            })
            .populate('schedule.slots.subject');

        // If not found by timetable ID, find by class ID
        if (!timetable) {
            timetable = await Timetable.findOne({ class: req.params.id })
                .populate({
                    path: 'class',
                    populate: { path: 'department' }
                })
                .populate('schedule.slots.subject');
        }

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: 'Failed to fetch timetable' });
    }
});


// Delete Timetable by ID
router.delete('/api/timetable/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable:', error);
    res.status(500).json({ message: 'Failed to delete timetable' });
  }
});
// Update Timetable by ID
router.put('/api/timetable/:id', async (req, res) => {
    const { id } = req.params;
    const { classId, departmentId, schedule } = req.body;
  
    try {
      // Find timetable by ID and update
      const updatedTimetable = await Timetable.findByIdAndUpdate(
        id,
        {
          class: classId,
        //   department: departmentId,
          schedule
        },
        { new: true }
      );
  
      if (!updatedTimetable) {
        return res.status(404).json({ message: 'Timetable not found' });
      }
  
      res.json({ message: 'Timetable updated successfully', updatedTimetable });
    } catch (error) {
      console.error('Error updating timetable:', error);
      res.status(500).json({ message: 'Failed to update timetable' });
    }
  });
  
module.exports = router;
