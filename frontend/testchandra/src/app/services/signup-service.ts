import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private http = inject(HttpClient);

  signup(payload: {name: string; email: string; password: string;}) {
    return this.http.post('http://localhost:5000/signup', payload);
  }
}
