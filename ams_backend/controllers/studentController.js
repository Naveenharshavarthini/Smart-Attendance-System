const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class department');
    res.json(students);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class department');
    if (!student) return res.status(404).send('Student not found');
    res.json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');

    await student.remove();
    res.json({ msg: 'Student removed' });
  } catch (err) {
    res.status(500).send('Server Error');0
  }
};
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const geolib = require('geolib');

// Clock-in for attendance
exports.clockIn = async (req, res) => {
  const { studentId, classId, lat, lng } = req.body;  // Student sends location data (lat/lng)
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Only allow clock-in within the first 20 minutes of the hour
  if (currentMinute > 20) {
    return res.status(400).json({ msg: 'Clock-in period has expired for this hour' });
  }

  try {
    // Fetch the class the student belongs to
    const studentClass = await Class.findById(classId);
    if (!studentClass) return res.status(404).json({ msg: 'Class not found' });

    // Check if the student's location is within 20 meters of the class location
    const isWithinRange = geolib.isPointWithinRadius(
      { latitude: lat, longitude: lng },
      { latitude: studentClass.lat, longitude: studentClass.lng },
      20  // 20 meters radius
    );

    // Find the student's attendance for today
    const attendance = await Attendance.findOne({
      student: studentId,
      date: currentTime.toDateString(),
    });

    if (!attendance) {
      // If no attendance for the day, create a new record
      const newAttendance = new Attendance({
        student: studentId,
        date: currentTime.toDateString(),
        class: classId,
        slots: [{
          slot: currentHour,
          status: isWithinRange ? 'Present' : 'Absent',
          clockInTime: currentTime,
        }],
      });
      await newAttendance.save();
      return res.json(newAttendance);
    }

    // If attendance exists for the day, update the relevant slot
    const slotIndex = attendance.slots.findIndex(slot => slot.slot === currentHour);
    if (slotIndex === -1) {
      // If slot for current hour doesn't exist, add it
      attendance.slots.push({
        slot: currentHour,
        status: isWithinRange ? 'Present' : 'Absent',
        clockInTime: currentTime,
      });
    } else {
      // Update existing slot with new clock-in data
      attendance.slots[slotIndex].status = isWithinRange ? 'Present' : 'Absent';
      attendance.slots[slotIndex].clockInTime = currentTime;
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
// Get daily attendance for a student
exports.getDailyAttendance = async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const attendance = await Attendance.findOne({
        student: studentId,
        date: new Date().toDateString()
      });
  
      if (!attendance) {
        return res.json({ msg: 'No attendance records for today' });
      }
  
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  