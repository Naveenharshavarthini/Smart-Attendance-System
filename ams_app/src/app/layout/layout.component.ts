import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  user :any ;
ngOnInit(): void {
  this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
  console.log(this.user);
}

signout(){
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.reload();
}

}
