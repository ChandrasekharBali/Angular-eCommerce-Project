import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartCountService } from '../services/cart-count-service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout {
  totalAmount = 0;
  private http = inject(HttpClient);
  private router = inject(Router);
  private cartcountservice = inject(CartCountService);

  billing = {
    name: '',
    email: '',
    phone: '',
  };

  shipping = {
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };

  constructor() {
    const navState = history.state;
    this.totalAmount = navState.totalAmount || 0;
  }

  createOrder() {
    return this.http.post<any>('http://localhost:5000/create-order', {
      amount: this.totalAmount,
    });
  }

  pay() {
    // Basic validation
    if (!this.billing.name || !this.billing.email || !this.billing.phone) {
      alert('Please fill billing info');
      return;
    }

    if (!this.shipping.address || !this.shipping.city) {
      alert('Please fill shipping info');
      return;
    }

    this.createOrder().subscribe((order) => {
      const options: any = {
        key: order.key,
        amount: order.amount,
        currency: 'INR',
        name: 'My Store',
        description: 'Checkout Payment',
        order_id: order.orderId,
        prefill: {
          name: this.billing.name,
          email: this.billing.email,
          contact: this.billing.phone,
        },
        handler: (response: any) => this.verifyPayment(response),
        theme: { color: '#0f5fff' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }

verifyPayment(response: any) {
  const payload = {
    ...response,
    cartItems: JSON.parse(localStorage.getItem('cart') || '[]'),
    billing: this.billing,
    shipping: this.shipping,
    totalAmount: this.totalAmount,
  };

  this.http.post('http://localhost:5000/verify-payment', payload)
    .subscribe((res: any) => {
      if (res.success) {
        alert('Payment Successful!');
        localStorage.removeItem('cart'); // clear cart
        this.cartcountservice.updateCartCountFromStorage();
        this.router.navigate([`/order-success/${res.orderId}`]);
      } else {
        alert('Payment Failed Verification!');
      }
    });
}

}
