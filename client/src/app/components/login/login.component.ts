import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private toastrService: ToastrService
    ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(
        (response) => {
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['upload-documents']);
          this.toastrService.success('Sikeres bejelentkezés!');
        },
        (error) => {
          console.error('Hibás bejelentkezés', error);
          this.toastrService.error('Helyeten felhasználónév vagy jelszó!');
        }
      );
    }
  }
}
