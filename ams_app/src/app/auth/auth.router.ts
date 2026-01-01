import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

export const authroutes: Routes = [
  {
    path: '',
    component: LoginComponent,  // Layout component as the wrapper
  }
];
