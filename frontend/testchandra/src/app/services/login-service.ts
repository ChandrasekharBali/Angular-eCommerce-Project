import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);

  login(payload: {email: string; password: string;}) {
    return this.http.post('http://localhost:5000/login', payload);
  }

  

}
