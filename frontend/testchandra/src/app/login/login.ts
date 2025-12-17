import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login-service';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private authservice = inject(AuthService);

  loading = signal(false);

 form = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required]],
  });

  login() {
    this.loading.set(true);

this.loginService.login({email: this.form.value.email!, password: this.form.value.password!}).subscribe({
  next:(res: any) => {
  this.loading.set(false);
  this.authservice.login(res.token);
  this.router.navigate(['/products']);
  },
  error: err => {
console.log("login failed", err);
this.loading.set(false);
  }
})   

  };
  
}
