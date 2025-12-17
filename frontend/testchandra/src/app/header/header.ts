import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CartCountService } from '../services/cart-count-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private router = inject(Router);
private authservice = inject(AuthService);

  cartCount: number = 0;
  isLoggedIn = this.authservice.isLoggedIn;

private cartService = inject(CartCountService);

ngOnInit() {
  this.cartService.cartCount$.subscribe(count => { this.cartCount = count; });
}

logout() {
   this.router.navigate(['/login']);
   this.authservice.logout();
}

}
