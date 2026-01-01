import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './departmentlist.component.html',
  styleUrl: './departmentlist.component.scss'
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  confirmDeleteId: string | null = null; // Store the ID of the department to delete

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.masterService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  confirmDelete(item: any): void {
    this.confirmDeleteId = item._id; // Set the ID for the confirmation dialog
  }

  deleteDepartment(): void {
    if (this.confirmDeleteId) {
      this.masterService.deleteDepartment(this.confirmDeleteId).subscribe(() => {
        this.loadDepartments(); // Refresh the list after deletion
        this.confirmDeleteId = null; // Reset the confirmation ID
      },err => console.log(err)
      );
    }
  }

  updateDepartment(item: any): void {
    console.log(item);
    
    this.router.navigate(['/adddep/'+item._id]); // Navigate to the add/update form
  }
}
