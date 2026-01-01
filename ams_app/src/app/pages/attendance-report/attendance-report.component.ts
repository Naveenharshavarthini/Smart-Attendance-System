// src/app/attendance-report/attendance-report.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../services/master.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {
  attendanceList: any[] = [];
  filteredAttendanceList: any[] = [];
  classes: any[] = [];
  departments: any[] = [];
  selectedClass: string = '';
  selectedDepartment: string = '';
  selectedStaff: string = '';
  users:any=[];
  staffs: any[] = [];
  subjects: any[] = [];
selectedSubject: string = '';
user:any= null;
  constructor(private masterService: MasterService, private router: Router,private userService :UserService) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadDepartments();
    this.loadUsers();
    this.loadSubjects();  // Load subjects
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
      this.loadAttendanceList();
  }
  loadSubjects(): void {
    this.masterService.getAllSubjects().subscribe((data: any[]) => {
      this.subjects = data;
    });
  }
  loadAttendanceList(): void {
    let obj={userId :this.user.role == 'Student'?this.user._id:null, subjectId:this.user.role == 'Staff' ? this.user.subject : null}
    console.log(obj);
    
    this.masterService.getAttendance(obj).subscribe((data: any[]) => {
      this.attendanceList = data;
    //  this.filteredAttendanceList = data; // Initialize filtered list
    });
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.staffs = data.filter((user:any) => user.role === 'Staff');
    });
  }
  loadClasses(): void {
    this.masterService.getClasses().subscribe((data: any[]) => {
      this.classes = data;
    });
  }

  loadDepartments(): void {
    this.masterService.getDepartments().subscribe((data: any[]) => {
      this.departments = data;
      setTimeout(() => {
        this.getdepartment()
      }, 500);
    });
  }
getclass(id:any){
  let cls = this.classes.find((cls:any)=>cls._id == id);  
  return cls ? cls.className :  '-';
}
getdepartment(){
  let newarr = this.attendanceList.filter((att: any, index: number, self: any[]) =>
    index === self.findIndex((t) => att.userId === t.userId));
    console.log(newarr);
    newarr.forEach((element: any) => {
      element['totalPresent'] = this.attendanceList.filter((att: any) => att.userId === element.userId && att.status === 'Present').length
    });
 this.filteredAttendanceList = newarr;
//this.filterAttendance()
  
}
  filterAttendance(): void {
    console.log( this.selectedClass);
    console.log( this.selectedDepartment);
    console.log("filteredAttendanceList==>",this.filteredAttendanceList);
    this.getdepartment()
    if(!this.selectedClass && !this.selectedDepartment ){
      this.filteredAttendanceList = this.filteredAttendanceList;
    //  this.getdepartment()
      return;
    }
    if(this.selectedClass && !this.selectedDepartment){
      this.filteredAttendanceList = this.filteredAttendanceList.filter(attendance => attendance.class === this.selectedClass);
    //  this.getdepartment()
      return;
    }
    if(!this.selectedClass && this.selectedDepartment ){
      this.filteredAttendanceList = this.filteredAttendanceList.filter(attendance => attendance.department === this.selectedDepartment);
     // this.getdepartment()
      return;
    }
    if(this.selectedClass && this.selectedDepartment ){
      this.filteredAttendanceList = this.filteredAttendanceList.filter(attendance => attendance.class === this.selectedClass && attendance.department === this.selectedDepartment);
     // this.getdepartment()
      return;
    }
   
    // this.filteredAttendanceList = this.filteredAttendanceList.filter(attendance => {
    //   const matchesClass = this.selectedClass ? attendance.class === this.selectedClass : true;
    //   const matchesDepartment = this.selectedDepartment ? attendance.department === this.selectedDepartment : true;
    // //  const matchesStaff = this.selectedStaff ? attendance.staffId === this.selectedStaff : true;
    //   return matchesClass && matchesDepartment ;
    // });
    this.filteredAttendanceList = this.attendanceList.filter(attendance => {
      const matchesClass = this.selectedClass ? attendance.class === this.selectedClass : true;
      const matchesDepartment = this.selectedDepartment ? attendance.department === this.selectedDepartment : true;
      const matchesSubject = this.selectedSubject ? attendance.subject === this.selectedSubject : true;
      
      return matchesClass && matchesDepartment && matchesSubject;
    });
    console.log(this.filteredAttendanceList);
    
  }

  viewMore(studentId: string): void {
    this.router.navigate(['/addattendance', studentId]);
  }
}

