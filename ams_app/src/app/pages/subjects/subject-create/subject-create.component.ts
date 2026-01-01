import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-subject-create',
 // standalone: true,
 // imports: [],
  templateUrl: './subject-create.component.html',
  styleUrl: './subject-create.component.scss'
})
export class SubjectCreateComponent {
  subjectForm: FormGroup;
  isEditMode = false;
  subjectId: string = '';

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.subjectId = params['id'];
        this.masterService.getSubjectById(this.subjectId).subscribe(subject => {
          this.subjectForm.patchValue(subject);
        });
      }
    });
  }
 // Get user's current geolocation and set it in the form
 getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.subjectForm.patchValue({
          latitude: lat,
          longitude: lng,
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
  onSubmit(): void {
    if (this.subjectForm.invalid) return;

    if (this.isEditMode) {
      this.masterService.updateSubject(this.subjectId, this.subjectForm.value).subscribe(() => {
        this.router.navigate(['/subjects']);
      });
    } else {
      this.masterService.createSubject(this.subjectForm.value).subscribe(() => {
        this.router.navigate(['/subjects']);
      });
    }
  }
}
