import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AuthGuard } from '../services/auth.guard';
import { CreatedepartmentComponent } from '../pages/createdepartment/createdepartment.component';
import { DepartmentListComponent } from '../pages/departmentlist/departmentlist.component';
import { CreateclassComponent } from '../pages/createclass/createclass.component';
import { ClasslistComponent } from '../pages/classlist/classlist.component';
import { UserListComponent } from '../pages/user-list/user-list.component';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { AddattendanceComponent } from '../pages/addattendance/addattendance.component';
import { AttendanceReportComponent } from '../pages/attendance-report/attendance-report.component';
import { FacesregComponent } from '../pages/facesreg/facesreg.component';
import { SubjectCreateComponent } from '../pages/subjects/subject-create/subject-create.component';
import { SubjectListComponent } from '../pages/subjects/subject-list/subject-list.component';
import { CreateTimetableComponent } from '../pages/create-timetable/create-timetable.component';
import { TimetablelistComponent } from '../pages/timetablelist/timetablelist.component';
import { ViewReportComponent } from '../pages/view-report/view-report.component';

export const layoutroutes: Routes = [
  {
    path: '',
    component: LayoutComponent,  // Layout component as the wrapper
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },  // Dashboard child route
      { path: 'adddep', component: CreatedepartmentComponent } , 
      { path: 'adddep/:id', component: CreatedepartmentComponent }  ,
      { path: 'departments', component: DepartmentListComponent }  ,
      { path: 'addclass', component: CreateclassComponent },
      { path: 'addclass/:id', component: CreateclassComponent },
      { path: 'classes', component: ClasslistComponent },
      { path: 'user-list', component: UserListComponent },  // User list route
      { path: 'create-user', component: CreateUserComponent },  // Create new user
      { path: 'edit-user/:id', component: CreateUserComponent },  // Edit user
      { path: 'addattendance', component: AddattendanceComponent },
      { path: 'addattendance/:id', component: AddattendanceComponent },
      { path: 'attendance-report', component: AttendanceReportComponent },
      { path: 'subjects', component: SubjectListComponent },
      { path: 'subjects/create', component: SubjectCreateComponent },
      { path: 'subjects/edit/:id', component: SubjectCreateComponent },
      { path: 'timetable/create', component: CreateTimetableComponent },
      { path: 'timetable-list', component: TimetablelistComponent },
      { path: 'edit-timetable/:id', component: CreateTimetableComponent },
      { path: 'report/:classId/:userId', component: ViewReportComponent },
      {path:'facereg',component:FacesregComponent}
    ]
  }
];
