import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classlist',
  templateUrl: './classlist.component.html',
  styleUrl: './classlist.component.scss'
})
export class ClasslistComponent implements OnInit {
  classes: any[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  // Load list of classes
  loadClasses(): void {
    this.loading = true;
    this.masterService.getClasses().subscribe({
      next: (response) => {
        this.classes = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load classes';
        this.loading = false;
      }
    });
  }

  // Delete a class
  deleteClass(id: string): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.masterService.deleteClass(id).subscribe({
        next: () => {
          this.loadClasses(); // Reload list after deletion
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete class';
        }
      });
    }
  }

  // Navigate to edit form with prefilled values
  editClass(id: string): void {
    this.router.navigate([`/addclass/${id}`]);
  }
}