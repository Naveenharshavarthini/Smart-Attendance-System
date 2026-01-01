import { Component ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-createdepartment',
  templateUrl: './createdepartment.component.html',
  styleUrl: './createdepartment.component.scss'
})
export class CreatedepartmentComponent {
  departmentForm: FormGroup;
  isUpdate = false; // Track if it's an update

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      hod: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isUpdate = true; // It's an update
      this.masterService.getDepartmentById(id).subscribe((department) => {
        this.departmentForm.patchValue(department); // Populate the form with existing data
      });
    }
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      if (this.isUpdate) {
        this.masterService.updateDepartment( this.route.snapshot.paramMap.get('id'), this.departmentForm.value )
          .subscribe(() => {
            this.router.navigate(['/departments']); // Navigate to the list after updating
          });
      } else {
        this.masterService.createDepartment(this.departmentForm.value).subscribe(() => {
          this.router.navigate(['/departments']); // Navigate to the list after adding
        });
      }
    }
  }
}
