import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router'; // Correct import
import { layoutroutes } from './layout.routes';
import { DashboardComponent } from '../pages/dashboard/dashboard.component'; // Import DashboardComponent
import { CreatedepartmentComponent } from '../pages/createdepartment/createdepartment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentListComponent } from '../pages/departmentlist/departmentlist.component';
import { ClasslistComponent } from '../pages/classlist/classlist.component';
import { CreateclassComponent } from '../pages/createclass/createclass.component';
import { UserListComponent } from '../pages/user-list/user-list.component';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { AddattendanceComponent } from '../pages/addattendance/addattendance.component';
import { AttendanceReportComponent } from '../pages/attendance-report/attendance-report.component';
import { FacesregComponent } from '../pages/facesreg/facesreg.component';
import {WebcamModule} from 'ngx-webcam';
import { SubjectCreateComponent } from '../pages/subjects/subject-create/subject-create.component';
import { SubjectListComponent } from '../pages/subjects/subject-list/subject-list.component';
import { CreateTimetableComponent } from '../pages/create-timetable/create-timetable.component';
import { TimetablelistComponent } from '../pages/timetablelist/timetablelist.component';
import { ViewReportComponent } from '../pages/view-report/view-report.component';
@NgModule({
  declarations: [
    LayoutComponent, // Declare LayoutComponent
    DashboardComponent, // Declare DashboardComponent
    CreatedepartmentComponent,
    DepartmentListComponent,
    ClasslistComponent,
    CreateclassComponent,
    UserListComponent,
    CreateUserComponent,
    AddattendanceComponent,
    AttendanceReportComponent,
    FacesregComponent,
    SubjectCreateComponent,
    SubjectListComponent,
    CreateTimetableComponent,
    TimetablelistComponent,
    ViewReportComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,   
    WebcamModule,
    RouterModule.forChild(layoutroutes) // Set up child routes using RouterModule
  ]
})
export class LayoutModule { }
