    const Attendance = require('../models/attendance.model');
    const User = require('../models/User');
    const Timetable = require('../models/Timetable');
    // Clock-In Attendance
    exports.clockIn = async (req, res) => {
        try {
            const { userId, studentLatitude, studentLongitude, idCard ,clockInTime,subject} = req.body;

            // Fetch user details
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
             console.log(req.body);
             
            // Create a new attendance record
            const attendance = new Attendance({
                userId: user._id,
                name: user.name,
                class: user.class,
                department: user.department,
                clockInTime,
                studentLatitude,
                studentLongitude,
                idCard,
                status: 'Present', // Can update this field later based on your logic
                createOndate: new Date(),
                subject
            });

            await attendance.save();
            res.status(201).json({ message: 'Attendance recorded', attendance });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    };

    // Get Attendance Records
exports.getAttendance = async (req, res) => {
    console.log('getAttendance called'); // Log call to this function
   const { userId, classId, departmentId,subjectId,year, month  } = req.body.params;

    try {
        console.log(req.body);
        
        const query = {};
        if (userId) query.userId = userId; // Filter by user ID
        if (classId) query.class = classId; // Filter by class ID
        if (departmentId) query.department = departmentId; // Filter by department ID
        if (subjectId) query.subject = subjectId; // Filter by subjectId ID
         // Filter by Month & Year
         if (year && month !== undefined) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            query.clockInTime = { $gte: startDate, $lte: endDate };
        }
          console.log(query);
          
        const attendanceRecords = await Attendance.find(query).sort({ clockInTime: -1 }); // Sort by latest clock in
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error in getAttendance:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error retrieving attendance records: ' + error.message });
    }
};



exports.getAttendanceReport = async (req, res) => {
    console.log('getAttendanceReport called');
    const { userId, classId, year, month } = req.body.params;

    try {
        console.log("Request Params:", req.body.params);

        // Fetch Timetable for the class
        const timetable = await Timetable.findOne({ class: classId }).populate('schedule.slots.subject');
        console.log("Timetable:", timetable);

        if (!timetable) {
            return res.status(404).json({ error: 'Timetable not found' });
        }

        // Initialize Subject Slots Data
        const subjectSlots = {};
        timetable.schedule.forEach((day) => {
            day.slots.forEach((slot) => {
                const subjectId = slot.subject._id.toString();
                if (!subjectSlots[subjectId]) {
                    subjectSlots[subjectId] = {
                        subject: slot.subject.name,
                        totalClasses: 0,
                        conducted: 0,
                        attended: 0,
                        _id:subjectId
                    };
                }
                subjectSlots[subjectId].totalClasses += 1;
            });
        });

        // Fetch attendance records for the user in the given month/year
        let query = { userId, class: classId.toString() }; // Convert classId to string
        console.log("Query before date filter:", query);

        if (year && month !== undefined) {
            const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
            const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
            query.clockInTime = { $gte: startDate, $lte: endDate };
        }
        

        console.log("Final Query:", query);

        const attendanceRecords = await Attendance.find(query).populate('subject');
        console.log("Attendance Records:", attendanceRecords);

        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this user in the given time period." });
        }
        attendanceRecords.forEach(record => {
            console.log("Debug Record:", record);
            console.log("userId:", record.userId ? record.userId.toString() : "undefined");
            console.log("class:", record.class ? record.class.toString() : "undefined");
            console.log("clockInTime:", record.clockInTime ? record.clockInTime.toString() : "undefined");
            console.log("subject:", record.subject ? JSON.stringify(record.subject) : "undefined");
        });
        // Count attended slots per subject
        attendanceRecords.forEach((record) => {
            const subjectId = record.subject && record.subject._id 
                ? record.subject._id.toString() 
                : (record.subject ? record.subject.toString() : "undefined");
        
            if (subjectId !== "undefined" && subjectSlots[subjectId] && record.status.toLowerCase() === "present") {
                subjectSlots[subjectId].attended += 1;
            }
        });
        // Calculate attendance percentage
        const today = new Date().getDate(); // Today's date (e.g., 17 for March 17)
        const totalDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // Days in month (e.g., 31 for March)
        
        const attendanceData = Object.values(subjectSlots).map((subject) => {
            const totalClasses = subject.totalClasses || 0;   // Total classes in the month (e.g., 16)
            const conducted = Math.round((today / totalDaysInMonth) * totalClasses); // Conducted till today
            const attended = subject.attended || 0;           // Attended classes
            const remaining = totalClasses - conducted;       // Future classes after today
        
            return {
                subjectId: subject._id?.toString() || "",
                subject: subject.subject,
                totalClasses,
                conducted,
                attended,
                remaining,
                attendancePercentage: conducted > 0 
                    ? ((attended / conducted) * 100).toFixed(2) 
                    : "0.00",
                predictedPercentage: totalClasses > 0
                    ? (((attended + remaining) / totalClasses) * 100).toFixed(2)
                    : "0.00",
            };
        });
        
        

        console.log("Final Attendance Report:", attendanceData);

        res.status(200).json(attendanceData);
    } catch (error) {
        console.error('Error in getAttendanceReport:', error);
        res.status(500).json({ error: 'Error retrieving attendance report: ' + error.message });
    }
};
