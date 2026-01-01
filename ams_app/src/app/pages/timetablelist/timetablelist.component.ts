import { Component } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timetablelist',
  templateUrl: './timetablelist.component.html',
  styleUrl: './timetablelist.component.scss'
})
export class TimetablelistComponent {
  timetables:any =[];
  loading: boolean = true;

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTimetables();
  }

  fetchTimetables() {
    this.masterService.getTimetables().subscribe({
      next: (data) => {
        this.timetables = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching timetables:', error);
        this.loading = false;
      }
    });
  }

  deleteTimetable(id: string) {
    if (confirm('Are you sure you want to delete this timetable?')) {
      this.masterService.deleteTimetable(id).subscribe({
        next: () => {
          this.timetables = this.timetables.filter((t:any) => t._id !== id);
        },
        error: (error:any)=> console.error('Error deleting timetable:', error)
      });
    }
  }

  editTimetable(id: string) {
    this.router.navigate(['/edit-timetable', id]);
  }
}
