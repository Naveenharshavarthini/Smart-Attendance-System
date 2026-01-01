import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  isStudent = false;
  isStaff = false;
  showPasswordField = false; // Control for the password field in edit mode
  showDepartmentDropdown = false; // To show/hide department field
  roles = ['Admin', 'Staff', 'Student'];
  departments: any[] = [];
  classes: any[] = [];
  userId: string | null = null;
  captureImage = false;  // Toggle for webcam capture
  webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  subjects: any[] = [];
  updateimage ='';
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private route: ActivatedRoute,
    private router: Router,
    private userservice: UserService
  ) {
    // Initialize form
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Password is optional at first; will be required only if needed
      role: ['', Validators.required],
      department: [''],
      class: [''],
      dob: ['', Validators.required],
      idCardId: [''],
      subject: [''], // Only for staff
      profilePhoto: [null, Validators.required] 
    });
  }

  ngOnInit(): void {
   const loginuser  = JSON.parse(localStorage.getItem('user') || '{}'); 
    if(loginuser.role == 'Staff') this.roles = ['Student']
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      // Edit mode
      this.isEditMode = true;
      this.loadDepartmentsAndClassesForEdit();
      this.loadSubjects();
    } else {
      // Create mode
      this.loadDepartments(); // Load departments normally
      this.loadClasses(); // Load classes normally
      this.loadSubjects();
      this.userForm.get('password')?.setValidators([Validators.required]); // Password required in create mode
    }
  }
  loadDepartmentsAndClassesForEdit() {
    this.loadDepartments(() => {
      this.loadClasses(() => {
  this.loadSubjects(() => {
        // Once departments and classes are loaded, then load the user data
        this.loadUser(this.userId!);
  })
      });
    });
  }
  // Handle role changes to adjust form fields
  onRoleChange() {
    const selectedRole = this.userForm.get('role')?.value;
    this.isStudent = selectedRole === 'Student';
    this.isStaff = selectedRole === 'Staff';
    // Show department dropdown for Staff and Student roles
    this.showDepartmentDropdown = this.isStaff || this.isStudent;
  }


// Load departments with a callback to ensure we wait for the departments to be loaded
loadDepartments(callback?: Function) {
  this.masterService.getDepartments().subscribe(departments => {
    this.departments = departments;
    if (callback) callback(); // Call the callback after loading
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
loadUser(id: string) {
  this.userservice.getUserById(id).subscribe(user => {
    const formattedDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : null;
   // Patch the form with user data
   this.userForm.patchValue({
    ...user,
    dob: formattedDob, // Set the formatted date
    subject: user.subject ? user.subject._id : '' // Set subject if exists
  });
    this.onRoleChange(); // Adjust fields based on the user's role

    // Set department and class fields explicitly if they exist in the user object
    if (user.department) {
      this.userForm.get('department')?.setValue(user.department._id);
    }
    if (user.class) {
      this.userForm.get('class')?.setValue(user.class._id);
    }
    if (user.Subject) {
      this.userForm.get('subject')?.setValue(user.Subject._id);
    }

    // Remove password validation for edit mode (unless the user opts to change password)
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.updateimage = `http://localhost:5001/`+user.profilePhoto;
  });
  
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.userForm.patchValue({ profilePhoto: file });
  }
}
triggerSnapshot(): void {
  this.trigger.next();
}

handleImage(webcamImage: WebcamImage): void {
  this.webcamImage = webcamImage;
  fetch(webcamImage.imageAsDataUrl)
    .then(res => res.blob())
    .then(blob => {
      console.log(webcamImage);
      const file = new File([blob], 'profilePhoto.png', { type: 'image/png' });
      this.userForm.patchValue({ profilePhoto: file });
    });
}

get triggerObservable(): Observable<void> {
  return this.trigger.asObservable();
}
  // Toggle password field visibility in edit mode
  togglePasswordField() {
    this.showPasswordField = !this.showPasswordField;
    if (this.showPasswordField) {
      // Require password if changing
      this.userForm.get('password')?.setValue('');
      this.userForm.get('password')?.setValidators([Validators.required]);
    } else {
      // Clear password field and validation if not changing
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.setValue(''); // Reset the password field
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  // Handle form submission
  // onSubmit() {
  //   if (this.userForm.valid) {
  //     const userData = { ...this.userForm.value };

  //     if (this.isEditMode) {
  //       // In edit mode, remove password field from the data if not changing password
  //       if (!this.showPasswordField) {
  //         delete userData.password; // Remove password if not changing
  //       }

  //       // Call update API
  //       this.userservice.updateUser(this.userId!, userData).subscribe(() => {
  //         this.router.navigate(['/user-list']);
  //       });
  //     } else {
  //       // Create new user
  //       this.userservice.createUser(userData).subscribe(() => {
  //         this.router.navigate(['/user-list']);
  //       });
  //     }
  //   }
  // }
  onSubmit() {
    if (this.userForm.invalid) {
      console.log('Form is invalid');
      alert('Form is invalid, Please fill all the required * fields !')
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control && control.value) {
        if (key === 'subject') {
          formData.append(key, control.value._id || control.value);  // Append subject ID
        } else if (key === 'profilePhoto' && control.value instanceof File) {
          formData.append(key, control.value, control.value.name);
        } else {
          formData.append(key, control.value);
        }
      }
    });
  
    if (this.isEditMode && this.userId) {
      if (!this.showPasswordField) {
        formData.delete('password') // Remove password if not changing
              }
     
      // Update user if in edit mode
      this.userservice.updateUser(this.userId, formData).subscribe({
        next: () => {
          console.log('User updated successfully');
          this.router.navigate(['/user-list']);  // Redirect to user list
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {
      // Create user if not in edit mode
      this.userservice.createUser(formData).subscribe({
        next: () => {
          console.log('User created successfully');
          this.router.navigate(['/user-list']);  // Redirect to user list
        },
        error: (err) => console.error('Create error:', err)
      });
    }
  }
  
}
