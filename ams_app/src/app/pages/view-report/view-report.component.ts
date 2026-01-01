import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss',
})
export class ViewReportComponent implements OnInit {
  selectedYear: number;
  selectedMonth: number;
  availableYears: number[] = [];
  months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];
  attendanceData: any[] = [];
  backendUrl = 'http://localhost:5001/api/attendance'; // Adjust according to your backend

  userId: string = '';
  userRole: string = '';
  classId: string = '';
  departmentId: string = '';
  userSubjectId: string = '';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private masterService: MasterService // Ensure MasterService is injected
  ) {
    // Initialize available years dynamically (last 5 years)
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Default selection
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }

  ngOnInit() {
    this.loadUserData(); // Load user role from localStorage first

    this.route.params.subscribe((params) => {
      const classId = params['classId'];
      const userId = params['userId'];

      console.log('Extracted Params:', classId, userId);
      console.log('User Role:', this.userRole);

      if (this.userRole.toLowerCase() != 'Student' && classId && userId) {
        this.getAttendanceData(classId, userId);
      } else {
        this.updateReport();
      }
    });
  }

  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user._id || '';
      this.userRole = user.role || '';
      this.classId = user.class || '';
      this.departmentId = user.department || '';
      this.userSubjectId = user.subject || '';
    }

    console.log('User Data Loaded:', this.userRole, this.classId, this.departmentId);
  }

  updateReport() {
    if (this.userRole === 'Staff') {
      this.getAttendanceData('', this.userId);
    } else if (this.userRole === 'Student') {
      this.getAttendanceData(this.classId, this.userId);
    }
  }

  getAttendanceData(classId: string, userId: string) {
    const params = {
      userId: userId,
      classId: classId,
      year: this.selectedYear,
      month: this.selectedMonth + 1, // Convert from 0-indexed month
    };
  
    this.masterService.getAttendanceReport(params).subscribe(
      (data) => {
        console.log('Attendance Report:', data);
        this.attendanceData = data;
      },
      (error) => {
        console.error('Error fetching attendance report:', error);
      }
    );
  }

  processAttendanceData(data: any[]) {
    const subjectAttendance = new Map();

    data.forEach((record) => {
        const subjectId = record.subject?._id || record.subject;
        const subjectName = record.subject?.name || 'Unnamed Subject';

        if (!subjectAttendance.has(subjectId)) {
            subjectAttendance.set(subjectId, {
                subject: subjectName,
                totalClasses: 0,
                conducted: 0,
                attended: 0,
                missed: 0,
                remaining: 0,
                attendancePercentage: "0.00",
                predictedPercentage: "0.00",
            });
        }

        const subjectData = subjectAttendance.get(subjectId);
        subjectData.totalClasses += 1;
        if (record.clockInTime < new Date()) {
            subjectData.conducted += 1;
            if (record.status === 'Present') {
                subjectData.attended += 1;
            }
        }
    });

    subjectAttendance.forEach((record) => {
        record.missed = record.conducted - record.attended;
        record.remaining = record.totalClasses - record.conducted;

        record.attendancePercentage = record.conducted > 0 
            ? ((record.attended / record.conducted) * 100).toFixed(2) 
            : "0.00";
        
        record.predictedPercentage = record.totalClasses > 0 
            ? (((record.attended + record.remaining) / record.totalClasses) * 100).toFixed(2)
            : "0.00";
    });

    this.attendanceData = Array.from(subjectAttendance.values());
}


}
