import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartCountService {
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.updateCartCountFromStorage();
  }

  updateCartCountFromStorage() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  this.cartCount.next(cart.length);
  }

  addtocart(product: any) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
    console.log('cart', cart);
    this.updateCartCountFromStorage();
  }

  removeItemFromCart(index: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCountFromStorage();
  }

}
