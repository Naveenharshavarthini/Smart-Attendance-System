import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  signout(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  }
}
