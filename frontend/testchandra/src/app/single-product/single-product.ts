import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartCountService } from '../services/cart-count-service';

@Component({
  selector: 'app-single-product',
  imports: [ButtonModule],
  templateUrl: './single-product.html',
  styleUrl: './single-product.css',
})
export class SingleProduct implements OnInit{

private http = inject(HttpClient);
private route = inject(ActivatedRoute);
private cartService = inject(CartCountService);
productData:any = null;

ngOnInit() {
  const productId = this.route.snapshot.paramMap.get('id');
  this.http.get(`http://localhost:5000/singleproduct/${productId}`).subscribe((res: any) => {
this.productData = res;
console.log(this.productData);
  })
}

 addtocart(productData: any) {
    this.cartService.addtocart(productData);
  }

}
