import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-create-timetable',
  templateUrl: './create-timetable.component.html',
  styleUrl: './create-timetable.component.scss'
})
export class CreateTimetableComponent {
  classes:any = [];       
  subjects:any = []
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'];
  isEditMode = false;        // Track if it's edit mode
  timetableId: string = '';  // Store timetable ID if editing
  timeSlots = [
     {lable:'9-10 am',vaule:'9-10'}, 
     {lable:'10-11 am',vaule:'10-11'},
     {lable:'11-12 am',vaule:'11-12'}, 
     {lable:'12-1 pm',vaule:'12-1'}, 
     {lable:'1-2 pm',vaule:'1-2'}, 
     {lable:'2-3 pm',vaule:'2-3'}, 
     {lable:'3-4 pm',vaule:'3-4'}, 
    //  {lable:'4-5 pm',vaule:'4-5'}
    ];
  timetable = {
    classId: '',  // to be set from backend
    schedule: this.days.map(day => ({
      day,
      slots: this.timeSlots.map(hour => ({ hour, subject: '' }))
    }))
  };
  isalllistloaded = false;
  constructor(private masterService: MasterService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private utitedService: UtilityService,
    private router: Router) {
  this.loadDepartmentsAndClassesForEdit()
  }
  loadDepartmentsAndClassesForEdit() {
      this.loadClasses(() => {
  this.loadSubjects(() => {
        // Once departments and classes are loaded, then load the user data
       this.isalllistloaded = true;
      });
    });
  }
// Load classes with a callback to ensure we wait for the classes to be loaded
loadClasses(callback?: Function) {
  this.masterService.getClasses().subscribe(classes => {
    this.classes = classes;
    if (callback) callback(); // Call the callback after loading
  });
}
loadSubjects(callback?: Function) {
  this.masterService.getAllSubjects().subscribe(subjects => {
    this.subjects = subjects;
    if (callback) callback(); 
  });
}

  ngOnInit() {
    // Fetch classes and subjects
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.timetableId = id;
        this.loadTimetableById(id); // Load existing timetable if editing
      }
    });


  }
  loadTimetableById(id: string) {
    this.masterService.getTimetable(id).subscribe({
      next: (res) => {
        // Map received data to timetable structure
        this.timetable.classId = res.class._id || '';
      //  this.timetable.departmentId = res.department._id || '';
        this.timetable.schedule = this.days.map(day => {
          const daySchedule = res.schedule.find((d: { day: string; }) => d.day === day);
          return {
            day,
            slots: this.timeSlots.map(hour => {
              const slot = daySchedule?.slots.find((s: any) => s.hour === hour.vaule);
              return { hour, subject: slot?.subject._id || '' };
            })
          };
        });
      },
      error: (err) => console.error('Failed to load timetable:', err)
    });
  }
  saveTimetable() {
    const filteredTimetable = {
      ...this.timetable,
      schedule: this.timetable.schedule.map(day => ({
        ...day,
        slots: day.slots.filter(slot => slot.subject !== '').map(slot => ({
          ...slot,
          hour: slot.hour.vaule // Extract only the 'vaule' property
        }))
      }))
    };

    console.log('Saving filtered timetable:', filteredTimetable);

    this.masterService.saveTimetable(filteredTimetable).subscribe({
      next: (res) => {
        console.log('Timetable saved:', res);
        this.router.navigate(['/timetable-list']);  // Navigate after save
      },
      error: (err) => {console.log(err);
       this.utitedService.showError(err.error.message)}
    });
  }

  // Update timetable
  updateTimetable() {
    const filteredTimetable = {
      ...this.timetable,
      schedule: this.timetable.schedule.map(day => ({
        ...day,
        slots: day.slots.filter(slot => slot.subject !== '').map(slot => ({
          ...slot,
          hour: slot.hour.vaule // Extract only the 'vaule' property
        }))
      }))
    };

    console.log('Updating timetable:', filteredTimetable);

    this.masterService.updateTimetable(this.timetableId, filteredTimetable).subscribe({
      next: (res) => {
        console.log('Timetable updated:', res);
        this.router.navigate(['/timetable-list']);  // Navigate after update
      },
      error: (err) => this.utitedService.showError(err.error.message)
    });
  }
}
