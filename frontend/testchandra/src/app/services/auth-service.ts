import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
isLoggedIn = signal<boolean>(!!localStorage.getItem('jwt'));

login(token: string) {
  localStorage.setItem("jwt", token);
  console.log("Token successfully generated", token);
  this.isLoggedIn.set(true);
}

logout() {
  localStorage.removeItem('jwt');
  this.isLoggedIn.set(false);
}

}
