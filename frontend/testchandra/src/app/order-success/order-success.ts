import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmailService } from '../services/email-service';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess implements OnInit {

private http = inject(HttpClient);
private route = inject(ActivatedRoute);
private sendEmail = inject(EmailService);

order: any = null;

ngOnInit() {
  const orderId = this.route.snapshot.paramMap.get('id');

  this.http.get(`http://localhost:5000/order/${orderId}`).subscribe((res: any) => {
    this.order = res;

    const orderData = {
    email: this.order.billing.email,
    name: this.order.city,
    orderId: this.order._id,
    orderAmt: this.order.totalAmount
    };
      this.sendEmail.sendEmail(orderData).subscribe({
        next(res) {
          console.log('email sent', res);
        },
        error(err) {
          console.log('email delivery failed', err);
        },
      });

  });

}

}
