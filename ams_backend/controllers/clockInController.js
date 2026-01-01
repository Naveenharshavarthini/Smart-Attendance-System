const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const geolib = require('geolib'); // Use geolib for location distance calculations

exports.clockIn = async (req, res) => {
  const { studentId, classId, lat, lng } = req.body;
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Only allow clock-in within the first 20 minutes of the hour
  if (currentMinute > 20) {
    return res.status(400).json({ msg: 'Clock-in period has expired for this hour' });
  }

  try {
    const studentClass = await Class.findById(classId);
    if (!studentClass) return res.status(404).json({ msg: 'Class not found' });

    // Check if the student's location is within 20 meters of the class location
    const isWithinRange = geolib.isPointWithinRadius(
      { latitude: lat, longitude: lng },
      { latitude: studentClass.lat, longitude: studentClass.lng },
      20 // 20 meters
    );

    const attendance = await Attendance.findOne({
      student: studentId,
      date: currentTime.toDateString(),
    });

    if (!attendance) {
      // Create attendance record for the day if not present
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

    // Update the existing attendance record for the current slot
    const slotIndex = attendance.slots.findIndex(slot => slot.slot === currentHour);
    if (slotIndex === -1) {
      // If slot for the current hour doesn't exist, add it
      attendance.slots.push({
        slot: currentHour,
        status: isWithinRange ? 'Present' : 'Absent',
        clockInTime: currentTime,
      });
    } else {
      // If slot already exists, update the status (optional)
      attendance.slots[slotIndex].status = isWithinRange ? 'Present' : 'Absent';
      attendance.slots[slotIndex].clockInTime = currentTime;
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
