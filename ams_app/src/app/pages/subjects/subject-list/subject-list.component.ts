import { Component } from '@angular/core';
import { MasterService } from '../../../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent {
  subjects: any[] = [];

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.masterService.getAllSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/subjects/edit', id]);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure to delete this subject?')) {
      this.masterService.deleteSubject(id).subscribe(() => this.loadSubjects());
    }
  }
}
