import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartCountService } from '../services/cart-count-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {

  cartItems: any[] = [];           
  cartItemsWithQuantity: any[] = [];   
  cartTotals: number = 0;

  private router = inject(Router);
  private cartService = inject(CartCountService);

  ngOnInit() {
    const storedItems = localStorage.getItem('cart');
    this.cartItems = storedItems ? JSON.parse(storedItems) : [];
    this.processCart();
  }

  processCart() {
    const map: { [key: string]: any } = {};

    // Count quantities
    this.cartItems.forEach(item => {
      if (map[item._id]) {
        map[item._id].quantity += 1;
      } else {
        map[item._id] = { ...item, quantity: 1 };
      }
    });

    this.cartItemsWithQuantity = Object.values(map);
    // Calculate total
    this.cartTotals = this.cartItemsWithQuantity.reduce(
      (sum, item) => sum + (parseFloat(item.price?.toString().replace(/[^0-9.]/g, '')) || 0) * item.quantity,
      0
    );
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartService.updateCartCountFromStorage();
    this.processCart();
  }

  checkout() {
    this.router.navigate(['/checkout'], { state: { totalAmount: this.cartTotals } });
  }

}
