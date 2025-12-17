import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  
private http = inject(HttpClient);

order: any = null;

sendEmail(orderData: {email: string, name: string, orderId: string, orderAmt: string}) {
  return this.http.post('http://localhost:5000/order/sendordersuccessemail', orderData);
}

}
