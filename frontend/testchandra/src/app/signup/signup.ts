import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignupService } from '../services/signup-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
private fb = inject(FormBuilder);
private signupService = inject(SignupService);

loading = signal(false);
errorMessage = signal<string | null>(null);

form = this.fb.group({
  name: ["", [Validators.required]],
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required]],
})

signup() {
  this.loading.set(true);
   this.errorMessage.set(null);
  this.signupService.signup({name: this.form.value.name!, email: this.form.value.email!, password: this.form.value.password!}).subscribe({
    next:(res: any) => {
       console.log("Signup successfully completed");
      this.loading.set(false);
    },
    error: err => {
      console.log("error signup", err);
      this.loading.set(false);

       if (err.status === 400) {
        this.errorMessage.set(err.error.message);
      } else {
        this.errorMessage.set("Something went wrong. Please try again.");
      }
    },
  })
}

}
