import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token); // Save the token
          localStorage.setItem('user', JSON.stringify(response.user)); // Save user details
          this.router.navigate(['/']); // Redirect after login
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
