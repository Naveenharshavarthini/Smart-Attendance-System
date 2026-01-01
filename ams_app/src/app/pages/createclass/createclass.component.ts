import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createclass',
  templateUrl: './createclass.component.html',
  styleUrls: ['./createclass.component.scss']
})
export class CreateclassComponent implements OnInit {
  classForm: FormGroup;
  isEditMode = false;
  classId: string | null = null;
  years: number[] = [];
  departments: any[] = []; // Initialize departments

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.classForm = this.fb.group({
      className: ['', Validators.required],
      department: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required], // Set current year as default
      section: ['', Validators.required],
      classTeacher: ['', Validators.required],
      lat: ['', ],// Validators.min(-90), Validators.max(90)
      lng: ['', ],//, Validators.min(-180), Validators.max(180)
    });
  }

  ngOnInit(): void {
    this.classId = this.route.snapshot.paramMap.get('id');
    if (this.classId) {
      this.isEditMode = true;
      this.loadClass(this.classId);
    }
    this.loadDepartments(); // Load departments
    this.generateYearList();
  }

  // Load departments from the MasterService
  loadDepartments() {
    this.masterService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data; // Set departments
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  // Generate a list of years from 100 years ago to the current year
  generateYearList() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) {
      this.years.push(i);
    }
  }

  // Load class details in edit mode
  loadClass(id: string) {
    this.masterService.getClassById(id).subscribe((data) => {
      this.classForm.patchValue(data);
      this.classForm.get('department')?.setValue(data.department._id)
    });
  }
 // Get user's current geolocation and set it in the form
 getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.classForm.patchValue({
          lat: lat,
          lng: lng,
        });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}
  // Submit form: Create or update the class
  onSubmit() {
    console.log(this.classForm.value);
    
    if (this.classForm.valid) {
      if (this.isEditMode) {
        this.masterService.updateClass(this.classId!, this.classForm.value).subscribe(() => {
          this.router.navigate(['/classes']);
        });
      } else {
        this.masterService.createClass(this.classForm.value).subscribe(() => {
          this.router.navigate(['/classes']);
        });
      }
    }
  }
}
